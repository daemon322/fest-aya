/**
 * API Serverless para enviar reservas a Formspree
 * Resuelve problemas de CORS haciendo la llamada desde el servidor
 */

export default async function handler(req, res) {
  const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
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

    // ID del formulario en Formspree
    

    // Preparar el cuerpo para Formspree (JSON)
    // Nota: Los archivos se validan en el cliente, aquí solo enviamos datos
    const emailBody = {
      name,
      email,
      phone,
      document,
      refNumber,
      cartDetails,
      timestamp,
      _subject: subject || "Nueva Reserva",
      _replyto: email, // Agregar email de respuesta
    };

    // Si hay comprobante, incluirlo en el email
    if (voucherBase64 && voucherFileName) {
      emailBody.comprobante_archivo = voucherFileName;
      // Crear HTML con la imagen embebida
      const imageMimeType = voucherBase64.split(";")[0].replace("data:", ""); // e.g., "image/png"
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
        <pre>${JSON.stringify(cartDetails, null, 2)}</pre>
        <p><small>Enviado: ${timestamp}</small></p>
      `;
    }

    console.log("📧 Enviando reserva a Formspree:", {
      nombre: name,
      email: email,
      referencia: refNumber,
      conComprobante: voucherBase64 ? "✓ Sí" : "✗ No",
    });

    // Enviar a Formspree desde el servidor (sin problemas de CORS)
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Formspree:", response.status, errorText);
      return res.status(500).json({
        success: false,
        message: `Error en Formspree: ${response.status}`,
      });
    }

    console.log(
      "✅ Reserva enviada exitosamente a Formspree" +
        (voucherBase64 ? " con comprobante" : ""),
    );

    return res.status(200).json({
      success: true,
      message:
        "Reserva enviada exitosamente" +
        (voucherBase64 ? " con comprobante" : ""),
      refNumber,
      voucherReceived: voucherBase64 ? true : false,
    });
  } catch (error) {
    console.error("❌ Error en send-reservation:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
}
