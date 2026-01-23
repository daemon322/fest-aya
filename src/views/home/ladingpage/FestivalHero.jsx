import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Zap,
  Award,
  Clock,
  Users,
  Star,
  Eye,
} from "lucide-react";
import aguamarina from "../../../assets/aguamarina.jpg";
import armonia10 from "../../../assets/armonia10.jpg";
import grupo5 from "../../../assets/grupo5.png";

// Array de conciertos/anual de orquestas populares
const FESTIVALS = [
  {
    id: "001",
    title: "GRUPO 5",
    subtitle: "Tour 2026",
    location: "Estadio Nacional, Lima",
    coordinates: "12°03'S, 77°02'W",
    date: "15 Junio 2026",
    duration: "1 noche",
    season: "Invierno",
    description:
      "El Grupo 5, la orquesta de cumbia más querida del Perú, regresa con su espectacular show anual. Vive una noche llena de éxitos, luces y emociones junto a miles de fanáticos.",
    experience: "Cumbia Total",
    intensity: 10,
    rarity: "Evento Anual",
    stats: {
      participants: "40,000+",
      duration: "6 horas",
      escenario: "360°",
    },
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
    image:grupo5,
    overlay:
      "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=2000&q=30')",
  },
  {
    id: "002",
    title: "AGUA MARINA",
    subtitle: "Gira del Amor 2026",
    location: "Explanada Sur, Lima",
    coordinates: "12°05'S, 77°01'W",
    date: "20 Julio 2026",
    duration: "1 noche",
    season: "Invierno",
    description:
      "Agua Marina, ícono de la cumbia peruana, presenta su tradicional concierto anual con todos sus clásicos románticos. Una fiesta inolvidable para bailar y cantar toda la noche.",
    experience: "Noche Romántica",
    intensity: 9,
    rarity: "Clásico Anual",
    stats: {
      participants: "30,000+",
      duration: "5 horas",
      escenario: "Principal",
    },
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    image:aguamarina,
    overlay:
      "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2000&q=30')",
  },
  {
    id: "003",
    title: "ARMONÍA 10",
    subtitle: "Fiesta Norteña 2026",
    location: "Plaza Norte, Lima",
    coordinates: "12°00'S, 77°04'W",
    date: "10 Agosto 2026",
    duration: "1 noche",
    season: "Invierno",
    description:
      "Armonía 10, la agrupación emblemática del norte, llega con su show anual para poner a bailar a todo el Perú. Disfruta de sus mejores éxitos en un ambiente de pura alegría.",
    experience: "Sabor Norteño",
    intensity: 8,
    rarity: "Imperdible",
    stats: {
      participants: "25,000+",
      duration: "5 horas",
      escenario: "Norteño",
    },
    color: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
    image: armonia10,
    overlay:
      "url('https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=2000&q=30')",
  }
];

// Componente de efecto de partículas premium
const PremiumParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Partículas doradas */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`gold-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg shadow-amber-400/30"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            scale: 0,
          }}
          animate={{
            x: [null, Math.random() * 100 + "vw"],
            y: [null, Math.random() * 100 + "vh"],
            scale: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rayos de luz */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`light-${i}`}
          className="absolute w-[1px] h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent"
          initial={{
            x: Math.random() * 100 + "vw",
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [null, Math.random() * 100 + "vw"],
            rotate: 360,
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Componente de tarjeta de cristal premium
const GlassPanel = ({ children, className = "", intensity = 0.1 }) => (
  <div
    className={`backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl ${className}`}
    style={{
      background: `linear-gradient(135deg, rgba(255,255,255,${intensity}) 0%, rgba(255,255,255,${intensity * 0.5}) 100%)`,
      boxShadow:
        "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    }}
  >
    {children}
  </div>
);

// Componente de barra de progreso sutil
const ProgressIndicator = ({ current, total }) => {
  return (
    <div className="relative">
      <div className="h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute -top-6 left-0 text-xs tracking-widest text-white/60 font-mono">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>
    </div>
  );
};

const ExclusiveFestivalShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  const currentFestival = FESTIVALS[activeIndex];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);

  // Efecto de autoplay
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % FESTIVALS.length);
      }, 10000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying]);

  // Seguimiento del mouse para efectos 3D
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FESTIVALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FESTIVALS.length) % FESTIVALS.length);
  };

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Fondo premium */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Imagen principal con efectos */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{
                backgroundImage: `url(${currentFestival.image})`,
                filter: "brightness(0.4) contrast(1.3) saturate(1.2)",
              }}
            />

            {/* Overlay de textura */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: currentFestival.overlay,
                mixBlendMode: "overlay",
              }}
            />

            {/* Gradiente dinámico */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />

            {/* Efecto de iluminación */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: currentFestival.gradient,
                opacity: 0.15,
                x: mousePosition.x - 250,
                y: mousePosition.y - 250,
              }}
              animate={{
                x: mousePosition.x - 250,
                y: mousePosition.y - 250,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 30 }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <PremiumParticles />

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Panel izquierdo - Información */}
          <div className="flex flex-col justify-center space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                {/* Encabezado elegante */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-gradient-to-r from-amber-500 to-transparent" />
                    <span className="text-sm tracking-[0.3em] text-white/60 uppercase">
                      {currentFestival.experience}
                    </span>
                  </div>

                  <h1 className="text-6xl lg:text-8xl font-bold leading-[0.85] tracking-tight">
                    <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                      {currentFestival.title}
                    </span>
                    <br />
                    <span
                      className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent"
                      style={{ color: currentFestival.color }}
                    >
                      {currentFestival.subtitle}
                    </span>
                  </h1>
                </div>

                {/* Información geográfica */}
                <GlassPanel className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>UBICACIÓN</span>
                      </div>
                      <div className="text-lg font-medium">
                        {currentFestival.location}
                      </div>
                      <div className="text-sm text-white/40">
                        {currentFestival.coordinates}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>TEMPORADA</span>
                      </div>
                      <div className="text-lg font-medium">
                        {currentFestival.season}
                      </div>
                      <div className="text-sm text-white/40">
                        {currentFestival.date}
                      </div>
                    </div>
                  </div>
                </GlassPanel>

                {/* Descripción */}
                <div className="space-y-4">
                  <p className="text-xl leading-relaxed text-white/80 font-light tracking-wide">
                    {currentFestival.description}
                  </p>

                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-2">
                      <Award
                        className="w-5 h-5"
                        style={{ color: currentFestival.color }}
                      />
                      <span className="text-sm">{currentFestival.rarity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap
                        className="w-5 h-5"
                        style={{ color: currentFestival.color }}
                      />
                      <span className="text-sm">
                        Intensidad: {currentFestival.intensity}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.entries(currentFestival.stats).map(
                    ([key, value]) => (
                      <GlassPanel key={key} className="p-4 text-center">
                        <div
                          className="text-2xl font-bold mb-1"
                          style={{ color: currentFestival.color }}
                        >
                          {value}
                        </div>
                        <div className="text-xs tracking-widest text-white/60 uppercase">
                          {key}
                        </div>
                      </GlassPanel>
                    ),
                  )}
                </div>

                {/* Navegación */}
                <div className="flex items-center gap-6 pt-8">
                  <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-4 rounded-full border border-white/20 hover:border-amber-500/50 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180 group-hover:text-amber-400 transition-colors" />
                  </motion.button>

                  <div className="flex-1">
                    <div className="flex justify-center gap-2">
                      {FESTIVALS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          className={`h-1 transition-all duration-500 rounded-full ${
                            idx === activeIndex
                              ? "w-12 bg-gradient-to-r from-amber-500 to-orange-500"
                              : "w-4 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-4 rounded-full border border-white/20 hover:border-amber-500/50 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 group-hover:text-amber-400 transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Panel derecho - Visualización */}
          <div className="hidden lg:flex items-center justify-center relative">
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full"
            >
              {/* Marco de visualización */}
              <GlassPanel intensity={0.15} className="p-8">
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden group">
                  {/* Imagen principal */}
                  <motion.img
                    src={currentFestival.image}
                    alt={currentFestival.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Overlay de gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

                  {/* Efecto de borde */}
                  <div className="absolute inset-0 border-2 border-white/10 rounded-xl pointer-events-none" />

                  {/* Contenido flotante */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs tracking-widest text-white/60 mb-2">
                          EXPERIENCIA {currentFestival.id}
                        </div>
                        <div className="text-4xl font-bold leading-tight">
                          <div className="text-white">
                            {currentFestival.title.split(" ")[0]}
                          </div>
                          <div style={{ color: currentFestival.color }}>
                            {currentFestival.title
                              .split(" ")
                              .slice(1)
                              .join(" ")}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className="text-6xl font-bold opacity-20"
                          style={{ color: currentFestival.color }}
                        >
                          {currentFestival.id}
                        </div>
                      </div>
                    </div>

                    {/* Indicadores */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {currentFestival.stats.participants}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {currentFestival.stats.duration}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/20"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(0,0,0,0.6)",
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Efecto de brillo al pasar el mouse */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${currentFestival.color}20 0%, transparent 50%)`,
                      }}
                    />
                  </div>
                </div>
              </GlassPanel>

              {/* Elementos decorativos flotantes */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none"
                style={{ color: currentFestival.color }}
              >
                <Star
                  className="w-full h-full opacity-20"
                  fill="currentColor"
                />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-6 w-24 h-24 pointer-events-none"
                style={{ color: currentFestival.color }}
              >
                <div
                  className="w-full h-full border-2 rounded-full opacity-20"
                  style={{ borderColor: currentFestival.color }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveFestivalShowcase;
