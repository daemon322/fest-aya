import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Ticket,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Info,
  Star,
  Package,
} from "lucide-react";
import { TICKET_TYPES, EVENT_INFO, PHASES } from "../../data/ticketsConfig";

const CART_KEY = "mi-entradas-cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    console.error("Error guardando carrito en localStorage");
  }
};

/* ─── Tarjeta detallada de item ──────────────────────────────────────────── */
const CartItemDetail = ({ item, index, onRemove, onUpdateQty }) => {
  const config = TICKET_TYPES[item.id] || TICKET_TYPES["general-latido"];
  const subtotal = item.price * item.quantity;

  return (
    <div className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-amber-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabecera de la tarjeta */}
      <div className="flex items-start justify-between p-8 pb-0">
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
            {item.phaseName}
          </span>
          {config.badge && (
            <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-white/5 text-white/60 text-[9px] font-bold uppercase tracking-widest rounded-full">
              <Star size={8} fill="currentColor" /> {config.badge}
            </span>
          )}
          <h3 className="text-2xl font-serif italic text-white pt-2">
            {item.title}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {config.subtitle}
          </p>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="p-2 rounded-full text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
          aria-label="Eliminar entrada"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Zona e info */}
      <div className="px-8 pt-4 pb-6 flex items-center gap-2 border-b border-white/5">
        <MapPin size={12} className="text-amber-500/60" />
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          {config.zone}
        </span>
      </div>

      {/* Descripción */}
      <div className="px-8 py-6">
        <p className="text-sm text-white/50 leading-relaxed italic">
          {config.description}
        </p>
      </div>

      {/* Lo que incluye */}
      <div className="px-8 pb-6">
        <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
          <Package size={12} /> Lo que incluye
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.includes.map((inc, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle
                size={12}
                className="text-amber-500/70 mt-0.5 shrink-0"
              />
              <span className="text-[11px] text-white/60 leading-tight">
                {inc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Restricciones */}
      <div className="px-8 pb-6">
        <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
          <Info size={12} /> Condiciones
        </h4>
        <ul className="space-y-2">
          {config.restrictions.map((r, i) => (
            <li key={i} className="flex items-center gap-3">
              <AlertTriangle size={10} className="text-amber-500/50 shrink-0" />
              <span className="text-[10px] text-white/40">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Controles de cantidad + precio */}
      <div className="p-8 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/5 mt-2">
        {/* Cantidad */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
            Cantidad
          </span>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2">
            <button
              onClick={() => onUpdateQty(index, -1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-black hover:bg-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="font-mono text-lg text-white w-10 text-center select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(index, 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-black hover:bg-white transition-all duration-200 cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="text-[9px] text-white/20 font-mono">
            P.U.: S/ {item.price.toFixed(2)}
          </span>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1">
            Subtotal
          </span>
          <span className="text-3xl font-mono text-amber-500 font-light">
            S/ {subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Componente principal ───────────────────────────────────────────────── */
const CartPage = () => {
  const navigate = useNavigate();

  // Lazy initializer: lee localStorage en el primer render.
  // Sin esto, el efecto de guardado corría primero con [] y borraba el carrito.
  const [cart, setCart] = useState(() => loadCart());

  // Scroll al tope al montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Guardar en localStorage cada vez que cambia el carrito
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index, delta) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      })
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleGoCheckout = () => {
    // ?checkout=1 hace que CompraEntrada abra el checkout directamente
    navigate("/voley-al-limite?checkout=1");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-5 py-24 sm:py-32">

        {/* Encabezado */}
        <div className="mb-16">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-all uppercase text-[9px] tracking-[0.4em] mb-10 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
              <ArrowLeft size={12} />
            </div>
            Volver
          </button>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-amber-500 font-black mb-3">
                {EVENT_INFO.name}
              </p>
              <h1 className="text-5xl sm:text-6xl font-serif italic text-white leading-none">
                Mi Carrito
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-3">
                {totalItems > 0
                  ? `${totalItems} ${totalItems === 1 ? "entrada" : "entradas"} guardadas`
                  : "Sin entradas guardadas"}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                Vaciar
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 opacity-20">
            <Ticket size={80} strokeWidth={0.5} />
            <div className="text-center space-y-2">
              <p className="text-[10px] uppercase tracking-[0.5em]">
                Tu carrito está vacío
              </p>
              <p className="text-[9px] text-white/50 uppercase tracking-widest">
                Agrega entradas desde la página del evento
              </p>
            </div>
            <button
              onClick={() => navigate("/voley-al-limite")}
              className="opacity-100 px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-amber-500 transition-all cursor-pointer"
            >
              Ver Entradas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-16">
            {/* Lista de entradas detallada */}
            <div className="space-y-8">
              {cart.map((item, idx) => (
                <CartItemDetail
                  key={`${item.id}-${idx}`}
                  item={item}
                  index={idx}
                  onRemove={handleRemove}
                  onUpdateQty={handleUpdateQty}
                />
              ))}
            </div>

            {/* Resumen y CTA */}
            <div className="space-y-8">
              {/* Panel de totales */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h3 className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-black">
                  Resumen de Compra
                </h3>

                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[11px] text-white/50"
                    >
                      <span>
                        {item.title}{" "}
                        <span className="text-white/30">x{item.quantity}</span>
                      </span>
                      <span className="font-mono">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                      Total
                    </p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">
                      Incluye todos los cargos
                    </p>
                  </div>
                  <span className="text-4xl font-mono text-amber-500 font-light">
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Garantías */}
              <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">
                    Reserva Segura
                  </p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Tu selección se guarda automáticamente. Una vez finalices el
                    checkout, recibirás confirmación en tu correo en un plazo de
                    12–24 horas.
                  </p>
                </div>
              </div>

              {/* Botón de checkout */}
              <button
                onClick={handleGoCheckout}
                className="w-full py-7 bg-amber-500 text-black font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl hover:bg-white transition-all duration-500 flex items-center justify-center gap-4 group shadow-[0_20px_60px_rgba(245,158,11,0.15)] cursor-pointer"
              >
                <ShoppingCart size={16} />
                Continuar con el Checkout
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform duration-500"
                />
              </button>

              <p className="text-center text-[9px] uppercase tracking-widest text-white/20">
                Podrás revisar tu pedido antes de confirmar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
