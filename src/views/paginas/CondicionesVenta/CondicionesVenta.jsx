import React, { useState } from 'react';
import { 
  FileText, 
  ShoppingBag, 
  CreditCard, 
  Ticket, 
  RefreshCcw, 
  UserCheck, 
  ShieldAlert, 
  Headphones, 
  Gavel, 
  ChevronRight, 
  Calendar, 
  Building, 
  Scale, 
  Info, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

export default function CondicionesVenta() {
  const [activeSection, setActiveSection] = useState('objeto');

  const sections = [
    { id: 'objeto', icon: FileText, title: '1. Objeto del Contrato' },
    { id: 'proceso', icon: ShoppingBag, title: '2. Proceso de Adquisición' },
    { id: 'precios', icon: Calendar, title: '3. Tarifas y Comisiones' },
    { id: 'pagos', icon: CreditCard, title: '4. Pasarelas de Pago' },
    { id: 'entrega', icon: Ticket, title: '5. Títulos y Comprobantes' },
    { id: 'cambios', icon: RefreshCcw, title: '6. Derecho de Desistimiento' },
    { id: 'ingreso', icon: UserCheck, title: '7. Protocolos de Acceso' },
    { id: 'restricciones', icon: ShieldAlert, title: '8. Prohibiciones' },
    { id: 'soporte', icon: Headphones, title: '9. Reclamaciones' },
    { id: 'legal', icon: Gavel, title: '10. Jurisdicción' },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Ajuste de scroll para compensar posibles navbars pegajosos
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Encabezado Legal Tipo Membrete con Fondo Oscuro */}
      <div className="bg-black text-white pt-24 pb-16 px-4 md:px-8 border-b-8 border-gray-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-200 uppercase tracking-[0.3em] text-xs font-black">
              <Scale className="w-5 h-5" />
              <span>Documento Normativo Oficial</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Condiciones <br className="hidden md:block" /> de Venta
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-full md:w-auto">
            <div className="flex items-center space-x-3 mb-3 text-white">
              <Building className="w-5 h-5" />
              <span className="font-bold text-sm tracking-tight uppercase">MULTISERVICIOS KASURI E.I.R.L</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1 font-medium">
              <p className="flex justify-between"><span>RUC:</span> <span className="text-slate-200">20574793379</span></p>
              <p className="flex justify-between gap-8"><span>Domicilio:</span> <span className="text-slate-200">Ayacucho, Perú</span></p>
              <p className="flex justify-between"><span>Evento:</span> <span className="text-slate-200 uppercase">Vóley al Límite</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Índice de Navegación (Sticky) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-25 bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Contenido del Contrato</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeSection === section.id 
                        ? 'bg-white text-indigo-700 shadow-md border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`text-[10px] font-mono mr-3 ${activeSection === section.id ? 'text-indigo-600 font-bold' : 'text-slate-300'}`}>
                        {section.id.toUpperCase()}
                      </span>
                      <span className="text-sm font-bold">{section.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Cuerpo Normativo */}
          <div className="lg:col-span-8 space-y-20 pb-24">
            
            {/* Aviso INDECOPI / Consumidor */}
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-8 rounded-r-3xl">
              <div className="flex space-x-5">
                <Info className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                  Este documento se rige bajo el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong> y demás normas concordantes del Estado Peruano. Al realizar una compra, usted declara haber leído y aceptado cada cláusula aquí expuesta.
                </p>
              </div>
            </div>

            {/* Secciones */}
            <section id="objeto" className="scroll-mt-12">
              <h2 className="text-3xl font-black mb-6 text-slate-900 flex items-baseline tracking-tight">
                <span className="text-indigo-600 mr-4 text-xl font-mono opacity-50">01.</span>
                Objeto del Contrato
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                <p>
                  El presente contrato tiene por objeto regular los términos y condiciones de la venta de entradas para el evento deportivo <strong>“¡Vóley al Límite, sin filtros en la cancha!”</strong>.
                </p>
                <p className="text-base">
                  MULTISERVICIOS KASURI E.I.R.L (en adelante "La Empresa") actúa como organizador y único responsable legal del evento, utilizando sistemas tecnológicos de terceros exclusivamente como canal de venta y gestión de tickets.
                </p>
              </div>
            </section>

            <section id="proceso" className="scroll-mt-12">
              <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-baseline tracking-tight">
                <span className="text-indigo-600 mr-4 text-xl font-mono opacity-50">02.</span>
                Proceso de Adquisición
              </h2>
              <div className="grid gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-inner transition-all">
                  <h4 className="font-bold mb-3 text-slate-900 text-xl">Identificación Obligatoria</h4>
                  <p className="text-slate-500 leading-relaxed">Es obligación estricta del cliente proporcionar datos de identidad exactos. En cumplimiento con la <strong>Ley N° 30037</strong> (Ley que previene la violencia en espectáculos deportivos), cada entrada debe estar vinculada obligatoriamente a un DNI o Carnet de Extranjería vigente.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-inner transition-all">
                  <h4 className="font-bold mb-3 text-slate-900 text-xl">Perfeccionamiento del Contrato</h4>
                  <p className="text-slate-500 leading-relaxed">La compra se considera perfeccionada y el contrato celebrado únicamente tras la recepción del correo de confirmación y el cargo efectivo en la cuenta del usuario.</p>
                </div>
              </div>
            </section>

            <section id="cambios" className="scroll-mt-12">
              <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-baseline tracking-tight">
                <span className="text-indigo-600 mr-4 text-xl font-mono opacity-50">06.</span>
                Cambios y Devoluciones
              </h2>
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <ShieldAlert className="absolute top-[-40px] right-[-40px] w-64 h-64 text-white/5 -rotate-12" />
                <h4 className="text-amber-400 font-bold mb-6 uppercase tracking-widest text-xs">Advertencia Legal Importante</h4>
                <p className="text-indigo-100 leading-relaxed mb-8 text-lg">
                  Conforme al <strong>Art. 52.2 de la Ley 29571</strong>, el derecho a desistimiento unilateral no aplica en contratos de prestación de servicios para espectáculos públicos con fecha determinada.
                </p>
                <ul className="space-y-6">
                  {[
                    "No se aceptan cancelaciones ni devoluciones por voluntad del cliente tras la confirmación.",
                    "Los reembolsos solo proceden en caso de cancelación definitiva del evento por parte del organizador.",
                    "En situaciones de fuerza mayor o postergación, el ticket mantiene su validez para la nueva fecha programada."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 shrink-0" />
                      <span className="text-sm font-semibold text-slate-200">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="soporte" className="scroll-mt-12">
              <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-baseline tracking-tight">
                <span className="text-indigo-600 mr-4 text-xl font-mono opacity-50">09.</span>
                Reclamaciones
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] hover:border-indigo-100 transition-all group">
                  <Mail className="w-8 h-8 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h5 className="font-bold mb-2 text-lg">Área Legal</h5>
                  <p className="text-xs text-slate-400 mb-6 font-medium">Atención prioritaria para consultas sobre términos contractuales.</p>
                  <span className="text-sm font-black text-indigo-600 border-b-2 border-indigo-100 hover:border-indigo-600 transition-all">antreus28d@gmail.com</span>
                </div>
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] hover:border-indigo-100 transition-all group">
                  <FileText className="w-8 h-8 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h5 className="font-bold mb-2 text-lg">Libro Virtual</h5>
                  <p className="text-xs text-slate-400 mb-6 font-medium">Conforme a las directrices de INDECOPI.</p>
                  <a href="/paginas/LibroReclamaciones" className="flex items-center text-sm font-black text-indigo-600 border-b-2 border-indigo-100 hover:border-indigo-600 transition-all">
                    Registrar Reclamo
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            </section>

            <section id="legal" className="scroll-mt-12 border-t-2 border-slate-100 pt-20">
              <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-baseline tracking-tight">
                <span className="text-indigo-600 mr-4 text-xl font-mono opacity-50">10.</span>
                Jurisdicción
              </h2>
              <p className="text-slate-500 leading-relaxed mb-10 italic">
                Cualquier controversia derivada de la interpretación de este contrato será sometida a la competencia exclusiva de los jueces y tribunales del <strong>Distrito Judicial de Ayacucho</strong>, renunciando el usuario a cualquier otro fuero por razón de domicilio.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span>Versión del Contrato: 2026-A</span>
                <span className="hidden sm:block text-slate-200">|</span>
                <span>Última Actualización: 15 de Marzo, 2026</span>
              </div>
            </section>

          </div>
        </div>

        {/* Firma / Cierre del Documento */}
        <div className="mt-24 border-t-8 border-slate-900 pt-16 text-center pb-24">
          <div className="inline-block px-14 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-xl">
            Fin de las Condiciones de Venta
          </div>
          <p className="mt-8 text-slate-400 text-xs max-w-lg mx-auto leading-relaxed font-medium uppercase tracking-widest px-4">
            Este documento digital tiene plena validez probatoria conforme a la Ley de Firmas y Certificados Digitales del Perú.
          </p>
        </div>

      </div>
    </div>
  );
}