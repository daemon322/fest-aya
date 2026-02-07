/**
 * API Serverless para enviar reservas a Formspree
 * Resuelve problemas de CORS haciendo la llamada desde el servidor
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

    console.log("📧 Enviando reserva a Formspree:", {
      nombre: name,
      email: email,
      referencia: refNumber,
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
      console.error(
        "Error de Formspree:",
        response.status,
        errorText
      );
      return res.status(500).json({
        success: false,
        message: `Error en Formspree: ${response.status}`,
      });
    }

    console.log("✅ Reserva enviada exitosamente a Formspree");

    return res.status(200).json({
      success: true,
      message: "Reserva enviada exitosamente",
      refNumber,
    });
  } catch (error) {
    console.error("❌ Error en send-reservation:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
}
