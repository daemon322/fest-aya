import { Link } from "react-router-dom";
import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Crown, Fingerprint, ArrowUpRight, Calendar, Sparkles,
  MapPin, Award, Music, Wine, ShieldCheck, Star, Clock,
  Users, Gem,
} from "lucide-react";

// FIX: Los archivos daniela.webp, grupmarina.webp, yaipen.webp no existían.
//      Reemplazados con assets reales del proyecto.
import imgArtist1 from "../../../assets/nataliam.webp";
import imgArtist2 from "../../../assets/fymv.webp";
import imgArtist3 from "../../../assets/ceciliat.webp";
import FestivalHero from "./FestivalHero";

// ─── Variantes ────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:   { opacity: 0, y: 40, filter: "blur(10px)" },
  visible:  { opacity: 1, y: 0,  filter: "blur(0px)",  transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1] } },
};

const artists = [
  {
    name: "GRUPO 5",
    genre: "Salsa Premium",
    description: "La orquesta más prestigiosa del Perú, con 50 años de legado musical.",
    image: imgArtist1,
    year: "1973",
    award: "Oro",
  },
  {
    name: "AGUA MARINA",
    genre: "Cumbia Clásica",
    description: "Pioneros de la cumbia peruana con más de 100 discos de oro.",
    image: imgArtist2,
    year: "1974",
    award: "Platino",
  },
  {
    name: "DANIELA DARCOURT",
    genre: "Jazz Fusión",
    description: "Voz ganadora del Grammy Latino, innovadora del jazz contemporáneo.",
    image: imgArtist3,
    year: "2015",
    award: "Latino",
  },
];

// ─── Tarjeta de Artista ───────────────────────────────────────────────────────
const ArtistCard = ({ artist, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.2, duration: 0.8 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full"
        >
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ y: isHovered ? 0 : "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-amber-500 text-xs tracking-widest">{artist.genre}</span>
              <h3 className="text-2xl font-light mt-1">{artist.name}</h3>
            </div>
            <ArrowUpRight className="text-amber-500" />
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{artist.description}</p>

          <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-amber-500" />
              <span className="text-xs text-zinc-400">{artist.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-amber-500" />
              <span className="text-xs text-zinc-400">Premio {artist.award}</span>
            </div>
          </div>
        </motion.div>

        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <Gem size={16} className="text-amber-500" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function FestivalMid() {
  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 40, damping: 30 });

  return (
    <div className="text-[#f4f4f4] font-serif bg-transparent overflow-x-hidden relative pt-10">

      {/* DETALLES DEL EVENTO */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        className="py-40 px-6 md:px-20"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: Clock,       title: "Duración Relevante",  desc: "8 horas de gala ininterrumpida con protocolo de etiqueta." },
            { icon: Users,       title: "Círculo Selecto",     desc: "Acceso limitado a 500 invitados por edición anual." },
            { icon: Music,       title: "Acústica Pura",       desc: "Ingeniería de sonido alemana diseñada para recintos históricos." },
            { icon: ShieldCheck, title: "Privacidad Total",    desc: "Zonas restringidas y seguridad perimetral de alto nivel." },
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="space-y-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-amber-500/20 rounded-full group-hover:bg-amber-500 transition-all duration-500">
                <item.icon size={20} className="text-amber-500 group-hover:text-black" />
              </div>
              <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-white">{item.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <FestivalHero />

      {/* ELENCO */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={containerVariants}
        className="py-40 px-6 md:px-20 relative z-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="mb-32 flex flex-col md:flex-row justify-between items-end gap-10">
            <div>
              <span className="text-amber-500 text-[10px] tracking-[0.6em] uppercase font-black block mb-4">
                Curaduría 2026
              </span>
              <h2 className="text-6xl md:text-9xl font-light tracking-tighter uppercase italic">
                Maestros <br />{" "}
                <span className="not-italic text-zinc-100">del Ritmo</span>
              </h2>
            </div>
            <p className="max-w-xs text-zinc-600 text-[10px] tracking-[0.2em] uppercase leading-relaxed text-right italic">
              Seleccionados por su trayectoria, impacto cultural y pureza interpretativa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist, index) => (
              <ArtistCard key={artist.name} artist={artist} delay={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOSPITALIDAD */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        className="py-40 bg-zinc-100 text-black px-6 md:px-20 relative z-50"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div variants={itemVariants} className="space-y-16">
            <div className="space-y-6">
              <span className="text-[10px] tracking-[0.5em] uppercase text-amber-600 font-black">Servicio de Guante Blanco</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic text-zinc-200">
                Experiencia <br />{" "}
                <span className="text-black not-italic">única</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { Icon: Wine,     title: "Cata de Reserva",  desc: "Selección de licores premium y maridaje peruano de autor por chefs galardonados." },
                { Icon: Star,     title: "Conserjería Real", desc: "Atención personalizada en cada Box para gestionar sus requerimientos en tiempo real." },
                { Icon: MapPin,   title: "Valet Distintivo", desc: "Acceso directo y estacionamiento privado con protocolos de máxima discreción." },
                { Icon: Sparkles, title: "Atmósfera VIP",    desc: "Mobiliario de diseñador y climatización inteligente para su total confort." },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="space-y-4">
                  <Icon size={24} className="text-amber-600" />
                  <h4 className="text-[10px] tracking-[0.3em] uppercase font-black">{title}</h4>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-10 border border-zinc-200 -z-10 group-hover:scale-105 transition-transform duration-1000" />
            {/* FIX: imagen de hospitalidad cambiada a una URL más estable de Unsplash */}
            <img
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200"
              className="w-full shadow-2xl grayscale brightness-110"
              alt="Hospitalidad"
              loading="lazy"
            />
            <div className="absolute top-10 right-10 text-white p-10 flex flex-col gap-4">
              <Award size={32} className="text-amber-500" />
              <p className="text-[8px] tracking-[0.4em] uppercase font-black">Estándar 5 Estrellas</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SEDES */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
        className="py-40 px-6 md:px-20 relative z-50"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div variants={itemVariants} className="text-center mb-32 space-y-6">
            <span className="text-amber-500 text-[10px] tracking-[0.5em] uppercase font-black">El Escenario</span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase italic">
              Recintos de{" "}
              <span className="font-black not-italic text-white">Leyenda</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {[
              {
                src:    "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1200",
                title:  "La Real Fortaleza",
                place:  "Carmen Alto",
              },
              {
                src:    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200",
                title:  "Millwa Country Club",
                place:  "Avenida Javier Heraud N°463",
              },
            ].map((venue) => (
              <motion.div
                key={venue.title}
                variants={itemVariants}
                className="relative aspect-[16/9] group overflow-hidden"
              >
                <img
                  src={venue.src}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={venue.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black flex flex-col justify-end p-12">
                  <h4 className="text-3xl font-light uppercase tracking-tighter">{venue.title}</h4>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-amber-500 font-bold mt-2">{venue.place}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ACREDITACIÓN */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
        className="h-[90vh] flex flex-col items-center justify-center relative overflow-hidden z-50"
      >
        <motion.div variants={itemVariants} className="z-10 text-center space-y-12 px-6 pb-20">
          <Fingerprint size={50} className="text-amber-500/60 mx-auto" strokeWidth={1} />
          <h2 className="text-4xl md:text-8xl font-light tracking-tighter uppercase italic max-w-4xl mx-auto leading-none">
            Sé parte del <br />{" "}
            <span className="font-black not-italic text-white">Gran Evento Anual</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/tickets">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
                className="bg-amber-600 text-white px-16 py-8 text-[11px] tracking-[0.6em] font-black uppercase rounded-sm shadow-[0_0_50px_rgba(245,158,11,0.2)] cursor-pointer"
              >
                Comprar Entrada
              </motion.button>
            </Link>

            <Link
              to="/paginas/TerminoCondiciones"
              className="text-[10px] tracking-[0.5em] uppercase font-bold text-zinc-500 border-b border-zinc-900 pb-2 hover:text-white transition-colors"
            >
              Términos y Condiciones
            </Link>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <span className="text-[40vw] font-black italic">ATHREUS</span>
        </div>
      </motion.section>

      {/* Indicador de progreso */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">
        <div className="w-[1px] h-32 bg-white/10 relative">
          <motion.div
            style={{ scaleY: smoothY }}
            className="absolute top-0 w-full h-full bg-amber-500 origin-top"
          />
        </div>
        <span className="text-[8px] tracking-[0.4em] uppercase text-zinc-700 [writing-mode:vertical-rl]">
          Prestigio
        </span>
      </div>
    </div>
  );
}
