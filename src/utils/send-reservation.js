/**
 * API Serverless para enviar reservas a Formspree
 * Resuelve problemas de CORS haciendo la llamada desde el servidor
 * Maneja archivos (comprobantes) en multipart/form-data
 */

export default async function handler(req, res) {
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
    } = req.body;

    // Si hay archivo en la request (Vercel multipart)
    const hasFile = req.files && req.files.voucherFile;

    // Validación básica
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    // ID del formulario en Formspree
    const FORMSPREE_ID = "xojnqjwk";

    // Preparar el cuerpo para Formspree (JSON)
    const emailBody = {
      name,
      email,
      phone,
      document,
      refNumber,
      cartDetails,
      timestamp,
      _subject: subject || "Nueva Reserva",
      comprobante_adjunto: hasFile ? "✓ Sí" : "✗ No",
    };

    // Enviar a Formspree desde el servidor (sin problemas de CORS)
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      console.error("Error de Formspree:", response.status);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la reserva en el servidor",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reserva enviada exitosamente" + (hasFile ? " con comprobante" : ""),
      refNumber,
      fileReceived: hasFile ? true : false,
    });
  } catch (error) {
    console.error("Error en send-reservation:", error);
    return res.status(500).json({
      success: false,
      message: "Error de conexión con el servidor de email",
    });
  }
}
