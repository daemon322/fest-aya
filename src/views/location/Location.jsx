import React, { useEffect, useState } from "react";

export default function Location() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================================
  //  INFORMACIÓN DE LA UBICACIÓN (personalizable por el cliente)
  // ============================================================
  const eventLocation = {
    name: "Losa Deportiva Capillapata",
    address: "Capillapata, Ayacucho 05000, Perú",
    lat: -13.1667677,
    lng: -74.2186018,
    description:
      "Moderno complejo deportivo al aire libre, sede del Ayacucho Vóley Club. Cuenta con una cancha principal de cemento pulido y gradientes naturales.",
    landmarks: {
      comedor: "Comedor Acuchimay",
      jrCarranza: "Jr. Luis Carranza",
      puenteNuevo: "Puente Nuevo",
      terminal: "Terminal Terrestre Libertadores de América",
    },
  };

  // ============================================================
  //  RUTAS DE TRANSPORTE PÚBLICO (verificadas parcialmente)
  //  El cliente debe revisar y completar los datos entre [ ]
  // ============================================================
  const transportRoutes = {
    ruta11: {
      name: "Ruta 11 – ¿Señor del Calvario?",
      description:
        "⚠️ Información no confirmada. Según comentarios, podría pasar por Capillapata. Se recomienda verificar con el conductor.",
      stops: [
        "Centro de Ayacucho",
        "[Av. Principal]",
        "[Paradero cerca a Capillapata]",
      ],
      frequency: "Por confirmar",
      fare: "Por confirmar",
      nearestStop: "Preguntar al conductor si pasa por Capillapata",
      status: "pending",
      color: "yellow",
    },
    ruta12: {
      name: "Ruta 12 – Empresa San Luis S.R.L.",
      description:
        "✅ Confirmado: Pasa directamente por la Losa Deportiva Capillapata. Es la ruta más recomendada para llegar al evento.",
      stops: [
        "Centro de Ayacucho",
        "**LOSA DEPORTIVA CAPILLAPATA** (frente al ingreso)",
        "Puente Nuevo",
      ],
      frequency: "Cada 15-20 minutos (diurno)",
      fare: "S/ 1.50 - S/ 2.00",
      nearestStop: "Frente a la losa (paradero señalizado)",
      status: "verified",
      color: "green",
    },
    ruta21: {
      name: "Ruta 21 – Turismo Chancos",
      description:
        "✅ Confirmado: Pasa por la Losa Deportiva Capillapata en su recorrido Mollepata - Ayacucho.",
      stops: [
        "Santa Clara",
        "**LOSA DEPORTIVA CAPILLAPATA** (a media cuadra)",
        "Puente Nuevo",
        "Centro de Ayacucho",
      ],
      frequency: "Cada 20-30 minutos",
      fare: "S/ 1.50 - S/ 2.00",
      nearestStop: "A media cuadra de la losa (referencia: Comedor Acuchimay)",
      status: "verified",
      color: "green",
    },
    alternativeRoutes: [
      "Ruta 8 – Pasa por Santísima Trinidad y Acuchimay (preguntar si se acerca)",
      "Ruta 20 – Podría tener superposición con otras rutas, verificar en terreno",
      "Combis con letrero 'Capillapata' – Salen del centro y preguntar al conductor",
    ],
  };

  const mapsIframeSrc =
    "https://www.google.com/maps/embed?pb=!3m2!1ses-419!2spe!4v1773751166550!5m2!1ses-419!2spe!6m8!1m7!1sau5JucL9a4y-BzwNOu1Lpg!2m2!1d-13.16676774634084!2d-74.21860181273945!3f39.482918152667715!4f4.824039591607857!5f0.7820865974627469";

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Espaciado superior dinámico para navbar transparente */}
      <div
        className={`h-24 md:h-28 transition-all duration-300 ${
          scrolled ? "h-20 md:h-24" : ""
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ---------- CABECERA ---------- */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block bg-indigo-900 text-indigo-300 px-4 py-1 rounded-full text-sm font-semibold mb-4 border border-indigo-700">
            🏐 Sede Oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {eventLocation.name}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {eventLocation.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-gray-400">
            <span className="flex items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {eventLocation.address}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {eventLocation.lat}, {eventLocation.lng}
            </span>
          </div>
        </div>

        {/* ---------- MAPA INMERSIVO ---------- */}
        <div className="relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="h-[500px] w-full">
              <iframe
                src={mapsIframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vista inmersiva de la Losa Deportiva Capillapata"
                className="w-full h-full"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-gray-900/80 text-gray-200 px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 border border-gray-600">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Vista 360° / Street View
            </div>
          </div>
        </div>

        {/* ---------- CÓMO LLEGAR EN MICRO / COMBI ---------- */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-900 rounded-full border border-indigo-700">
              <svg
                className="w-8 h-8 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Cómo llegar en micro / combi
            </h2>
          </div>

          <p className="text-lg text-gray-300 mb-8 max-w-3xl">
            Las rutas <strong className="text-white">12 (San Luis)</strong> y{" "}
            <strong className="text-white">21 (Turismo Chancos)</strong> pasan directamente por la{" "}
            <strong className="text-white">Losa Deportiva Capillapata</strong>. La Ruta 11 está
            pendiente de confirmación.
          </p>

          {/* Grid de rutas principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* RUTA 11 (pendiente) */}
            <div
              className={`bg-transparent rounded-xl shadow-lg border border-yellow-900/50 overflow-hidden hover:shadow-xl hover:shadow-yellow-900/20 transition relative`}
            >
              <div className="bg-yellow-900 px-6 py-4 border-b border-yellow-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🚌 Ruta 11</span>
                  <span className="bg-yellow-800 px-3 py-1 rounded-full text-xs text-yellow-200">
                    Pendiente
                  </span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  {transportRoutes.ruta11.description}
                </p>
                <h4 className="font-semibold text-gray-200 mb-2 text-sm">
                  🔄 Recorrido referencial:
                </h4>
                <div className="bg-gray-900/50 p-3 rounded-lg mb-3 text-xs text-gray-300 border border-gray-700">
                  <ul className="space-y-1 list-disc list-inside">
                    {transportRoutes.ruta11.stops.map((stop, idx) => (
                      <li key={idx}>{stop}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-yellow-400">⏱️ Frecuencia:</span>{" "}
                    {transportRoutes.ruta11.frequency}
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-yellow-400">💰 Tarifa:</span>{" "}
                    {transportRoutes.ruta11.fare}
                  </div>
                </div>
                <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                  <span className="font-medium">Parada más cercana:</span>{" "}
                  {transportRoutes.ruta11.nearestStop}
                </div>
              </div>
            </div>

            {/* RUTA 12 (confirmada) */}
            <div
              className={`bg-transparent rounded-xl shadow-lg border border-green-900/50 overflow-hidden hover:shadow-xl hover:shadow-green-900/20 transition relative`}
            >
              <div className="bg-green-900 px-6 py-4 border-b border-green-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🚌 Ruta 12</span>
                  <span className="bg-green-800 px-3 py-1 rounded-full text-xs text-green-200">
                    San Luis S.R.L.
                  </span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  {transportRoutes.ruta12.description}
                </p>
                <h4 className="font-semibold text-gray-200 mb-2 text-sm">
                  🔄 Recorrido:
                </h4>
                <div className="bg-gray-900/50 p-3 rounded-lg mb-3 text-xs text-gray-300 border border-gray-700 max-h-32 overflow-y-auto">
                  <ul className="space-y-1 list-disc list-inside">
                    {transportRoutes.ruta12.stops.map((stop, idx) => (
                      <li key={idx}>{stop}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-green-400">⏱️ Frecuencia:</span>{" "}
                    {transportRoutes.ruta12.frequency}
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-green-400">💰 Tarifa:</span>{" "}
                    {transportRoutes.ruta12.fare}
                  </div>
                </div>
                <div className="text-xs text-green-400 border-t border-gray-700 pt-2">
                  <span className="font-medium">🚏 Parada más cercana:</span>{" "}
                  {transportRoutes.ruta12.nearestStop}
                </div>
              </div>
            </div>

            {/* RUTA 21 (confirmada) */}
            <div
              className={`bg-transparent rounded-xl shadow-lg border border-green-900/50 overflow-hidden hover:shadow-xl hover:shadow-green-900/20 transition relative`}
            >
              <div className="bg-green-900 px-6 py-4 border-b border-green-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🚌 Ruta 21</span>
                  <span className="bg-green-800 px-3 py-1 rounded-full text-xs text-green-200">
                    Turismo Chancos
                  </span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  {transportRoutes.ruta21.description}
                </p>
                <h4 className="font-semibold text-gray-200 mb-2 text-sm">
                  🔄 Recorrido:
                </h4>
                <div className="bg-gray-900/50 p-3 rounded-lg mb-3 text-xs text-gray-300 border border-gray-700 max-h-32 overflow-y-auto">
                  <ul className="space-y-1 list-disc list-inside">
                    {transportRoutes.ruta21.stops.map((stop, idx) => (
                      <li key={idx}>{stop}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-green-400">⏱️ Frecuencia:</span>{" "}
                    {transportRoutes.ruta21.frequency}
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded border border-gray-700">
                    <span className="font-semibold text-green-400">💰 Tarifa:</span>{" "}
                    {transportRoutes.ruta21.fare}
                  </div>
                </div>
                <div className="text-xs text-green-400 border-t border-gray-700 pt-2">
                  <span className="font-medium">🚏 Parada más cercana:</span>{" "}
                  {transportRoutes.ruta21.nearestStop}
                </div>
              </div>
            </div>
          </div>

          {/* Rutas alternativas y puntos de referencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-transparent rounded-xl p-6">
              <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                Rutas alternativas cercanas
              </h4>
              <ul className="space-y-2 text-gray-300">
                {transportRoutes.alternativeRoutes.map((route, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{route}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-transparent rounded-xl p-6">
              <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Puntos de referencia para orientarte
              </h4>
              <p className="text-gray-300 mb-2 text-sm">
                Si vienes en combi, puedes pedir que te dejen cerca de:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-blue-700">
                    1
                  </span>
                  <span>
                    <strong className="text-white">{eventLocation.landmarks.comedor}</strong> – A 3
                    cuadras de la losa
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-blue-700">
                    2
                  </span>
                  <span>
                    <strong className="text-white">{eventLocation.landmarks.jrCarranza}</strong> – La
                    Ruta 11 podría pasar por aquí (verificar)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-blue-700">
                    3
                  </span>
                  <span>
                    <strong className="text-white">{eventLocation.landmarks.puenteNuevo}</strong> –
                    Zona de conexión de varias rutas
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border border-blue-700">
                    4
                  </span>
                  <span>
                    <strong className="text-white">{eventLocation.landmarks.terminal}</strong> – A
                    10-15 minutos caminando
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mensaje de advertencia sobre Ruta 11 */}
          <div className="mt-6 bg-yellow-900/30 p-4 rounded-lg text-sm text-yellow-200 border border-yellow-800/50">
            <p className="font-semibold flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Sobre la Ruta 11
            </p>
            <p className="mt-1">
              La información de esta ruta no ha sido confirmada recientemente.
              Si decides utilizarla, pregunta al conductor si pasa por
              Capillapata antes de abordar.
            </p>
          </div>
        </div>

        {/* ---------- SERVICIOS E INSTALACIONES ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-transparent rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="p-2 bg-green-900 rounded-lg text-green-300">✓</span>
              Instalaciones
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span> Superficie: Cemento
                pulido profesional
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span> Capacidad: 800
                espectadores
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span> Baños portátiles y
                food trucks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span> Rampas de
                accesibilidad
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span> Estacionamiento en
                calles aledañas
              </li>
            </ul>
          </div>

          <div className="bg-transparent rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="p-2 bg-amber-900 rounded-lg text-amber-300">⚠️</span>
              Recomendaciones
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span> Llevar ropa
                abrigadora (noche fría en Ayacucho)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span> Entrada impresa
                obligatoria + DNI (Ley N°30037)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span> Prohibido: mascotas,
                vidrio, armas, objetos punzantes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span> Puertas abren 2 horas
                antes del evento
              </li>
            </ul>
          </div>
        </div>

        {/* ---------- NOTA FINAL ---------- */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
          <p>
            📍 Coordenadas exactas: {eventLocation.lat}, {eventLocation.lng} —
            Información de rutas basada en datos proporcionados por la
            organización. Si detectas algún error, escríbenos a{" "}
            <a
              href="mailto:transporte@athreus.com"
              className="text-indigo-400 hover:underline"
            >
              transporte@athreus.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}