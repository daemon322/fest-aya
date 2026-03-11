// api/send-reservation.js
// Serverless handler: recibe JSON, valida reCAPTCHA, rate-limit y honeypot,
// y reenvía el payload a Formspree.
//
// Variables de entorno requeridas:
//   FORMSPREE_ID         — ID del formulario en Formspree
//   RECAPTCHA_SECRET     — Secret key de Google reCAPTCHA v3
//   ALLOWED_ORIGIN       — Origen permitido (ej: https://tudominio.com)
//   FORMSPREE_API_KEY    — (opcional) API key de Formspree
//   RATE_LIMIT_WINDOW_MS — (opcional) ventana de rate limit en ms (default: 60000)
//   RATE_LIMIT_MAX       — (opcional) máx. peticiones por ventana (default: 10)

// Tipos de archivo permitidos para el voucher
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf',
]);
// Tamaño máximo del voucher en base64: ~3 MB (base64 aumenta ~33%)
const MAX_VOUCHER_B64_CHARS = 4_000_000;

// Sanitización básica de texto
const sanitize = (val) => (typeof val === 'string' ? val.trim().slice(0, 255) : '');

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
  if (ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  } else {
    // FIX: en producción SIEMPRE configura ALLOWED_ORIGIN.
    //      '*' solo se usa como último recurso en desarrollo.
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? '' : '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Método no permitido.' });

  // ── Rate Limiting (en memoria) ────────────────────────────────────────────
  // NOTA: en Vercel serverless cada instancia tiene su propio mapa.
  //       Para producción seria, usa @upstash/ratelimit con Redis.
  const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const RATE_MAX    = Number(process.env.RATE_LIMIT_MAX       || 10);
  const ip =
    (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!global.__rateMap) global.__rateMap = new Map();
  const now   = Date.now();
  const entry = global.__rateMap.get(ip) || { ts: now, count: 0 };
  if (now - entry.ts > RATE_WINDOW) { entry.ts = now; entry.count = 0; }
  entry.count++;
  global.__rateMap.set(ip, entry);
  if (entry.count > RATE_MAX)
    return res.status(429).json({ success: false, message: 'Demasiadas solicitudes. Intenta más tarde.' });

  try {
    // ── Parsear body ─────────────────────────────────────────────────────────
    let body = req.body && Object.keys(req.body).length ? req.body : null;
    if (!body) {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      try   { body = raw ? JSON.parse(raw) : {}; }
      catch { body = {}; }
    }

    // ── Honeypot ─────────────────────────────────────────────────────────────
    if (body.hp) return res.status(400).json({ success: false, message: 'Bad request.' });

    // ── Extraer campos ───────────────────────────────────────────────────────
    const {
      name, email, phone, document,
      cartDetails, timestamp, subject,
      voucherBase64, voucherFileName,
      recaptchaToken,
    } = body;

    const cleanName  = sanitize(name);
    const cleanEmail = sanitize(email);

    // ── Validación básica ────────────────────────────────────────────────────
    if (!cleanName || !cleanEmail) {
      return res.status(400).json({ success: false, message: 'Nombre y email son requeridos.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Formato de email inválido.' });
    }

    // ── reCAPTCHA ────────────────────────────────────────────────────────────
    if (!recaptchaToken || !process.env.RECAPTCHA_SECRET) {
      // FIX: NO devolver debug info al cliente en producción
      console.error('reCAPTCHA validation failed:', {
        hasToken: !!recaptchaToken,
        hasSecret: !!process.env.RECAPTCHA_SECRET,
      });
      return res.status(400).json({ success: false, message: 'Error de seguridad. Recarga la página e intenta de nuevo.' });
    }

    const params = new URLSearchParams({
      secret:   process.env.RECAPTCHA_SECRET,
      response: recaptchaToken,
      remoteip: ip,
    });

    const verifyRes  = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
    });
    const verifyJson = await verifyRes.json().catch(() => null);

    if (!verifyJson?.success) {
      console.error('reCAPTCHA verification failed:', verifyJson?.['error-codes']);
      // FIX: no exponer error-codes ni datos de Google al cliente
      return res.status(400).json({ success: false, message: 'Verificación de seguridad fallida. Recarga la página e intenta de nuevo.' });
    }

    if (typeof verifyJson.score === 'number' && verifyJson.score < 0.5) {
      console.warn(`reCAPTCHA score too low: ${verifyJson.score}`);
      return res.status(400).json({ success: false, message: 'Verificación de seguridad fallida. Intenta de nuevo.' });
    }

    // ── Validación del voucher ───────────────────────────────────────────────
    if (voucherBase64 && voucherFileName) {
      // FIX: validar tamaño máximo (~3 MB)
      if (voucherBase64.length > MAX_VOUCHER_B64_CHARS) {
        return res.status(400).json({ success: false, message: 'El comprobante es demasiado grande. Máximo permitido: 3 MB.' });
      }
      // FIX: validar tipo de archivo por su prefijo data URI
      const mimeMatch = voucherBase64.match(/^data:([^;]+);base64,/);
      if (!mimeMatch || !ALLOWED_MIME_TYPES.has(mimeMatch[1])) {
        return res.status(400).json({ success: false, message: 'Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.' });
      }
    }

    // ── Configuración de Formspree ───────────────────────────────────────────
    const FORMSPREE_ID      = process.env.FORMSPREE_ID;
    const FORMSPREE_API_KEY = process.env.FORMSPREE_API_KEY || null;
    if (!FORMSPREE_ID) {
      console.error('Missing FORMSPREE_ID env variable');
      return res.status(500).json({ success: false, message: 'Error de configuración del servidor.' });
    }

    // ── Construir payload para Formspree ─────────────────────────────────────
    const emailBody = {
      name:         cleanName,
      email:        cleanEmail,
      phone:        sanitize(phone),
      document:     sanitize(document),
      cartDetails:  cartDetails ? JSON.stringify(cartDetails) : '',
      timestamp:    timestamp || new Date().toISOString(),
      _subject:     sanitize(subject) || `Nueva Reserva - ${cleanName}`,
      _replyto:     cleanEmail,
    };

    if (voucherBase64 && voucherFileName) {
      emailBody.comprobante_archivo = sanitize(voucherFileName);
      // HTML para visualizar el comprobante en el email
      emailBody._html = `
        <h3 style="font-family:sans-serif">Nueva Reserva — AyacuchoFest</h3>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0"><strong>Nombre</strong></td><td>${cleanName}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td>${cleanEmail}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Teléfono</strong></td><td>${sanitize(phone)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Documento</strong></td><td>${sanitize(document)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Archivo</strong></td><td>${sanitize(voucherFileName)}</td></tr>
        </table>
        <h4 style="font-family:sans-serif">Detalle del carrito</h4>
        <pre style="font-family:monospace;font-size:12px">${JSON.stringify(cartDetails || {}, null, 2)}</pre>
        <h4 style="font-family:sans-serif">Comprobante</h4>
        <img src="${voucherBase64}" alt="comprobante" style="max-width:500px;border:1px solid #eee" />
      `;
    }

    // ── Enviar a Formspree ────────────────────────────────────────────────────
    const headers = {
      'Content-Type': 'application/json',
      Accept:         'application/json',
    };
    if (FORMSPREE_API_KEY) headers['Authorization'] = `Bearer ${FORMSPREE_API_KEY}`;

    const formspreeRes = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method:  'POST',
      headers,
      body:    JSON.stringify(emailBody),
    });

    const text = await formspreeRes.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }

    if (!formspreeRes.ok) {
      console.error('Formspree error:', formspreeRes.status, text);
      return res.status(502).json({ success: false, message: 'Error al enviar la reserva. Intenta de nuevo.' });
    }

    return res.status(200).json({ success: true, message: 'Reserva enviada correctamente.' });

  } catch (err) {
    console.error('Error in send-reservation:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor. Intenta de nuevo.' });
  }
}
