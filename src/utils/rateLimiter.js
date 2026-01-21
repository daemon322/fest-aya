/**
 * Rate Limiting simple en localStorage
 * Limita intentos por email y por IP
 */

const RATE_LIMIT_KEY = "rate_limit_";
const ATTEMPT_LIMIT = 5; // Máximo 5 intentos
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutos en ms

/**
 * Verificar si se puede hacer un intento
 */
export const puedeIntentarEnvio = (identificador) => {
  const key = RATE_LIMIT_KEY + identificador;
  const data = localStorage.getItem(key);

  if (!data) {
    return { permitido: true, intentosRestantes: ATTEMPT_LIMIT };
  }

  const { intentos, timestamp } = JSON.parse(data);
  const ahora = Date.now();
  const diferencia = ahora - timestamp;

  // Si pasó la ventana, resetear
  if (diferencia > ATTEMPT_WINDOW) {
    localStorage.removeItem(key);
    return { permitido: true, intentosRestantes: ATTEMPT_LIMIT };
  }

  // Si llegó al límite
  if (intentos >= ATTEMPT_LIMIT) {
    const minutosRestantes = Math.ceil((ATTEMPT_WINDOW - diferencia) / 60000);
    return {
      permitido: false,
      intentosRestantes: 0,
      mensajeError: `Demasiados intentos. Intenta de nuevo en ${minutosRestantes} minutos.`,
    };
  }

  return { permitido: true, intentosRestantes: ATTEMPT_LIMIT - intentos };
};

/**
 * Registrar un intento fallido
 */
export const registrarIntento = (identificador) => {
  const key = RATE_LIMIT_KEY + identificador;
  const data = localStorage.getItem(key);

  if (!data) {
    localStorage.setItem(
      key,
      JSON.stringify({
        intentos: 1,
        timestamp: Date.now(),
      }),
    );
  } else {
    const { intentos, timestamp } = JSON.parse(data);
    localStorage.setItem(
      key,
      JSON.stringify({
        intentos: intentos + 1,
        timestamp,
      }),
    );
  }
};

/**
 * Limpiar rate limit (después de éxito)
 */
export const limpiarRateLimit = (identificador) => {
  const key = RATE_LIMIT_KEY + identificador;
  localStorage.removeItem(key);
};
