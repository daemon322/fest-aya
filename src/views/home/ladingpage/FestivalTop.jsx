import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  ArrowUpRight,
  Instagram,
  Twitter,
  Music,
  Play,
  ChevronRight,
  Volume2,
} from "lucide-react";
import aguamarina from "../../../assets/aguamarina.jpg";
import grupo5 from "../../../assets/grupo5.png";
import armonia10 from "../../../assets/armonia10.jpg";
import corazonserrano from "../../../assets/corazonserrano.jpg";

const ARTISTS = [
  {
    id: 1,
    name: "GRUPO 5",
    tagline: "EL GRUPO DE ORO",
    image: grupo5,
    color: "#EAB308",
    accent: "text-yellow-400",
    gradient: "from-yellow-500/20 via-yellow-500/5 to-transparent",
    tracks: 8,
    year: "1973",
  },
  {
    id: 2,
    name: "AGUA MARINA",
    tagline: "EL AGUA MÁS RICA",
    image: aguamarina,
    color: "#06B6D4",
    accent: "text-cyan-400",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    tracks: 12,
    year: "1974",
  },
  {
    id: 3,
    name: "ARMONIA 10",
    tagline: "LA UNIVERSIDAD",
    image: armonia10,
    color: "#EF4444",
    accent: "text-red-500",
    gradient: "from-red-500/20 via-red-500/5 to-transparent",
    tracks: 6,
    year: "1975",
  },
  {
    id: 4,
    name: "CORAZÓN SERRANO",
    tagline: "PASIÓN NORTEÑA",
    image: corazonserrano,
    color: "#A855F7",
    accent: "text-purple-500",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    tracks: 10,
    year: "1980",
  },
];

// Marquee mejorado con gradiente en los bordes
const Marquee = ({ text, speed = 20, reverse = false }) => {
  return (
    <div className="relative flex overflow-hidden select-none w-full border-y border-white/5 py-3">
      {/* Gradientes laterales */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

      <motion.div
        animate={{ x: reverse ? [0, 1000] : [0, -1000] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 pr-12"
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-[5rem] md:text-[8rem] font-black leading-none tracking-tighter opacity-5">
              {text}
            </span>
            <ChevronRight size={40} className="opacity-5" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const active = ARTISTS[index];
  const audioRef = useRef(null);

  // Cambio automático con pausa al hover
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ARTISTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Efecto de sonido al cambiar artista
  const handleArtistChange = (newIndex) => {
    setIndex(newIndex);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans z-60">
      {/* Audio para efectos */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"
      />

      {/* Ruido de textura */}
      <div
        className="fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layout principal con mejor división */}
      <div className="relative flex flex-col lg:flex-row h-screen sm:pt-2 pt-16">
        {/* Lado izquierdo - Mejorado */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between p-6 md:p-10 lg:p-12 z-30 relative">
          {/* Header minimalista */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="text-2xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                AYACUCHO<span className={active.accent}>FEST</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest text-white px-3 py-1 border border-white/10 rounded-full">
                AYACUCHO, PE
              </span>
              <div className="w-1 h-1 rounded-full bg-white" />
              <span className="text-xs font-bold tracking-widest text-white">
                MARZ 2026
              </span>
            </div>
          </motion.div>

          {/* Contenido principal - Con más jerarquía */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Tagline con animación sutil */}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm font-bold tracking-[0.3em] ${active.accent} mb-2 block uppercase text-glow`}
                >
                  {active.tagline}
                </motion.span>

                {/* Nombre del artista con efecto tipográfico */}
                <h1 className="text-6xl md:text-8xl lg:text-7xl xl:text-8xl font-black leading-[0.85] tracking-tighter font-['Archivo_Black']">
                  <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {active.name.split(" ")[0]}
                  </span>
                  {active.name.split(" ")[1] && (
                    <span className={`block ${active.accent} mt-2`}>
                      {active.name.split(" ")[1]}
                    </span>
                  )}
                </h1>

                {/* Información adicional */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Volume2 size={14} />
                    <span>{active.tracks} éxitos</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="text-white text-sm">
                    Desde {active.year}
                  </div>
                </div>

                {/* Botones mejorados */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <a href="./tickets">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold text-sm tracking-wider uppercase overflow-hidden rounded-sm cursor-pointer"
                    >
                      <div
                        className={`absolute inset-0 ${active.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                      <Ticket size={18} />
                      <span className="relative">COMPRAR TICKETS</span>
                      <ArrowUpRight
                        size={16}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </motion.button>
                  </a>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center justify-center gap-3 border border-white/20 px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-white/5 transition-all rounded-sm cursor-pointer"
                  >
                    <Play
                      size={14}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>ESCUCHAR HITS</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navegación mejorada */}
          <div className="flex flex-col gap-6 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {ARTISTS.map((artist, i) => (
                  <button
                    key={artist.id}
                    onClick={() => handleArtistChange(i)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative group"
                  >
                    <div
                      className={`h-1 w-8 transition-all duration-500 ${index === i ? "bg-white" : "bg-white/10 group-hover:bg-white/30"}`}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs font-bold whitespace-nowrap bg-black/80 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                        {artist.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm font-mono text-white/30">
                  <span className="text-white/60">0{index + 1}</span> / 0
                  {ARTISTS.length}
                </div>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={() =>
                    handleArtistChange((index + 1) % ARTISTS.length)
                  }
                  className="p-2 border border-white/10 hover:border-white/30 transition-colors rounded-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Línea de progreso temporal */}
            <div className="relative h-px bg-white/5">
              <motion.div
                key={active.id}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className={`absolute left-0 top-0 h-full ${active.accent.replace("text-", "bg-")}`}
              />
            </div>
          </div>
        </div>

        {/* Lado derecho - Visual inmersivo mejorado */}
        <div className="hidden lg:block w-3/5 h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent z-20" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{
                clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                scale: 1.1,
              }}
              animate={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                scale: 1,
              }}
              exit={{
                clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
                scale: 1.1,
              }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={active.image}
                className="w-full h-full object-cover"
                alt={active.name}
                style={{ filter: "" }}
              />

              {/* Overlay de gradiente dinámico */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${active.gradient} mix-blend-overlay`}
              />

              {/* Efecto de línea diagonal */}
              <div className="absolute bottom-0 right-0 w-2/3 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Elemento decorativo numérico */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
            className="absolute bottom-12 right-12 z-30"
          >
            <div className="text-[20rem] font-black font-outline opacity-[0.03] select-none leading-none">
              26
            </div>
          </motion.div>

          {/* Redes sociales posicionadas sobre la imagen */}
          <div className="absolute bottom-12 left-12 flex flex-col gap-4 z-30">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Music, label: "Spotify" },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5, scale: 1.1 }}
                className="group flex items-center gap-3 text-white hover:text-white transition-colors"
              >
                <div className="p-2 border border-white group-hover:border-white rounded-sm">
                  <social.icon size={16} />
                </div>
                <span className="text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Versión móvil de la imagen */}
        <div className="lg:hidden relative w-full h-64 md:h-96 mt-8 overflow-hidden clip-diagonal">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={active.image}
                className="w-full h-full object-cover"
                alt={active.name}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${active.gradient}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Marquee animado mejorado */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Marquee text={`${active.name} • ${active.tagline}`} speed={35} />
        <Marquee
          text="LIMA • PERÚ • 2026 • AYACUCHOFEST"
          speed={25}
          reverse={true}
        />
      </div>

      {/* Elementos decorativos geométricos */}
      <div className="absolute top-0 left-0 w-64 h-64 border-t border-l border-white/5" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-b border-r border-white/5" />

      {/* Línea divisoria central elegante */}
      <div className="hidden lg:block absolute left-2/5 top-0 bottom-0 w-px z-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
