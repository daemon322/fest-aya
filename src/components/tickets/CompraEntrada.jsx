import React, { useState, useEffect } from "react";
import {
  Crown,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  X,
  Trash2,
  Ticket,
  ChevronRight,
  Flame,
  Mic2,
  Music,
  Sparkles,
  AlertCircle,
  List,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Checkout from "./Checkout";
import Tribuna from "./Tribuna";
import Guide from "./Guide";
import { Flyers } from "../../views/tickets/Flyer";

/* ─── Persistencia localStorage ──────────────────────────────────────────── */
const CART_KEY = "mi-entradas-cart";

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    console.error("Error al guardar carrito en localStorage");
  }
};

/* ─── CartSidebar ─────────────────────────────────────────────────────────── */
const CartSidebar = ({ isOpen, onClose, cart, onRemoveItem, onUpdateQty, onCheckout }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-md transition-opacity duration-700 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 z-[1300] h-full w-full max-w-md bg-[#050505] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={10} className="text-amber-500 animate-pulse" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500/80">
                Tu Selección
              </h2>
            </div>
            <p className="text-2xl font-serif italic text-white tracking-tight">Checkout</p>
          </div>
          <button
            onClick={onClose}
            className="group p-3 text-white hover:text-black hover:bg-white cursor-pointer rounded-full transition-all duration-500"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-black to-[#050505]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
              <Ticket size={80} strokeWidth={0.5} />
              <p className="text-[10px] uppercase tracking-[0.4em] font-light">No tiene reservas activas</p>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="group relative animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-amber-500/10 text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em]">
                        {item.phaseName}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest pt-1">{item.title}</h4>
                    </div>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-red-500 hover:bg-red-500/10 rounded-full transition-colors duration-300 p-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    {/* Controles de cantidad con diseño mejorado */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 w-fit">
                        <button
                          onClick={() => onUpdateQty(idx, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-black hover:bg-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer active:scale-90"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono text-base text-white w-8 text-center select-none tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-black hover:bg-white transition-all duration-200 cursor-pointer active:scale-90"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono tracking-tighter">
                        P.U: S/ {item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-white/30 uppercase tracking-[0.1em] block mb-1">Subtotal</span>
                      <span className="text-base font-mono text-amber-500/90">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-8 bg-black border-t border-white/5 space-y-5 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <span>Monto Base</span>
              <span className="font-mono text-white/70">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-[0.4em]">Total Final</span>
              <span className="text-3xl font-light text-amber-500 font-mono">S/ {subtotal.toFixed(2)}</span>
            </div>

            {/* Ver detalle del carrito */}
            <button
              onClick={() => { onClose(); navigate("/carrito"); }}
              className="w-full py-3 rounded-xl border border-white/10 text-white/50 font-bold text-[9px] uppercase tracking-[0.3em] hover:border-amber-500/30 hover:text-amber-500/70 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <List size={12} />
              Ver detalle completo
            </button>

            <button
              onClick={onCheckout}
              className="w-full py-5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-4 group cursor-pointer"
            >
              Confirmar Ticket
              <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ─── TicketCard ──────────────────────────────────────────────────────────── */
const TicketCard = ({ title, subtitle, prices, activePhase, availability, maxAvailability, features, isPopular, onAdd }) => {
  const [quantity, setQuantity] = useState(0);
  const currentPrice = prices[activePhase];
  const isCritical = availability < maxAvailability * 0.1;

  return (
    <div className="relative flex flex-col h-full p-12 rounded-[3rem] backdrop-blur-2xl transition-all duration-700 group overflow-hidden">
      {isPopular && (
        <div className="absolute top-5 right-10 flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5">
          <Star size={10} fill="#f59e0b" className="text-amber-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500">Más Solicitado</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <header className="mb-14">
          <div className="space-y-3">
            <h3 className="text-4xl font-serif text-white tracking-tight italic group-hover:text-amber-500 transition-colors duration-700">
              {title}
            </h3>
            <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-white/80">{subtitle}</p>
          </div>
          <div className="mt-10 flex items-baseline gap-2">
            <span className="text-xl font-light text-amber-500/90 uppercase tracking-tighter">PEN</span>
            <div className="text-6xl font-light text-white tracking-tighter font-mono group-hover:scale-105 transition-transform duration-700 origin-left">
              {currentPrice.toFixed(0)}<span className="text-xl opacity-80">.00</span>
            </div>
          </div>
        </header>

        <div className="mb-12 space-y-4">
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em]">
            <span className="text-white/90">Disponibilidad</span>
            <span className={isCritical ? "text-red-500 animate-pulse" : "text-amber-500/90"}>
              {isCritical && <AlertCircle size={10} className="inline mr-1 mb-0.5" />}
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

        <ul className="mb-14 grid grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-5 translate-x-0 group-hover:translate-x-2 transition-transform duration-700" style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/90 group-hover:text-amber-500 group-hover:border-amber-500/90 transition-all duration-500">
                {React.cloneElement(feature.icon, { size: 12, strokeWidth: 1.5 })}
              </div>
              <span className="text-[10px] text-white/90 font-light tracking-[0.2em] uppercase group-hover:text-white/90 transition-colors duration-500">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-6">
          {/* Controles cantidad en la card con diseño mejorado */}
          <div className="flex items-center justify-between rounded-2xl px-6 py-4 border border-white/5 bg-white/[0.02]">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-black hover:bg-white/90 rounded-full transition-all cursor-pointer active:scale-90 border border-white/10 hover:border-white"
            >
              <Minus size={14} />
            </button>
            <span className="font-mono text-xl text-white font-light w-12 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.max(0, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-black hover:bg-white/90 rounded-full transition-all cursor-pointer active:scale-90 border border-white/10 hover:border-white"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            disabled={quantity === 0}
            onClick={() => { onAdd({ title, price: currentPrice, quantity }); setQuantity(0); }}
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

/* ─── Componente principal ───────────────────────────────────────────────── */
const CompraEntrada = () => {
  const location = useLocation();
  const [cart, setCart] = useState(() => loadCartFromStorage());
  const [activePhase, setActivePhase] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Si venimos desde CartPage con ?checkout=1 abrimos el checkout directamente
  const [showCheckout, setShowCheckout] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("checkout") === "1";
  });

  // Guardar carrito en localStorage en cada cambio
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Scroll al top cuando se activa el checkout (por URL o por botón)
  useEffect(() => {
    if (showCheckout) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showCheckout]);

  const phases = [
    { id: 0, label: "Pre-venta",     status: "del 17", date: "22 de marzo" },
    { id: 1, label: "Venta General", status: "del 23", date: "28 de marzo" },
  ];

  const ticketData = [
    {
      id: "zona-vip",
      title: "Zona Vip",
      subtitle: "Acceso dinámico",
      prices: [40.0, 45.0],
      availability: 200,
      maxAvailability: 200,
      features: [
        { icon: <Star />,  text: "Pase rápido de acceso" },
        { icon: <Flame />, text: "Zona baja con buena vista" },
        { icon: <Crown />, text: "1/4 de pollo + silla" },
      ],
    },
    {
      id: "general-latido",
      title: "General",
      subtitle: "Acceso regular",
      prices: [25.0, 30.0],
      availability: 500,
      maxAvailability: 500,
      features: [
        { icon: <Music />, text: "Pase regular" },
        { icon: <Mic2 />,  text: "Gradas Norte y Occidente" },
        { icon: <Mic2 />,  text: "Lata de cerveza o gaseosa" },
      ],
    },
  ];

  const handleAddTicket = (info) => {
    const phaseName = phases[activePhase].label;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.title === info.title && item.phaseName === phaseName
      );
      if (existingIdx > -1) {
        return prev.map((item, i) =>
          i === existingIdx ? { ...item, quantity: item.quantity + info.quantity } : item
        );
      }
      const ticketDef = ticketData.find((t) => t.title === info.title);
      return [...prev, { ...info, phaseName, id: ticketDef ? ticketDef.id : info.title }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (index) => setCart((prev) => prev.filter((_, i) => i !== index));

  const handleUpdateQty = (index, delta) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleOpenCheckout = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <Checkout cart={cart} onBack={handleBackFromCheckout} onComplete={handleCheckoutComplete} />
      ) : (
        <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 flex items-center justify-center flex-col">
          <Flyers />
          <Tribuna />
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onUpdateQty={handleUpdateQty}
            onCheckout={handleOpenCheckout}
          />

          <div className="voley-canvas-fixed">
            <div className="mancha azul pos-1"></div>
            <div className="mancha amarillo pos-2"></div>
            <div className="mancha azul-claro pos-3"></div>
            <div className="mancha amarillo-oro pos-4"></div>
            <div className="mancha azul-oscuro pos-5"></div>
          </div>
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <filter id="watercolor-real">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 0.1 0.2 0.5 0.8 1" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </svg>

          <div className="w-full space-y-0 sm:pt-12 relative">
            <div className="absolute inset-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#000000" fillOpacity="1" d="M0,192L30,170.7C60,149,120,107,180,96C240,85,300,107,360,106.7C420,107,480,85,540,69.3C600,53,660,43,720,37.3C780,32,840,32,900,69.3C960,107,1020,181,1080,186.7C1140,192,1200,128,1260,90.7C1320,53,1380,43,1410,37.3L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" />
              </svg>
            </div>

            <div className="w-full flex flex-col items-center space-y-12 pt-20">
              <div className="w-full relative justify-center flex flex-col sm:flex-row p-1.5 sm:bg-transparent bg-[#000000]">
                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`relative px-10 py-4 rounded-xl transition-all duration-700 overflow-hidden cursor-pointer ${
                      activePhase === phase.id ? "text-black" : "text-white/90 hover:text-white/90"
                    }`}
                  >
                    {activePhase === phase.id && (
                      <div className="absolute inset-0 bg-amber-500 animate-in fade-in zoom-in-95 duration-500" />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[14px] font-black uppercase tracking-[0.3em]">{phase.label}</span>
                      <span className={`text-[12px] uppercase tracking-widest mt-1 ${activePhase === phase.id ? "text-white/90" : "text-amber-500/90"}`}>
                        {phase.status}{" al " + phase.date}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-5 bg-[#000000]">
              {ticketData.map((ticket) => (
                <TicketCard key={ticket.id} {...ticket} activePhase={activePhase} onAdd={handleAddTicket} />
              ))}
            </div>

            <div className="relative top-0 inset-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#000000" fillOpacity="1" d="M0,288L15,272C30,256,60,224,90,218.7C120,213,150,235,180,240C210,245,240,235,270,202.7C300,171,330,117,360,90.7C390,64,420,64,450,101.3C480,139,510,213,540,245.3C570,277,600,267,630,240C660,213,690,171,720,170.7C750,171,780,213,810,240C840,267,870,277,900,272C930,267,960,245,990,197.3C1020,149,1050,75,1080,74.7C1110,75,1140,149,1170,154.7C1200,160,1230,96,1260,112C1290,128,1320,224,1350,229.3C1380,235,1410,149,1425,106.7L1440,64L1440,0L1425,0C1410,0,1380,0,1350,0C1320,0,1290,0,1260,0C1230,0,1200,0,1170,0C1140,0,1110,0,1080,0C1050,0,1020,0,990,0C960,0,930,0,900,0C870,0,840,0,810,0C780,0,750,0,720,0C690,0,660,0,630,0C600,0,570,0,540,0C510,0,480,0,450,0C420,0,390,0,360,0C330,0,300,0,270,0C240,0,210,0,180,0C150,0,120,0,90,0C60,0,30,0,15,0L0,0Z" />
              </svg>
            </div>
          </div>

          {/* Botón flotante del carrito */}
          {cart.length > 0 && !isCartOpen && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-2 right-2 z-[80] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-amber-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative bg-white text-black hover:text-white h-15 w-15 rounded-3xl shadow-2xl flex items-center justify-center hover:bg-red-600 hover:-translate-y-2 transition-all duration-500 active:scale-90">
                <div className="relative">
                  <ShoppingCart size={24} strokeWidth={2.5} />
                  <span className="absolute -top-5 -right-5 bg-amber-500 text-black text-[11px] font-black h-7 w-7 flex items-center justify-center rounded-xl border-[3px] border-black group-hover:bg-white transition-colors">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                </div>
              </div>
            </button>
          )}

          <Guide />
        </div>
      )}
    </>
  );
};

export default CompraEntrada;
