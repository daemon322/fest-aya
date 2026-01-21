// src/components/CompraEntrada.jsx
import { useState, useRef, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import QRCode from "react-qr-code";
import SelectorEvento from "./SelectorEvento";
import nikeblack from "../assets/yape1.png";
import { FiPlus, FiMinus, FiTrash2, FiCheck } from "react-icons/fi";
import { validarFormulario, obtenerIPCliente } from "../utils/validaciones";
import {
  puedeIntentarEnvio,
  registrarIntento,
  limpiarRateLimit,
} from "../utils/rateLimiter";
import {
  enviarCodigoVerificacion,
  verificarCodigoOTP,
  registrarIntentoFallido,
  emailYaExiste,
  dniYaExiste,
} from "../utils/emailService";

const ADMIN_CUENTA = "Cuenta BCP: XXXX-XXXX-XX-XXXX\nYape: +51 987654321";

export default function CompraEntrada() {
  const [seleccion, setSeleccion] = useState({ eventoId: null, tipoObj: null });
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);

  // Nuevos estados para verificación
  const [paso, setPaso] = useState("form"); // "form", "verificacion", "compra"
  const [codigoOTP, setCodigoOTP] = useState("");
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [ipCliente, setIpCliente] = useState(null);

  const cartRef = useRef(null);
  const paymentRef = useRef(null);
  const AddCartRef = useRef(null);

  // Obtener IP al cargar
  useEffect(() => {
    const getIP = async () => {
      const ip = await obtenerIPCliente();
      setIpCliente(ip);
    };
    getIP();
  }, []);

  const onSelectorChange = (eventoId, tipoObj) => {
    setSeleccion({ eventoId, tipoObj });
    // Scroll al agregar selección
    setTimeout(() => {
      AddCartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const agregarAlCarrito = () => {
    if (!seleccion.tipoObj) {
      setMessage({ type: "error", text: "Selecciona un tipo de entrada." });
      return;
    }

    if (seleccion.tipoObj.stock_disponible <= 0) {
      setMessage({
        type: "error",
        text: "No hay stock disponible para este tipo.",
      });
      return;
    }

    // Verificar si el tipo ya existe en el carrito
    const itemExistente = cart.find(
      (item) => item.tipoId === seleccion.tipoObj.id,
    );

    if (itemExistente) {
      // Si existe, aumentar la cantidad
      setCart(
        cart.map((item) =>
          item.tipoId === seleccion.tipoObj.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      );
      setMessage({
        type: "success",
        text: `${seleccion.tipoObj.nombre} - Cantidad aumentada a ${itemExistente.cantidad + 1}`,
      });
    } else {
      // Si no existe, crear nuevo item
      const cartItem = {
        id: `${seleccion.tipoObj.id}`, // ID único basado solo en tipoId
        tipoId: seleccion.tipoObj.id,
        nombre: seleccion.tipoObj.nombre,
        precio: seleccion.tipoObj.precio,
        color: seleccion.tipoObj.color_hex,
        cantidad: 1,
      };

      setCart([...cart, cartItem]);
      setMessage({
        type: "success",
        text: `${seleccion.tipoObj.nombre} agregado al carrito`,
      });
    }

    // Hacer scroll al carrito después de agregar
    setTimeout(() => {
      cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    setTimeout(() => setMessage(null), 2000);
  };

  const actualizarCantidad = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const eliminarDelCarrito = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calcularTotal = () => {
    return cart.reduce(
      (sum, item) => sum + Number(item.precio) * item.cantidad,
      0,
    );
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * FUNCIÓN FALTANTE: Generar QR string
   */
  const generarPaymentQrString = (entryId) => {
    const monto = calcularTotal().toFixed(2);
    return `pago|evento:${seleccion.eventoId}|items:${cart.length}|id:${entryId}|monto:${monto}`;
  };

  /**
   * PASO 1: Validar formulario y enviar código OTP
   */
  const handleEnviarCodigoOTP = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Verificar rate limit
    const rateLimitCheck = puedeIntentarEnvio(form.email);
    if (!rateLimitCheck.permitido) {
      setMessage({
        type: "error",
        text: rateLimitCheck.mensajeError,
      });
      return;
    }

    // Validar formulario
    const validacion = validarFormulario(form);
    if (!validacion.valido) {
      setMessage({ type: "error", text: validacion.error });
      registrarIntento(form.email);
      await registrarIntentoFallido(
        form.email,
        form.dni,
        validacion.error,
        ipCliente,
      );
      return;
    }

    // Verificar si email ya existe
    if (await emailYaExiste(validacion.datosLimpios.email)) {
      setMessage({
        type: "error",
        text: "Este email ya tiene una compra pendiente",
      });
      registrarIntento(form.email);
      await registrarIntentoFallido(
        form.email,
        form.dni,
        "Email duplicado",
        ipCliente,
      );
      return;
    }

    // Verificar si DNI ya existe
    if (await dniYaExiste(validacion.datosLimpios.dni)) {
      setMessage({
        type: "error",
        text: "Este DNI ya tiene una compra pendiente",
      });
      registrarIntento(form.dni);
      await registrarIntentoFallido(
        form.email,
        form.dni,
        "DNI duplicado",
        ipCliente,
      );
      return;
    }

    // Enviar código OTP
    setLoading(true);
    const resultado = await enviarCodigoVerificacion(
      validacion.datosLimpios.email,
    );

    if (resultado.exitoso) {
      setMessage({
        type: "success",
        text: "✓ Código enviado a tu email. Verifica tu bandeja de entrada.",
      });
      setPaso("verificacion");
      setForm({ ...form, ...validacion.datosLimpios });
    } else {
      setMessage({ type: "error", text: resultado.error });
      registrarIntento(form.email);
    }
    setLoading(false);
  };

  /**
   * PASO 2: Verificar código OTP
   */
  const handleVerificarOTP = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!codigoOTP || codigoOTP.length !== 6) {
      setMessage({
        type: "error",
        text: "Ingresa un código válido de 6 dígitos",
      });
      return;
    }

    setLoading(true);
    const resultado = await verificarCodigoOTP(form.email, codigoOTP);

    if (resultado.valido) {
      setMessage({
        type: "success",
        text: "✓ Email verificado correctamente",
      });
      setEmailVerificado(true);
      setPaso("compra");
      limpiarRateLimit(form.email);
    } else {
      setMessage({ type: "error", text: resultado.error });
      registrarIntento(form.email);
    }
    setLoading(false);
  };

  /**
   * PASO 3: Enviar compra (igual que antes pero con email verificado)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!emailVerificado) {
      setMessage({
        type: "error",
        text: "Debes verificar tu email primero",
      });
      return;
    }

    if (cart.length === 0) {
      setMessage({ type: "error", text: "Agrega al menos una entrada." });
      return;
    }
    if (!file) {
      setMessage({ type: "error", text: "Sube el voucher (captura/imagen)." });
      return;
    }

    setLoading(true);
    try {
      const entryId = crypto.randomUUID();
      const filePath = `${entryId}/${file.name}`;

      const { error: uploadErr } = await supabase.storage
        .from("vouchers")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = await supabase.storage
        .from("vouchers")
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      const payment_qr = generarPaymentQrString(entryId);
      const totalMonto = calcularTotal();
      const totalEntradas = cart.reduce((sum, item) => sum + item.cantidad, 0);

      const { error: entradaError } = await supabase.from("entradas").insert([
        {
          id: entryId,
          evento_id: seleccion.eventoId,
          nombre_completo: form.nombre,
          dni: form.dni,
          email: form.email,
          telefono: form.telefono,
          voucher_url: publicUrl,
          payment_qr,
          payment_status: "voucher_subido",
          validacion_estado: "pendiente",
          monto_total: totalMonto,
          cantidad_entradas: totalEntradas,
        },
      ]);

      if (entradaError) throw entradaError;

      const itemsToInsert = cart.map((item) => ({
        entrada_id: entryId,
        tipo_entrada_id: item.tipoId,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio),
      }));

      const { error: itemsError } = await supabase
        .from("entradas_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Limpiar rate limit después de éxito
      limpiarRateLimit(form.email);

      setLastEntry({
        id: entryId,
        payment_qr,
        monto: totalMonto,
      });

      setMessage({
        type: "success",
        text: "✓ Compra registrada. Pronto el admin validará y recibirás los QR de ingreso.",
      });

      setForm({ nombre: "", dni: "", email: "", telefono: "" });
      setFile(null);
      setCart([]);
      setCodigoOTP("");
      setEmailVerificado(false);
      setPaso("form");
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Error al registrar: " + (err.message || err),
      });
    } finally {
      setLoading(false);
    }
  };

  const totalEntradas = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = calcularTotal();

  return (
    <div className="min-h-screen p-4">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.8);
          }
        }

        .panel-item {
          animation: slideInUp 0.6s ease-out;
        }

        .btn-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        input::placeholder {
          color: rgba(156, 163, 175, 0.6);
        }
      `}</style>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Panel */}
        <div className="w-full lg:w-2/3 space-y-5">
          <div className="panel-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-cyan-500/30 shadow-2xl">
            <SelectorEvento onChange={onSelectorChange} />
          </div>

          {/* Add to Cart */}
          {seleccion.tipoObj && (
            <div className="panel-item bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl p-5 sm:p-7 border-2 border-cyan-500/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                <div>
                  <p className="text-cyan-300 text-sm mb-2 font-semibold">
                    Seleccionaste
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    {seleccion.tipoObj.nombre}
                    {seleccion.tipoObj.color_hex && (
                      <span
                        className="w-6 h-6 rounded-xl ring-2 ring-cyan-400 shadow-lg"
                        style={{ background: seleccion.tipoObj.color_hex }}
                      />
                    )}
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    S/ {Number(seleccion.tipoObj.precio).toFixed(2)}
                  </p>
                </div>
                <button
                  ref={AddCartRef}
                  onClick={agregarAlCarrito}
                  disabled={seleccion.tipoObj.stock_disponible <= 0}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/50 btn-glow disabled:btn-glow-none scroll-mt-[300px] cursor-pointer"
                >
                  <FiPlus className="text-xl" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          )}

          {/* Cart Items */}
          {cart.length > 0 && (
            <div
              ref={cartRef}
              className="panel-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-blue-500/30 shadow-2xl scroll-mt-4"
            >
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
                Carrito ({totalEntradas})
              </h2>
              <div className="flex flex-wrap w-full overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    className="w-full items-center flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl border border-blue-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex-1 flex items-center gap-3">
                      {item.color && (
                        <div
                          className="w-6 h-6 rounded-lg flex-shrink-0 ring-2 ring-cyan-400 shadow-md"
                          style={{ background: item.color }}
                        />
                      )}
                      <div>
                        <p className="font-bold text-white">{item.nombre}</p>
                        <p className="text-sm text-cyan-300">
                          S/ {Number(item.precio).toFixed(2)} c/u
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 rounded-2xl p-1 border border-blue-500/30">
                      <button
                        onClick={() => actualizarCantidad(item.id, -1)}
                        className="p-2 hover:bg-blue-600 rounded-xl transition-colors text-cyan-300 hover:text-white"
                      >
                        <FiMinus className="text-lg" />
                      </button>
                      <span className="w-10 text-center font-bold text-white bg-slate-800 rounded-lg py-1">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, 1)}
                        className="p-2 hover:bg-cyan-600 rounded-xl transition-colors text-cyan-300 hover:text-white"
                      >
                        <FiPlus className="text-lg" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        S/ {(Number(item.precio) * item.cantidad).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.cantidad} x S/ {Number(item.precio).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="mt-6 pt-5 border-t border-blue-500/30">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Subtotal ({totalEntradas} entrada
                      {totalEntradas !== 1 ? "s" : ""}):
                    </span>
                    <span className="text-gray-300 font-semibold">
                      S/ {totalPrecio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-2xl border border-cyan-500/50">
                    <span className="text-lg font-bold text-white">
                      Total a Pagar:
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      S/ {totalPrecio.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {cart.length > 0 && (
            <div
              ref={paymentRef}
              className="panel-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-purple-500/30 shadow-2xl scroll-mt-4"
            >
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Datos para el pago
              </h3>
              <div className="grid sm:grid-cols-3 gap-5 items-center">
                <div className="flex justify-center">
                  <img
                    src={nikeblack}
                    alt="QR Pago"
                    className="h-32 sm:h-40 object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-300 whitespace-pre-line mb-4 leading-relaxed">
                    {ADMIN_CUENTA}
                  </p>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">
                      Monto a Transferir:
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      S/ {totalPrecio.toFixed(2)}
                    </p>
                  </div>
                </div>
                {lastEntry && (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-300 mb-3 font-semibold">
                      Tu QR de compra:
                    </p>
                    <div className="p-3 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <QRCode value={lastEntry.payment_qr} size={110} />
                    </div>
                    <p className="text-sm text-cyan-400 mt-3 font-bold">
                      S/ {lastEntry.monto.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Form CON VERIFICACIÓN */}
        <div className="w-full lg:w-1/3">
          <div className="panel-item bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-cyan-500/30 shadow-2xl sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-hidden">
            <h2 className="text-3xl font-bold mb-7 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">👤</span>
              {paso === "form"
                ? "Datos de Contacto"
                : paso === "verificacion"
                  ? "Verificar Email"
                  : "Confirmar Compra"}
            </h2>

            {/* PASO 1: Formulario */}
            {paso === "form" && (
              <form onSubmit={handleEnviarCodigoOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-cyan-300 mb-2">
                      DNI
                    </label>
                    <input
                      name="dni"
                      value={form.dni}
                      onChange={handleChange}
                      placeholder="12345678"
                      maxLength="8"
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cyan-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="987654321"
                      maxLength="9"
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.nombre || !form.dni || !form.email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-cyan-500/50 mt-2 btn-glow"
                >
                  {loading ? "Enviando..." : "✉️ Enviar Código"}
                </button>
              </form>
            )}

            {/* PASO 2: Verificación OTP */}
            {paso === "verificacion" && (
              <form onSubmit={handleVerificarOTP} className="space-y-4">
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-300">
                    📧 Se envió un código de 6 dígitos a:
                  </p>
                  <p className="text-white font-bold">{form.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    Código de Verificación
                  </label>
                  <input
                    type="text"
                    value={codigoOTP}
                    onChange={(e) =>
                      setCodigoOTP(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-4 bg-slate-700 border-2 border-cyan-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center text-2xl letter-spacing-2 transition-all duration-300 shadow-lg font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || codigoOTP.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-green-500/50 mt-6 btn-glow cursor-pointer"
                >
                  {loading ? "Verificando..." : "✓ Verificar Código"}
                </button>

                <button
                  type="button"
                  onClick={() => setPaso("form")}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-2 px-4 rounded-xl transition-colors mt-2 cursor-pointer"
                >
                  Volver
                </button>
              </form>
            )}

            {/* PASO 3: Enviar compra */}
            {paso === "compra" && emailVerificado && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-3">
                    Subir voucher
                  </label>
                  <div className="border-3 border-dashed border-blue-500/50 rounded-2xl hover:border-cyan-400 transition-colors p-4 text-center bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer flex items-center justify-center min-h-24">
                    <div className="flex flex-col items-center">
                      <label className="cursor-pointer">
                        <span className="text-cyan-300 hover:text-cyan-200 font-bold transition-colors">
                          Seleccionar archivo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        {file ? (
                          <span className="text-cyan-400 font-semibold">
                            ✓ {file.name}
                          </span>
                        ) : (
                          "PNG, JPG, GIF hasta 10MB"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0 || !file}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-cyan-500/50 mt-6 btn-glow cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    `✓ Enviar Compra (${totalEntradas})`
                  )}
                </button>
              </form>
            )}

            {/* Mensajes */}
            {message && (
              <div
                className={`mt-4 p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-300 ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-300 border-green-500/50 animate-pulse"
                    : "bg-red-500/20 text-red-300 border-red-500/50"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
