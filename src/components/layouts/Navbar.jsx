import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Menu, X } from "lucide-react";
import ayacucho from "../../assets/logoc.png";

const GalaNavbar = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Entradas", href: "/voley-al-limite" },
    { name: "Carrito", href: "/carrito" },
    { name: "Ubicación", href: "/location"} ,
    { name: "About", href: "/about" },
  ];

  const circleVariants = {
    closed: {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    opened: {
      clipPath: "circle(150% at calc(100% - 40px) 40px)",
      transition: { type: "spring", stiffness: 20, restDelta: 2 },
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[1200] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="/" aria-label="Ir al inicio">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 md:gap-4 z-[120]"
          >
            <img src={ayacucho} alt="" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-[11px] md:text-[12px] tracking-[0.6em] uppercase font-black text-white leading-none">
                AVC
              </span>
              <span className="text-[7px] tracking-[0.3em] uppercase text-cyan-500/90 font-bold mt-1">
                Ayacucho Vóley Club
              </span>
            </div>
          </motion.div>
        </a>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex gap-12 items-center" aria-label="Menú principal">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative overflow-hidden py-1"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
                {item.name}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="flex sm:hidden items-center gap-4 md:gap-8 z-[120]">

          {/* Hamburguesa — FIX: pointer-events se manejan correctamente ahora */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 text-white hover:text-amber-500 transition-colors bg-white/5 rounded-full lg:hidden relative z-[1300]"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate:  90, opacity: 0 }}
                  animate={{ rotate:   0, opacity: 1 }}
                  exit={{   rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Menú Mobile — FIX: pointer-events condicionales en lugar de data-state  */}
      <motion.div
        initial="closed"
        animate={isOpen ? "opened" : "closed"}
        variants={circleVariants}
        className={`fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center lg:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <nav
          className="flex flex-col items-center gap-12 w-full z-10 px-8 text-center"
          aria-label="Menú mobile"
        >
          {navLinks.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: isOpen ? i * 0.1 + 0.3 : 0 }}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-light tracking-[0.3em] uppercase italic text-zinc-500 hover:text-white transition-all duration-500 relative group"
            >
              <span className="relative z-10">{item.name}</span>
              <motion.span className="absolute -inset-x-4 h-full bg-amber-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-10 rounded" />
            </motion.a>
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isOpen ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full h-[1px] bg-amber-500/20 max-w-[200px]"
          />
        </nav>
      </motion.div>
    </>
  );
};

export default GalaNavbar;
