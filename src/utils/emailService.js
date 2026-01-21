import supabase from "./supabaseClient";
import { generarCodigoOTP } from "./validaciones";
import { enviarEmailOTP } from "./emailConfig";

/**
 * Enviar código de verificación por email
 */
export const enviarCodigoVerificacion = async (email) => {
  try {
    const codigo = generarCodigoOTP();

    // 1. Usar UPSERT: actualizar si existe, insertar si no
    const { error: upsertError } = await supabase
      .from("email_verificaciones")
      .upsert(
        [
          {
            email,
            codigo,
            verificado: false,
            intentos: 0,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          },
        ],
        { onConflict: "email" }, // Si email existe, actualiza
      );

    if (upsertError) throw upsertError;

    // 2. Enviar email con código
    const resultadoEmail = await enviarEmailOTP(email, codigo);

    if (!resultadoEmail.exitoso) {
      throw new Error(resultadoEmail.error || "Error al enviar email");
    }

    return { exitoso: true, mensaje: "Código enviado al email" };
  } catch (err) {
    console.error("Error al enviar código:", err);
    return {
      exitoso: false,
      error: "Error al enviar el código. Intenta de nuevo.",
    };
  }
};

/**
 * Verificar código OTP
 */
export const verificarCodigoOTP = async (email, codigo) => {
  try {
    const { data, error } = await supabase
      .from("email_verificaciones")
      .select("*")
      .eq("email", email)
      .eq("codigo", codigo)
      .single();

    if (error || !data) {
      // Incrementar intentos fallidos
      const { data: verif } = await supabase
        .from("email_verificaciones")
        .select("intentos")
        .eq("email", email)
        .single();

      if (verif && verif.intentos >= 3) {
        await supabase.from("email_verificaciones").delete().eq("email", email);

        return {
          valido: false,
          error: "Demasiados intentos fallidos. Solicita un nuevo código.",
        };
      }

      // Incrementar intentos
      await supabase
        .from("email_verificaciones")
        .update({ intentos: (verif?.intentos || 0) + 1 })
        .eq("email", email);

      return { valido: false, error: "Código incorrecto" };
    }

    // Verificar si expiró (15 minutos)
    const ahora = new Date();
    const expiresAt = new Date(data.expires_at);

    if (ahora > expiresAt) {
      await supabase.from("email_verificaciones").delete().eq("email", email);

      return {
        valido: false,
        error: "El código expiró. Solicita uno nuevo.",
      };
    }

    // Marcar como verificado
    await supabase
      .from("email_verificaciones")
      .update({ verificado: true })
      .eq("email", email);

    return { valido: true };
  } catch (err) {
    console.error("Error al verificar código:", err);
    return { valido: false, error: "Error al verificar el código" };
  }
};

/**
 * Registrar intento fallido en auditoría
 */
export const registrarIntentoFallido = async (email, dni, razon, ip) => {
  try {
    await supabase.from("intento_compras_fallidas").insert([
      {
        email,
        dni,
        razon,
        ip_address: ip,
      },
    ]);
  } catch (err) {
    console.error("Error al registrar intento fallido:", err);
  }
};

/**
 * Verificar si email ya existe en compras
 */
export const emailYaExiste = async (email) => {
  try {
    const { data, error } = await supabase
      .from("entradas")
      .select("id")
      .eq("email", email)
      .eq("validacion_estado", "pendiente")
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error("Error al verificar email:", err);
    return false;
  }
};

/**
 * Verificar si DNI ya existe en compras
 */
export const dniYaExiste = async (dni) => {
  try {
    const { data, error } = await supabase
      .from("entradas")
      .select("id")
      .eq("dni", dni)
      .eq("validacion_estado", "pendiente")
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error("Error al verificar DNI:", err);
    return false;
  }
};
