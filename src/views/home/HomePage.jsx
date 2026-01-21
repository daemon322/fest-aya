import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  ChevronRight, 
  Users, 
  Star, 
  Music, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Gift
} from 'lucide-react';

const HomePage = () => {
  const eventDate = new Date('2024-12-31T20:00:00'); // Cambia esta fecha
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Estadísticas del evento
  const stats = [
    { icon: Users, value: '10,000+', label: 'Asistentes Esperados' },
    { icon: Star, value: '4.9/5.0', label: 'Rating Anterior' },
    { icon: Music, value: '24+', label: 'Artistas Confirmados' },
    { icon: Clock, value: '12h', label: 'Horas de Evento' },
  ];

  // Lineup de artistas
  const lineup = [
    { name: 'DJ Quantum', genre: 'Electronic', time: '20:00 - 22:00' },
    { name: 'The Sound Waves', genre: 'Indie Rock', time: '22:30 - 00:00' },
    { name: 'Nebula Collective', genre: 'Techno', time: '00:30 - 02:30' },
    { name: 'Maya & The Echoes', genre: 'Alternative', time: '03:00 - 05:00' },
  ];

  // Características del evento
  const features = [
    { icon: CheckCircle, text: '3 zonas VIP con acceso exclusivo' },
    { icon: CheckCircle, text: 'Food trucks de comida internacional' },
    { icon: CheckCircle, text: 'Zona de descanso con hamacas' },
    { icon: CheckCircle, text: 'Stands interactivos y fotográficos' },
    { icon: CheckCircle, text: 'Parking gratuito hasta las 6 AM' },
    { icon: CheckCircle, text: 'Área de cargadores portátiles' },
  ];

  // Countdown renderer
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-4xl font-bold text-white">
          ¡El Evento Ha Comenzado!
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: days, label: 'Días' },
            { value: hours, label: 'Horas' },
            { value: minutes, label: 'Minutos' },
            { value: seconds, label: 'Segundos' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {item.value.toString().padStart(2, '0')}
              </div>
              <div className="text-white/70 text-sm mt-2 uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0c29] to-[#302b63] overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-2 rounded-full mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/80">Evento Anual Exclusivo</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block text-white">NEXUS</span>
              <span className="block text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text">
                MUSIC FEST
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8">
              La experiencia musical más esperada del año. Un encuentro único donde 
              el sonido, la tecnología y la energía se fusionan para crear momentos inolvidables.
            </p>
          </motion.div>

          {/* Countdown */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">¡Falta Muy Poco!</h2>
              <p className="text-white/60">El evento comienza en:</p>
            </div>
            <Countdown date={eventDate} renderer={renderer} />
          </div>

          {/* Información del evento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          >
            {[
              { icon: Calendar, label: 'Fecha', value: '31 Diciembre 2024' },
              { icon: Clock, label: 'Hora', value: '20:00 - 08:00' },
              { icon: MapPin, label: 'Ubicación', value: 'Parque Metropolitano, Lima' },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                    <item.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-white/60 text-sm">{item.label}</span>
                </div>
                <div className="text-white text-lg font-semibold">{item.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Botón principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link
              to="/tickets"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-purple-500/30"
            >
              <Ticket className="w-6 h-6" />
              <span>Comprar Entradas Ahora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <p className="text-white/50 text-sm mt-4">
              Precios desde $49.99 • Entradas limitadas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sección de Estadísticas */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Un Evento Para Recordar
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
                  <stat.icon className="w-8 h-8 text-purple-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lineup Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Lineup Principal</h2>
            <p className="text-white/60 text-lg">Los artistas que harán vibrar la noche</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {lineup.map((artist, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {artist.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{artist.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                    {artist.genre}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock className="w-4 h-4" />
                  {artist.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Qué Incluye Tu Entrada?</h2>
            <p className="text-white/60 text-lg">Todo lo que necesitas para una experiencia completa</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <feature.icon className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/30 via-purple-900/20 to-blue-900/30 rounded-3xl p-12 border border-white/10 backdrop-blur-sm"
          >
            <Gift className="w-16 h-16 mx-auto text-purple-300 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              ¡No Te Quedes Fuera!
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Las entradas se agotan rápidamente cada año. Asegura tu lugar ahora y 
              obtén un 20% de descuento en grupos de 4 o más personas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tickets"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Ticket className="w-6 h-6" />
                <span>Ver Tipos de Entrada</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 border border-white/20 transition-all duration-300">
                <Calendar className="w-6 h-6" />
                <span>Agendar Recordatorio</span>
              </button>
            </div>
            
            <p className="text-white/50 text-sm mt-6">
              *Política de reembolso disponible hasta 30 días antes del evento
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {['Términos', 'Privacidad', 'FAQ', 'Contacto', 'Prensa'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            © 2024 Nexus Music Fest. Todos los derechos reservados.
            <br />
            El evento más esperado del año | Edición Limitada
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;