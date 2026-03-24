// functions/send-reservation.js
// Cloudflare Pages + SendGrid
// Variables de entorno (.env.local para desarrollo, Cloudflare Dashboard para producción):
//   SENDGRID_API_KEY     — API key de sendgrid.com
//   ADMIN_EMAIL          — Tu correo donde recibirás las reservas
//   FROM_EMAIL           — Email verificado en SendGrid (puede ser noreply@tudominio.com)
//   RECAPTCHA_SECRET     — Secret key de Google reCAPTCHA v2
//
// Opcionales:
//   RATE_LIMIT_WINDOW_MS — ventana rate limit ms (default: 60000)
//   RATE_LIMIT_MAX       — máx peticiones/ventana (default: 5)

import sgMail from "@sendgrid/mail";

// Rate limiter en memoria (por instancia de worker)
const rateLimitMap = new Map();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_VOUCHER_B64_CHARS = 4_000_000;

const sanitize = (val) =>
  typeof val === "string"
    ? val
        .trim()
        .replace(/[<>"'`]/g, "")
        .slice(0, 255)
    : "";
const sanitizeHeader = (val) =>
  typeof val === "string"
    ? val
        .replace(/[\r\n\t]/g, " ")
        .trim()
        .slice(0, 200)
    : "";
const isValidEmail = (e) => {
  const email = e.toLowerCase();
  const allowedDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "edu.pe",
    "unmsm.edu.pe",
    "unh.edu.pe",
  ];
  const domain = email.split("@")[1];
  return (
    /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(email) &&
    allowedDomains.some((d) => domain === d || domain?.endsWith("." + d))
  );
};
const isValidPhone = (p) => /^[\d\s+()-]{7,20}$/.test(p);
const isValidDoc = (d) => d.length >= 6 && d.length <= 20;

// ── Email al ADMIN ────────────────────────────────────────────────────────────
function buildAdminHtml({
  name,
  email,
  phone,
  document,
  refNumber,
  cartDetails,
  voucherBase64,
}) {
  const rows = (cartDetails || [])
    .map(
      (item) =>
        `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;">${item.phaseName}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;">${item.title}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">S/ ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");
  const total = (cartDetails || []).reduce(
    (a, i) => a + i.price * i.quantity,
    0,
  );
  return `
    <h2 style="font-family:sans-serif;color:#111">Nueva Reserva — REF: ${sanitize(refNumber)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:4px 16px 4px 0;color:#555"><strong>Nombre</strong></td><td>${name}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#555"><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#555"><strong>Teléfono</strong></td><td>${phone}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#555"><strong>Documento</strong></td><td>${document}</td></tr>
    </table>
    <h3 style="font-family:sans-serif;color:#111">Detalle del carrito</h3>
    <table style="font-family:sans-serif;font-size:13px;border-collapse:collapse;width:100%;max-width:500px">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px 12px;text-align:left">Fase</th>
          <th style="padding:8px 12px;text-align:left">Entrada</th>
          <th style="padding:8px 12px;text-align:center">Cant.</th>
          <th style="padding:8px 12px;text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:10px 12px;text-align:right;font-weight:bold">TOTAL</td>
          <td style="padding:10px 12px;text-align:right;font-weight:bold;color:#d97706">S/ ${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    <p style="font-family:sans-serif;color:#888;margin-top:16px">📎 El comprobante de pago se envía como archivo adjunto.</p>
  `;
}

// ── Confirmación al CLIENTE ───────────────────────────────────────────────────
function buildClientMessage({ name, email, refNumber, cartDetails }) {
  const total = (cartDetails || []).reduce(
    (a, i) => a + i.price * i.quantity,
    0,
  );
  const lines = (cartDetails || [])
    .map(
      (i) =>
        `  • ${i.title} (${i.phaseName}) x${i.quantity}  →  S/ ${(i.price * i.quantity).toFixed(2)}`,
    )
    .join("\n");

  return `
Hola ${name},

¡Tu reserva fue recibida exitosamente! Aquí están los detalles:

══════════════════════════════════
Número de referencia: ${sanitize(refNumber)}
══════════════════════════════════

TUS ENTRADAS:
${lines}

TOTAL: S/ ${total.toFixed(2)}

══════════════════════════════════
¿QUÉ SIGUE AHORA?

PASO 1 — Revisión de tu comprobante
Nuestro equipo verificará el voucher que adjuntaste. Una vez
validado, recibirás un correo de confirmación de pago.

PASO 2 — Entrega de tu código QR
Tu E-Ticket con código QR será enviado a este correo (${email})
entre 30 minutos y 1 hora después de recibir la
confirmación de pago.

⚠ IMPORTANTE: Si hay alta demanda de reservas simultáneas,
el tiempo máximo de espera para el envío del QR es de 24 horas.
Te pedimos paciencia y comprensión en ese caso.

PASO 3 — Día del evento
Presenta tu QR desde el celular con el brillo al máximo.
Lleva tu DNI — las entradas son nominativas e intransferibles.

══════════════════════════════════
¿Tienes alguna duda?
Escríbenos por WhatsApp: +51 961 379 018

Guarda este correo como comprobante de tu reserva.

— Equipo Voley al Límite 2026 · Ayacucho, Perú
  `.trim();
}

// ── Helper: respuesta JSON ─────────────────────────────────────────────────────
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default {
  onRequest: async (context) => {
    const { request, env } = context;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { success: false, message: "Método no permitido." },
        405,
      );
    }

    // Rate limiting (por IP)
    const RATE_WINDOW = Number(env.RATE_LIMIT_WINDOW_MS || 60_000);
    const RATE_MAX = Number(env.RATE_LIMIT_MAX || 5);
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { ts: now, count: 0 };
    if (now - entry.ts > RATE_WINDOW) {
      entry.ts = now;
      entry.count = 0;
    }
    entry.count++;
    rateLimitMap.set(ip, entry);

    if (entry.count > RATE_MAX) {
      const response = jsonResponse(
        {
          success: false,
          message: "Demasiadas solicitudes. Intenta más tarde.",
        },
        429,
      );
      response.headers.set(
        "Retry-After",
        String(Math.ceil(RATE_WINDOW / 1000)),
      );
      return response;
    }

    try {
      let body = {};
      try {
        const text = await request.text();
        body = text ? JSON.parse(text) : {};
      } catch {
        body = {};
      }

      if (JSON.stringify(body).length > 6_000_000) {
        return jsonResponse(
          { success: false, message: "Solicitud demasiado grande." },
          413,
        );
      }

      // Honeypot
      if (body.hp) {
        return jsonResponse({ success: true });
      }

      const {
        name,
        email,
        phone,
        document,
        refNumber,
        cartDetails,
        voucherBase64,
        voucherFileName,
        recaptchaToken,
      } = body;

      const cleanName = sanitize(name);
      const cleanEmail = sanitize(email);
      const cleanPhone = sanitize(phone);
      const cleanDocument = sanitize(document);

      if (!cleanName || cleanName.length < 3) {
        return jsonResponse(
          { success: false, message: "Nombre inválido." },
          400,
        );
      }
      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        return jsonResponse(
          {
            success: false,
            message: "El correo no es válido o el dominio no es permitido.",
          },
          400,
        );
      }
      if (!cleanPhone || !isValidPhone(cleanPhone)) {
        return jsonResponse(
          { success: false, message: "Teléfono inválido." },
          400,
        );
      }
      if (!cleanDocument || !isValidDoc(cleanDocument)) {
        return jsonResponse(
          { success: false, message: "Documento inválido." },
          400,
        );
      }

      // reCAPTCHA v2
      if (!recaptchaToken) {
        return jsonResponse(
          { success: false, message: "Completa la verificación de seguridad." },
          400,
        );
      }
      if (!env.RECAPTCHA_SECRET) {
        return jsonResponse(
          { success: false, message: "Error de configuración." },
          500,
        );
      }

      const captchaRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: env.RECAPTCHA_SECRET,
            response: recaptchaToken,
            remoteip: ip,
          }).toString(),
        },
      );
      const captchaJson = await captchaRes.json().catch(() => null);
      if (!captchaJson?.success) {
        console.error("reCAPTCHA v2 falló:", captchaJson?.["error-codes"]);
        return jsonResponse(
          {
            success: false,
            message:
              "Verificación de seguridad fallida. Recarga la página e intenta de nuevo.",
          },
          400,
        );
      }

      // Validar voucher
      if (voucherBase64 && voucherFileName) {
        if (voucherBase64.length > MAX_VOUCHER_B64_CHARS) {
          return jsonResponse(
            {
              success: false,
              message: "El comprobante es demasiado grande. Máximo 3 MB.",
            },
            400,
          );
        }
        const mimeMatch = voucherBase64.match(/^data:([^;]+);base64,/);
        if (!mimeMatch || !ALLOWED_MIME_TYPES.has(mimeMatch[1])) {
          return jsonResponse(
            {
              success: false,
              message:
                "Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.",
            },
            400,
          );
        }
      }

      const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
      const FROM_EMAIL = env.FROM_EMAIL;
      const ADMIN_EMAIL = env.ADMIN_EMAIL;
      if (!SENDGRID_API_KEY || !FROM_EMAIL || !ADMIN_EMAIL) {
        console.error("Faltan SENDGRID_API_KEY, FROM_EMAIL o ADMIN_EMAIL");
        return jsonResponse(
          { success: false, message: "Error de configuración del servidor." },
          500,
        );
      }

      sgMail.setApiKey(SENDGRID_API_KEY);

      const emailData = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        document: cleanDocument,
        refNumber: sanitize(refNumber),
        cartDetails: cartDetails || [],
      };

      // 1. Email al ADMIN (con voucher como adjunto)
      try {
        const attachments = [];
        if (voucherBase64 && voucherFileName) {
          const b64Data = voucherBase64.split(",")[1] || voucherBase64;
          attachments.push({
            content: b64Data,
            filename: voucherFileName,
            type: "application/octet-stream",
            disposition: "attachment",
          });
        }

        await sgMail.send({
          to: ADMIN_EMAIL,
          from: FROM_EMAIL,
          replyTo: cleanEmail,
          subject: sanitizeHeader(
            `Nueva Reserva — ${cleanName} | REF: ${sanitize(refNumber)}`,
          ),
          html: buildAdminHtml(emailData),
          attachments,
        });

        console.log("Email al admin enviado exitosamente");
      } catch (adminErr) {
        console.error("Error enviando email al admin:", adminErr.message);
        return jsonResponse(
          {
            success: false,
            message: "Error al enviar la reserva. Intenta de nuevo.",
          },
          502,
        );
      }

      // 2. Confirmación al CLIENTE
      try {
        await sgMail.send({
          to: cleanEmail,
          from: FROM_EMAIL,
          replyTo: ADMIN_EMAIL,
          subject: sanitizeHeader(
            `✓ Tu reserva fue recibida — REF: ${sanitize(refNumber)}`,
          ),
          text: buildClientMessage(emailData),
        });

        console.log("Email al cliente enviado exitosamente");
      } catch (clientErr) {
        console.warn("Email al cliente falló (no crítico):", clientErr.message);
      }

      return jsonResponse({
        success: true,
        message: "Reserva enviada correctamente.",
      });
    } catch (err) {
      console.error("Error interno:", err);
      return jsonResponse(
        {
          success: false,
          message: "Error interno del servidor. Intenta de nuevo.",
        },
        500,
      );
    }
  },
};
