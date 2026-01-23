import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Menu, X } from "lucide-react";

const GalaNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Control del scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear el scroll del cuerpo cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Entradas", href: "./tickets" },
    { name: "Experiencia", href: "./" },
    { name: "Sedes", href: "#" },
    { name: "About", href: "./about" },
  ];

  // Variantes para la animación de revelación circular
  const circleVariants = {
    closed: {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    opened: {
      clipPath: "circle(150% at calc(100% - 40px) 40px)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[110] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Logo / Identidad */}
        <a href="./">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 md:gap-4 z-[120]"
          >
            <Crown size={24} className="text-amber-500" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[11px] md:text-[12px] tracking-[0.6em] uppercase font-black text-white leading-none">
                Gala Real
              </span>
              <span className="text-[7px] tracking-[0.3em] uppercase text-amber-500/60 font-bold mt-1">
                Patrimonio del Perú
              </span>
            </div>
          </motion.div>
        </a>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex gap-12 items-center">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative overflow-hidden py-1"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-zinc-400 group-hover:text-white transition-colors duration-300">
                {item.name}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>

        {/* Acciones de la Derecha */}
        <div className="flex items-center gap-4 md:gap-8 z-[120]">
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: "#f59e0b",
              color: "#000",
            }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:block border border-white/20 text-white px-6 py-2.5 text-[9px] tracking-[0.3em] uppercase font-black transition-all duration-300"
          >
            Acceso Privado
          </motion.button>

          {/* Botón Menú Mobile / Hamburguesa - Actúa como Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 text-white hover:text-amber-500 transition-colors bg-white/5 rounded-full lg:hidden relative z-[130]"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Menú Mobile con Revelación Circular */}
      <motion.div
        initial="closed"
        animate={isOpen ? "opened" : "closed"}
        variants={circleVariants}
        className="fixed inset-0 z-[105] bg-[#0a0a0a] flex flex-col items-center justify-center lg:hidden pointer-events-none data-[state=open]:pointer-events-auto"
        data-state={isOpen ? "open" : "closed"}
      >
        {/* Fondo decorativo con textura sutil */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-amber-500/10 pointer-events-none" />

        <div className="flex flex-col items-center gap-12 w-full z-10 px-8 text-center">
          {navLinks.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: isOpen ? i * 0.1 + 0.3 : 0 }}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-light tracking-[0.3em] uppercase italic text-zinc-500 hover:text-white transition-all duration-500 relative group pointer-events-auto"
            >
              <span className="relative z-10">{item.name}</span>
              <motion.span className="absolute -inset-x-4 h-full bg-amber-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-10" />
            </motion.a>
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isOpen ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full h-[1px] bg-amber-500/20 max-w-[200px]"
          />

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.8 }}
            onClick={() => setIsOpen(false)}
            className="border border-amber-500/50 text-amber-500 px-10 py-4 text-[11px] tracking-[0.5em] uppercase font-black hover:bg-amber-500 hover:text-black transition-all duration-500 pointer-events-auto"
          >
            Acreditación VIP
          </motion.button>
        </div>

        {/* Marca de agua de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Crown size={400} strokeWidth={0.5} />
        </div>
      </motion.div>
    </>
  );
};

export default GalaNavbar;
