import React, { useState, useEffect, useRef } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Globe,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Zap,
  Award,
} from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Activa un poco antes de llegar
      },
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  // Helper para las clases de animación tipo "rompecabezas"
  const getAnimClass = (direction, delay) => {
    const base = `transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${delay}`;
    if (!isVisible) {
      switch (direction) {
        case "left":
          return `${base} translate-x-[-100px] opacity-0 blur-lg`;
        case "right":
          return `${base} translate-x-[100px] opacity-0 blur-lg`;
        case "up":
          return `${base} translate-y-[100px] opacity-0 blur-lg`;
        case "down":
          return `${base} translate-y-[-100px] opacity-0 blur-lg`;
        case "scale":
          return `${base} scale-50 opacity-0 blur-lg`;
        default:
          return `${base} opacity-0`;
      }
    }
    return `${base} translate-x-0 translate-y-0 opacity-100 scale-100 blur-0`;
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050505] text-white pt-24 pb-12 overflow-hidden border-t border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Sección Superior: Logo y Stats rápidos */}
        <div
          className={`flex flex-col md:flex-row justify-between items-center mb-20 gap-8 ${getAnimClass("down", "delay-75")}`}
        >
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:rotate-12 transition-transform duration-500">
              A
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                Ayacucho<span className="text-amber-500">Fest</span>
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mt-1">
                Plataforma Oficial
              </p>
            </div>
          </div>

          <div className="flex gap-12">
            <div className="text-center">
              <p className="text-2xl font-black text-white leading-none">
                500+
              </p>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">
                Eventos
              </p>
            </div>
            <div className="text-center border-x border-white/10 px-12">
              <p className="text-2xl font-black text-white leading-none">
                100k
              </p>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">
                Usuarios
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-500 leading-none">
                24/7
              </p>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">
                Soporte
              </p>
            </div>
          </div>
        </div>

        {/* Grid Principal (El Rompecabezas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Columna 1: Info - Viene de la Izquierda */}
          <div className={getAnimClass("left", "delay-100")}>
            <h4 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[11px] mb-8 flex items-center gap-2">
              <ShieldCheck size={14} /> La Experiencia
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Redefiniendo el acceso a la cultura andina a través de tecnología
              de vanguardia y seguridad absoluta en cada ticket.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces - Viene de Arriba */}
          <div className={getAnimClass("down", "delay-200")}>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[11px] mb-8 border-l-2 border-amber-500 pl-4">
              Navegación
            </h4>
            <ul className="space-y-4">
              {[
                "Calendario 2024",
                "Mapa de Recintos",
                "Portal de Promotores",
                "Puntos de Venta",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white text-sm transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-amber-500 mr-0 group-hover:mr-3 transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal - Viene de Abajo */}
          <div className={getAnimClass("up", "delay-300")}>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[11px] mb-8 border-l-2 border-amber-500 pl-4">
              Legal & Soporte
            </h4>
            <ul className="space-y-4">
              {[
                {label: "Términos de Uso", icon: Zap, href: "/paginas/TerminoCondiciones",},
                { label: "Centro de Ayuda", icon: Mail },
                { label: "Libro de Reclamaciones", icon: Award, href:"/paginas/LibroReclamaciones" },
                { label: "Preguntas Frecuentes", icon: Globe },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-500 hover:text-white text-sm transition-all flex items-center gap-3 group"
                  >
                    <item.icon
                      size={14}
                      className="text-gray-700 group-hover:text-amber-500"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Suscripción - Viene de la Derecha */}
          <div className={getAnimClass("right", "delay-500")}>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[11px] mb-8 border-l-2 border-amber-500 pl-4">
              Newsletter
            </h4>
            <p className="text-gray-500 text-sm mb-6 italic font-light">
              Entérate antes que todos sobre la venta de entradas para la{" "}
              <span className="text-white font-bold">Semana Santa</span>.
            </p>
          </div>
        </div>

        {/* Footer Bottom: Branding y Certificaciones */}
        <div
          className={`py-12 sm:py-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10 ${getAnimClass("scale", "delay-700")}`}
        >
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4">
              AyacuchoFest &copy; 2024 — Tecnología para la Cultura
            </p>
            <div className="flex gap-6 items-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="flex items-center gap-2 border border-white/10 px-3 py-1 rounded-md">
                <CreditCard size={12} />{" "}
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  Visa
                </span>
              </div>
              <div className="flex items-center gap-2 border border-white/10 px-3 py-1 rounded-md">
                <ShieldCheck size={12} />{" "}
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  PCI DSS
                </span>
              </div>
              <div className="flex items-center gap-2 border border-white/10 px-3 py-1 rounded-md">
                <Globe size={12} />{" "}
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  SSL Secure
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              { label: "Privacidad", href: "/paginas/PrivacPoli" },
              { label: "Condiciones de Venta", href: "/" },
              { label: "Cookies", href: "/paginas/PoliticCookies" },
              { label: "Mapa del Sitio", href: "/" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Marca de agua decorativa gigante de fondo */}
      <div className="absolute -bottom-20 -right-20 pointer-events-none select-none">
        <h1 className="text-[250px] font-black text-white/[0.01] leading-none uppercase italic">
          AFEST
        </h1>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
