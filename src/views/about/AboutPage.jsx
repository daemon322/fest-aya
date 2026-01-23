import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShieldCheck, Music2, Quote, Trophy, Users } from 'lucide-react';

const GalaAbout = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Efectos de Parallax avanzados
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scaleImage = useTransform(scrollYProgress, [0.2, 0.5], [1.2, 1]);
  const rotateImg = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section ref={containerRef} className="relative bg-[#050505] text-white py-40 md:py-72 overflow-hidden">
      
      {/* CAPA DE TEXTURA Y PROFUNDIDAD */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent z-10" />

      {/* TITULAR DE FONDO CINEMÁTICO */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 left-0 w-full select-none pointer-events-none opacity-[0.03] whitespace-nowrap"
      >
        <h2 className="text-[35vw] font-black uppercase tracking-tighter leading-none">
          PERÚ PRESTIGIO
        </h2>
      </motion.div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* BLOQUE IZQUIERDO: COMPOSICIÓN VISUAL ASIMÉTRICA */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="relative group">
              <motion.div 
                style={{ scale: scaleImage, rotate: rotateImg }}
                className="relative aspect-[3/4] overflow-hidden rounded-sm border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200" 
                  alt="Maestría Musical" 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
              </motion.div>

              {/* Elementos Flotantes de Información */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute -bottom-12 -right-8 bg-amber-500 p-10 text-black shadow-2xl z-30 flex flex-col gap-2"
              >
                <Trophy size={24} strokeWidth={2} />
                <span className="text-[9px] tracking-[0.4em] font-black uppercase">Excelencia</span>
                <p className="text-4xl font-serif italic font-light leading-none">V Edición</p>
              </motion.div>

              <div className="absolute -top-10 -left-10 w-40 h-40 border border-amber-500/20 rounded-full animate-spin-slow pointer-events-none" />
            </div>
          </div>

          {/* BLOQUE DERECHO: NARRATIVA EDITORIAL */}
          <div className="lg:col-span-7 pt-20 lg:pt-0">
            <div className="max-w-2xl ml-auto" ref={textRef}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
              >
                <span className="inline-block px-4 py-1 border border-amber-500/50 text-amber-500 text-[10px] tracking-[0.8em] uppercase font-black mb-10">
                  El Manifiesto
                </span>
                
                <h2 className="text-6xl md:text-[9rem] font-light leading-[0.85] tracking-tighter uppercase mb-12">
                  UNA <span className="italic font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-200">ODISEA</span> <br /> 
                  TROPICAL
                </h2>

                <div className="relative mb-20">
                  <Quote className="absolute -top-6 -left-8 text-amber-500/20" size={60} />
                  <p className="text-2xl md:text-3xl text-zinc-300 font-light leading-snug tracking-tight">
                    "La cumbia es el pulso de una nación. En Gala Real, esa pulsación se transforma en arte puro, en una ceremonia donde el <span className="text-white font-bold italic">lujo</span> y la <span className="text-white font-bold italic">identidad</span> convergen."
                  </p>
                </div>

                {/* Grid de Atributos con Hover Dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pb-20 border-b border-white/10">
                  {[
                    { icon: ShieldCheck, title: "Curaduría Real", desc: "Seleccionamos minuciosamente a los exponentes que han definido la historia sonora del Perú." },
                    { icon: Music2, title: "Acústica Noble", desc: "Ingeniería de sonido diseñada para teatros de ópera aplicada a la potencia de la orquesta tropical." },
                    { icon: Users, title: "Círculo Privado", desc: "Una audiencia selecta que comparte la misma pasión por la excelencia y el respeto al legado." },
                    { icon: Star, title: "Inmortalidad", desc: "Creamos momentos que trascienden el espectáculo para convertirse en memorias colectivas." }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="group flex flex-col gap-4"
                    >
                      <item.icon className="text-amber-500 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
                      <h4 className="text-[11px] tracking-[0.4em] font-black uppercase text-zinc-200 group-hover:text-amber-500 transition-colors">{item.title}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-light">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Acción de Cierre */}
                <div className="mt-20 flex flex-col sm:flex-row items-start sm:items-center gap-12">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group overflow-hidden bg-white text-black px-12 py-6 rounded-full"
                  >
                    <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 text-[10px] tracking-[0.4em] font-black uppercase">Unirse a la Gala</span>
                  </motion.button>
                  
                  <div className="flex flex-col">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-1">Admisión por</span>
                    <span className="text-sm font-black uppercase tracking-[0.2em] border-b border-amber-500/50 pb-1">Invitación Exclusiva</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ELEMENTO DECORATIVO DE CIERRE */}
      <div className="absolute bottom-20 right-20 flex items-center gap-6 opacity-20">
        <div className="w-40 h-[1px] bg-zinc-800" />
        <span className="text-[10px] tracking-[1em] uppercase font-black rotate-90 origin-right">Legacy</span>
      </div>
    </section>
  );
};

const Star = ({ className, size, strokeWidth }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default GalaAbout;