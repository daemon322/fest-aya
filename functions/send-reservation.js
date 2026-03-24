// /functions/send-reservation.js

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
    ? val.trim().replace(/[<>"'`]/g, "").slice(0, 255)
    : "";

const sanitizeHeader = (val) =>
  typeof val === "string"
    ? val.replace(/[\r\n\t]/g, " ").trim().slice(0, 200)
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

// ── HTML ADMIN ──
function buildAdminHtml({ name, email, phone, document, refNumber, cartDetails }) {
  const rows = (cartDetails || [])
    .map(
      (item) => `
<tr>
<td>${item.phaseName}</td>
<td>${item.title}</td>
<td>${item.quantity}</td>
<td>S/ ${(item.price * item.quantity).toFixed(2)}</td>
</tr>`
    )
    .join("");

  const total = (cartDetails || []).reduce(
    (a, i) => a + i.price * i.quantity,
    0
  );

  return `
<h2>Nueva Reserva — REF: ${sanitize(refNumber)}</h2>
<p><b>Nombre:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Teléfono:</b> ${phone}</p>
<p><b>Documento:</b> ${document}</p>

<h3>Detalle</h3>
<table border="1" cellpadding="6">
${rows}
<tr>
<td colspan="3"><b>TOTAL</b></td>
<td><b>S/ ${total.toFixed(2)}</b></td>
</tr>
</table>
`;
}

// ── CLIENTE ──
function buildClientMessage({ name, email, refNumber, cartDetails }) {
  const total = (cartDetails || []).reduce(
    (a, i) => a + i.price * i.quantity,
    0
  );

  const lines = (cartDetails || [])
    .map(
      (i) =>
        `• ${i.title} (${i.phaseName}) x${i.quantity} → S/ ${(i.price * i.quantity).toFixed(2)}`
    )
    .join("\n");

  return `
Hola ${name},

Tu reserva fue recibida correctamente.

REF: ${refNumber}

${lines}

TOTAL: S/ ${total.toFixed(2)}

Te enviaremos tu QR pronto.
`;
}

// ── HANDLER ──
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

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

    // VALIDACIONES
    if (!cleanName || cleanName.length < 3)
      return json({ success: false, message: "Nombre inválido" }, 400);

    if (!isValidEmail(cleanEmail))
      return json({ success: false, message: "Email inválido" }, 400);

    if (!isValidPhone(cleanPhone))
      return json({ success: false, message: "Teléfono inválido" }, 400);

    if (!isValidDoc(cleanDocument))
      return json({ success: false, message: "Documento inválido" }, 400);

    // RECAPTCHA
    const captchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET,
          response: recaptchaToken,
        }),
      }
    );

    const captchaJson = await captchaRes.json();

    if (!captchaJson.success) {
      return json({ success: false, message: "Captcha inválido" }, 400);
    }

    // VALIDAR VOUCHER
    let attachments = [];

    if (voucherBase64 && voucherFileName) {
      if (voucherBase64.length > MAX_VOUCHER_B64_CHARS) {
        return json({ success: false, message: "Archivo muy grande" }, 400);
      }

      const base64 = voucherBase64.split(",")[1];

      attachments.push({
        content: base64,
        filename: voucherFileName,
        type: "application/octet-stream",
        disposition: "attachment",
      });
    }

    const emailData = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      document: cleanDocument,
      refNumber,
      cartDetails,
    };

    // ── EMAIL ADMIN ──
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: env.ADMIN_EMAIL }],
            subject: sanitizeHeader(
              `Nueva Reserva — ${cleanName} | REF: ${refNumber}`
            ),
          },
        ],
        from: { email: env.FROM_EMAIL },
        reply_to: { email: cleanEmail },
        content: [
          {
            type: "text/html",
            value: buildAdminHtml(emailData),
          },
        ],
        attachments,
      }),
    });

    // ── EMAIL CLIENTE ──
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: cleanEmail }],
            subject: `Reserva recibida — REF: ${refNumber}`,
          },
        ],
        from: { email: env.FROM_EMAIL },
        content: [
          {
            type: "text/plain",
            value: buildClientMessage(emailData),
          },
        ],
      }),
    });

    return json({ success: true, message: "Reserva enviada" });

  } catch (err) {
    return json({ success: false, message: "Error interno" }, 500);
  }
}

// helper response
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}