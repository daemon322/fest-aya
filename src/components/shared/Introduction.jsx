import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// FIX: El loader desaparecía en solo 0.3s (delay: 0.3, duration: 0.3),
//      demasiado rápido para que la animación de entrada fuera visible.
//      Ajustado para mostrar la animación completa y luego hacer fade out.
const Introduction = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.6, delay: 1.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
      // Evitar que el overlay bloquee clicks después de ocultarse
      style={{ willChange: "opacity" }}
    >
      <div className="relative overflow-hidden">
        {/* Animación de entrada del contenido */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Ícono con rotación suave */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
          >
            <Crown className="text-amber-500 mb-4" size={40} strokeWidth={1} />
          </motion.div>

          <h2 className="text-white text-[10px] tracking-[1.5em] uppercase font-light">
            Cargando
          </h2>

          {/* Barra de progreso animada */}
          <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          </div>
        </motion.div>

        {/* Línea inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-500 origin-left"
        />
      </div>
    </motion.div>
  );
};

export default Introduction;
