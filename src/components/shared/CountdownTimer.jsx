// components/shared/CountdownTimer.jsx
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';

const CountdownTimer = ({ eventDate }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-4xl font-bold text-white">
          ¡El Festival Está en Vivo!
        </div>
      );
    }

    const units = [
      { value: days,    label: 'Días',     from: '#9333ea', to: '#6b21a8' },
      { value: hours,   label: 'Horas',    from: '#2563eb', to: '#1e3a8a' },
      { value: minutes, label: 'Minutos',  from: '#db2777', to: '#9d174d' },
      { value: seconds, label: 'Segundos', from: '#0891b2', to: '#164e63' },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {units.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden group"
          >
            {/* Glow de fondo usando style (no template literal en className) */}
            <div
              className="absolute inset-0 opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
            />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              {/* FIX: valor con gradiente inline para evitar purge de Tailwind */}
              <div
                className="text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
              >
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-white/80 text-lg mt-4 uppercase tracking-wider font-semibold">
                {item.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return <Countdown date={eventDate} renderer={renderer} />;
};

export default CountdownTimer;
