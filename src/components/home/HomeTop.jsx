import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Star,
  ShieldCheck,
  TrendingUp,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import neo1 from "../../assets/neo1.webp";
import mariela1 from "../../assets/mariela1.webp";
import ceciliat from "../../assets/ceciliat1.webp";
import angelal from "../../assets/angelal1.webp";
const slides = [
  {
    title: "INCA VOLLEY",
    opponent: "ANDES",
    date: "15 MAR 2026",
    location: "ESTADIO NACIONAL · LIMA",
    description:
      "El poder ancestral de los Andes se encuentra con la electricidad de la costa en un duelo histórico por la supremacía.",
    colors: ["#a855f7", "#ec4899"],
    tag: "SEMIFINAL · VÓLEY MASCULINO",
    teamA: {
      name: "Inca Volley",
      image: neo1,
      wins: 18,
      losses: 6,
      bestPlayer: "Carlos 'El Rayo' Quispe",
      role: "Atacante Principal",
    },
    teamB: {
      name: "Andes Club",
      image: ceciliat,
      wins: 15,
      losses: 9,
      bestPlayer: "Miguel 'Cóndor' Huamán",
      role: "Líbero",
    },
  },
  {
    title: "NUEVA ERA",
    opponent: "REMATADORES",
    date: "22 MAR 2026",
    location: "COLISEO CERRADO · AYACUCHO",
    description:
      "La juventud y la experiencia se fusionan para dar paso a una nueva dinastía en el voley peruano.",
    colors: ["#06b6d4", "#f43f5e"],
    tag: "CUARTOS · VÓLEY FEMENINO",
    teamA: {
      name: "Nueva Era",
      image: angelal,
      wins: 22,
      losses: 2,
      bestPlayer: "Lucía 'Saeta' Mendoza",
      role: "Capitana",
    },
    teamB: {
      name: "Rematadores",
      image: ceciliat,
      wins: 14,
      losses: 10,
      bestPlayer: "Ana 'Bloque' Salas",
      role: "Central",
    },
  },
  {
    title: "LIMA PRIDE",
    opponent: "UNIVERSITARIO",
    date: "05 ABR 2026",
    location: "VILLA DEPORTIVA · LIMA",
    description:
      "El clásico de la ciudad. Pasión, garra y tradición en un solo lugar. ¿Quién dominará la red?",
    colors: ["#fbbf24", "#f97316"],
    tag: "CLÁSICO · VÓLEY MASCULINO",
    teamA: {
      name: "Lima Pride",
      image: angelal,
      wins: 20,
      losses: 12,
      bestPlayer: "Jorge 'Muro' Farfán",
      role: "Armador",
    },
    teamB: {
      name: "Universitario",
      image: mariela1,
      wins: 25,
      losses: 7,
      bestPlayer: "Renato 'Garra' Torres",
      role: "Opuesto",
    },
  },
];

const StatCard = ({ team, side, color }) => {
  const totalGames = team.wins + team.losses;
  const winPercentage =
    totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;

  return (
    <div
      className={`flex flex-col ${side === "right" ? "items-end text-right" : "items-start text-left"} gap-4`}
    >
      <div className="space-y-2 w-full">
        <h4 className="text-sm font-black tracking-tight text-white uppercase">
          {team.name}
        </h4>

        {/* Wins/Losses badges */}
        <div
          className={`flex gap-3 ${side === "right" ? "justify-end" : "justify-start"}`}
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-base">
            <CheckCircle2 size={16} /> {team.wins}
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-mono text-base">
            <XCircle size={16} /> {team.losses}
          </div>
        </div>

        {/* Win rate bar */}
        <div className="w-full max-w-[160px] mt-2">
          <div className="flex justify-between text-[9px] font-bold text-zinc-500 mb-1">
            <span>WIN RATE</span>
            <span className="text-white">{winPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${winPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${color}80, ${color})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* MVP Card con borde de color */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-2xl bg-white/5 border backdrop-blur-md w-full max-w-[200px]`}
        style={{ borderColor: `${color}40`, borderWidth: "1px" }}
      >
        <div
          className={`flex items-center gap-2 mb-2 ${side === "right" ? "flex-row-reverse" : ""}`}
        >
          <div
            className="p-1.5 rounded-full"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            <Star size={14} fill="currentColor" />
          </div>
          <span className="text-[10px] tracking-tighter text-zinc-400 font-bold uppercase">
            MVP
          </span>
        </div>
        <p className="text-sm font-semibold text-white truncate">
          {team.bestPlayer}
        </p>
        <p className="text-[11px] text-zinc-500">{team.role}</p>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Fondo Ambient Lights */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${slides[current].colors[0]}33 0%, transparent 90%)`,
          }}
        />
      </AnimatePresence>

      <main className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-12 py-20">
        <div className="max-w-[1700px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center"
            >
              {/* BLOQUE IZQUIERDO: TEXTO E INFO EQUIPO A */}
              <div className="lg:col-span-3 order-2 lg:order-1 space-y-8 h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] bg-white/5 border border-white/10 text-gray-200 uppercase">
                    {slides[current].tag}
                  </span>
                  <h1 className="text-4xl xl:text-6xl font-black italic tracking-tighter leading-none">
                    <span style={{ color: slides[current].colors[0] }}>
                      {slides[current].title}
                    </span>
                  </h1>
                  <p className="text-zinc-500 text-xs xl:text-sm leading-relaxed max-w-xs">
                    {slides[current].description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <StatCard
                    team={slides[current].teamA}
                    side="left"
                    color={slides[current].colors[0]}
                  />
                </motion.div>

                <div className="hidden lg:flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Calendar size={14} className="text-zinc-600" />
                    <span>{slides[current].date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <MapPin size={14} className="text-zinc-600" />
                    <span>{slides[current].location}</span>
                  </div>
                </div>
              </div>

              {/* BLOQUE CENTRAL: VS VISUAL (SPLIT SCREEN) */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center relative px-4 lg:px-0 shadow-black shadow-lg hover:shadow-2xl hover:shadow-amber-200 hover:translate-y-4 ease-in-out duration-500 rounded-[2.5rem] select-none">
                <div className="relative w-full aspect-[16/10] lg:aspect-[4/5] xl:aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={`vs-container-${current}`}
                      className="absolute inset-0 flex"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Lado Izquierdo - Team A */}
                      <div className="relative w-1/2 h-full overflow-hidden">
                        <motion.img
                          src={slides[current].teamA.image}
                          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] contrast-[1.1]"
                          initial={{ x: -20, scale: 1.2 }}
                          animate={{ x: 0, scale: 1 }}
                          transition={{ duration: 1.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                      </div>

                      {/* Lado Derecho - Team B */}
                      <div className="relative w-1/2 h-full overflow-hidden">
                        <motion.img
                          src={slides[current].teamB.image}
                          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] contrast-[1.1]"
                          initial={{ x: 20, scale: 1.2 }}
                          animate={{ x: 0, scale: 1 }}
                          transition={{ duration: 1.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent" />
                      </div>

                      {/* Divisor Diagonal VS */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        {/* Línea Divisoria */}
                        <div className="absolute w-px h-[150%] bg-white/20 rotate-[25deg] blur-sm" />

                        {/* Círculo Central VS */}
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.5,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="relative w-20 h-20 lg:w-28 lg:h-28 bg-black/60 backdrop-blur-2xl border-2 border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        >
                          <span className="text-3xl lg:text-5xl font-black italic tracking-tighter text-white">
                            VS
                          </span>

                          {/* Anillos decorativos */}
                          <div className="absolute inset-0 rounded-full border border-white/90 animate-ping opacity-20" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* BLOQUE DERECHO: INFO EQUIPO B */}
              <div className="lg:col-span-3 order-3 space-y-8 flex flex-col items-end justify-center h-full select-none">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-right space-y-4"
                >
                  <h2 className="relative text-4xl xl:text-6xl font-black italic tracking-tighter leading-none">
                    <span style={{ color: slides[current].colors[1] }}>
                      {slides[current].opponent}
                    </span>
                  </h2>
                  <p className="text-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase italic ml-auto flex items-center justify-end gap-2">
                    <TrendingUp size={14} /> El Rival a Vencer
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <StatCard
                    team={slides[current].teamB}
                    side="right"
                    color={slides[current].colors[1]}
                  />
                </motion.div>

                <div className="w-full max-w-[200px] pt-4 space-y-4">
                  <a href="/tickets" className="w-full px-6 py-4 bg-white text-black font-black text-[10px] tracking-[0.2em] hover:bg-zinc-200 transition-all rounded-full flex items-center justify-center gap-2 group shadow-xl">
                    COMPRAR{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">
                    <span>Hype Meter</span>
                    <span className="text-white">98%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navegación Inferior Miniaturizada */}
      <div className="relative bottom-8 left-0 right-0 z-50 flex justify-center items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative h-8 flex items-center"
          >
            <div
              className={`h-0.5 transition-all duration-700 rounded-full ${current === i ? "w-16 bg-white" : "w-6 bg-white/10 group-hover:bg-white/30"}`}
            />
          </button>
        ))}
      </div>

      {/* Marca de agua / Decoración lateral */}
      <div className="fixed top-1/2 -left-20 -rotate-90 origin-center text-[6vh] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        Inca Volley Official
      </div>
      <div className="fixed top-1/2 -right-20 rotate-90 origin-center text-[6vh] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        Estadio Nacional 2026
      </div>
    </div>
  );
};

export default App;
