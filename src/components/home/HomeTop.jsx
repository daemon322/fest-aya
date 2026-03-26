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

import diosas from "../../assets/logoa.png";
import perritas from "../../assets/logob.png";
import interrogacion from "../../assets/perin.png";
import logoayacucho from "../../assets/logoayacucho.png";
import logofenix from "../../assets/logofen.png";
import logoquiroz from "../../assets/logoqui.png";
import logoruby from "../../assets/logoruby.png";

const slides = [
  {
    title: "DIOSAS DE LA AMAZONÍA",
    opponent: "LAS PERRITAS",
    date: "28 MAR 2026",
    location: "LOSA DEPORTIVA DE CAPILLAPATA · AYACUCHO",
    description:
      "El poder ancestral de los Andes se encuentra con la tormenta salvaje de la selva en un duelo histórico por la supremacía.",
    colors: ["#fbbf24", "#f97316"],
    tag: "CLÁSICO · VÓLEY TRANS",
    teamA: {
      name: "Diosas de la Amazonía",
      image: diosas,
      wins: 25,
      losses: 7,
      bestPlayer: "???",
      role: "??????",
    },
    teamB: {
      name: "Las Perritas",
      image: perritas,
      wins: 25,
      losses: 7,
      bestPlayer: "???",
      role: "??????",
    },
  },
  {
    title: "QUIROZ",
    opponent: "LAS VILLANAS",
    date: "28 MAR 2026",
    location: "LOSA DEPORTIVA DE CAPILLAPATA · AYACUCHO",
    description:
      "Este enfrentamiento forma parte de un torneo regional que busca promover el desarrollo del vóley en las regiones..",
    colors: ["#a855f7", "#ec4899"],
    tag: "VÓLEY MASCULINO",
    teamA: {
      name: "QUIROZ",
      image: logoquiroz,
      wins: 18,
      losses: 6,
      bestPlayer: "???",
      role: "??????",
    },
    teamB: {
      name: "LAS VILLANAS",
      image: logoruby,
      wins: 15,
      losses: 9,
      bestPlayer: "???",
      role: "??????",
    },
  },
  {
    title: "LIMA NORTE",
    opponent: "TEAM AYACUCHO",
    date: "28 MAR 2026",
    location: "LOSA DEPORTIVA DE CAPILLAPATA · AYACUCHO",
    description:
      "La juventud y la experiencia se fusionan para dar paso a una nueva dinastía en el voley peruano.",
    colors: ["#06b6d4", "#f43f5e"],
    tag: "CUARTOS · VÓLEY FEMENINO",
    teamA: {
      name: "LIMA NORTE",
      image: logofenix,
      wins: 22,
      losses: 2,
      bestPlayer: "???",
      role: "??????",
    },
    teamB: {
      name: "TEAM AYACUCHO",
      image: logoayacucho,
      wins: 14,
      losses: 10,
      bestPlayer: "???",
      role: "?????",
    },
  },
    {
    title: "HUANCAYO",
    opponent: "LAS ZORRITAS",
    date: "28 MAR 2026",
    location: "LOSA DEPORTIVA DE CAPILLAPATA · AYACUCHO",
    description:
      "La juventud y la experiencia se fusionan para dar paso a una nueva dinastía en el voley peruano.",
    colors: ["#06b6d4", "#f43f5e"],
    tag: "CUARTOS · VÓLEY FEMENINO",
    teamA: {
      name: "HUANCAYO",
      image: interrogacion,
      wins: 22,
      losses: 2,
      bestPlayer: "???",
      role: "??????",
    },
    teamB: {
      name: "LAS ZORRITAS",
      image: interrogacion,
      wins: 14,
      losses: 10,
      bestPlayer: "???",
      role: "?????",
    },
  },
];

const StatCard = ({ team, side, color }) => {
  const totalGames = team.wins + team.losses;
  const winPercentage =
    totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full ${
        side === "right" ? "text-right" : "text-left"
      }`}
    >
      {/* Línea de acento superior */}
      <div
        className="absolute top-0 left-0 w-16 h-1 rounded-tl-2xl"
        style={{ background: color }}
      />

      <div className="space-y-3">
        {/* Nombre del equipo */}
        <h4 className="text-sm font-bold text-white truncate">{team.name}</h4>

        {/* Wins/Losses y Win Rate en fila */}
        <div
          className={`flex items-center gap-4 ${
            side === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-sm font-mono text-white">{team.wins}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-rose-400" />
            <span className="text-sm font-mono text-white">{team.losses}</span>
          </div>
        </div>

        {/* Barra de win rate */}
        <div className="w-full">
          <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
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

        {/* MVP con diseño simplificado */}
        <div
          className={`flex items-center gap-2 mt-2 ${
            side === "right" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className="p-1 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <Star size={12} className="text-white" fill={color} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white truncate">
              {team.bestPlayer}
            </p>
            <p className="text-[10px] text-zinc-400">{team.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HomeTop = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans antialiased overflow-hidden pt-20">
      {/* Fondo ambiental con gradiente */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${slides[current].colors[0]}33 0%, transparent 60%), radial-gradient(circle at 70% 50%, ${slides[current].colors[1]}33 0%, transparent 60%)`,
          }}
        />
      </AnimatePresence>

      {/* Header con liga y fecha */}
      <header className="relative z-20 flex justify-between items-center px-6 py-4 lg:px-12 border-b border-white/5">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-zinc-400" />
          <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase">
            Ayacucho Vóley Club
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <Calendar size={14} />
            <span>{slides[current].date}</span>
          </div>
          <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">
              En Vivo
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 sm:px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
            >
              {/* Columna izquierda: info equipo A + detalles */}
              <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
                {/* Tag y título en móvil se ven arriba del VS, pero aquí los mantenemos */}
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-white/5 border border-white/10 text-zinc-300 uppercase">
                    {slides[current].tag}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                    <span style={{ color: slides[current].colors[0] }}>
                      {slides[current].title}
                    </span>
                  </h1>
                  <p className="text-sm text-zinc-400 max-w-md">
                    {slides[current].description}
                  </p>
                </div>

                {/* Estadísticas equipo A */}
                <StatCard
                  team={slides[current].teamA}
                  side="left"
                  color={slides[current].colors[0]}
                />

                {/* Fecha y ubicación visibles en desktop y tablet */}
                <div className="hidden sm:flex flex-col gap-2 text-sm text-zinc-400 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-500" />
                    <span>{slides[current].date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-zinc-500" />
                    <span>{slides[current].location}</span>
                  </div>
                </div>
              </div>

              {/* Columna central: VS visual */}
              <a href="/voley-al-limite" className="lg:col-span-4 order-1 lg:order-2 flex justify-center items-center">
                <div className="relative w-full max-w-md aspect-square lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={`vs-${current}`}
                      className="absolute inset-0 flex"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Lado A */}
                      <div className="relative w-1/2 h-full overflow-hidden">
                        {slides[current].teamA.image ? (
                          <img
                            src={slides[current].teamA.image}
                            alt={slides[current].teamA.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-transparent" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                      </div>

                      {/* Lado B */}
                      <div className="relative w-1/2 h-full overflow-hidden">
                        {slides[current].teamB.image ? (
                          <img
                            src={slides[current].teamB.image}
                            alt={slides[current].teamB.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-bl from-pink-900/50 to-transparent" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-transparent" />
                      </div>

                      {/* Divisor diagonal y VS */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-px h-[150%] bg-white/20 rotate-[25deg] blur-sm" />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black/80 backdrop-blur-xl border-2 border-white/30 rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <span className="text-2xl sm:text-3xl font-black text-white">
                            VS
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </a>

              {/* Columna derecha: info equipo B + CTA */}
              <div className="lg:col-span-4 order-3 space-y-6">
                {/* Título del oponente alineado a la derecha */}
                <div className="text-right">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                    <span style={{ color: slides[current].colors[1] }}>
                      {slides[current].opponent}
                    </span>
                  </h2>
                  <p className="text-sm text-zinc-400 flex items-center justify-end gap-1 mt-1">
                    <TrendingUp size={14} /> El rival a vencer
                  </p>
                </div>

                {/* Estadísticas equipo B */}
                <StatCard
                  team={slides[current].teamB}
                  side="right"
                  color={slides[current].colors[1]}
                />

                {/* Botón de compra */}
                <div className="pt-4">
                  <a
                    href="/voley-al-limite/tickets"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-sm tracking-wider hover:bg-zinc-200 transition-all rounded-full flex items-center justify-center gap-2 group shadow-xl"
                  >
                    COMPRAR ENTRADAS
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <div className="flex justify-between items-center text-xs text-zinc-500 mt-4">
                    <span>HYPE METER</span>
                    <span className="text-white font-bold">98%</span>
                  </div>
                </div>

                {/* Fecha y ubicación solo en móvil (porque ya están en left) */}
                <div className="sm:hidden flex flex-col gap-2 text-sm text-zinc-400 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-500" />
                    <span>{slides[current].date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-zinc-500" />
                    <span>{slides[current].location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navegación inferior con colores dinámicos */}
      <div className="relative bottom-6 flex justify-center items-center gap-3 z-20">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative h-2 flex items-center"
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                current === i
                  ? "w-12"
                  : "w-3 bg-white/20 group-hover:bg-white/40"
              }`}
              style={{
                background:
                  current === i
                    ? `linear-gradient(90deg, ${slide.colors[0]}, ${slide.colors[1]})`
                    : "",
              }}
            />
          </button>
        ))}
      </div>

      {/* Watermarks decorativos */}
      <div className="fixed top-1/2 -left-24 -rotate-90 text-[8vh] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        Ayacucho Vóley
      </div>
      <div className="fixed top-1/2 -right-24 rotate-90 text-[8vh] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        2026
      </div>
    </div>
  );
};

export default HomeTop;
