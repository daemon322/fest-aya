// src/components/CompraEntrada.jsx
import { useState } from "react";
import supabase from "../utils/supabaseClient";
import QRCode from "react-qr-code";
import SelectorEvento from "./SelectorEvento";
import nikeblack from "../assets/yape1.png";

// Puedes cambiar estos datos por los del admin/cuenta real

const ADMIN_CUENTA = "Cuenta BCP: XXXX-XXXX-XX-XXXX\nYape: +51 987654321";

export default function CompraEntrada() {
  const [seleccion, setSeleccion] = useState({ eventoId: null, tipoObj: null });
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

  const onSelectorChange = (eventoId, tipoObj) => {
    setSeleccion({ eventoId, tipoObj });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generarPaymentQrString = (entryId) => {
    const tipo = seleccion.tipoObj?.id || "unknown";
    const monto = seleccion.tipoObj?.precio
      ? Number(seleccion.tipoObj.precio).toFixed(2)
      : "";
    return `pago|evento:${seleccion.eventoId}|tipo:${tipo}|id:${entryId}|monto:${monto}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!seleccion.eventoId || !seleccion.tipoObj) {
      setMessage({ type: "error", text: "Selecciona un tipo de entrada." });
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
      const payload = {
        id: entryId,
        evento_id: seleccion.eventoId,
        tipo_entrada_id: seleccion.tipoObj.id,
        nombre_completo: form.nombre,
        dni: form.dni,
        email: form.email,
        telefono: form.telefono,
        voucher_url: publicUrl,
        payment_qr,
        payment_status: "voucher_subido",
        validacion_estado: "pendiente",
      };

      const { error } = await supabase
        .from("entradas")
        .insert([payload])
        .select()
        .single();
      if (error) throw error;

      setLastEntry({
        id: entryId,
        payment_qr,
        monto: seleccion.tipoObj.precio,
      });
      setMessage({
        type: "success",
        text: "Compra registrada. Pronto el admin validará y recibirás el QR de ingreso.",
      });
      setForm({ nombre: "", dni: "", email: "", telefono: "" });
      setFile(null);
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

  return (
    <div className="flex flex-col sm:flex-row  p-4 gap-4">
      <div className="w-full bg-[#17171b] rounded-2xl p-4">
        <SelectorEvento onChange={onSelectorChange} />
        <div className="items-center justify-start text-white">
          {seleccion.tipoObj ? (
            <div className="mb-6">
              <p className="mb-2 font-medium">Datos para el pago:</p>
              {/* Puedes mostrar el QR del admin o la cuenta */}
              <div className="grid sm:grid-cols-3 items-center gap-4">
                <div className="p-4 inline-block">
                  {/* Si tienes un QR real, pon el valor aquí */}
                  <img
                    src={nikeblack}
                    alt=""
                    className="sm:h-[150px] object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm">{ADMIN_CUENTA}</p>
                  <p className="text-sm mt-2">
                    Monto:{" "}
                    <strong>
                      S/ {Number(seleccion.tipoObj.precio).toFixed(2)}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Sube el voucher después de transferir.
                  </p>
                </div>
                {lastEntry && (
                  <div className="mt-8 w-full">
                    <p className="mb-2">QR de referencia de tu compra:</p>
                    <div className="inline-block p-4">
                      <QRCode
                        value={lastEntry.payment_qr}
                        className="sm:h-[120px] object-contain"
                      />
                    </div>
                    <p className="text-sm mt-2">
                      Monto: S/ {Number(lastEntry.monto).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 w-full">
              <p className="text-sm text-gray-400">
                Selecciona un tipo de entrada para ver los datos de pago.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Panel derecho - Formulario */}
      <div className="bg-[#17171b] rounded-2xl lg:rounded-3xl p-6 shadow-2xl border border-gray-800">
        {seleccion.tipoObj && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-5 border border-purple-800/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400 mb-1">Seleccionaste</p>
                <p className="text-xl font-bold text-white">
                  {seleccion.tipoObj.nombre}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Precio</p>
                <p className="text-2xl font-bold text-white">
                  S/ {Number(seleccion.tipoObj.precio).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                DNI
              </label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 987654321"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subir voucher (foto/captura)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-700 rounded-2xl hover:border-purple-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-8 w-12 text-gray-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 text-sm text-gray-400">
            <p className="mb-2">
              Al continuar aceptas nuestra{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 underline transition-colors"
              >
                Política de privacidad
              </a>{" "}
              y{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 underline transition-colors"
              >
                Política de devoluciones
              </a>
              .
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando compra...
              </span>
            ) : (
              "Enviar Compra"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl border ${message.type === "success" ? "bg-green-900/20 text-green-400 border-green-800/30" : "bg-red-900/20 text-red-400 border-red-800/30"}`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
