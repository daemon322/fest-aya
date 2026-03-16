import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Introduction = () => {
  const [isVisible, setIsVisible] = useState(true);
  const loadingText = "Cargando".split("");
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generar partículas con propiedades aleatorias
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    color: `rgba(245, 158, 11, ${0.1 + Math.random() * 0.3})`,
    blur: Math.random() * 4 + 1,
  }));

  // Si ya no es visible, no renderizar nada
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.8, ease: "easeInOut" }}
      onAnimationComplete={() => setIsVisible(false)} // Al terminar, ocultar
      className="fixed inset-0 z-[1300] flex items-center justify-center"
      style={{
        willChange: "opacity",
        backgroundColor: "#0a0a0a",
        pointerEvents: "auto", // Asegura que capture clics
      }}
    >
      {/* Fondo ultrarealista con múltiples capas (igual que antes) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Capa 1: Gradiente grande y lento */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.3, 0.15],
            rotate: [0, 120, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax] bg-gradient-radial from-amber-400/20 via-amber-600/10 to-transparent rounded-full blur-3xl"
        />

        {/* Capa 2: Gradiente secundario con movimiento inverso */}
        <motion.div
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.1, 0.25, 0.1],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[80vmax] h-[80vmax] bg-gradient-radial from-amber-300/10 via-transparent to-transparent rounded-full blur-3xl"
        />

        {/* Partículas principales (más grandes y lentas) */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}%`, y: `${p.y}%`, scale: 0 }}
            animate={{
              x: [`${p.x}%`, `${(p.x + 20) % 100}%`, `${p.x}%`],
              y: [`${p.y}%`, `${(p.y + 30) % 100}%`, `${p.y}%`],
              scale: [0.8, 1.5, 0.8],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
            className="absolute rounded-full"
            style={{
              width: p.size * 2,
              height: p.size * 2,
              backgroundColor: p.color,
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
          />
        ))}

        {/* Partículas secundarias (más pequeñas y rápidas) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-0.5 h-0.5 bg-amber-400/30 rounded-full blur-[2px]"
          />
        ))}

        {/* Destello tipo "lens flare" */}
        <motion.div
          animate={{
            x: ["-10%", "110%", "-10%"],
            y: ["-10%", "110%", "-10%"],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[30vmax] h-[30vmax] bg-gradient-to-br from-amber-300/20 via-transparent to-transparent rounded-full blur-3xl rotate-45"
        />

        {/* Ruido SVG con opacidad baja */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wMjUiIC8+PC9zdmc+')] opacity-15" />
      </div>

      {/* Contenido principal */}
      <div className="relative w-full max-w-lg px-4 sm:px-6">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          {/* Corona con efectos mejorados */}
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              y: [0, -10, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              rotate: { duration: 2.2, delay: 0.3, ease: "easeInOut" },
              y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <Crown
              className="text-amber-500 relative z-10"
              size={dimensions.width < 640 ? 44 : 60}
              strokeWidth={1.2}
              style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.7))" }}
            />
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-md"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Texto "Cargando" con glitch */}
          <div className="overflow-hidden">
            <h2 className="text-white/90 text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] uppercase font-light flex flex-wrap justify-center">
              {loadingText.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.08,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  whileInView={{
                    textShadow: [
                      "0 0 4px #f59e0b",
                      "0 0 14px #f59e0b, 0 0 20px #f59e0b",
                      "0 0 4px #f59e0b",
                    ],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* Barra de progreso */}
          <div className="w-40 sm:w-56 md:w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              style={{ filter: "blur(6px)" }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
            <motion.div
              initial={{ left: "-10%" }}
              animate={{ left: "110%" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300 rounded-full blur-md"
            />
          </div>

          {/* Línea inferior con diamante */}
          <div className="relative w-full h-[1px] mt-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent origin-left"
              style={{ boxShadow: "0 0 15px rgba(245,158,11,0.6)" }}
            />
            <motion.div
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: "50%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rotate-45"
              style={{ boxShadow: "0 0 12px rgba(245,158,11,0.9)" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Introduction;