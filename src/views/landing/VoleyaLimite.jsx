import React, { useState } from "react";
import { Star, AlertCircle, Bold } from "lucide-react";
import { AiFillSignal } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { RiDrinks2Fill, RiVipCrown2Fill } from "react-icons/ri";
import { GiChickenOven, GiTicket } from "react-icons/gi";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { Flyers } from "../../views/tickets/Flyer";
import GrandStand from "../../components/grandstand/GrandStand";
import Guide from "../../components/guide/Guide";
import Fondo from "../../assets/fondox.png";
/* ─── Persistencia localStorage ──────────────────────────────────────────── */
const CART_KEY = "mi-entradas-cart";

/* ─── TicketCard ──────────────────────────────────────────────────────────── */
const TicketCard = ({
  title,
  subtitle,
  prices,
  activePhase,
  availability,
  maxAvailability,
  features,
  isPopular,
}) => {
  const currentPrice = prices[activePhase];
  const isCritical = availability < maxAvailability * 0.1;

  return (
    <div className="relative flex flex-col h-full sm:p-12 p-2 rounded-[3rem] backdrop-blur-2xl transition-all duration-700 group overflow-hidden">
      {isPopular && (
        <div className="absolute top-5 right-10 flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5">
          <Star size={10} fill="#f59e0b" className="text-amber-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500">
            Más Solicitado
          </span>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-2 h-full w-full gap-5">
        <header className="mb-14">
          <div className="space-y-3">
            <h3 className="text-4xl font-serif text-white tracking-tight italic group-hover:text-amber-500 transition-colors duration-700">
              {title}
            </h3>
            <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-white/80">
              {subtitle}
            </p>
          </div>
          <div className="mt-10 flex items-baseline gap-2">
            <span className="text-xl font-light text-amber-500/90 uppercase tracking-tighter">
              PEN
            </span>
            <div className="text-6xl font-light text-white tracking-tighter font-mono group-hover:scale-105 transition-transform duration-700 origin-left">
              {currentPrice.toFixed(0)}
              <span className="text-xl opacity-80">.00</span>
            </div>
          </div>
        </header>
        <ul className="mb-14 grid grid-cols-1 gap-6">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-5 translate-x-0 group-hover:translate-x-2 transition-transform duration-700"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/90 group-hover:text-amber-500 group-hover:border-amber-500/90 transition-all duration-500">
                {React.cloneElement(feature.icon, {
                  size: 12,
                  strokeWidth: 1.5,
                })}
              </div>
              <span className="text-[10px] text-white/90 font-light tracking-[0.2em] uppercase group-hover:text-white/90 transition-colors duration-500">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-10 space-y-4 w-full">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em]">
          <span className="text-white/90">Disponibilidad</span>
          <span
            className={
              isCritical ? "text-red-500 animate-pulse" : "text-amber-500/90"
            }
          >
            {isCritical && (
              <AlertCircle size={10} className="inline mr-1 mb-0.5" />
            )}
            {availability} de {maxAvailability}
          </span>
        </div>
        <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
          <div
            className={`h-full transition-all duration-[2500ms] ease-out ${isCritical ? "bg-red-500" : "bg-amber-500"}`}
            style={{ width: `${(availability / maxAvailability) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Componente principal ───────────────────────────────────────────────── */
const VoleyaLimite = () => {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    { id: 0, label: "Pre-venta", status: "del 17", date: "26 de marzo" },
    { id: 1, label: "Venta General", status: "del 23", date: "28 de marzo" },
  ];

  const ticketData = [
    {
      id: "zona-vip",
      title: "Zona Vip",
      subtitle: "Acceso dinámico",
      prices: [40.0, 45.0],
      availability: 37,
      maxAvailability: 200,
      features: [
        { icon: <RiVipCrown2Fill />, text: "Pase rápido de acceso" },
        {
          icon: <MdAirlineSeatReclineExtra />,
          text: "Zona baja con buena vista",
        },
        { icon: <GiChickenOven />, text: "1/4 de pollo + silla" },
      ],
    },
    {
      id: "general-latido",
      title: "General",
      subtitle: "Acceso regular",
      prices: [25.0, 30.0],
      availability: 261,
      maxAvailability: 500,
      features: [
        { icon: <FaRegUser />, text: "Pase regular" },
        { icon: <AiFillSignal />, text: "Gradas Norte y Occidente" },
        { icon: <RiDrinks2Fill />, text: "Lata de cerveza o gaseosa" },
      ],
    },
  ];

  return (
    <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 flex items-center justify-center flex-col">
      <Flyers />
      <GrandStand />
      <img src={Fondo} alt="" className="fixed inset-0 w-full select-none pointer-events-none h-screen"/>

      <div className="w-full space-y-0 sm:pt-12 relative z-20">
        <div className="bg-black absolute h-42 w-full top-0"></div>
        <div className="w-full flex flex-col items-center sm:mt-30 mt-20 bg-black">
          <div className="w-full relative justify-center flex flex-col sm:flex-row p-1.5 sm:bg-transparent bg-[#000000]">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`relative px-10 py-4 rounded-xl transition-all duration-700 overflow-hidden cursor-pointer ${
                  activePhase === phase.id
                    ? "text-black"
                    : "text-white/90 hover:text-white/90"
                }`}
              >
                {activePhase === phase.id && (
                  <div className="absolute inset-0 bg-amber-500 animate-in fade-in zoom-in-95 duration-500" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[14px] font-black uppercase tracking-[0.3em]">
                    {phase.label}
                  </span>
                  <span
                    className={`text-[12px] uppercase tracking-widest mt-1 ${activePhase === phase.id ? "text-white/90" : "text-amber-500/90"}`}
                  >
                    {phase.status}
                    {" al " + phase.date}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-5 bg-[#000000] sm:pb-0 pb-10 pt-10">
          {ticketData.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} activePhase={activePhase} />
          ))}
        </div>
        <div className="w-full flex items-center justify-center">
          <a
            href="/voley-al-limite/tickets"
            className={`text-black hover:text-white m-auto absolute sm:mb-0 mb-14 z-90 sm:p-6 p-4 rounded-2xl font-bold sm:text-[12px] text-[8px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2 bg-white hover:bg-amber-500/90 sm:shadow-2xl shadow-amber-500 sm:shadow-transparent sm:hover:shadow-amber-500 hover:-translate-y-2`}
          >
            <GiTicket size={18} fontSize={Bold}/>Comprar Entrada
          </a>
        </div>

        <div className="relative top-0 inset-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#000000"
              fillOpacity="1"
              d="M0,288L15,272C30,256,60,224,90,218.7C120,213,150,235,180,240C210,245,240,235,270,202.7C300,171,330,117,360,90.7C390,64,420,64,450,101.3C480,139,510,213,540,245.3C570,277,600,267,630,240C660,213,690,171,720,170.7C750,171,780,213,810,240C840,267,870,277,900,272C930,267,960,245,990,197.3C1020,149,1050,75,1080,74.7C1110,75,1140,149,1170,154.7C1200,160,1230,96,1260,112C1290,128,1320,224,1350,229.3C1380,235,1410,149,1425,106.7L1440,64L1440,0L1425,0C1410,0,1380,0,1350,0C1320,0,1290,0,1260,0C1230,0,1200,0,1170,0C1140,0,1110,0,1080,0C1050,0,1020,0,990,0C960,0,930,0,900,0C870,0,840,0,810,0C780,0,750,0,720,0C690,0,660,0,630,0C600,0,570,0,540,0C510,0,480,0,450,0C420,0,390,0,360,0C330,0,300,0,270,0C240,0,210,0,180,0C150,0,120,0,90,0C60,0,30,0,15,0L0,0Z"
            />
          </svg>
        </div>
      </div>
      <Guide />
    </div>
  );
};

export default VoleyaLimite;
