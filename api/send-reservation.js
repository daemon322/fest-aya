// /api/send-reservation.js
export default async function handler(req, res) {
  // En producción Vercel -> usar process.env
  const FORMSPREE_ID = process.env.FORMSPREE_ID || process.env.VITE_FORMSPREE_ID;
  const FORMSPREE_API_KEY = process.env.FORMSPREE_API_KEY || null;

  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      name,
      email,
      phone,
      document,
      refNumber,
      cartDetails,
      timestamp,
      subject,
      voucherBase64,
      voucherFileName,
    } = req.body;

    // Validación básica
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    if (!FORMSPREE_ID) {
      console.error("Falta FORMSPREE_ID en process.env");
      return res.status(500).json({
        success: false,
        message: "Configuración del servidor incompleta",
      });
    }

    const emailBody = {
      name,
      email,
      phone,
      document,
      refNumber,
      cartDetails,
      timestamp,
      _subject: subject || "Nueva Reserva",
      _replyto: email,
    };

    if (voucherBase64 && voucherFileName) {
      emailBody.comprobante_archivo = voucherFileName;
      emailBody._html = `
        <h3>Reserva Confirmada</h3>
        <p><strong>Referencia:</strong> ${refNumber}</p>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <h4>📎 Comprobante de Pago:</h4>
        <p><strong>Archivo:</strong> ${voucherFileName}</p>
        <img src="${voucherBase64}" alt="Comprobante" style="max-width: 500px; border: 1px solid #ddd; padding: 10px;" />
        <hr />
        <p><strong>Detalles:</strong></p>
        <pre>${JSON.stringify(cartDetails ?? {}, null, 2)}</pre>
        <p><small>Enviado: ${timestamp}</small></p>
      `;
    }

    console.log("📧 Enviando reserva a Formspree:", {
      nombre: name,
      email,
      referencia: refNumber,
      conComprobante: voucherBase64 ? "✓ Sí" : "✗ No",
    });

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (FORMSPREE_API_KEY) {
      headers["Authorization"] = `Bearer ${FORMSPREE_API_KEY}`;
    }

    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers,
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Formspree:", response.status, errorText);
      return res.status(500).json({
        success: false,
        message: `Error en Formspree: ${response.status}`,
        detail: errorText,
      });
    }

    console.log("✅ Reserva enviada exitosamente a Formspree" + (voucherBase64 ? " con comprobante" : ""));

    return res.status(200).json({
      success: true,
      message: "Reserva enviada exitosamente" + (voucherBase64 ? " con comprobante" : ""),
      refNumber,
      voucherReceived: !!voucherBase64,
    });
  } catch (error) {
    console.error("❌ Error en send-reservation:", error);
    return res.status(500).json({
      success: false,
      message: "Error: " + (error?.message || String(error)),
    });
  }
}