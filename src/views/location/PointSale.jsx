import React, { useEffect, useState } from "react";

export default function PointSale() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================================
  //  INFORMACIÓN DEL PUNTO DE VENTA (personalizable por el cliente)
  // ============================================================
  const salePoint = {
    name: "Punto de Venta Oficial – Centro de Ayacucho",
    address: "JR. JIRON SAN LUIS - CIUDAD MAGISTERIAL MZA. I LOTE. 06 URB. ASOCIACION CIUDAD MAGISTERIAL (A MEDIA CUADRA DE LA I.E JEANPEAJET)",
    coordinates: {
      lat: -13.1781357,
      lng: -74.2060713,
    },
    description:
      "Local comercial céntrico, totalmente implementado para la venta de entradas del Ayacucho Vóley Club. Atención personalizada y rápida.",
    schedule: [
      { days: "Lunes a Viernes", hours: "9:00 am – 8:00 pm" },
      { days: "Sábados", hours: "9:00 am – 6:00 pm" },
      { days: "Domingos", hours: "9:00 am – 1:00 pm (solo venta online)" },
    ],
    paymentMethods: [
      "Efectivo",
      "Yape",
      "Transferencia bancaria (solo previa coordinación)",
    ],
    contact: {
      phone: "+51 961 379 018",
      email: "antreus28d@gmail.com",
    },
    notes:
      "⚠️ Único punto de venta físico autorizado. No comprar entradas fuera de este local ni de la plataforma Athreus.",
  };

  // Iframe proporcionado por el cliente (vista inmersiva del local)
  const mapsIframeSrc =
    "https://www.google.com/maps/embed?pb=!3m2!1ses-419!2spe!4v1773754347081!5m2!1ses-419!2spe!6m8!1m7!1s2uMvO6QOEN6puPQsuZNxcw!2m2!1d-13.17813574357706!2d-74.20607132623297!3f310.6978068585822!4f4.821006782923888!5f0.7820865974627469";

  // Enlace para abrir en Google Maps (para el botón "Cómo llegar")
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${salePoint.coordinates.lat},${salePoint.coordinates.lng}`;

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
            🎟️ Punto de Venta Físico
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {salePoint.name}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {salePoint.description}
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
              {salePoint.address}
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
              {salePoint.coordinates.lat}, {salePoint.coordinates.lng}
            </span>
          </div>
        </div>

        {/* ---------- MAPA INMERSIVO ---------- */}
        <div className="relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="h-[450px] w-full">
              <iframe
                src={mapsIframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vista inmersiva del punto de venta oficial"
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
              Vista del local / Street View
            </div>
          </div>
        </div>

        {/* ---------- INFORMACIÓN DETALLADA ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Horarios */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-900 rounded-lg border border-indigo-700">
                <svg
                  className="w-6 h-6 text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Horario de atención</h2>
            </div>
            <ul className="space-y-3">
              {salePoint.schedule.map((item, index) => (
                <li key={index} className="flex justify-between text-sm border-b border-gray-700 pb-2">
                  <span className="text-gray-400">{item.days}</span>
                  <span className="text-white font-medium">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Métodos de pago */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-900 rounded-lg border border-green-700">
                <svg
                  className="w-6 h-6 text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Métodos de pago</h2>
            </div>
            <ul className="space-y-2">
              {salePoint.paymentMethods.map((method, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-300">{method}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y notas */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-900 rounded-lg border border-amber-700">
                <svg
                  className="w-6 h-6 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Contacto</h2>
            </div>
            <div className="space-y-3 mb-4">
              <p className="flex items-center gap-2 text-sm">
                <span className="text-amber-400">📞</span>
                <a href={`tel:${salePoint.contact.phone}`} className="text-gray-300 hover:text-white">
                  {salePoint.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <span className="text-amber-400">✉️</span>
                <a href={`mailto:${salePoint.contact.email}`} className="text-gray-300 hover:text-white">
                  {salePoint.contact.email}
                </a>
              </p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-yellow-300 flex items-start gap-2">
                <span>⚠️</span>
                <span>{salePoint.notes}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Botón para obtener indicaciones */}
        <div className="text-center">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg hover:shadow-indigo-900/50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Cómo llegar (abrir en Google Maps)
          </a>
        </div>

        {/* Nota final */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-800 mt-16 pt-8">
          <p>
            📍 Coordenadas exactas: {salePoint.coordinates.lat}, {salePoint.coordinates.lng} — 
            Punto de venta oficial autorizado por la organización del evento.
          </p>
        </div>
      </div>
    </div>
  );
}