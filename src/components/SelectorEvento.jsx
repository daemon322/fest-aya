// src/components/SelectorEvento.jsx
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { FcCalendar } from "react-icons/fc";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";

export default function SelectorEvento({ onChange }) {
  const [eventos, setEventos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: evs, error: e1 } = await supabase
          .from("eventos")
          .select("*")
          .order("fecha_inicio", { ascending: true });
        if (e1) throw e1;
        setEventos(evs || []);
        if (evs && evs.length > 0) {
          setSelectedEvento(evs[0].id);
        }
      } catch (err) {
        setError(err.message || err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedEvento) {
      setTipos([]);
      setSelectedTipo(null);
      onChange && onChange(null, null);
      return;
    }
    const loadTipos = async () => {
      try {
        const { data, error } = await supabase
          .from("tipos_entrada")
          .select("*")
          .eq("evento_id", selectedEvento)
          .order("id", { ascending: true });
        if (error) throw error;
        setTipos(data || []);
        if (data && data.length > 0) {
          setSelectedTipo(null); // No selecciona por defecto
          onChange && onChange(selectedEvento, null);
        } else {
          setSelectedTipo(null);
          onChange && onChange(selectedEvento, null);
        }
      } catch (err) {
        setError(err.message || err);
      }
    };
    loadTipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvento]);

  useEffect(() => {
    const tipoObj = tipos.find((t) => t.id === selectedTipo) || null;
    onChange && onChange(selectedEvento, tipoObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTipo]);

  if (loading) return <p>Cargando evento y precios…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!eventos.length) return <p>No hay eventos publicados.</p>;

  // Mostrar nombre del evento por defecto
  const eventoActual = eventos.find((ev) => ev.id === selectedEvento);

  return (
    <div className="flex flex-col">
      <div className="absolute top-54 left-4">
        <div className="w-full flex justify-start">
          <label className="block mb-2 p-2 px-4 font-medium bg-violet-700 text-center text-white rounded-xl">
            Evento
          </label>
        </div>
        <div className="p-2 rounded text-white">
          {eventoActual ? (
            <>
              <span className="font-semibold sm:text-6xl text-3xl">
                {eventoActual.nombre}
              </span>
              <div className="flex flex-col sm:flex-row rounded-lg pt-4 sm:gap-4">
                <span className="sm:text-2xl text-1xl flex gap-2 justify-center items-center">
                  <FcCalendar />
                  {eventoActual.fecha_inicio
                    ? new Date(eventoActual.fecha_inicio).toLocaleString()
                    : ""}
                </span>
                <span className="sm:text-2xl text-1xl flex gap-2 justify-center items-center">
                  <FaMagnifyingGlassLocation className="text-purple-500" />
                  Estadio Nacional
                </span>
              </div>
            </>
          ) : (
            <span>No hay evento seleccionado.</span>
          )}
        </div>
      </div>

      <div className="w-full p-2 bg-[#17171b] rounded-2xl">
        <div>
          <div>
            <label className="block font-medium text-white text-2xl">Lineup</label>
          </div>
          <div className="flex flex-wrap justify-between p-4 gap-2">
            <label className="block font-medium text-white bg-purple-500/20 border border-[#7f42b9] p-2 rounded-lg px-4">Grupo 5</label>
            <label className="block font-medium text-white bg-purple-500/20 border border-[#7f42b9] p-2 rounded-lg px-4">Armonia 10</label>
            <label className="block font-medium text-white bg-purple-500/20 border border-[#7f42b9] p-2 rounded-lg px-4">Agua Marina</label>
            <label className="block font-medium text-white bg-purple-500/20 border border-[#7f42b9] p-2 rounded-lg px-4">Orquesta adolescentes</label>
            <label className="block font-medium text-white bg-purple-500/20 border border-[#7f42b9] p-2 rounded-lg px-4">Kandela</label>
          </div>
        </div>
        <label className="block mb-2 font-medium text-white">
          Tipo / Precio
        </label>
        {tipos.length === 0 ? (
          <p className="text-sm text-gray-600">
            No hay tipos de entrada para este evento.
          </p>
        ) : (
          <div className="grid gap-2 text-white">
            {tipos.map((t) => (
              <label
                key={t.id}
                className={`p-3 border-2 rounded-xl cursor-pointer flex items-center ${selectedTipo === t.id ? "bg-purple-600/10 border-[#7f42b9]" : "border-[#28282d]"}`}
              >
                <input
                  type="radio"
                  name="tipo_entrada"
                  value={t.id}
                  checked={selectedTipo === t.id}
                  onChange={() => setSelectedTipo(t.id)}
                  className="mr-2"
                />
                <span className="font-medium">{t.nombre}</span>
                <span className="ml-2 text-gray-400">
                  S/ {Number(t.precio).toFixed(2)}
                </span>
                {t.color_hex && (
                  <span
                    className="ml-3 inline-block w-4 h-4 rounded"
                    style={{ background: t.color_hex }}
                  />
                )}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
