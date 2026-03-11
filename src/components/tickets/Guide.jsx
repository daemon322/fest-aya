import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  UserCircle, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  QrCode,
  Trophy,
  Ticket,
  Zap,
  Lock,
  Info,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Mail,
  CheckCircle
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimate, setIsAnimate] = useState(false);
  const contentRef = useRef(null);

  // Efecto para manejar la animación de entrada al cambiar de pestaña
  useEffect(() => {
    setIsAnimate(false);
    const timer = setTimeout(() => setIsAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    // Scroll automático en dispositivos móviles (pantallas < 1024px)
    if (window.innerWidth < 1024 && contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const detailedSteps = [
    {
      id: "Paso 01",
      title: "Mapa Táctico 3D",
      subtitle: "Ubicación Estratégica",
      icon: <Ticket size={32} />,
      content: "Accede al mapa interactivo de última generación. Visualiza el campo desde tu ángulo preferido y selecciona las butacas disponibles en tiempo real.",
      instructions: [
        "Selecciona zonas VIP, Oriente u Occidente.",
        "Los asientos rojos son preventa exclusiva.",
        "Reserva garantizada por solo 10 minutos."
      ],
      tip: "Usa el zoom para ver la cercanía exacta al campo de juego."
    },
    {
      id: "Paso 02",
      title: "Revisión de Orden",
      subtitle: "Control de Inventario",
      icon: <ShoppingCart size={32} />,
      content: "Verifica el resumen de tu despliegue. Asegúrate de que las cantidades y sectores elegidos coincidan con tu estrategia de asistencia.",
      instructions: [
        "Confirma el total incluyendo costos de emisión.",
        "Aplica cupones de preventa autorizados.",
        "Valida los términos de permanencia en el estadio."
      ],
      tip: "Asegúrate de no tener bloqueadores de ventanas emergentes activos."
    },
    {
      id: "Paso 03",
      title: "Identificación DNI",
      subtitle: "Registro Biométrico",
      icon: <UserCircle size={32} />,
      content: "Tus entradas son nominativas e intransferibles. Vinculamos cada ticket a la identidad del titular para garantizar la seguridad del evento.",
      instructions: [
        "Nombres completos tal cual figuran en el RENIEC.",
        "DNI/CE vigente para validación en puerta.",
        "Correo electrónico corporativo o personal activo."
      ],
      tip: "El nombre en el ticket debe coincidir al 100% con tu documento físico."
    },
    {
      id: "Paso 04",
      title: "Pago y Verificación",
      subtitle: "Transacción Segura",
      icon: <CreditCard size={32} />,
      content: "Realiza el depósito mediante nuestros canales oficiales (Yape o BCP). Es imperativo que el voucher sea legible para la validación del sistema.",
      instructions: [
        "Utiliza el QR oficial de Yape de la empresa.",
        "Captura de pantalla nítida con N° de operación.",
        "Solo se aceptan depósitos de cuentas nacionales."
      ],
      tip: "Guarda el voucher físico hasta finalizar el evento deportivo."
    },
    {
      id: "Paso 05",
      title: "Despacho de Tickets",
      subtitle: "Entrega de Credenciales",
      icon: <ShieldCheck size={32} />,
      content: "Una vez validado tu pago, el sistema generará tus códigos QR de alta seguridad y los enviará automáticamente a tu bandeja.",
      instructions: [
        "Revisa tu bandeja de entrada y carpeta 'Promociones'.",
        "Descarga el PDF en tu dispositivo móvil.",
        "No compartas fotos del QR en redes antes del evento."
      ],
      tip: "Ajusta el brillo de tu celular al máximo al ingresar al estadio."
    }
  ];

  return (
    <div className="min-h-screen text-white font-sans selection:bg-red-600">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative">
        
        {/* Header - Diseño Impactante */}
        <header className="mb-12 md:mb-20 select-none w-full">
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left duration-700">
            <div className="h-px w-12 bg-red-600" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white">Proceso de Venta Oficial 2026</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 animate-in fade-in slide-in-from-bottom duration-1000 w-full">
            Consigue tu <br />
            <span className="text-red-600 ">Entrada VIP</span>
          </h1>
          <p className="max-w-xl text-gray-100 text-sm md:text-base font-medium leading-relaxed border-l border-red-600 pl-6">
            Guía optimizada para hinchas y espectadores. Sigue los parámetros para asegurar tu lugar en la gran final nacional.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* Navegación - Botones Estilo Tablero */}
          <nav className="lg:col-span-4 flex flex-col gap-3">
            {detailedSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 text-left cursor-pointer backdrop-blur-2xl ${
                  activeTab === index 
                  ? 'bg-amber-300 border-red-600/50 shadow-[0_20px_40px_rgba(220,38,38,0.1)]' 
                  : 'bg-zinc-900/20 border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Indicador lateral activo */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-red-600 transition-transform duration-500 ${activeTab === index ? 'scale-y-100' : 'scale-y-0'}`} />
                
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === index ? 'text-red-500' : 'text-gray-50'}`}>
                    {step.id}
                  </span>
                  <ChevronRight size={14} className={`transition-all duration-300 ${activeTab === index ? 'translate-x-0 opacity-100 text-red-600' : '-translate-x-4 opacity-0'}`} />
                </div>
                <h3 className={`text-base font-black uppercase italic transition-colors ${activeTab === index ? 'text-white' : 'text-gray-50'}`}>
                  {step.title}
                </h3>
              </button>
            ))}

            {/* Banner Ayuda */}
            <div className="mt-6 p-6 hidden lg:block select-none backdrop-blur-lg">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <AlertTriangle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Atención al Cliente</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-bold uppercase mb-4">
                ¿Tienes dudas sobre el proceso? Nuestro equipo está listo para asistirte en tiempo real.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-red-600 transition-colors flex items-center gap-2">
                Abrir Soporte <ExternalLink size={12} />
              </button>
            </div>
          </nav>

          {/* Contenedor de Detalles con Scroll Ref */}
          <main 
            ref={contentRef}
            className="lg:col-span-8 scroll-mt-6 select-none"
          >
            <div className={`min-h-[500px] p-8 md:p-14 backdrop-blur-3xl rounded-2xl transition-all duration-700 ${isAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              {/* Cabecera del Contenido */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center text-red-600 shadow-2xl shadow-red-600/20">
                    {detailedSteps[activeTab].icon}
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-1">
                      {detailedSteps[activeTab].title}
                    </h2>
                    <p className="text-amber-300 text-[14px] md:text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <Zap size={12} className="fill-current" /> {detailedSteps[activeTab].subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cuerpo del Contenido */}
              <div className="space-y-10">
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-red-600/30 rounded-full" />
                  <p className="text-gray-50 text-lg md:text-xl leading-relaxed font-medium italic">
                    "{detailedSteps[activeTab].content}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-50">
                      <FileText size={16} className="text-red-600" />
                      Hoja de Ruta
                    </h4>
                    <ul className="space-y-4">
                      {detailedSteps[activeTab].instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span className="text-sm text-gray-100 font-bold uppercase leading-snug">
                            {inst}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] relative group overflow-hidden">
                      <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <Info size={100} />
                      </div>
                      <div className="relative z-10">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Consejo Profesional</h5>
                        <p className="text-xs text-white font-black uppercase leading-relaxed italic">
                          {detailedSteps[activeTab].tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Sección de Canales Bancarios - Mejorada */}
        <section className="mt-24 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Panel Principal de Pagos */}
            <div className="lg:col-span-2 p-8 md:p-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Liquidación Oficial</h2>
                    <p className="text-xs font-bold text-gray-200 uppercase tracking-widest">Cuentas autorizadas por la federación</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
                    <Lock size={14} className="text-red-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Encriptado SSL 256-bit</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 group cursor-default">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                      <QrCode className="text-purple-600" />
                    </div>
                    <p className="text-[14px] font-black text-gray-200 uppercase tracking-widest mb-1">App de Pago</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">Yape / Plin</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all duration-300 group cursor-default">
                    <div className="w-12 h-12 bg-[#ff6b00] rounded-2xl flex items-center justify-center mb-6 shadow-xl text-white">
                      <CreditCard />
                    </div>
                    <p className="text-[14px] font-black text-gray-200 uppercase tracking-widest mb-1">Banco de Crédito</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">BCP Soles</p>
                  </div>
               </div>
            </div>

            {/* Módulo de Validación de Tickets */}
            <div className="bg-red-600 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                  <Mail size={120} />
               </div>
               
               <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6 leading-none">Despacho de <br />Credenciales</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-bold uppercase">Validación en 45 min</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-bold uppercase">PDF con QR Dinámico</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-bold uppercase">Entrada de un solo uso</span>
                    </div>
                  </div>
               </div>

               <div className="relative z-10 mt-10">
                  <p className="text-[10px] font-black uppercase leading-tight text-red-100">
                    El sistema detecta automáticamente tu pago. Si el voucher es válido, el envío es inmediato.
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* FAQ - Acordeón Estilizado */}
        <section className="mt-24 select-none">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-gray-100 mb-4 italic">Zona de Ayuda</h2>
            <div className="h-1 w-12 bg-red-600 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "¿Qué documento necesito?", a: "Para nacionales DNI vigente, para extranjeros Pasaporte o Carné de Extranjería físico." },
              { q: "¿Puedo comprar entradas VIP?", a: "Sujeto a disponibilidad en el mapa. Solo se permiten 4 entradas por cada número de DNI registrado." }
            ].map((item, i) => (
              <div key={i} className="p-8 transition-all">
                <h5 className="font-black uppercase italic text-sm mb-4 text-white flex items-center gap-3">
                  <HelpCircle size={16} className="text-red-600" />
                  {item.q}
                </h5>
                <p className="text-xs text-gray-200 leading-relaxed font-bold uppercase tracking-wide">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer - Branding Pro */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 select-none">
          <div className="flex flex-col items-center md:items-start">
             <div className="flex items-center gap-4 mb-2">
                <Trophy size={20} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Evento Oficial Perú 2026</span>
             </div>
             <p className="text-[9px] text-zinc-700 font-bold uppercase">Gestionado por Sports Events Corp. Todos los derechos reservados.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
             <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95">
               <Smartphone size={16} />
               WhatsApp Oficial
             </button>
             <button className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-full font-black uppercase italic text-[10px] tracking-widest hover:bg-white/5 transition-all">
               <ExternalLink size={16} />
               Términos Legales
             </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;