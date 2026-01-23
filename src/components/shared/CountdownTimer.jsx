// components/home/CountdownTimer.jsx
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
    } else {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { value: days, label: 'Días', color: 'from-purple-600 to-purple-800' },
            { value: hours, label: 'Horas', color: 'from-blue-600 to-blue-800' },
            { value: minutes, label: 'Minutos', color: 'from-pink-600 to-pink-800' },
            { value: seconds, label: 'Segundos', color: 'from-cyan-600 to-cyan-800' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity`} />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-white/80 text-lg mt-4 uppercase tracking-wider font-semibold">
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
  };

  return <Countdown date={eventDate} renderer={renderer} />;
};

export default CountdownTimer;