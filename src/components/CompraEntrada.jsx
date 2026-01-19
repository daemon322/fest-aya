// src/components/CompraEntrada.jsx
import { useState } from 'react'
import supabase from '../utils/supabaseClient'
import QRCode from 'react-qr-code'
import SelectorEvento from './SelectorEvento'

export default function CompraEntrada() {
  const [seleccion, setSeleccion] = useState({ eventoId: null, tipoObj: null })
  const [form, setForm] = useState({ nombre: '', dni: '', email: '', telefono: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [lastEntry, setLastEntry] = useState(null) // para mostrar id y qr

  const onSelectorChange = (eventoId, tipoObj) => {
    setSeleccion({ eventoId, tipoObj })
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const generarPaymentQrString = (entryId) => {
    // Puedes incluir información útil: evento|tipo|id|monto
    const tipo = seleccion.tipoObj?.id || 'unknown'
    const monto = seleccion.tipoObj?.precio ? Number(seleccion.tipoObj.precio).toFixed(2) : ''
    return `pago|evento:${seleccion.eventoId}|tipo:${tipo}|id:${entryId}|monto:${monto}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!seleccion.eventoId || !seleccion.tipoObj) {
      setMessage({ type: 'error', text: 'Selecciona un evento y un tipo de entrada.' })
      return
    }
    if (!file) {
      setMessage({ type: 'error', text: 'Sube el voucher (captura/imagen).' })
      return
    }

    setLoading(true)
    try {
      // 1) generar entryId
      const entryId = crypto.randomUUID()

      // 2) subir voucher
      const filePath = `${entryId}/${file.name}`
      const { error: uploadErr } = await supabase.storage.from('vouchers').upload(filePath, file)
      if (uploadErr) throw uploadErr

      const { data: urlData } = await supabase.storage.from('vouchers').getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl

      // 3) insertar fila en 'entradas'
      const payment_qr = generarPaymentQrString(entryId)
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
        payment_status: 'voucher_subido',
        validacion_estado: 'pendiente'
      }

      const { data, error } = await supabase.from('entradas').insert([payload]).select().single()
      if (error) throw error

      setLastEntry({ id: entryId, payment_qr, monto: seleccion.tipoObj.precio })
      setMessage({ type: 'success', text: 'Compra registrada. Pronto el admin validará y recibirás el QR de ingreso.' })
      setForm({ nombre: '', dni: '', email: '', telefono: '' })
      setFile(null)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Error al registrar: ' + (err.message || err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SelectorEvento onChange={onSelectorChange} />

      {seleccion.tipoObj && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p><strong>Precio:</strong> S/ {Number(seleccion.tipoObj.precio).toFixed(2)}</p>
          <p className="text-sm text-gray-600">Zona: {seleccion.tipoObj.nombre}</p>
        </div>
      )}

      {/* Muestra QR de pago temporal si quieres generar un QR instantáneo antes de subir voucher.
          Sin embargo, en este flujo generamos el payment_qr al insertar, y lo mostramos en `lastEntry` */}
      {lastEntry ? (
        <div className="mb-4">
          <p className="mb-2">QR de pago / referencia (guárdalo por si lo necesitas):</p>
          <div className="inline-block p-4 bg-white border">
            <QRCode value={lastEntry.payment_qr} />
          </div>
          <p className="text-sm mt-2">Monto: S/ {Number(lastEntry.monto).toFixed(2)}</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Al registrar, generaremos una referencia de pago que podrás usar en Yape/transferencia.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="w-full border p-2 rounded mb-2" type="email" required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full border p-2 rounded mb-2" />

        <label className="block mb-1">Subir voucher (foto/captura)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />

        <div className="text-xs text-gray-600 mb-4">
          <p>Al continuar aceptas nuestra <a className="underline">Política de privacidad</a> y <a className="underline">Política de devoluciones</a>.</p>
        </div>

        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Guardando...' : 'Registrar compra'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
