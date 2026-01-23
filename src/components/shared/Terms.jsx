import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ChevronDown, FileText, Lock, Scale, UserCheck } from 'lucide-react';

const Terms = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "Protocolo de Admisión",
      icon: UserCheck,
      content: "La entrada a Gala Real es estrictamente nominal e intransferible. Cada ticket incluye un identificador biométrico único. La organización se reserva el derecho de admisión basado en el cumplimiento del código de vestimenta (Gala/Black Tie) y la validación de la invitación previa."
    },
    {
      title: "Derechos de Imagen",
      icon: FileText,
      content: "Al ingresar al recinto, los asistentes consienten ser filmados o fotografiados como parte del material documental del evento. Queda estrictamente prohibido el uso de cámaras profesionales o dispositivos de grabación de audio sin acreditación de prensa previa."
    },
    {
      title: "Seguridad y Privacidad",
      icon: Lock,
      content: "Implementamos protocolos de seguridad de grado diplomático. Todos los datos recolectados para la acreditación están protegidos bajo estándares internacionales de encriptación. No se permite el reingreso una vez abandonado el perímetro de seguridad del evento."
    },
    {
      title: "Política de Cancelación",
      icon: ShieldAlert,
      content: "Debido a la naturaleza exclusiva y limitada del evento, no se realizan reembolsos. En caso de postergación por fuerza mayor, el ticket mantendrá su validez para la fecha reprogramada o podrá ser acreditado para la edición del año siguiente."
    },
    {
      title: "Jurisdicción y Legalidad",
      icon: Scale,
      content: "Cualquier controversia derivada de la interpretación de estos términos será resuelta bajo la jurisdicción de los tribunales de Lima, Perú, renunciando a cualquier otro fuero que pudiera corresponder por domicilio presente o futuro."
    }
  ];

  return (
    <section className="relative bg-[#050505] text-white py-32 md:py-48 overflow-hidden min-h-screen">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Cabecera del Componente */}
          <div className="mb-24 space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-amber-500 text-[10px] tracking-[1em] uppercase font-black block"
            >
              Marco Legal
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic"
            >
              Términos de <br /> <span className="not-italic font-black text-zinc-300">EXCLUSIVIDAD</span>
            </motion.h2>
            <div className="w-20 h-[1px] bg-amber-500/50" />
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-medium">
              Última actualización: Enero 2025 • Lima, Perú
            </p>
          </div>

          {/* Acordeón de Términos */}
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden"
              >
                <button 
                  onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                  className="w-full p-8 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-amber-500/30 text-xs font-mono">0{idx + 1}</span>
                    <section.icon size={20} className="text-amber-500" strokeWidth={1.5} />
                    <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em]">{section.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: activeSection === idx ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ChevronDown size={20} className="text-zinc-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeSection === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-8 pt-2 ml-14 max-w-2xl">
                        <p className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide italic">
                          {section.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Footer del Documento */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 p-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center">
                <Lock size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Certificación de Cumplimiento</p>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500">Protocolo Real v.2.5</p>
              </div>
            </div>
            
            <button className="text-[10px] tracking-[0.4em] uppercase font-black text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 pb-1">
              Descargar PDF Oficial
            </button>
          </motion.div>
        </div>
      </div>

      {/* Marca de agua lateral */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 rotate-90 opacity-[0.02] pointer-events-none">
        <span className="text-[15rem] font-black uppercase tracking-tighter">LEGAL</span>
      </div>
    </section>
  );
};

export default Terms;