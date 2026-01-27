import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle, 
  Send, 
  ShieldCheck,
  ClipboardList,
  ChevronRight,
  Info
} from 'lucide-react';

const InputField = ({ label, icon: Icon, type = "text", placeholder, name, required = true }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-amber-500 transition-colors">
      {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
      />
    </div>
  </div>
);

export default function ClaimsBook() {
  const [claimType, setClaimType] = useState('reclamacion'); // 'reclamacion' o 'queja'
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de envío a la base de datos
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            <ShieldCheck size={48} className="text-black" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">¡Registro Exitoso!</h2>
            <p className="text-gray-400 leading-relaxed">
              Tu hoja de reclamación ha sido registrada bajo el código <span className="text-amber-500 font-bold">#AF-2024-0892</span>. 
              Recibirás una copia en tu correo y te responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:bg-amber-500 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="relative pt-20 pb-12 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <MessageSquare size={14} /> Libro Virtual
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Hoja de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 italic">Reclamaciones.</span>
          </h1>
          <p className="text-gray-500 max-w-xl font-light leading-relaxed">
            Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, ponemos a su disposición nuestro libro virtual.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-16">
        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* SECCIÓN 1: IDENTIFICACIÓN DEL CONSUMIDOR */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/10">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">1. Identificación del Consumidor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nombre Completo" icon={User} placeholder="Ej. Juan Pérez" name="fullname" />
              <InputField label="Correo Electrónico" icon={Mail} type="email" placeholder="juan@ejemplo.com" name="email" />
              <InputField label="Teléfono / Celular" icon={Phone} type="tel" placeholder="987 654 321" name="phone" />
              <InputField label="DNI / CE / Pasaporte" icon={FileText} placeholder="Número de documento" name="id_number" />
              <div className="md:col-span-2">
                <InputField label="Domicilio" icon={MapPin} placeholder="Dirección completa" name="address" />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: DETALLES DEL SERVICIO */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/10">
                <ClipboardList size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">2. Detalle del Bien o Servicio</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Monto reclamado (S/)</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">S/</span>
                  <input type="number" step="0.01" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" placeholder="0.00" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Descripción del Bien/Servicio</p>
                <textarea 
                  rows="3"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-700 resize-none"
                  placeholder="Ej. Entrada para concierto de 'Sinfonía Ayacuchana'..."
                ></textarea>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: DETALLE DE LA RECLAMACIÓN */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/10">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">3. Detalle de la Reclamación</h2>
            </div>
            
            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
              <button 
                type="button"
                onClick={() => setClaimType('reclamacion')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${claimType === 'reclamacion' ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-white'}`}
              >
                Reclamación
              </button>
              <button 
                type="button"
                onClick={() => setClaimType('queja')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${claimType === 'queja' ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-white'}`}
              >
                Queja
              </button>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl flex gap-4 items-start">
              <Info className="text-amber-500 shrink-0" size={18} />
              <p className="text-[11px] text-gray-400 leading-relaxed uppercase tracking-wider font-medium">
                <span className="text-white font-bold">RECLAMACIÓN:</span> Disconformidad relacionada a los productos o servicios. <br/>
                <span className="text-white font-bold">QUEJA:</span> Disconformidad no relacionada a los productos o servicios; malestar o descontento respecto a la atención al público.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Detalle de la reclamación o queja</p>
                <textarea 
                  rows="6"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-700 resize-none"
                  placeholder="Describa los hechos de la manera más detallada posible..."
                ></textarea>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pedido del consumidor</p>
                <textarea 
                  rows="3"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-700 resize-none"
                  placeholder="¿Qué solución espera obtener?"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Términos y Envío */}
          <div className="pt-10 space-y-8">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-1">
                <input type="checkbox" required className="peer sr-only" />
                <div className="w-5 h-5 border-2 border-white/10 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all" />
                <ShieldCheck size={14} className="absolute inset-0 m-auto text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                Declaro ser el titular del reclamo y autorizo el tratamiento de mis datos personales para la gestión de esta solicitud conforme a la Ley N° 29733.
              </p>
            </label>

            <button 
              type="submit"
              className="w-full group relative overflow-hidden bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-amber-500 transition-colors flex items-center justify-center gap-3"
            >
              Enviar Reclamación
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            
            <p className="text-center text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">
              AyacuchoFest S.A.C. — RUC: 20601234567
            </p>
          </div>
        </form>
      </main>

      {/* Floating Info (Desktop) */}
      <div className="fixed bottom-10 left-10 hidden xl:block max-w-[240px] p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Ayuda Inmediata</h4>
        <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
          Si prefieres una atención directa, puedes comunicarte con nuestra central de ayuda.
        </p>
        <a href="tel:+5166123456" className="flex items-center gap-2 text-white font-bold text-[10px] uppercase hover:text-amber-500 transition-colors">
          <Phone size={12} /> +51 66 123456
        </a>
      </div>
    </div>
  );
}