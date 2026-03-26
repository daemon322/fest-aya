import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Zap, Users, Activity, Ticket, Flame, ShieldCheck, MousePointer2, Crown} from 'lucide-react';
import dualidad from "../../assets/flyerlow.png";
import logoayacucho from "../../assets/logoayacucho.png";
import logofenix from "../../assets/logofenix.png";
import logoquiroz from "../../assets/logoquiroz.png";
import logoruby from "../../assets/logoruby.png";
import HomeTop from '../../components/home/HomeTop';
// --- Gancho para Efecto Tilt 3D Suave (Spring Physics) ---
const useTilt = () => {
  const x = useSpring(0, { stiffness: 60, damping: 20 });
  const y = useSpring(0, { stiffness: 60, damping: 20 });

  const onMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - card.left;
    const mouseY = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    x.set((mouseY - centerY) / 18); // Inclinación más sutil
    y.set((centerX - mouseX) / 18);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { rotateX: x, rotateY: y, onMouseMove, onMouseLeave };
};

// --- Componente de Revelación con Scroll ---
const SectionReveal = ({ children, delay = 0, x = 0, y = 40, className = "" }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
// --- SECCIÓN DUALIDAD: VHS REEL DESIGN ---
const DualidadVHS = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0.1, 0.4], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  
  return (
    <section className="relative min-h-[140vh] md:min-h-[160vh] overflow-hidden py-24 px-6 md:px-0">
      <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start sticky top-24">
        
        {/* Lado Texto */}
        <div className="lg:col-span-5 z-20 select-none">
          <SectionReveal>
            <div className="inline-flex items-center gap-4 mb-6 p-2 pr-6 rounded-full">
              <div className="w-10 h-10 bg-[#FF1E1E] flex items-center justify-center rounded-full animate-pulse">
                <Flame size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Fuego en la cancha</span>
            </div>
            <h2 className="text-6xl md:text-9xl font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-xl drop-shadow-black">
              DUALIDAD <br /> <span className="text-[#ff0000] vhs-glitch drop-shadow-xl drop-shadow-black">EXTREMA</span>
            </h2>
            <div className="sm:space-y-38 space-y-9 max-w-md border-l-4 border-[#ff0000] pl-8">
               <p className="text-xl md:text-3xl font-bold leading-tight text-white/90">
                 La elegancia de la táctica <span className="text-[#FF1E1E]">femenina</span> colisiona con la potencia explosiva del juego <span className="text-[#D4AF37]">masculino</span>.
               </p>
               <div className="sm:relative grid sm:grid-cols-3 grid-cols-1 items-center justify-center w-full">
                  <div className="px-4 py-2 border-2 border-red-600/90 text-[10px] font-black tracking-widest uppercase bg-red-600 hover:bg-white hover:text-red-600 z-10 text-center">Fuerza: 100%</div>
                  <div className="px-4 py-2 border-2 border-white/90 text-[10px] font-black tracking-widest uppercase bg-white text-red-500 hover:bg-red-600 hover:text-white text-center">Expe: Pro</div>
                  <div className="px-4 py-2 border-2 border-red-600/90 text-[10px] font-black tracking-widest uppercase bg-red-600 hover:bg-white hover:text-red-600 z-10 text-center">Táctica: Elite</div>
               </div>
            </div>
          </SectionReveal>
        </div>

        {/* Lado VHS Reel */}
        <div className="lg:col-span-7 relative h-[600px] md:h-[800px] w-full mt-12 lg:mt-0">
          <div className="relative w-full h-full overflow-hidden rounded-sm">
            
            {/* Imagen 1: Masculino (Deslizándose) */}
            <motion.div 
              className="absolute inset-0 z-10 select-none"
            >
              <img 
                src={dualidad} 
                className="w-full sm:h-[900px] h-full object-content sm:object-cover transition-all duration-700"
                alt="Voley Masculino"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[15%] bg-gradient-to-t from-transparent via-transparent to-black" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
            
            {/* Barra de Glitch entre cintas */}
            <motion.div 
               style={{ y: y2 }}
               className=""
            />
          </div>
        </div>
      </div>

      <style>{`
        .vhs-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
          pointer-events: none;
        }
        @keyframes vhs-glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .vhs-glitch:hover {
          animation: vhs-glitch 0.2s infinite;
          text-shadow: 2px 0 #00fff9, -2px 0 #ff00c1;
        }
      `}</style>
    </section>
  );
};
// --- Efecto de Texto Parallax Infinito ---
const ParallaxText = ({ children, baseVelocity = 100, className = "" }) => {
  return (
    <div className={`overflow-hidden tracking-tighter leading-[0.8] whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div 
        className="font-[1000] uppercase italic text-[12vw] md:text-[8vw] flex flex-nowrap gap-12 py-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        <span>{children} </span>
        <span className="text-transparent stroke-gold opacity-50">{children} </span>
        <span>{children} </span>
        <span className="text-transparent stroke-gold opacity-50">{children} </span>
      </motion.div>
    </div>
  );
};

const ExperienceGrid = () => (
  <section className="pb-40 bg-[#080808] relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 select-none">
        {[
          { label: "Potencia Saque", value: "115", unit: "km/h", icon: <Zap className="text-[#FF1E1E]" /> },
          { label: "Ranking Regional", value: "#01", unit: "Elite", icon: <Trophy className="text-[#D4AF37]" /> },
          { label: "Equipos", value: "24", unit: "Utd", icon: <Users className="text-[#FF1E1E]" /> },
          { label: "Impacto Audiencia", value: "2k+", unit: "Live", icon: <Activity className="text-[#D4AF37]" /> }
        ].map((stat, i) => (
          <SectionReveal key={i} delay={i * 0.1} className="group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-zinc-900 rounded-lg group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-[11px] font-black text-gray-100 uppercase tracking-[0.4em]">{stat.label}</div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-8xl font-[1000] text-white italic tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors">{stat.value}</span>
              <span className="text-lg font-black text-gray-300 italic uppercase tracking-widest">{stat.unit}</span>
            </div>
          </SectionReveal>
        ))}
      </div>
    </div>
  </section>
);

const GuestCard = ({ name, role, img, delay }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
  return (
    <SectionReveal delay={delay} y={60} className="perspective-1000 h-full">
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden bg-zinc-900 aspect-[3/4.5] clip-path-hero border-b-4 border-transparent hover:border-[#D4AF37] transition-colors duration-500"
      >
        <img src={img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" alt={name}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div style={{ transform: "translateZ(30px)" }} className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-[#FF1E1E]" />
            <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.3em]">{role}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-[1000] text-white italic uppercase tracking-tighter leading-none">
            {name.split(' ')[0]} <br />
            <span className="text-[#FF1E1E]">{name.split(' ')[1]}</span>
          </h3>
        </div>
      </motion.div>
    </SectionReveal>
  );
};

const App = () => {
  const [activeZone, setActiveZone] = useState('vip');
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  const zones = {
    vip: { price: 'S/ 45', desc: 'Disfruta de la vista y comodidad a pie de cancha.', icon: <Crown /> },
    general: { price: 'S/ 30', desc: 'Vive la pasión de las barras desde la tribuna norte/occidente.', icon: <Users /> }
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[#FF1E1E] selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .stroke-text { -webkit-text-stroke: 1.5px white; }
        .stroke-gold { -webkit-text-stroke: 2.5px #ffffff; }
        .clip-slant { clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%); }
        @media (max-width: 1024px) { .clip-slant { clip-path: none; } }
        .clip-path-hero { clip-path: polygon(0 0, 100% 0, 100% 92%, 88% 100%, 0% 100%); }
        .perspective-1000 { perspective: 1000px; }      
      `}</style>

      <main>
        <HomeTop />

        {/* MARQUESINA */}
        <div className="relative z-30 py-8 bg-[#FF1E1E] -rotate-1 scale-105 select-none">
           <ParallaxText baseVelocity={-2.5}>PRESTIGIO • POTENCIA • TRADICIÓN • VÓLEY • ELITE</ParallaxText>
        </div>

        {/* SECCIÓN: DUALIDAD */}
        <DualidadVHS />

        {/* SECCIÓN: LEYENDAS */}
        <section className="py-32 md:py-60 bg-[#080808]">
          <div className="container mx-auto px-6">
            <SectionReveal className="mb-20 md:mb-32 select-none">
                <h2 className="text-7xl md:text-[10rem] font-[1000] uppercase italic tracking-tighter leading-none mb-8">
                  EL <span className="text-[#fc0000]">OLIMPO</span>
                </h2>
                <p className="text-zinc-200 font-black tracking-[0.5em] text-xs uppercase italic">EQUIPOS INVITADOS PARA ESTA OCACIÓN</p>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 select-none">
              <GuestCard name="???? ???" role="LIMA NORTE" img={logofenix} delay={0.1}/>
              <GuestCard name="???? ???" role="TEAM AYACUCHO" img={logoayacucho} delay={0.2}/>
              <GuestCard name="???? ???" role="QUIROZ" img={logoquiroz} delay={0.3}/>
              <GuestCard name="???? ???" role="LAS VILLANAS" img={logoruby} delay={0.4}/>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <ExperienceGrid />

        {/* SECCIÓN: TICKETS CON 3D SUAVE & ORO INCA */}
        <section className="py-32 md:py-60 bg-white text-black relative overflow-hidden px-6">
          <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-30 items-start">
              <div className="lg:col-span-5">
                <SectionReveal>
                  <div className="flex items-center gap-3 mb-10 select-none">
                    <ShieldCheck className="text-[#FF1E1E]" size={30} />
                    <span className="font-black uppercase tracking-[0.4em] text-[10px] md:text-xs text-black">Official Ticketing System</span>
                  </div>
                  <h2 className="text-6xl md:text-9xl font-[1000] uppercase italic tracking-tighter leading-[0.85] mb-12 select-none">
                    RESERVA <br /> <span className="text-[#FF1E1E]">TU LUGAR.</span>
                  </h2>
                  <div className="space-y-4">
                    {Object.keys(zones).map((zone) => (
                      <button 
                        key={zone}
                        onClick={() => setActiveZone(zone)}
                        className={`w-full text-left p-8 md:p-10 flex items-center justify-between border-2 transition-all duration-500 cursor-pointer ${activeZone === zone ? 'border-black bg-black text-white shadow-2xl scale-[1.03]' : 'border-zinc-100 hover:border-[#D4AF37]/30 group'}`}
                      >
                        <div className="flex items-center gap-6">
                           <div className={`w-2 h-10 md:h-12 ${activeZone === zone ? 'bg-[#FF1E1E]' : 'bg-zinc-200 group-hover:bg-[#D4AF37]'} transition-colors`} />
                           <span className="text-2xl md:text-3xl font-[1000] uppercase italic tracking-tighter">{zone}</span>
                        </div>
                        <span className={`text-2xl md:text-4xl font-[1000] ${activeZone === zone ? 'text-[#D4AF37]' : 'text-zinc-400'}`}>
                          {zones[zone].price}
                        </span>
                      </button>
                    ))}
                  </div>
                </SectionReveal>
              </div>

              <div className="lg:col-span-6 w-full perspective-1000 sm:pt-20 select-none">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeZone}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-[#0c0c0c] p-10 md:p-24 text-white clip-slant shadow-2xl border border-[#D4AF37]/20 relative w-full"
                  >
                    <div style={{ transform: "translateZ(40px)" }}>
                      <div className="flex items-center gap-4 mb-10">
                         <div className="p-3 bg-[#D4AF37] rounded-lg">
                           {React.cloneElement(zones[activeZone].icon, { size: 24, className: "text-black" })}
                         </div>
                         <span className="text-gray-100 font-black tracking-[0.5em] text-[10px] uppercase italic">EXPERIENCIA {activeZone}</span>
                      </div>
                      <h3 className="text-6xl md:text-8xl font-[1000] uppercase italic mb-10 tracking-tighter leading-none text-shadow-amber-500 text-shadow-lg">
                        ZONA <br /> <span className="text-[#FF1E1E] text-shadow-blue-500 text-shadow-lg">{activeZone}</span>
                      </h3>
                      <p className="text-zinc-300 text-xl md:text-2xl font-light mb-16 md:mb-20 leading-relaxed max-w-xl">
                        {zones[activeZone].desc}
                      </p>
                      <button className="flex flex-col sm:flex-row items-center gap-8 group w-full">
                         <div className="w-24 h-24 bg-[#FF1E1E] flex items-center justify-center rounded-full group-hover:bg-[#D4AF37] transition-all shadow-lg">
                            <Ticket size={40} className="text-white group-hover:text-black" />
                         </div>
                         <div className="text-center sm:text-left">
                           <span className="text-3xl font-black uppercase italic tracking-widest block border-b-4 border-[#FF1E1E] pb-2 group-hover:border-[#D4AF37] transition-all">RESERVAR</span>
                           <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase mt-2 block italic">STOCK MUY LIMITADO</span>
                         </div>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* CIERRE CON MARCA PATRIMONIAL */}
        <section className="py-32 md:py-60 bg-[#050505] text-center border-t border-[#D4AF37]/10 relative">
            <SectionReveal>
              <div className="mb-20 pr-5">
                <span className="text-[68px] sm:text-[240px] font-bold text-transparent stroke-gold opacity-10 uppercase tracking-tighter leading-none select-none italic">
                  AYACUCHO VÓLEY CLUB
                </span>
              </div>
              <div className="max-w-4xl mx-auto">
                <p className="text-white text-3xl md:text-5xl font-[1000] uppercase italic tracking-tighter mb-16 select-none">
                  EL DEPORTE QUE NOS <span className="text-[#FF1E1E]">UNE</span>, <br /> EL LEGADO QUE NOS <span className="text-[#D4AF37]">MUEVE</span>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-12 border-y border-[#D4AF37]/20 select-none">
                   <div className="flex flex-col">
                     <span className="text-[#FF1E1E] font-black text-xs tracking-[0.5em] mb-2 uppercase italic">Sede</span>
                     <span className="text-zinc-400 font-bold text-lg uppercase">Complejo Deportivo Capillapata</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[#D4AF37] font-black text-xs tracking-[0.5em] mb-2 uppercase italic">Fecha</span>
                     <span className="text-zinc-400 font-bold text-lg uppercase">28 MARZO 2026</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[#FF1E1E] font-black text-xs tracking-[0.5em] mb-2 uppercase italic">Nivel</span>
                     <span className="text-zinc-400 font-bold text-lg uppercase">CLASE DE LA LIGA NACIONAL</span>
                   </div>
                </div>
                <div className="mt-20 flex justify-center items-center gap-4 text-zinc-700 text-[10px] font-black uppercase tracking-[0.8em] select-none">
                   <MousePointer2 size={14} className="text-[#D4AF37]" />
                   <span className=' uppercase'>Ayacucho Vóley Club © 2026</span>
                </div>
              </div>
            </SectionReveal>
        </section>
      </main>
    </div>
  );
};

export default App;