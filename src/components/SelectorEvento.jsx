// src/components/SelectorEvento.jsx
import { useEffect, useState } from 'react'
import supabase from '../utils/supabaseClient'

export default function SelectorEvento({ onChange }) {
  const [eventos, setEventos] = useState([])
  const [tipos, setTipos] = useState([])
  const [selectedEvento, setSelectedEvento] = useState(null)
  const [selectedTipo, setSelectedTipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: evs, error: e1 } = await supabase.from('eventos').select('*').order('fecha_inicio', { ascending: true })
        if (e1) throw e1
        setEventos(evs || [])
        if (evs && evs.length > 0) {
          setSelectedEvento(evs[0].id)
        }
      } catch (err) {
        setError(err.message || err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // cuando cambia el evento seleccionado, carga tipos_entrada para ese evento
  useEffect(() => {
    if (!selectedEvento) {
      setTipos([])
      setSelectedTipo(null)
      onChange && onChange(null, null)
      return
    }
    const loadTipos = async () => {
      try {
        const { data, error } = await supabase
          .from('tipos_entrada')
          .select('*')
          .eq('evento_id', selectedEvento)
          .order('id', { ascending: true })
        if (error) throw error
        setTipos(data || [])
        if (data && data.length > 0) {
          setSelectedTipo(data[0].id)
          onChange && onChange(selectedEvento, data[0])
        } else {
          setSelectedTipo(null)
          onChange && onChange(selectedEvento, null)
        }
      } catch (err) {
        setError(err.message || err)
      }
    }
    loadTipos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvento])

  // notificar cambio del tipo
  useEffect(() => {
    const tipoObj = tipos.find(t => t.id === selectedTipo) || null
    onChange && onChange(selectedEvento, tipoObj)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTipo])

  if (loading) return <p>Cargando evento y precios…</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!eventos.length) return <p>No hay eventos publicados.</p>

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Evento</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedEvento || ''}
        onChange={(e) => setSelectedEvento(e.target.value)}
      >
        {eventos.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.nombre} — {ev.fecha_inicio ? new Date(ev.fecha_inicio).toLocaleString() : ''}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Tipo / Precio</label>
      {tipos.length === 0 ? (
        <p className="text-sm text-gray-600">No hay tipos de entrada para este evento.</p>
      ) : (
        <div className="grid gap-2">
          {tipos.map(t => (
            <label key={t.id} className={`p-3 border rounded cursor-pointer ${selectedTipo === t.id ? 'bg-gray-100 border-black' : ''}`}>
              <input
                type="radio"
                name="tipo_entrada"
                value={t.id}
                checked={selectedTipo === t.id}
                onChange={() => setSelectedTipo(t.id)}
                className="mr-2"
              />
              <span className="font-medium">{t.nombre}</span>
              <span className="ml-2 text-gray-600">S/ {Number(t.precio).toFixed(2)}</span>
              {t.color_hex && <span className="ml-3 inline-block w-4 h-4 rounded" style={{ background: t.color_hex }} />}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
