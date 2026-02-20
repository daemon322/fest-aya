// api/send-reservation.js
// Serverless handler: recibe JSON desde el cliente, valida recaptcha, rate-limit, honeypot,
// y reenvía el payload a Formspree.
// Config via process.env:
//   FORMSPREE_ID, FORMSPREE_API_KEY (optional), RECAPTCHA_SECRET, ALLOWED_ORIGIN,
//   RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX

export default async function handler(req, res) {
  // Basic CORS (limit to ALLOWED_ORIGIN if provided)
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
  if (ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido" });
  }

  // Rate limiting (in-memory). For production use Redis/Upstash, not in-memory.
  const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const RATE_MAX = Number(process.env.RATE_LIMIT_MAX || 10);

  const ip =
    (req.headers["x-forwarded-for"] &&
      req.headers["x-forwarded-for"].split(",")[0].trim()) ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!global.__rateMap) global.__rateMap = new Map();
  const now = Date.now();
  const entry = global.__rateMap.get(ip) || { ts: now, count: 0 };
  if (now - entry.ts > RATE_WINDOW) {
    entry.ts = now;
    entry.count = 0;
  }
  entry.count++;
  global.__rateMap.set(ip, entry);
  if (entry.count > RATE_MAX) {
    return res
      .status(429)
      .json({
        success: false,
        message: "Demasiadas solicitudes, intenta más tarde.",
      });
  }

  try {
    // Parse body (some platforms already parse JSON; fallback to manual)
    let body = req.body && Object.keys(req.body).length ? req.body : null;
    if (!body) {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = {};
      }
    }

    // Honeypot (field 'hp' must be empty)
    if (body.hp) {
      return res.status(400).json({ success: false, message: "Bad request." });
    }

    const {
      name,
      email,
      cartDetails,
      timestamp,
      subject,
      voucherBase64,
      voucherFileName,
      recaptchaToken,
    } = body;

    // Basic validation
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Nombre y email requeridos." });
    }

    if (!recaptchaToken || !process.env.RECAPTCHA_SECRET) {
      console.error("❌ Validación de reCAPTCHA fallida:", {
        hasToken: !!recaptchaToken,
        hasSecret: !!process.env.RECAPTCHA_SECRET,
        tokenLength: recaptchaToken?.length || 0,
      });
      return res
        .status(400)
        .json({
          success: false,
          message: "reCAPTCHA token faltante o no configurado.",
          debug: {
            hasToken: !!recaptchaToken,
            hasSecret: !!process.env.RECAPTCHA_SECRET,
          },
        });
    }

    // Verify reCAPTCHA with Google
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET);
    params.append("response", recaptchaToken);
    // optional: params.append("remoteip", ip);

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      },
    );
    const verifyJson = await verifyRes.json().catch(() => null);
    if (!verifyJson || !verifyJson.success) {
      console.error("reCAPTCHA verification failed:", verifyJson);
      return res
        .status(400)
        .json({
          success: false,
          message: "reCAPTCHA inválido o expirado. Intenta de nuevo.",
        });
    }

    // Si usando reCAPTCHA v3, verificar score y comentar el resultado
    if (typeof verifyJson.score === "number") {
      console.log(`reCAPTCHA score: ${verifyJson.score} (umbral: 0.5)`);
      if (verifyJson.score < 0.5) {
        console.warn("reCAPTCHA score too low - likely bot activity");
        return res
          .status(400)
          .json({
            success: false,
            message:
              "reCAPTCHA: puntuación baja (posible bot activation). Intenta de nuevo.",
          });
      } else {
        console.log(
          `✅ reCAPTCHA verification passed with score: ${verifyJson.score}`,
        );
      }
    } else {
      console.log("✅ reCAPTCHA verification passed (v2)");
    }

    // Ensure Formspree ID is configured
    const FORMSPREE_ID = process.env.FORMSPREE_ID;
    const FORMSPREE_API_KEY = process.env.FORMSPREE_API_KEY || null;
    if (!FORMSPREE_ID) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Configuración del servidor incompleta (FORMSPREE_ID).",
        });
    }

    // Build payload for Formspree
    const emailBody = {
      name,
      email,
      cartDetails: cartDetails ? JSON.stringify(cartDetails) : "",
      timestamp: timestamp || new Date().toISOString(),
      _subject: subject || "Nueva Reserva",
      _replyto: email,
    };

    if (voucherBase64 && voucherFileName) {
      emailBody.comprobante_archivo = voucherFileName;
      emailBody._html = `
        <h3>Reserva</h3>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Archivo:</strong> ${voucherFileName}</p>
        <img src="${voucherBase64}" alt="comprobante" style="max-width:500px" />
        <pre>${JSON.stringify(cartDetails || {}, null, 2)}</pre>
      `;
    }

    // Send to Formspree
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (FORMSPREE_API_KEY)
      headers["Authorization"] = `Bearer ${FORMSPREE_API_KEY}`;

    const formspreeRes = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers,
      body: JSON.stringify(emailBody),
    });

    const text = await formspreeRes.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!formspreeRes.ok) {
      console.error("Formspree error:", formspreeRes.status, text);
      return res.status(502).json({
        success: false,
        message: `Error al enviar a Formspree: ${formspreeRes.status}`,
        detail: json || text,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reserva enviada correctamente",
      formspree: json || { status: formspreeRes.status },
    });
  } catch (err) {
    console.error("Error en send-reservation:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno", error: String(err) });
  }
}
