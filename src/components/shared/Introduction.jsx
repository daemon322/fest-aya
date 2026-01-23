import {
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
const Introduction = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 1, delay: 2.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
    >
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <Crown className="text-amber-500 mb-4" size={40} strokeWidth={1} />
          <h2 className="text-white text-[10px] tracking-[1.5em] uppercase font-light">Legado Real del Perú</h2>
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </motion.div>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-500 origin-left"
        />
      </div>
    </motion.div>
  );
};
export default Introduction