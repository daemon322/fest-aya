import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  Eye, 
  Lock, 
  Info, 
  MousePointerClick, 
  Clock, 
  CheckCircle2,
  XCircle,
  ChevronDown
} from 'lucide-react';

const CookieCard = ({ icon: Icon, title, description, category, type }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 hover:border-amber-500/30 transition-all duration-500 group">
    <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 md:w-7 md:h-7" />
      </div>
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
            type === 'Obligatoria' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {type}
          </span>
        </div>
        <p className="text-gray-400 leading-relaxed mb-4 text-sm md:text-base">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600">
          <span className="flex items-center gap-1.5"><Clock size={12}/> Duración: Variable</span>
          <span className="flex items-center gap-1.5"><Settings size={12}/> Categoría: {category}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans pb-20 md:pb-32">
      {/* Hero Section */}
      <header className="relative pt-20 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-amber-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8 animate-pulse">
            <Cookie size={14} /> Transparencia Digital
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 md:mb-8">
            Política de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 italic">Cookies.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed px-4">
            En AyacuchoFest valoramos tu privacidad. Esta política explica cómo y por qué utilizamos cookies para mejorar tu experiencia en nuestra plataforma.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6">
        
        {/* Intro Section */}
        <section className="mb-16 md:mb-24 p-6 md:p-10 bg-white/[0.02] border border-white/5 rounded-[30px] md:rounded-[40px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
            <Info size={120} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-4 md:mb-6 italic">¿Qué son las cookies?</h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed relative z-10 max-w-3xl">
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a recordar tus preferencias, procesar tus compras de manera segura y entender cómo interactúas con AyacuchoFest.
          </p>
        </section>

        {/* Categories Grid */}
        <div className="space-y-6 md:space-y-8">
          <CookieCard 
            icon={ShieldCheck}
            title="Cookies Necesarias"
            type="Obligatoria"
            category="Seguridad y Sesión"
            description="Son esenciales para que navegues por el sitio y uses sus funciones, como acceder a áreas seguras o procesar pagos. Sin estas cookies, los servicios que solicitas no pueden proporcionarse."
          />

          <CookieCard 
            icon={Eye}
            title="Cookies de Rendimiento"
            type="Preferencial"
            category="Análisis"
            description="Recopilan información sobre cómo usas nuestro sitio (por ejemplo, qué páginas visitas más). Estos datos son anónimos y se utilizan únicamente para mejorar el funcionamiento de la plataforma."
          />

          <CookieCard 
            icon={MousePointerClick}
            title="Cookies de Funcionalidad"
            type="Personalización"
            category="Experiencia"
            description="Permiten que el sitio recuerde las elecciones que haces (como tu nombre de usuario o la ciudad seleccionada) para ofrecerte funciones personalizadas y eventos locales en Ayacucho."
          />

          <CookieCard 
            icon={Lock}
            title="Cookies de Publicidad"
            type="Marketing"
            category="Segmentación"
            description="Se utilizan para entregarte anuncios que sean más relevantes para ti y tus intereses. También ayudan a limitar el número de veces que ves un anuncio y a medir la eficacia de las campañas."
          />
        </div>

        {/* How to Manage */}
        <section className="mt-20 md:mt-32 border-t border-white/10 pt-16 md:pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight">
                Controla tus <br className="hidden md:block" /> <span className="text-amber-500">preferencias</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-base md:text-lg">
                Puedes bloquear o eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad de la compra de entradas.
              </p>
              <div className="space-y-3">
                {['Google Chrome', 'Safari', 'Mozilla Firefox', 'Microsoft Edge'].map(browser => (
                  <div key={browser} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all cursor-pointer group">
                    <span className="font-bold text-[12px] md:text-sm uppercase tracking-widest group-hover:text-amber-500 transition-colors">{browser}</span>
                    <ChevronDown size={16} className="text-gray-700" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 md:order-2">
               <div className="aspect-square rounded-[40px] md:rounded-[60px] bg-gradient-to-br from-amber-500/20 to-amber-900/10 border border-amber-500/20 flex flex-col items-center justify-center p-8 md:p-12 text-center group overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                 <Cookie size={60} className="text-amber-500 mb-6 md:mb-8 animate-bounce md:w-20 md:h-20" />
                 <h4 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-tighter leading-none">Tu privacidad es <br/>nuestro compromiso</h4>
                 <p className="text-[10px] md:text-sm text-amber-500/60 font-medium uppercase tracking-[0.2em]">AyacuchoFest Secure Cloud</p>
               </div>
               {/* Decorative floating elements - Hidden on very small screens */}
               <div className="absolute -top-4 -right-4 w-12 h-12 md:w-20 md:h-20 bg-amber-500 rounded-2xl md:rounded-3xl rotate-12 flex items-center justify-center text-black shadow-xl hidden sm:flex">
                 <Lock className="w-6 h-6 md:w-8 md:h-8" />
               </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="mt-24 md:mt-40 text-center px-4">
          <p className="text-gray-700 text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] mb-4">
            Última actualización: Enero 2024
          </p>
          <div className="flex justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-amber-500/40 uppercase tracking-widest italic">
            <span>Privacidad</span>
            <span>•</span>
            <span>Seguridad</span>
            <span>•</span>
            <span>Cultura</span>
          </div>
        </footer>
      </main>
    </div>
  );
}