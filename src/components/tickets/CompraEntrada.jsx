import React, { useState } from "react";
import {
  Crown,
  Star,
  Users,
  Wine,
  Clock,
  ShieldCheck,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  X,
  Trash2,
  Ticket,
  ChevronRight,
  Flame,
  Mic2,
  MapPin,
  Music,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Checkout from "./Checkout";
import Tribuna from "./Tribuna";
import Guide from "./Guide";

const CartSidebar = ({ isOpen, onClose, cart, onRemoveItem, onCheckout }) => {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + serviceCharge;

  return (
    <>
      {/* Overlay con desenfoque profundo */}
      <div
        className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-md transition-opacity duration-700 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Izquierdo con diseño minimalista */}
      <div
        className={`fixed top-0 left-0 z-[1300] h-full w-full max-w-md bg-[#050505] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={10} className="text-amber-500 animate-pulse" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500/80">
                Tu Selección
              </h2>
            </div>
            <p className="text-2xl font-serif italic text-white tracking-tight">
              Checkout
            </p>
          </div>
          <button
            onClick={onClose}
            className="group p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all duration-500"
          >
            <X
              size={20}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar bg-gradient-to-b from-black to-[#050505]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
              <Ticket size={80} strokeWidth={0.5} />
              <p className="text-[10px] uppercase tracking-[0.4em] font-light">
                Sin reservas activas
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="group relative animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-amber-500/10 text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em]">
                        {item.phaseName}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest pt-1">
                        {item.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-white/10 hover:text-red-500 transition-colors duration-300 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between border-b border-white/5 pb-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono text-white/90">
                          {item.quantity}
                        </span>
                        <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                          Unidades
                        </span>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono tracking-tighter">
                        P.U: S/ {item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-white/30 uppercase tracking-[0.1em] block mb-1">
                        Subtotal
                      </span>
                      <span className="text-md font-mono text-amber-500/90">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-10 bg-black border-t border-white/5 space-y-8 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-[0.3em]">
                <span>Monto Base</span>
                <span className="font-mono text-white/70">
                  S/ {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-[0.3em]">
                <span>Fee de Servicio</span>
                <span className="font-mono text-white/70">
                  S/ {serviceCharge.toFixed(2)}
                </span>
              </div>
              <div className="pt-6 flex justify-between items-center border-t border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-[0.4em]">
                  Total Final
                </span>
                <div className="text-right">
                  <span className="text-3xl font-light text-amber-500 font-mono">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-6 rounded-none bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-4 group"
            >
              Confirmar Ticket
              <ChevronRight
                size={14}
                className="group-hover:translate-x-2 transition-transform duration-500"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const TicketCard = ({
  title,
  subtitle,
  prices,
  activePhase,
  availability,
  maxAvailability,
  features,
  isPopular,
  onAdd,
}) => {
  const [quantity, setQuantity] = useState(0);
  const currentPrice = prices[activePhase];
  const isCritical = availability < maxAvailability * 0.1;

  return (
    <div
      className={`relative flex flex-col h-full p-12 rounded-[3rem] hover:bg-[#00000093] transition-all duration-700 group overflow-hidden`}
    >
      {/* Resplandor de fondo interactivo (CSS sutil) */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[80px] group-hover:bg-amber-500/10 transition-all duration-700 rounded-full" />

      {isPopular && (
        <div className="absolute top-5 right-10 flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5">
          <Star size={10} fill="#f59e0b" className="text-amber-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500">
            Más Solicitado
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <header className="mb-14">
          <div className="space-y-3">
            <h3 className="text-4xl font-serif text-white tracking-tight italic group-hover:text-amber-500 transition-colors duration-700">
              {title}
            </h3>
            <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-white/80">
              {subtitle}
            </p>
          </div>
          <div className="mt-10 flex items-baseline gap-2">
            <span className="text-xl font-light text-amber-500/90 uppercase tracking-tighter">
              PEN
            </span>
            <div className="text-6xl font-light text-white tracking-tighter font-mono group-hover:scale-105 transition-transform duration-700 origin-left">
              {currentPrice.toFixed(0)}
              <span className="text-xl opacity-80">.00</span>
            </div>
          </div>
        </header>

        <div className="mb-12 space-y-4">
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em]">
            <span className="text-white/90">Disponibilidad</span>
            <span
              className={
                isCritical ? "text-red-500 animate-pulse" : "text-amber-500/90"
              }
            >
              {isCritical && (
                <AlertCircle size={10} className="inline mr-1 mb-0.5" />
              )}
              {availability} de {maxAvailability}
            </span>
          </div>
          <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
            <div
              className={`h-full transition-all duration-[2500ms] ease-out ${isCritical ? "bg-red-500" : "bg-amber-500"}`}
              style={{ width: `${(availability / maxAvailability) * 100}%` }}
            />
          </div>
        </div>

        <ul className="space-y-6 mb-14 flex-grow">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-5 translate-x-0 group-hover:translate-x-2 transition-transform duration-700"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/90 group-hover:text-amber-500 group-hover:border-amber-500/90 transition-all duration-500">
                {React.cloneElement(feature.icon, {
                  size: 12,
                  strokeWidth: 1.5,
                })}
              </div>
              <span className="text-[10px] text-white/70 font-light tracking-[0.2em] uppercase group-hover:text-white/90 transition-colors duration-500">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-6">
          <div className="flex items-center justify-between rounded-2xl px-6 py-4 border border-white/5">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-black hover:bg-white/90 rounded-full transition-all cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="font-mono text-xl text-white font-light w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.max(0, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-black hover:bg-white/90 rounded-full transition-all cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            disabled={quantity === 0}
            onClick={() => {
              onAdd({ title, price: currentPrice, quantity });
              setQuantity(0);
            }}
            className={`w-full py-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.5em] transition-all duration-500 flex items-center justify-center gap-4 ${
              quantity === 0
                ? "bg-white/[0.02] text-white/10 cursor-not-allowed border border-white/5"
                : "bg-white text-black hover:bg-amber-500 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5 cursor-pointer"
            }`}
          >
            <ShoppingCart size={14} />
            Añadir Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const phases = [
    { id: 0, label: "Early Access", status: "Preventa 01", date: "Limited" },
    {
      id: 1,
      label: "Main Selection",
      status: "Preventa 02",
      date: "Available",
    },
    { id: 2, label: "Last Call", status: "Regular", date: "Door" },
  ];

  const ticketData = [
    {
      id: "box-leyenda",
      title: "Box Leyenda",
      subtitle: "Premium Experience",
      prices: [550.0, 750.0, 950.0],
      availability: 2,
      maxAvailability: 10,
      isPopular: true,
      features: [
        { icon: <Crown />, text: "Lounge Privado" },
        { icon: <Wine />, text: "Barra Libre Premium" },
        { icon: <Users />, text: "10 Invitados" },
        { icon: <MapPin />, text: "Vista Frontal" },
      ],
    },
    {
      id: "zona-flow",
      title: "Zona Flow",
      subtitle: "Dynamic Access",
      prices: [120.0, 180.0, 250.0],
      availability: 68,
      maxAvailability: 150,
      features: [
        { icon: <Star />, text: "Acceso Fast Pass" },
        { icon: <Flame />, text: "Zona de Baile" },
        { icon: <Clock />, text: "Open Bar 2h" },
      ],
    },
    {
      id: "general-latido",
      title: "G. Latido",
      subtitle: "Essential Rhythm",
      prices: [60.0, 90.0, 120.0],
      availability: 210,
      maxAvailability: 500,
      features: [
        { icon: <Music />, text: "High Fidelity" },
        { icon: <Mic2 />, text: "Pista Central" },
      ],
    },
  ];

  const handleAddTicket = (info) => {
    const phaseName = phases[activePhase].status;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.title === info.title && item.phaseName === phaseName,
      );

      if (existingItemIndex > -1) {
        return prevCart.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + info.quantity };
          }
          return item;
        });
      }

      return [
        ...prevCart,
        { ...info, phaseName, id: `${info.title}-${phaseName}` },
      ];
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleOpenCheckout = () => {
    setShowCheckout(true);
    setIsCartOpen(false);
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setIsCartOpen(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <>
      {showCheckout ? (
        <Checkout
          cart={cart}
          onBack={handleBackFromCheckout}
          onComplete={handleCheckoutComplete}
        />
      ) : (
        <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 flex items-center justify-center flex-col">
          <Tribuna/>
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleOpenCheckout}
          />

          <div className="max-w-7xl w-full space-y-24">
            {/* Selector de Fase con diseño de Tabulador Premium */}
            <div className="flex flex-col items-center space-y-12 pt-20">
              <div className="relative flex flex-col sm:flex-row bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`relative px-10 py-4 rounded-xl transition-all duration-700 overflow-hidden cursor-pointer ${
                      activePhase === phase.id
                        ? "text-black"
                        : "text-white/90 hover:text-white/90"
                    }`}
                  >
                    {activePhase === phase.id && (
                      <div className="absolute inset-0 bg-amber-500 animate-in fade-in zoom-in-95 duration-500" />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[14px] font-black uppercase tracking-[0.3em]">
                        {phase.label}
                      </span>
                      <span
                        className={`text-[12px] uppercase tracking-widest mt-1 ${activePhase === phase.id ? "text-white/90" : "text-amber-500/90"}`}
                      >
                        {phase.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Entradas con espaciado amplio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-5">
              {ticketData.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  {...ticket}
                  activePhase={activePhase}
                  onAdd={handleAddTicket}
                />
              ))}
            </div>
          </div>

          {/* Botón de Carrito con Efecto Pulso */}
          {cart.length > 0 && !isCartOpen && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-12 right-12 z-[80] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-amber-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative bg-white text-black hover:text-white h-20 w-20 rounded-3xl shadow-2xl flex items-center justify-center hover:bg-red-600 hover:-translate-y-2 transition-all duration-500 active:scale-90">
                <div className="relative">
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  <span className="absolute -top-5 -right-5 bg-amber-500 text-black text-[11px] font-black h-7 w-7 flex items-center justify-center rounded-xl border-[3px] border-black group-hover:bg-white transition-colors">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                </div>
              </div>
            </button>
          )}
          <Guide/>

          <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.3); }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
        </div>
      )}
    </>
  );
};

export default App;
