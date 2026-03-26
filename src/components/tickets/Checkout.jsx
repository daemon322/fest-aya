import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
import { GiExitDoor } from "react-icons/gi";
import { BsFillFileImageFill } from "react-icons/bs";

/* ─── Seguridad / Sanitización ─────────────────────────────────────────── */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>"'`]/g, "") // previene XSS básico
    .slice(0, 255);
};

const validateEmail = (email) => {
  const s = sanitizeInput(email).toLowerCase();
  const allowedDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "edu.pe",
    "unmsm.edu.pe",
    "unh.edu.pe",
  ];
  const domain = s.split("@")[1];
  return (
    /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(s) &&
    allowedDomains.some((d) => domain === d || domain?.endsWith("." + d))
  );
};

const validatePhone = (phone) => {
  const s = sanitizeInput(phone);
  return /^[\d\s+()-]{7,20}$/.test(s);
};

const validateDocument = (doc) => {
  const s = sanitizeInput(doc);
  return s.length >= 6 && s.length <= 20;
};

const validateFormData = (data) => {
  const name = sanitizeInput(data.name);
  const email = sanitizeInput(data.email);
  const phone = sanitizeInput(data.phone);
  const document = sanitizeInput(data.document);
  const errors = [];

  if (!name || name.length < 3)
    errors.push("Nombre debe tener al menos 3 caracteres");
  if (!validateEmail(email))
    errors.push("El correo no es válido o el dominio no es permitido");
  if (!validatePhone(phone)) errors.push("Teléfono no válido");
  if (!validateDocument(document))
    errors.push("Documento debe tener entre 6 y 20 caracteres");

  return { isValid: errors.length === 0, errors };
};

/* ─── Checkout ──────────────────────────────────────────────────────────── */
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
  const [honeypot, setHoneypot] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotification, setSuccessNotification] = useState(false);

  // reCAPTCHA v2
  const recaptchaRef = useRef(null);

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // ── Scroll al inicio del checkout en cada cambio de paso ───────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // El modal de éxito no se cierra automáticamente.
  // El usuario lo cierra manualmente con el botón.

  /* ── Envío del formulario ─────────────────────────────────────────────── */
  const handleConfirmAndSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Obtener token de reCAPTCHA v2
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setFormErrors([
        "Por favor completa la verificación de seguridad (reCAPTCHA).",
      ]);
      setIsSubmitting(false);
      return;
    }

    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      document: sanitizeInput(formData.document),
    };

    try {
      // Convertir voucher a base64 si existe
      let voucherBase64 = null;
      let voucherFileName = null;

      if (voucher) {
        voucherFileName = voucher.name;
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            voucherBase64 = reader.result;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(voucher);
        }).catch(() => {
          setFormErrors(["Error al procesar el archivo. Intenta de nuevo."]);
          setIsSubmitting(false);
          recaptchaRef.current?.reset();
          return;
        });
        if (!voucherBase64) return;
      }

      const response = await fetch("/send-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          hp: honeypot,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setSuccessNotification(true);
        setShowConfirmDialog(false);
        setFormErrors([]);
      } else {
        try {
          const errorData = await response.json();
          const msg =
            errorData.message ||
            "Error al procesar la reserva. Intenta de nuevo.";
          setFormErrors([msg]);
        } catch {
          setFormErrors([
            "Error al procesar la reserva. Verifica tu conexión e intenta de nuevo.",
          ]);
        }
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error("Error enviando reserva:", error);
      setFormErrors([
        "Error de conexión. Verifica tu internet e intenta de nuevo.",
      ]);
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Indicador de pasos ─────────────────────────────────────────────── */
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-16 select-none">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${
              step === i
                ? "bg-amber-500 border-amber-500 text-white scale-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : step > i
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-red-500/50 text-white/80"
            }`}
          >
            {step > i ? <CheckCircle2 size={16} /> : i}
          </div>
          {i < 4 && (
            <div
              className={`sm:w-16 w-12 h-[1px] mx-2 ${step > i ? "bg-green-500" : "bg-red-500/50"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen bg-black overflow-y-auto flex flex-col items-center">
      <div className="max-w-4xl w-full p-4 pt-20">
        {/* Navegación Superior */}
        <div className="flex justify-between items-center mb-12 pt-10">
          <button
            onClick={step === 1 ? onBack : prevStep}
            className="group flex items-center gap-3 text-white/80 hover:text-white transition-all uppercase text-[9px] tracking-[0.4em] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white/80">
              <ArrowLeft size={12} />
            </div>
            {step === 1 ? "Volver" : "Paso anterior"}
          </button>
          <div className="text-right select-none">
            <p className="text-[8px] uppercase tracking-[0.5em] text-amber-500 mb-1 font-bold">
              Checkout Seguro
            </p>
            <p className="text-xs font-mono text-white/40">REF: {refNumber}</p>
          </div>
        </div>

        {renderStepIndicator()}

        <div className="max-w-2xl mx-auto pb-24">
          {/* ── PASO 1: Resumen ──────────────────────────────────────── */}
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

              <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 mt-10 space-y-6">
                <div className="flex justify-between text-[14px] uppercase tracking-[0.2em] text-white/90 gap-2">
                  <span>Monto Tickets</span>
                  <span className="font-mono text-white sm:text-xl text-[14px]">
                    S/{subtotal.toFixed(2)}
                    <span className="text-amber-400 text-[10px]"> PEN</span>
                  </span>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-center gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Total Final
                    </span>
                    <p className="text-[9px] text-white/90 uppercase tracking-widest italic">
                      Incluye impuestos y cargos
                    </p>
                  </div>
                  <span className="sm:text-5xl text-2xl font-mono text-amber-500 tracking-tighter">
                    S/{subtotal.toFixed(2)}
                    <span className="text-white sm:text-lg text-sm"> PEN</span>
                  </span>
                </div>
              </div>
              <div className="flex m-auto justify-center">
                <button
                  disabled={safeCart.length === 0}
                  onClick={nextStep}
                  className="p-10 py-7 bg-white text-black hover:text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-amber-500 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed mt-10"
                >
                  Confirmar e ir a Datos
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 2: Datos del titular ────────────────────────── */}
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
                    ph: "tucorreo@gmail.com",
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
                      value={formData[input.id]}
                      maxLength={255}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, [input.id]: e.target.value })
                      }
                    />
                  </div>
                ))}

                {/* Honeypot anti-bot */}
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
              <div className="flex m-auto justify-center">
                <button
                  onClick={() => {
                    if (honeypot) return; // bot detectado
                    const validation = validateFormData(formData);
                    if (!validation.isValid) {
                      setFormErrors(validation.errors);
                      return;
                    }
                    setFormErrors([]);
                    nextStep();
                  }}
                  className="p-6 py-6 bg-white text-black hover:text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-amber-500 transition-all disabled:opacity-10 mt-6 cursor-pointer flex gap-2 justify-center items-center"
                >
                  Siguiente: Adjuntar Pago <BsFillFileImageFill size={14}/>
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 3: Voucher / Pago ───────────────────────────── */}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10">
              <header className="text-center">
                <h2 className="text-5xl font-serif italic text-white mb-4">
                  Validar Pago
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/90">
                  Adjunta el comprobante de yapeo
                </p>
              </header>

              <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl flex items-start gap-5">
                <Info className="text-amber-500 mt-1" size={20} />
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                    Cuenta a Yapear
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Yape: 961379018 <br />
                    Titular: Herny Escalante
                  </p>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  id="voucher-upload"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
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
                    {voucher
                      ? voucher.name
                      : "Arrastra aquí o haz clic · JPG, PNG, WEBP, PDF"}
                  </p>
                </label>
              </div>
              <div className="flex m-auto justify-center">
                <button
                  disabled={!voucher}
                  onClick={nextStep}
                  className="p-10 py-7 bg-white text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-amber-500 transition-all disabled:opacity-10 cursor-pointer disabled:cursor-not-allowed"
                >
                  Último paso de validación
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 4: Confirmación + reCAPTCHA v2 ─────────────── */}
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

                {/* reCAPTCHA v2 checkbox */}
                <div className="flex justify-center py-4">
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 inline-block">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      theme="dark"
                    />
                  </div>
                </div>
                <p className="text-center text-[9px] text-white/30 uppercase tracking-widest">
                  Verificación de seguridad obligatoria
                </p>

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
                <div className="flex m-auto justify-center">
                  <button
                    disabled={!agreed}
                    onClick={() => {
                      const validation = validateFormData(formData);
                      if (!validation.isValid) {
                        setFormErrors(validation.errors);
                        return;
                      }
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
                      setShowConfirmDialog(true);
                    }}
                    className="p-10 py-8 bg-amber-500 text-white hover:text-black font-black uppercase text-[12px] tracking-[0.6em] rounded-2xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(245,158,11,0.15)] disabled:opacity-10 cursor-pointer disabled:cursor-not-allowed mt-10"
                  >
                    Finalizar Reserva
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL DE CONFIRMACIÓN ──────────────────────────────────── */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
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
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
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
                      y te enviará la confirmación dentro de 24 horas.<br></br>
                      REVISA TU CORREO (INCLUYENDO SPAM) PARA NO PERDER TU
                      RESERVA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 border border-white/20 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAndSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-amber-500 text-black hover:text-green-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
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

        {/* ── NOTIFICACIÓN DE ÉXITO ──────────────────────────────────── */}
        {successNotification && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 px-4">
            <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl max-w-lg w-full mx-auto p-8 sm:p-10 space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Ícono + título */}
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif italic text-white">
                    ¡Reserva Exitosa!
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-green-500/80 font-bold mt-2">
                    Solicitud recibida correctamente
                  </p>
                </div>
              </div>

              {/* Correo */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl px-6 py-4 text-center space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/80">
                  Confirmación enviada a
                </p>
                <p className="text-sm font-mono text-green-400 break-all">
                  {formData.email}
                </p>
              </div>

              {/* Proceso detallado */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-black">
                  ¿Qué sigue ahora?
                </p>

                <div className="space-y-3">
                  {/* Paso 1 */}
                  <div className="flex gap-4 items-start bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-[10px] font-black shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">
                        Revisión de tu comprobante
                      </p>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Nuestro equipo verificará el voucher que adjuntaste. Una
                        vez validado recibirás una confirmación en tu correo.
                        <br></br>REVISA TU CORREO (INCLUYENDO SPAM) PARA NO
                        PERDER TU RESERVA.
                      </p>
                    </div>
                  </div>

                  {/* Paso 2 */}
                  <div className="flex gap-4 items-start bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px] font-black shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">
                        Entrega de tu código QR
                      </p>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Tu E-Ticket con código QR será enviado a tu correo{" "}
                        <span className="text-amber-400 font-bold">
                          entre 30 minutos y 1 hora
                        </span>{" "}
                        después de recibir la confirmación de pago.
                      </p>
                      <p className="text-[10px] text-white/30 leading-relaxed mt-1 italic">
                        ⚠ Si hay alta demanda de reservas simultáneas, el tiempo
                        máximo de espera es de{" "}
                        <span className="text-white/50 font-bold">
                          24 horas
                        </span>
                        . Te pedimos paciencia y comprensión.
                      </p>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className="flex gap-4 items-start bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-[10px] font-black shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">
                        Día del evento
                      </p>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Presenta tu QR desde el celular con el brillo al máximo.
                        Lleva tu DNI — las entradas son nominativas e
                        intransferibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota final */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4">
                <p className="text-[10px] text-white/70 leading-relaxed text-center">
                  ¿Dudas? Contáctanos por WhatsApp al{" "}
                  <a
                    href="https://wa.me/51961379018"
                    className="text-amber-500/70 underline"
                  >
                    +51 961 379 018
                  </a>
                  . Guarda este correo como comprobante de tu reserva.
                </p>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onComplete}
                className="w-full py-5 bg-green-500 text-white hover:text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer"
              >
                <CheckCircle size={16} />
                Entendido
                <GiExitDoor size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
