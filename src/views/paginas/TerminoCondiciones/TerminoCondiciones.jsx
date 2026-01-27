import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, Info, Users, AlertTriangle, Activity, Ticket, 
  ShoppingCart, Lock, UserMinus, Copyright, MessageSquare, 
  Edit3, Gavel, Car, ArrowUp, Menu, X 
} from 'lucide-react';

const SECTIONS = [
  { id: 'about', title: '1. Sobre AyacuchoFest', icon: Info },
  { id: 'organizers', title: '2. Rol de los organizadores', icon: Users },
  { id: 'conduct', title: '3. Reglas de conducta', icon: Activity },
  { id: 'liability', title: '4. Límites de responsabilidad', icon: AlertTriangle },
  { id: 'processes', title: '5. Procesos en la plataforma', icon: ShieldCheck },
  { id: 'tickets-rules', title: '6. Reglas de tickets', icon: Ticket },
  { id: 'purchase', title: '7. Procedimiento de compra', icon: ShoppingCart },
  { id: 'safe-ticket', title: '8. Ticket Seguro', icon: Lock },
  { id: 'disaffiliation', title: '9. Desafiliación', icon: UserMinus },
  { id: 'intellectual-property', title: '10. Propiedad intelectual', icon: Copyright },
  { id: 'claims', title: '11. Reclamos y Libro', icon: MessageSquare },
  { id: 'modifications', title: '12. Modificaciones', icon: Edit3 },
  { id: 'law', title: '13. Ley aplicable', icon: Gavel },
  { id: 'parking', title: '14. Estacionamientos', icon: Car },
];

const Section = ({ title, id, children, icon: Icon }) => (
  <div id={id} className="section-block mb-24 md:mb-32 pt-10">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
        <Icon size={24} />
      </div>
      <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
        {title}
      </h2>
    </div>
    <div className="text-gray-400 text-base md:text-xl leading-relaxed space-y-6 max-w-4xl">
      {children}
    </div>
  </div>
);

export default function TerminoCondiciones() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lógica de detección de sección activa por posición
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200;
    setScrolled(window.scrollY > 300);

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) {
        const offsetTop = element.offsetTop;
        const height = element.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveId(section.id);
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500 selection:text-black">
      
      {/* --- NAVEGACIÓN MÓVIL (BOTÓN FLOTANTE) --- */}
      <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center lg:hidden pointer-events-none">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-95 transition-all border-t border-white/40"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-xs uppercase tracking-[0.2em]">Índice Legal</span>
        </button>
      </div>

      {/* --- OVERLAY MENÚ MÓVIL --- */}
      <div className={`
        fixed inset-0 z-[90] lg:hidden transition-all duration-500
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />
        <div className={`
          absolute bottom-0 left-0 right-0 bg-[#0a0a0a] rounded-t-[40px] p-8 max-h-[85vh] overflow-y-auto border-t border-amber-500/30 transition-transform duration-500
          ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-8" />
          <div className="grid grid-cols-1 gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl text-left transition-all ${
                  activeId === s.id ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                <s.icon size={18} />
                <span className="text-sm uppercase tracking-tight font-bold">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto flex">
        
        {/* --- SIDEBAR DESKTOP (STICKY) --- */}
        <aside className="hidden lg:block w-[400px] h-screen sticky top-0 border-r border-white/5 p-12 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-12 pt-10">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Documentación</h4>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-4 custom-scrollbar">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`cursor-pointer w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-left
                    ${activeId === s.id 
                      ? 'bg-amber-500 text-black font-black translate-x-2 shadow-lg shadow-amber-500/10' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <s.icon size={16} className={activeId === s.id ? 'text-black' : 'text-inherit'} />
                  <span className="text-[11px] uppercase tracking-wider">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="px-6  pt-24 md:pt-24 pb-40 overflow-hidden">
          
          {/* Header Hero */}
          <header className="mb-32 relative">
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <ShieldCheck size={14} /> Legal Center
            </div>
            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.8] mb-12">
              Términos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 italic">Globales.</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-500 max-w-2xl font-light leading-relaxed">
              El presente documento constituye el acuerdo legal entre el usuario y la plataforma <span className="text-white">AyacuchoFest</span>.
            </p>
          </header>

          <div className="space-y-10">
            <Section title="Sobre AyacuchoFest" id="about" icon={Info}>
              <p>AyacuchoFest es un sistema centralizado de gestión de eventos. Actuamos como intermediarios entre el organizador y el cliente final, proporcionando tecnología de punta para la validación de accesos.</p>
            </Section>

            <Section title="Rol de los organizadores" id="organizers" icon={Users}>
              <p>El Organizador es el único responsable de la realización del evento. AyacuchoFest no tiene injerencia en la programación, calidad del show o seguridad del recinto físico.</p>
              <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl mt-8">
                <p className="text-amber-500 font-black text-sm uppercase tracking-widest mb-4">Aviso de responsabilidad</p>
                <p className="text-sm leading-relaxed">Cualquier cambio de fecha o cancelación es responsabilidad del promotor, quien deberá gestionar las devoluciones según su propia política.</p>
              </div>
            </Section>

            <Section title="Reglas de conducta" id="conduct" icon={Activity}>
              <p>Se prohíbe terminantemente el uso de scripts, bots o cualquier método automatizado para la compra de entradas. El incumplimiento resultará en el baneo inmediato de la dirección IP y la cuenta.</p>
            </Section>

            <Section title="Límites de responsabilidad" id="liability" icon={AlertTriangle}>
              <div className="bg-red-500/5 border border-red-500/20 p-10 rounded-[40px]">
                <h4 className="text-red-400 font-black text-xl mb-6 flex items-center gap-3 italic">
                  <AlertTriangle /> EXCLUSIÓN DE DAÑOS
                </h4>
                <p className="text-lg italic leading-relaxed">"AyacuchoFest no se hace responsable por pérdidas personales, accidentes o inconvenientes derivados de la asistencia al evento."</p>
              </div>
            </Section>

            <Section title="Procesos en la plataforma" id="processes" icon={ShieldCheck}>
              <p>Cada compra genera un token único. Este token debe ser presentado en la puerta del evento para su escaneo y validación en tiempo real.</p>
            </Section>

            <Section title="Reglas de tickets" id="tickets-rules" icon={Ticket}>
              <p>Los tickets son propiedad de AyacuchoFest hasta que la transacción es confirmada. No se permite la reventa a precios superiores al valor nominal.</p>
            </Section>

            <Section title="Procedimiento de compra" id="purchase" icon={ShoppingCart}>
              <p>El usuario tiene un tiempo máximo de 10 minutos para completar su pago una vez seleccionada la entrada.</p>
            </Section>

            <Section title="Ticket Seguro" id="safe-ticket" icon={Lock}>
              <div className="p-10 bg-amber-500 text-black rounded-[40px]">
                <h4 className="text-3xl font-black mb-4 uppercase italic">Blindaje de Compra</h4>
                <p className="font-bold text-lg opacity-80">Si activaste el Ticket Seguro, podrás solicitar reembolso parcial por emergencias médicas documentadas.</p>
              </div>
            </Section>

            <Section title="Desafiliación" id="disaffiliation" icon={UserMinus}>
              <p>El usuario puede cerrar su cuenta en cualquier momento enviando un correo a soporte@ayacuchofest.com.</p>
            </Section>

            <Section title="Propiedad intelectual" id="intellectual-property" icon={Copyright}>
              <p>Todo el contenido visual, logotipos y software son propiedad intelectual exclusiva de AyacuchoFest.</p>
            </Section>

            <Section title="Reclamos y Libro" id="claims" icon={MessageSquare}>
              <p>Ponemos a disposición el Libro de Reclamaciones Virtual para cualquier discrepancia en el servicio de venta.</p>
            </Section>

            <Section title="Modificaciones" id="modifications" icon={Edit3}>
              <p>AyacuchoFest se reserva el derecho de modificar estos términos sin previo aviso.</p>
            </Section>

            <Section title="Ley aplicable" id="law" icon={Gavel}>
              <p>Este contrato se rige bajo las leyes de la República del Perú.</p>
            </Section>

            <Section title="Estacionamientos" id="parking" icon={Car}>
              <p>El servicio de parqueo es independiente. AyacuchoFest no custodia vehículos ni se responsabiliza por robos o daños.</p>
            </Section>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 sm:bottom-10 sm:right-10 right-5 z-[80] w-14 h-14 bg-white/5 border border-white/10 backdrop-blur-xl text-white rounded-2xl cursor-pointer flex items-center justify-center transition-all duration-500
          ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
          hover:bg-amber-500 hover:text-black
        `}
      >
        <ArrowUp size={24} />
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        
        .section-block {
          transition: transform 0.3s ease;
        }

        /* Corregir saltos en pantallas pequeñas */
        @media (max-width: 1024px) {
          .section-block {
            padding-top: 60px;
            margin-bottom: 60px;
          }
        }
      `}</style>
    </div>
  );
}