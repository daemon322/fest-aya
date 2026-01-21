/**
 * Configuración de envío de emails
 * Usa un backend Node.js + Nodemailer
 */

/**
 * Obtener URL del backend desde variables de entorno
 */
const getBackendURL = () => {
  // En producción usa VITE_BACKEND_URL, en desarrollo usa localhost
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
};

/**
 * Enviar email con código OTP
 */
export const enviarEmailOTP = async (email, codigo) => {
  try {
    const backendURL = getBackendURL();

    console.log(`📧 Enviando código a: ${email}`);
    console.log(`🔗 Backend URL: ${backendURL}`);

    const response = await fetch(`${backendURL}/api/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, codigo }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error del backend:", data);
      return {
        exitoso: false,
        error: data.message || "Error al enviar el código",
      };
    }

    console.log("✅ Email enviado exitosamente");
    return {
      exitoso: true,
      mensaje: "Código enviado al email",
    };
  } catch (err) {
    console.error("❌ Error enviando email:", err);
    return {
      exitoso: false,
      error: `Error de conexión al servidor. Intenta de nuevo.`,
    };
  }
};

/**
 * ALTERNATIVA: Modo simulado para testing sin backend
 * Solo muestra el código en consola
 */
export const enviarEmailOTPSimulado = async (email, codigo) => {
  console.log(`
╔════════════════════════════════════════╗
║   📧 CÓDIGO OTP PARA TESTING           ║
╠════════════════════════════════════════╣
║ Email:    ${email}
║ Código:   ${codigo}
║ Válido:   15 minutos                   ║
╚════════════════════════════════════════╝
⚠️ MODO SIMULADO - Sin backend real
  `);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        exitoso: true,
        mensaje: "Código mostrado en consola (modo desarrollo)",
      });
    }, 1000);
  });
};
