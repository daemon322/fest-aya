/**
 * Validaciones para seguridad de compras
 */

// Regex para validaciones
const REGEXES = {
  nombre: /^[a-záéíóúñ\s]+$/i, // Solo letras y espacios
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email válido
  dni: /^\d{8}$/, // Exactamente 8 dígitos
  telefono: /^\d{9}$/, // Exactamente 9 dígitos
};

/**
 * Valida el nombre (solo letras y espacios)
 */
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim().length < 3) {
    return {
      valido: false,
      error: "El nombre debe tener al menos 3 caracteres",
    };
  }
  if (nombre.trim().length > 100) {
    return {
      valido: false,
      error: "El nombre no puede exceder 100 caracteres",
    };
  }
  if (!REGEXES.nombre.test(nombre)) {
    return {
      valido: false,
      error: "El nombre solo puede contener letras y espacios",
    };
  }
  return { valido: true };
};

/**
 * Valida el email
 */
export const validarEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { valido: false, error: "El email es requerido" };
  }
  if (!REGEXES.email.test(email)) {
    return { valido: false, error: "El email no tiene un formato válido" };
  }
  if (email.length > 255) {
    return { valido: false, error: "El email es muy largo" };
  }
  return { valido: true };
};

/**
 * Valida el DNI (8 dígitos para Perú)
 */
export const validarDNI = (dni) => {
  if (!dni) {
    return { valido: false, error: "El DNI es requerido" };
  }
  const dniLimpio = dni.replace(/\D/g, ""); // Remover caracteres no numéricos

  if (!REGEXES.dni.test(dniLimpio)) {
    return { valido: false, error: "El DNI debe tener exactamente 8 dígitos" };
  }

  // Validar que no sea todo 0s u 1s (DNI inválido)
  if (/^0+$/.test(dniLimpio) || /^1+$/.test(dniLimpio)) {
    return { valido: false, error: "El DNI ingresado no es válido" };
  }

  return { valido: true, dniLimpio };
};

/**
 * Valida el teléfono (9 dígitos para Perú)
 */
export const validarTelefono = (telefono) => {
  if (!telefono) {
    return { valido: true }; // Es opcional
  }

  const telefonoLimpio = telefono.replace(/\D/g, "");

  if (!REGEXES.telefono.test(telefonoLimpio)) {
    return {
      valido: false,
      error: "El teléfono debe tener exactamente 9 dígitos",
    };
  }

  return { valido: true, telefonoLimpio };
};

/**
 * Valida todos los campos del formulario
 */
export const validarFormulario = (form) => {
  // Validar nombre
  const valNombre = validarNombre(form.nombre);
  if (!valNombre.valido) return valNombre;

  // Validar email
  const valEmail = validarEmail(form.email);
  if (!valEmail.valido) return valEmail;

  // Validar DNI
  const valDNI = validarDNI(form.dni);
  if (!valDNI.valido) return valDNI;

  // Validar teléfono (opcional)
  const valTel = validarTelefono(form.telefono);
  if (!valTel.valido) return valTel;

  return {
    valido: true,
    datosLimpios: {
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      dni: valDNI.dniLimpio,
      telefono: form.telefono ? valTel.telefonoLimpio : form.telefono,
    },
  };
};

/**
 * Genera código OTP de 6 dígitos
 */
export const generarCodigoOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Obtiene la IP del cliente (aproximada)
 */
export const obtenerIPCliente = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return "unknown";
  }
};
