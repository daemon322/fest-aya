import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Instagram, 
  Facebook, 
  Youtube, 
  Music2, 
  MapPin, 
  Mail, 
  Phone,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const agrupaciones = [
    { name: 'Grupo 5', genre: 'Cumbia Norteña', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' },
    { name: 'Agua Marina', genre: 'Elegancia Musical', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400' },
    { name: 'Armonía 10', genre: 'La Universidad de la Cumbia', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' }
  ];

  return (
    <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Efecto de Fondo Parallax / Marquee sutil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-[0.02] pointer-events-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap text-[20rem] font-black uppercase tracking-tighter"
        >
          <span>PERÚ • LEGADO • CUMBIA • PATRIMONIO •&nbsp;</span>
          <span>PERÚ • LEGADO • CUMBIA • PATRIMONIO •&nbsp;</span>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Columna 1: Branding & Manifesto */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              <Crown className="text-amber-500" size={32} strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-xl tracking-[0.5em] font-black uppercase">Gala Real</span>
                <span className="text-[9px] tracking-[0.2em] text-amber-500/60 uppercase font-bold">Patrimonio Musical del Perú</span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light tracking-wide">
              El encuentro anual más exclusivo de la música tropical peruana. 
              Donde la tradición se encuentra con la distinción en una noche de gala inolvidable.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: '#f59e0b' }}
                  className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Columna 2: Efecto 3D - Agrupaciones Destacadas */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-amber-500">Estrellas Invitadas</h4>
            <div className="flex flex-wrap gap-4">
              {agrupaciones.map((band, i) => (
                <motion.div
                  key={band.name}
                  whileHover={{ 
                    rotateY: 15, 
                    rotateX: -10,
                    scale: 1.05,
                    z: 50
                  }}
                  style={{ perspective: 1000 }}
                  className="relative w-full sm:w-40 h-52 group cursor-pointer overflow-hidden border border-white/10 rounded-sm"
                >
                  <img src={band.img} alt={band.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{band.name}</p>
                    <p className="text-[7px] uppercase text-amber-500 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{band.genre}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Columna 3: Contacto & Protocolo */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-zinc-500">Protocolo de Acceso</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-xs font-light text-zinc-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <MapPin size={14} className="group-hover:text-black" />
                </div>
                <span>Lima, San Isidro • Sedes Privadas</span>
              </li>
              <li className="flex items-center gap-4 text-xs font-light text-zinc-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <Mail size={14} className="group-hover:text-black" />
                </div>
                <span>protocolo@galareal.pe</span>
              </li>
              <li className="flex items-center gap-4 text-xs font-light text-zinc-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <ShieldCheck size={14} className="group-hover:text-black" />
                </div>
                <span>Acreditación Digital Segura</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea Divisoria Animada */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"
        />

        {/* Footer Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-12">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-zinc-600 mb-2">Edición Limitada {currentYear}</p>
            <div className="flex gap-8 text-[9px] tracking-[0.3em] uppercase font-black text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="./terms" className="hover:text-white transition-colors">Términos VIP</a>
              <a href="#" className="hover:text-white transition-colors">Sostenibilidad</a>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-4 border border-amber-500/30 px-8 py-4 bg-amber-500/5 hover:bg-amber-500 transition-all duration-500"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-black group-hover:text-black transition-colors">Postular a Invitación</span>
            <ArrowUpRight size={16} className="group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </motion.button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[8px] tracking-[0.8em] uppercase text-zinc-700 font-bold">
            Desarrollado para la Excelencia Musical • Made in Peru
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;