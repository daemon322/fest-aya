import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Calendar, MapPin, Palette, Image as ImageIcon } from "lucide-react";
import FestivalMid from "./FestivalMid";

// Paleta extendida solicitada
const COLORS = [
  { id: "cyan", name: "Cian Neón", hex: "#00f2ff", r: 0, g: 242, b: 255 },
  { id: "purple", name: "Púrpura", hex: "#a855f7", r: 168, g: 85, b: 247 },
  { id: "amber", name: "Ámbar", hex: "#F7F210", r: 247, g:242, b: 16, a: 97 },
  { id: "red", name: "Rojo Infierno", hex: "#ef4444", r: 239, g: 68, b: 68 },
  { id: "fire", name: "Fuego", hex: "#ff4d00", r: 255, g: 77, b: 0 },
  { id: "green", name: "Verde Neón", hex: "#55AB63", r: 85, g: 171, b: 99, a: 67},
];

// Paleta de colores elegantes para fondos
const BACKGROUND_COLORS = [
  { id: 1, name: "Negro Profundo", hex: "#000000", class: "bg-black" },
  { id: 2, name: "Blanco Puro", hex: "#1D4F52", class: "bg-white" },
  { id: 3, name: "Gris Carbón", hex: "#1a1a1a", class: "bg-gray-900" },
  { id: 4, name: "Azul Medianoche", hex: "#0a192f", class: "bg-blue-950" },
  { id: 5, name: "Verde Oscuro", hex: "#0d2618", class: "bg-green-950" },
  { id: 6, name: "Púrpura Real", hex: "#1a0b2e", class: "bg-purple-950" },
  { id: 7, name: "Grafito", hex: "#2d3748", class: "bg-gray-800" },
  { id: 8, name: "Índigo", hex: "#3730a3", class: "bg-indigo-900" },
];

// COMPONENTE DE SIMULACIÓN CORREGIDO
const FluidSimulation = ({ mousePos, velocity, activeColor }) => {
  const canvasRef = useRef(null);
  const rippleData = useRef({
    width: 0,
    height: 0,
    buffer1: null,
    buffer2: null,
    ctx: null,
    texture: null,
    active: false,
  });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // USAR VIEWPORT, NO EL TAMAÑO DEL DOCUMENTO
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scale = 0.4;
    const w = Math.floor(viewportWidth * scale);
    const h = Math.floor(viewportHeight * scale);

    canvas.width = w;
    canvas.height = h;

    // FIJAR EL CANVAS AL VIEWPORT
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.objectFit = "cover"; // MANTENER PROPORCIONES

    const ctx = canvas.getContext("2d", { alpha: true });
    rippleData.current = {
      width: w,
      height: h,
      buffer1: new Float32Array(w * h).fill(0),
      buffer2: new Float32Array(w * h).fill(0),
      ctx,
      texture: ctx.createImageData(w, h),
      active: true,
    };
  }, []);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);
    let frame;

    const render = () => {
      const s = rippleData.current;
      if (!s || !s.active) {
        frame = requestAnimationFrame(render);
        return;
      }
      const { width, height, buffer1, buffer2, ctx, texture } = s;
      const data = texture.data;
      const damping = 0.99;

      for (let i = width; i < width * height - width; i++) {
        buffer2[i] =
          (buffer1[i - 1] +
            buffer1[i + 1] +
            buffer1[i - width] +
            buffer1[i + width]) /
            2 -
          buffer2[i];
        buffer2[i] *= damping;
      }

      for (let i = 0; i < buffer2.length; i++) {
        const val = Math.abs(buffer2[i]);
        const pixelIdx = i * 4;
        data[pixelIdx] = activeColor.r;
        data[pixelIdx + 1] = activeColor.g;
        data[pixelIdx + 2] = activeColor.b;
        data[pixelIdx + 3] = Math.min(360, val * 8);
      }

      ctx.putImageData(texture, 0, 0);
      rippleData.current.buffer1 = buffer2;
      rippleData.current.buffer2 = buffer1;
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", init);
    };
  }, [init, activeColor]);

  useEffect(() => {
    const s = rippleData.current;
    if (!s || !s.active) return;

    // NORMALIZAR COORDENADAS AL VIEWPORT (0-1)
    const normalizedX = Math.max(
      0,
      Math.min(1, mousePos.x / window.innerWidth),
    );
    const normalizedY = Math.max(
      0,
      Math.min(1, mousePos.y / window.innerHeight),
    );

    // CONVERTIR A COORDENADAS DEL CANVAS
    const x = Math.floor(normalizedX * s.width);
    const y = Math.floor(normalizedY * s.height);

    if (x > 2 && x < s.width - 2 && y > 2 && y < s.height - 2) {
      const idx = y * s.width + x;
      s.buffer1[idx] += Math.min(125, velocity * 14);
    }
  }, [mousePos, velocity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none z-10 mix-blend-screen"
      style={{
        filter: "blur(3px) contrast(1.5)",
        pointerEvents: "none",
      }}
    />
  );
};

export default function App() {
  const [colorIndex, setColorIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const [activeBg, setActiveBg] = useState(BACKGROUND_COLORS[0].hex);
  const [bgName, setBgName] = useState(BACKGROUND_COLORS[0].name);
  const [isDimming, setIsDimming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lastMouse = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const activeColor = COLORS[colorIndex];

  const resetTimer = useCallback(() => {
    setIsDimming(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsDimming(true);
    }, 30000);
  }, []);

  const handleMouseMove = (e) => {
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    const v = Math.sqrt(dx * dx + dy * dy);
    setVelocity(v);
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMouse.current = { x: e.clientX, y: e.clientY };
    resetTimer();
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMouseMove(touch);
  };

  const cycleColor = () => {
    setColorIndex((prev) => (prev + 1) % COLORS.length);
    resetTimer();
  };

  const handleBgSelect = (bg) => {
    setActiveBg(bg.hex);
    setBgName(bg.name);
    resetTimer();
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 2000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("resize", checkMobile);
    };
  }, [resetTimer]);

  // CAPTURAR MOVIMIENTO DEL MOUSE GLOBALMENTE
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans select-none pb-10"
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMouseMove(touch);
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;600;900&family=Fira+Code:wght@400&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-code { font-family: 'Fira Code', monospace; }
        .glass { background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        .neon-text { filter: drop-shadow(0 0 8px currentColor); }
        .mask-overlay { background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%); }
        .mobile-tap-hint { animation: pulse 2s infinite; }
        .color-swatch {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .color-swatch:hover {
          transform: scale(1.1);
          border-color: rgba(255,255,255,0.5);
        }
        .color-swatch.selected {
          transform: scale(1.15);
          border-color: white;
          box-shadow: 0 0 15px rgba(255,255,255,0.3);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* --- FONDO (COLOR SÓLIDO) --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDimming ? 0.7 : 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
            style={{ backgroundColor: activeBg }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 mask-overlay" />
      </div>

      {/* --- SIMULACIÓN DE ONDAS FIJADA AL VIEWPORT --- */}
      <FluidSimulation
        mousePos={mousePos}
        velocity={velocity}
        activeColor={activeColor}
      />

      {/* --- INTERFAZ PRINCIPAL --- */}
      <div className="relative z-50 min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12">
        <div className=" justify-center flex pt-16">
          <h1 className="font-outfit font-black text-3xl sm:text-5xl md:text-7xl lg:text-9xl tracking-tighter italic uppercase leading-tight sm:leading-none">
            FESTIVAL ANUAL
            <br />
            <span
              style={{ color: activeColor.hex }}
              className="transition-colors duration-500"
            >
              AYACUCHANO
            </span>
          </h1>
        </div>

        {/* Footer Info - Totalmente responsivo */}
        <div className="mt-4 sm:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end">
            {/* Selector de fondos (COLORES) */}
            <div className="space-y-3 sm:space-y-4 order-2 md:order-1">
              <div className="flex items-center gap-2">
                <Palette size={14} className="opacity-40" />
                <p className="font-code text-[9px] opacity-30 uppercase tracking-widest">
                  Paleta de Fondos
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_COLORS.slice(0, 8).map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBgSelect(bg)}
                    className={`color-swatch h-8 sm:h-10 rounded-lg transition-all pointer-events-auto flex items-center justify-center ${activeBg === bg.hex ? "selected" : ""}`}
                    style={{ backgroundColor: bg.hex }}
                    title={bg.name}
                  >
                    {activeBg === bg.hex && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <p className="font-code text-[10px] opacity-50 tracking-wider">
                {bgName}
              </p>
            </div>

            {/* Botón central - Responsivo */}
            <div className="flex justify-center order-1 md:order-2 mb-6 sm:mb-0">
              <a href="./tickets">
                <motion.button
                  onMouseEnter={cycleColor}
                  onClick={cycleColor}
                  onTouchStart={cycleColor}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-6 sm:p-8 rounded-3xl overflow-visible transition-all duration-500 group cursor-pointer"
                >
                  {/* Resplandor externo */}
                  <div
                    className="absolute inset-0 rounded-3xl blur-xl sm:blur-2xl opacity-40 transition-colors duration-500"
                    style={{ backgroundColor: activeColor.hex }}
                  />
                  {/* El Botón Real */}
                  <div
                    className="relative rounded-3xl border-2 flex items-center justify-center transition-all duration-500 p-4"
                    style={{
                      borderColor: activeColor.hex,
                      color: activeColor.hex,
                    }}
                  >
                    <p className="flex gap-4 w-full text-center items-center font-bold">
                      ADQUIERE TUS ENTRADAS
                      <Zap
                        className="neon-text"
                        size={isMobile ? 28 : 40}
                        fill={activeColor.hex}
                        fillOpacity={0.2}
                      />
                    </p>
                  </div>
                </motion.button>
              </a>
            </div>

            {/* Información de fecha/lugar */}
            <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 font-code text-[10px] uppercase tracking-wider order-3">
              <div className="flex items-center gap-3 glass px-3 sm:px-4 py-2 rounded-lg border-white/5 w-full sm:w-auto justify-between sm:justify-start">
                <Calendar size={12} className="opacity-40 flex-shrink-0" />
                <span className="text-xs">15.NOV.2025</span>
              </div>
              <div className="flex items-center gap-3 glass px-3 sm:px-4 py-2 rounded-lg border-white/5 w-full sm:w-auto justify-between sm:justify-start">
                <MapPin size={12} className="opacity-40 flex-shrink-0" />
                <span className="text-xs">LATAM CORE / NODE-7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CURSOR DINÁMICO (solo en desktop) --- */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[1000] border-2 rounded-full flex items-center justify-center"
          animate={{
            x: mousePos.x - 16,
            y: mousePos.y - 16,
            borderColor: activeColor.hex,
            scale: velocity > 5 ? 1.5 : 1,
            boxShadow: `0 0 20px ${activeColor.hex}44`,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 0.5,
          }}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: activeColor.hex }}
          />
        </motion.div>
      )}
      <FestivalMid />
    </div>
  );
}
