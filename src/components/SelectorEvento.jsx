// src/components/SelectorEvento.jsx
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { FcCalendar } from "react-icons/fc";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";

export default function SelectorEvento({ onChange }) {
  const [eventos, setEventos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: evs, error: e1 } = await supabase
          .from("eventos")
          .select("*")
          .eq("activo", true)
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
      onChange && onChange(null, null);
      return;
    }
    const loadTipos = async () => {
      try {
        const { data, error } = await supabase
          .from("tipos_entrada")
          .select("*")
          .eq("evento_id", selectedEvento)
          .eq("activo", true)
          .order("precio", { ascending: true });
        if (error) throw error;
        setTipos(data || []);
        onChange && onChange(selectedEvento, null);
      } catch (err) {
        setError(err.message || err);
      }
    };
    loadTipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvento]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  if (error)
    return <p className="text-red-500 text-center py-4">Error: {error}</p>;
  if (!eventos.length)
    return (
      <p className="text-gray-400 text-center py-4">
        No hay eventos publicados.
      </p>
    );

  const eventoActual = eventos.find((ev) => ev.id === selectedEvento);

  return (
    <div className="flex flex-col">
      {/* Evento Info - Diseño Premium */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.6);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .evento-card {
          animation: slideInDown 0.6s ease-out;
        }

        .tipo-card {
          animation: fadeInScale 0.5s ease-out;
        }

        .glow-border {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full evento-card">
        <div className="sm:absolute top-28 flex justify-center mb-4">
          <label className="block p-2 px-4 font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-center text-white rounded-2xl shadow-lg shadow-cyan-500/50">
            🎵 EVENTO DESTACADO
          </label>
        </div>
        <div className="p-6 rounded-3xl text-white bg-gradient-to-br from-slate-900/20 via-slate-800/20 to-slate-900/20 border-2 border-cyan-500/50 glow-border top-44 left-8 overflow-hidden sm:absolute ">
          {/* Background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          <div className="relative z-10">
            {eventoActual ? (
              <>
                <span className="font-bold sm:text-6xl text-3xl block mb-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {eventoActual.nombre}
                </span>
                {eventoActual.descripcion && (
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    {eventoActual.descripcion}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-6 text-sm sm:text-base mt-6">
                  <span className="flex gap-3 items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-xl border border-cyan-500/30 backdrop-blur">
                    <FcCalendar className="text-2xl" />
                    <span className="font-medium">
                      {eventoActual.fecha_inicio
                        ? new Date(
                            eventoActual.fecha_inicio,
                          ).toLocaleDateString("es-PE", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </span>
                  <span className="flex gap-3 items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-xl border border-purple-500/30 backdrop-blur">
                    <FaMagnifyingGlassLocation className="text-2xl text-purple-400" />
                    <span className="font-medium">
                      {eventoActual.ubicacion || "Estadio Nacional"}
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <span>No hay evento seleccionado.</span>
            )}
          </div>
        </div>
      </div>

      {/* Tipos de Entrada */}
      <div className="w-full">
        <label className="block mb-6 sm:pt-0 pt-4 font-bold text-xl bg-clip-text text-white">
          ✨ Elige tu tipo de entrada
        </label>
        {tipos.length === 0 ? (
          <div className="p-8 text-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-gray-600">
            <p className="text-gray-400 text-base">
              No hay tipos de entrada disponibles para este evento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {tipos.map((t) => (
              <div
                key={t.id}
                onClick={() => onChange(selectedEvento, t)}
                className="tipo-card group relative p-5 border-2 border-gray-700 rounded-2xl hover:border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-950 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 "></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {t.nombre}
                      </h3>
                      {t.descripcion && (
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                          {t.descripcion}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <p className="text-sm text-gray-400">
                          {t.capacidad_maxima > 0
                            ? `${t.capacidad_maxima} Capacidad disponible`
                            : "Sin stock"}
                        </p>
                      </div>
                    </div>
                    {t.color_hex && (
                      <div
                        className="w-8 h-8 rounded-xl flex-shrink-0 ml-3 ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400 shadow-lg"
                        style={{ background: t.color_hex }}
                      />
                    )}
                  </div>
                  <div className="flex items-end justify-between pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Precio por entrada
                      </p>
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        S/ {Number(t.precio).toFixed(2)}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-xs font-semibold text-cyan-300 rounded-lg group-hover:from-cyan-500/50 group-hover:to-blue-500/50 transition-all">
                      Comprar
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
