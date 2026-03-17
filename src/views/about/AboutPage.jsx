import React from 'react';
import { Users, Target, ShieldCheck, Heart, Zap, MapPin, Calendar, Mail, Facebook, Instagram } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section with Modern Gradient & Mesh Background */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Pasión por el Deporte</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
            Ayacucho <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Vóley Club</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
            Impulsando el talento local y creando experiencias deportivas de alto nivel en el corazón de Ayacucho.
          </p>
        </div>
      </section>

      {/* Empresa Detrás del Evento */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-50 rounded-2xl -z-10" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2">Nuestra Historia</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                MULTISERVICIOS KASURI E.I.R.L
              </h3>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  Nacimos en Ayacucho con una visión clara: ofrecer soluciones integrales con un sello de calidad indiscutible. Nuestra trayectoria nos ha permitido ser parte del crecimiento de nuestra comunidad.
                </p>
                <p>
                  Hoy, damos un paso audaz hacia el deporte con <span className="font-semibold text-slate-900">"¡Vóley al Límite, sin filtros en la cancha!"</span>. No es solo un torneo; es una plataforma para la integración, el respeto y la máxima competencia.
                </p>
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent z-10" />
                <div className="flex items-center justify-center h-full text-slate-400 italic group-hover:scale-105 transition-transform duration-500">
                  [Imagen de Acción de Vóley]
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Valores - Modern Cards */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
                <p className="text-slate-600 leading-relaxed">
                  Elevar el estándar de los eventos deportivos regionales, inspirando a nuevas generaciones a través de la transparencia y la excelencia operativa.
                </p>
              </div>
            </div>

            {/* Valores */}
            <div className="md:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
               <h3 className="text-2xl font-bold mb-8">Nuestros Pilares</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: ShieldCheck, title: "Integridad", desc: "Transparencia absoluta en cada proceso." },
                   { icon: Heart, title: "Pasión", desc: "Amamos el deporte tanto como tú." },
                   { icon: Users, title: "Comunidad", desc: "Uniendo familias ayacuchanas." },
                   { icon: Zap, title: "Innovación", desc: "Mejora continua en cada evento." }
                 ].map((item, idx) => (
                   <div key={idx} className="flex space-x-4">
                     <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                       <item.icon className="w-5 h-5 text-indigo-400" />
                     </div>
                     <div>
                       <h4 className="font-semibold">{item.title}</h4>
                       <p className="text-sm text-slate-400">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Liderazgo Estratégico</h2>
            <p className="mt-4 text-slate-600">El equipo visionario detrás de la organización.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { name: "Henry Escalante R.", role: "Director General" },
              { name: "Deiby Escalante P.", role: "Coordinador de Eventos" },
              { name: "Dilmark Escalante", role: "Responsable de Logística" }
            ].map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-48 h-48 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 transition-all duration-300 group-hover:ring-indigo-100 flex items-center justify-center">
                    <Users className="w-20 h-20 text-slate-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                <p className="text-indigo-500 font-medium text-sm uppercase tracking-wide">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlight - Modern Bento Style */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-900 to-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 flex flex-col justify-center">
              <h2 className="text-white text-4xl font-bold mb-6 italic tracking-tight leading-tight">
                "Vóley al Límite, <br/>sin filtros en la cancha"
              </h2>
              <div className="space-y-6 text-slate-300 mb-10">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>28 de Marzo - 9:00 AM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <span>Complejo Deportivo Capillapata</span>
                </div>
                <p className="text-lg leading-relaxed">
                  Una competencia sin precedentes con categorías Trans, Femenina y Masculina. 
                  Un festival deportivo con shows artísticos y premios exclusivos.
                </p>
              </div>
              <button className="w-fit bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25">
                Comprar Entradas Ahora
              </button>
            </div>
            <div className="bg-slate-800/50 flex items-center justify-center p-12 border-l border-white/5">
                <div className="text-white/20 font-black text-8xl rotate-12 select-none uppercase">
                   Voley<br/>Club
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Tienes alguna duda?</h2>
          <p className="text-slate-600 mb-12">Estamos listos para escucharte y apoyarte.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 select-none">
            <span className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <Mail className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">antreus28d@gmail.com</span>
            </span>
          </div>

          <div className="flex justify-center space-x-4">
             <a href="https://www.facebook.com/AYACUCHOVOLEYCLUB/?locale=es_LA" className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors shadow-lg">
               <Facebook className="w-5 h-5" />
             </a>
             <a href="#" className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-pink-600 transition-colors shadow-lg">
               <Instagram className="w-5 h-5" />
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
}