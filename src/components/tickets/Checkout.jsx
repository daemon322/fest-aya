import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import ScrollToTop from "../layouts/ScrollToTop";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Funciones de seguridad y sanitización
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>"'`]/g, "") // Evita inyecciones XSS básicas
    .slice(0, 255); // Limita longitud
};

const validateEmail = (email) => {
  const sanitized = sanitizeInput(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized);
};

const validatePhone = (phone) => {
  const sanitized = sanitizeInput(phone);
  const phoneRegex = /^[\d\s+()-]{7,20}$/;
  return phoneRegex.test(sanitized);
};

const validateDocument = (doc) => {
  const sanitized = sanitizeInput(doc);
  return sanitized.length >= 6 && sanitized.length <= 20;
};

const validateFormData = (data) => {
  const name = sanitizeInput(data.name);
  const email = sanitizeInput(data.email);
  const phone = sanitizeInput(data.phone);
  const document = sanitizeInput(data.document);

  const errors = [];

  if (!name || name.length < 3) {
    errors.push("Nombre debe tener al menos 3 caracteres");
  }

  if (!validateEmail(email)) {
    errors.push("Email no válido");
  }

  if (!validatePhone(phone)) {
    errors.push("Teléfono no válido");
  }

  if (!validateDocument(document)) {
    errors.push("Documento debe tener entre 6 y 20 caracteres");
  }

  return { isValid: errors.length === 0, errors };
};

const Checkout = ({ cart = [], onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [refNumber] = useState(() =>
    Math.random().toString(36).toUpperCase().substring(2, 9),
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotification, setSuccessNotification] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Validación de seguridad para evitar errores de 'undefined' en el reduce
  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + serviceCharge;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Efecto para auto-cerrar después del éxito
  useEffect(() => {
    if (successNotification) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successNotification, onComplete]);

  const handleConfirmAndSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);

    // Validación final de datos
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Preparar datos sanitizados
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      document: sanitizeInput(formData.document),
    };

    try {
      // Convertir archivo a base64 si existe
      let voucherBase64 = null;
      let voucherFileName = null;

      if (voucher) {
        voucherFileName = voucher.name;
        const reader = new FileReader();

        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => {
            voucherBase64 = reader.result; // Contiene "data:image/png;base64,..."
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(voucher);
        });

        try {
          await base64Promise;
        } catch (error) {
          console.error("Error al leer archivo:", error);
          setFormErrors(["Error al procesar el archivo. Intenta de nuevo."]);
          setIsSubmitting(false);
          return;
        }
      }

      if (!executeRecaptcha) {
        console.error("reCAPTCHA no está disponible");
        setFormErrors([
          "Error de seguridad: reCAPTCHA no disponible. Recarga la página.",
        ]);
        setIsSubmitting(false);
        return;
      }

      // Verificando reCAPTCHA
      setIsVerifyingCaptcha(true);
      let recaptchaToken;
      try {
        recaptchaToken = await executeRecaptcha("checkout_submit");
      } catch (captchaError) {
        console.error("Error ejecutando reCAPTCHA:", captchaError);
        setFormErrors(["Error al verificar la seguridad. Intenta de nuevo."]);
        setIsSubmitting(false);
        setIsVerifyingCaptcha(false);
        return;
      }

      if (!recaptchaToken) {
        setFormErrors([
          "Error: No se pudo generar el token de seguridad. Intenta de nuevo.",
        ]);
        setIsSubmitting(false);
        setIsVerifyingCaptcha(false);
        return;
      }

      // Enviar a través del API endpoint del servidor (JSON)
      const response = await fetch("/api/send-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          document: sanitizedData.document,
          refNumber,
          cartDetails: safeCart,
          timestamp: new Date().toISOString(),
          subject: `Nueva Reserva - ${sanitizedData.name}`,
          voucherBase64,
          voucherFileName,
          hp: honeypot, // 👈 honeypot correcto
          recaptchaToken, // 👈 recaptcha obligatorio
        }),
      });

      if (response.ok) {
        // Éxito
        setSuccessNotification(true);
        setShowConfirmDialog(false);
        setFormErrors([]);
        setIsSubmitting(false);
        setIsVerifyingCaptcha(false);
      } else {
        // Error en la respuesta
        try {
          const errorData = await response.json();
          const errorMessage =
            errorData.message ||
            "Error al procesar la reserva. Intenta de nuevo.";

          // Mensajes específicos para errores de captcha
          if (errorMessage.includes("reCAPTCHA")) {
            setFormErrors([
              "Verificación de seguridad fallida. Por favor, intenta de nuevo.",
              "Si el problema persiste, recarga la página.",
            ]);
          } else {
            setFormErrors([errorMessage]);
          }
        } catch (e) {
          setFormErrors([
            "Error al procesar la reserva. Verifica tu conexión e intenta de nuevo.",
          ]);
        }
        setIsSubmitting(false);
        setIsVerifyingCaptcha(false);
      }
    } catch (error) {
      console.error("Error enviando reserva:", error);
      setFormErrors([
        "Error de conexión. Verifica tu internet e intenta de nuevo.",
      ]);
      setIsSubmitting(false);
      setIsVerifyingCaptcha(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-16">
      <ScrollToTop />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${
              step === i
                ? "bg-amber-500 border-amber-500 text-black scale-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : step > i
                  ? "bg-white border-white text-black"
                  : "border-white/10 text-white/20"
            }`}
          >
            {step > i ? <CheckCircle2 size={16} /> : i}
          </div>
          {i < 4 && (
            <div
              className={`w-16 h-[1px] mx-2 ${step > i ? "bg-white" : "bg-white/5"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black overflow-y-auto flex flex-col items-center">
      <div className="max-w-4xl w-full p-8 pt-20">
        {/* Navegación Superior */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={step === 1 ? onBack : prevStep}
            className="group flex items-center gap-3 text-white/40 hover:text-white transition-all uppercase text-[9px] tracking-[0.4em]"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
              <ArrowLeft size={12} />
            </div>
            {step === 1 ? "Volver a la selección" : "Paso anterior"}
          </button>

          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.5em] text-amber-500 mb-1 font-bold">
              Checkout Seguro
            </p>
            <p className="text-xs font-mono text-white/40">REF: {refNumber}</p>
          </div>
        </div>

        {renderStepIndicator()}

        {/* CONTENIDO SEGÚN PASO */}
        <div className="max-w-2xl mx-auto pb-24">
          {/* PASO 1: RESUMEN DETALLADO */}
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
              <header className="text-center mb-12">
                <h2 className="text-5xl font-serif italic text-white mb-4">
                  Revisión de Reserva
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/90">
                  Verifica los detalles de tus tickets antes de continuar
                </p>
              </header>

              <div className="space-y-4">
                {safeCart.length > 0 ? (
                  safeCart.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-white/10 transition-colors"
                    >
                      <div className="space-y-3">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[14px] font-bold uppercase tracking-widest rounded-full">
                          {item.phaseName}
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/70 text-[12px] tracking-widest">
                          <span>Cant: {item.quantity}</span>
                          <div className="w-1 h-1 bg-white/10 rounded-full" />
                          <span>Unit: S/ {Number(item.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] text-white/80 uppercase tracking-widest mb-1">
                          Subtotal
                        </p>
                        <p className="text-2xl font-mono text-white tracking-tighter">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-[#0a0a0a] rounded-[2rem] border border-white/5">
                    <p className="text-white/20 uppercase tracking-widest text-[10px]">
                      El carrito está vacío
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 mt-10 space-y-6">
                <div className="flex justify-between text-[14px] uppercase tracking-[0.3em] text-white/90">
                  <span>Monto Tickets</span>
                  <span className="font-mono text-white/80">
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[14px] uppercase tracking-[0.3em] text-white/90">
                  <span>Comisión Digital (5%)</span>
                  <span className="font-mono text-white/80">
                    S/ {serviceCharge.toFixed(2)}
                  </span>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-white">
                      Total Final
                    </span>
                    <p className="text-[9px] text-white/70 uppercase tracking-widest italic">
                      Incluye impuestos y cargos
                    </p>
                  </div>
                  <span className="text-5xl font-mono text-amber-500 tracking-tighter">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                disabled={safeCart.length === 0}
                onClick={nextStep}
                className="w-full py-7 bg-white text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-amber-500 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed mt-10"
              >
                Confirmar e ir a Datos
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          )}

          {/* PASO 2: INFORMACIÓN */}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10">
              <header className="text-center">
                <h2 className="text-5xl font-serif italic text-white mb-4">
                  Titular
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/80">
                  Información necesaria para tus E-Tickets
                </p>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    label: "Nombre Completo",
                    id: "name",
                    ph: "Ej: Juan Pérez",
                  },
                  {
                    label: "Correo Electrónico",
                    id: "email",
                    ph: "juan@ejemplo.com",
                  },
                  {
                    label: "Teléfono / WhatsApp",
                    id: "phone",
                    ph: "+51 999 888 777",
                  },
                  {
                    label: "DNI / Pasaporte",
                    id: "document",
                    ph: "Número de documento",
                  },
                ].map((input) => (
                  <div key={input.id} className="group space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/80 ml-4 group-focus-within:text-amber-500 transition-colors">
                      {input.label}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 text-sm focus:border-amber-500/40 focus:bg-white/[0.03] outline-none transition-all placeholder:text-white/70 text-white"
                      placeholder={input.ph}
                      onChange={(e) =>
                        setFormData({ ...formData, [input.id]: e.target.value })
                      }
                      value={formData[input.id]}
                    />
                  </div>
                ))}

                {/* Honeypot anti-bot (campo oculto) */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* Mostrar errores de validación */}
              {formErrors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-2">
                  {formErrors.map((error, idx) => (
                    <p
                      key={idx}
                      className="text-[10px] uppercase tracking-widest text-red-400"
                    >
                      ⚠ {error}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  // Validar honeypot (anti-bot)
                  if (honeypot) {
                    console.warn("Possible bot detected");
                    return;
                  }

                  // Validar datos
                  const validation = validateFormData(formData);
                  if (!validation.isValid) {
                    setFormErrors(validation.errors);
                    return;
                  }

                  setFormErrors([]);
                  nextStep();
                }}
                className="w-full py-7 bg-white text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-amber-500 transition-all disabled:opacity-10 mt-6 cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente: Registrar Pago
              </button>
            </div>
          )}

          {/* PASO 3: PAGO / VOUCHER */}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10">
              <header className="text-center">
                <h2 className="text-5xl font-serif italic text-white mb-4">
                  Validar Pago
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/90">
                  Adjunta el comprobante de transferencia
                </p>
              </header>

              <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl flex items-start gap-5">
                <Info className="text-amber-500 mt-1" size={20} />
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                    Cuentas de Transferencia
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    BCP Soles: 191-XXXXXXXX-0-XX <br />
                    CCI: 002-191-XXXXXXXXXX-XX <br />
                    Titular: EVENTOS SAC
                  </p>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  id="voucher-upload"
                  className="hidden"
                  onChange={(e) => setVoucher(e.target.files[0])}
                />
                <label
                  htmlFor="voucher-upload"
                  className="block bg-[#0a0a0a] border-2 border-dashed border-white/10 rounded-[3rem] p-20 text-center cursor-pointer group-hover:border-amber-500/30 transition-all hover:bg-white/[0.02]"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white/30">
                    <Camera size={32} strokeWidth={1} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2 text-white">
                    {voucher ? "Comprobante Listo" : "Subir Comprobante"}
                  </p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest">
                    {voucher ? voucher.name : "Arrastra aquí o haz clic"}
                  </p>
                </label>
              </div>

              <button
                disabled={!voucher}
                onClick={nextStep}
                className="w-full py-7 bg-white text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-amber-500 transition-all disabled:opacity-10 cursor-pointer disabled:cursor-not-allowed"
              >
                Último paso de validación
              </button>
            </div>
          )}

          {/* PASO 4: TÉRMINOS */}
          {step === 4 && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10">
              <header className="text-center">
                <h2 className="text-5xl font-serif italic text-white mb-4">
                  Confirmación
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/90">
                  Finaliza tu solicitud de reserva
                </p>
              </header>

              <div className="space-y-6">
                <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-start gap-4">
                    <ShieldCheck
                      size={20}
                      className="text-amber-500 shrink-0"
                    />
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                        Garantía de Autenticidad
                      </p>
                      <p className="text-[11px] leading-relaxed text-white/70">
                        Al confirmar, enviaremos los detalles a tu correo
                        electrónico. Un asesor revisará el comprobante adjunto y
                        habilitará tus códigos QR en un lapso de 12 a 24 horas.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.05] transition-all">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                  />
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${agreed ? "bg-amber-500 border-amber-500" : "border-white/20"}`}
                  >
                    {agreed && (
                      <CheckCircle2 size={16} className="text-black" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">
                    Acepto términos y condiciones
                  </span>
                </label>

                <button
                  disabled={!agreed}
                  onClick={() => {
                    // Validación final
                    const validation = validateFormData(formData);
                    if (!validation.isValid) {
                      setFormErrors(validation.errors);
                      return;
                    }

                    // Validar que tenemos todos los datos requeridos
                    if (
                      !formData.name ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.document ||
                      !voucher ||
                      !agreed
                    ) {
                      alert("Por favor completa todos los campos requeridos");
                      return;
                    }

                    // Abrir diálogo de confirmación
                    setShowConfirmDialog(true);
                  }}
                  className="w-full py-8 bg-amber-500 text-black font-black uppercase text-[12px] tracking-[0.6em] rounded-2xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(245,158,11,0.15)] disabled:opacity-10 cursor-pointer disabled:cursor-not-allowed mt-10"
                >
                  Finalizar Reserva Luxury
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL DE CONFIRMACIÓN */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-md w-full mx-4 p-10 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic text-white">
                    Confirmar Reserva
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500">
                    Último paso
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                      ¿Deseas finalizar tu reserva?
                    </p>
                    <p className="text-[11px] leading-relaxed text-white/70">
                      Se enviará un email a{" "}
                      <span className="text-amber-500 font-mono">
                        {formData.email}
                      </span>{" "}
                      con los detalles de tu reserva. Nuestro equipo la revisará
                      y te enviará la confirmación dentro de 24 horas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 border border-white/20 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAndSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-amber-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isVerifyingCaptcha ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                      Verificando Seguridad...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICACIÓN DE ÉXITO */}
        {successNotification && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl max-w-md w-full mx-4 p-10 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center animate-in scale-in-50 duration-500">
                  <CheckCircle size={40} className="text-green-500" />
                </div>

                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-serif italic text-white">
                    ¡Reserva Exitosa!
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-green-500/80 font-bold">
                    Confirmación en progreso
                  </p>
                </div>

                <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl w-full space-y-3">
                  <p className="text-[11px] leading-relaxed text-white/80">
                    Hemos recibido tu reserva correctamente. Se ha enviado un
                    email a:
                  </p>
                  <p className="text-[10px] font-mono bg-white/5 p-3 rounded-xl text-green-400 text-center break-all">
                    {formData.email}
                  </p>
                  <div className="border-t border-green-500/20 pt-4">
                    <p className="text-[11px] leading-relaxed text-white/80">
                      <span className="text-green-400 font-bold">
                        ✓ Nuestro equipo
                      </span>{" "}
                      revisará tu comprobante y{" "}
                      <span className="text-green-400 font-bold">
                        dentro de 24 horas
                      </span>{" "}
                      recibirás la confirmación por correo con tus códigos QR.
                    </p>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-green-500 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <p className="text-[9px] text-white/40 mt-3 text-center">
                    Cerrando en unos momentos...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
