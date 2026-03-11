import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const Introduction = () => {
  const loadingText = "Cargando".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.8, delay: 2.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a]"
      style={{ willChange: "opacity" }}
    >
      {/* Fondo dinámico: gradiente + partículas + ruido */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente animado */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmax] h-[80vmax] bg-gradient-radial from-amber-500/15 via-transparent to-transparent rounded-full blur-3xl"
        />
        {/* Partículas flotantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "50%", y: "50%" }}
            animate={{
              x: [`${30 + i * 10}%`, `${70 - i * 5}%`, `${30 + i * 10}%`],
              y: [`${20 + i * 8}%`, `${80 - i * 4}%`, `${20 + i * 8}%`],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full blur-sm"
            style={{ left: `${i * 15}%`, top: `${i * 10}%` }}
          />
        ))}
        {/* Ruido */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wMjUiIC8+PC9zdmc+')] opacity-20" />
      </div>

      <div className="relative w-full max-w-lg px-4 sm:px-6">
        {/* Contenedor principal con animación de entrada */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          {/* Corona con efectos */}
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, delay: 0.3, ease: "easeInOut" },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative"
          >
            {/* Brillo detrás */}
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl"
              animate={{ scale: [1, 1.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Corona principal */}
            <Crown
              className="text-amber-500 relative z-10"
              size={window.innerWidth < 640 ? 40 : 56}
              strokeWidth={1.2}
              style={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.5))" }}
            />
            {/* Reflejo superior (opcional) */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-md"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Texto "Cargando" con efecto glitch suave */}
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
                      "0 0 4px rgba(245,158,11,0.3)",
                      "0 0 12px rgba(245,158,11,0.7)",
                      "0 0 4px rgba(245,158,11,0.3)",
                    ],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* Barra de progreso tipo onda luminosa */}
          <div className="w-40 sm:w-56 md:w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
            {/* Capa de glow */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              style={{ filter: "blur(4px)" }}
            />
            {/* Línea principal */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
            {/* Punto brillante que recorre */}
            <motion.div
              initial={{ left: "-10%" }}
              animate={{ left: "110%" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300 rounded-full blur-sm"
            />
          </div>

          {/* Línea inferior con diamante */}
          <div className="relative w-full h-[1px] mt-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent origin-left"
              style={{ boxShadow: "0 0 10px rgba(245,158,11,0.5)" }}
            />
            {/* Diamante que se mueve con la línea */}
            <motion.div
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: "50%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rotate-45"
              style={{ boxShadow: "0 0 8px rgba(245,158,11,0.8)" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Introduction;