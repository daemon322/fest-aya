import { 
  Shield, 
  Lock, 
  UserCheck, 
  Eye, 
  FileText, 
  Globe, 
  Mail, 
  Database,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const PrivacySection = ({ icon: Icon, title, children }) => (
  <div className="group space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
        <Icon size={20} className="md:w-6 md:h-6" />
      </div>
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight italic text-white">
        {title}
      </h2>
    </div>
    <div className="pl-0 md:pl-16 text-gray-400 leading-relaxed text-sm md:text-base space-y-4">
      {children}
    </div>
  </div>
);

export default function PrivacPoli() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-amber-500 selection:text-black">
      {/* Hero Header */}
      <header className="relative pt-24 pb-16 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Lock size={14} /> Seguridad de Datos
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8">
            Privacidad <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 italic">Absoluta.</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Tu confianza es nuestro activo más valioso. En AyacuchoFest, protegemos tus datos con los más altos estándares de cifrado y transparencia.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-20 md:space-y-32 py-10">
        
        {/* Intro Card */}
        <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[40px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={150} />
          </div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed relative z-10 font-light">
            AyacuchoFest S.A.C. respeta la legislación vigente sobre <span className="text-white font-bold italic underline decoration-amber-500/50">Protección de Datos Personales (Ley N° 29733)</span>. Esta política detalla cómo recolectamos, usamos y resguardamos tu información.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="space-y-16 md:space-y-24">
          <PrivacySection icon={Database} title="Información que Recolectamos">
            <p>Recopilamos datos necesarios para garantizar tu acceso a los eventos:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Datos de identidad (Nombre, DNI)',
                'Información de contacto (Email, Teléfono)',
                'Datos de pago (Cifrados mediante PCI DSS)',
                'Preferencias culturales y ubicación'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <ChevronRight size={14} className="text-amber-500" />
                  <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{item}</span>
                </li>
              ))}
            </ul>
          </PrivacySection>

          <PrivacySection icon={Eye} title="Uso de la Información">
            <p>Tus datos nos permiten personalizar tu experiencia en AyacuchoFest:</p>
            <div className="space-y-4">
              <p>• Procesar y enviar tus entradas digitales de forma segura.</p>
              <p>• Enviarte alertas sobre cambios de horario o reprogramación de eventos.</p>
              <p>• Prevenir fraudes y garantizar la seguridad en los recintos.</p>
            </div>
          </PrivacySection>

          <PrivacySection icon={UserCheck} title="Tus Derechos ARCO">
            <p>Tienes el control total. Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición en cualquier momento:</p>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              <div className="flex-1 p-6 bg-amber-500 text-black rounded-3xl">
                <h4 className="font-black uppercase text-sm mb-2 tracking-tighter">Vía Digital</h4>
                <p className="text-xs font-bold opacity-80 mb-4 tracking-tight">Atención inmediata para solicitudes de datos.</p>
                <div className="flex items-center gap-2 font-black text-xs uppercase underline">
                  <Mail size={14} /> privacidad@ayacuchofest.com
                </div>
              </div>
              <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <h4 className="font-black uppercase text-sm mb-2 tracking-tighter text-white">Vía Presencial</h4>
                <p className="text-xs text-gray-500 mb-4 tracking-tight">Visítanos en nuestras oficinas centrales en Ayacucho.</p>
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Jr. Asamblea 123, Huamanga</span>
              </div>
            </div>
          </PrivacySection>

          <PrivacySection icon={ShieldAlert} title="Seguridad del Sitio">
            <p>Implementamos capas de seguridad de grado militar para proteger cada transacción. Utilizamos certificados SSL de validación extendida y no almacenamos tus números de tarjeta íntegros en nuestros servidores locales.</p>
          </PrivacySection>
        </div>

        {/* Final Disclaimer */}
        <footer className="pt-20 border-t border-white/5 text-center space-y-8">
          <div className="flex justify-center gap-12 grayscale opacity-40">
            <Globe size={32} />
            <Lock size={32} />
            <Shield size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.8em]">
              Vigencia desde Enero 2024
            </p>
            <p className="text-[9px] text-amber-500/40 font-bold uppercase tracking-[0.4em]">
              AyacuchoFest — Elevando la cultura con seguridad
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Action (Mobile optimized) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 md:w-16 md:h-16 bg-amber-500 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-110 transition-transform">
          <FileText size={24} />
        </button>
      </div>
    </div>
  );
}