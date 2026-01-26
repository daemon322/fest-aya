import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Image as ImageIcon, } from "lucide-react";
import "../../../styles/home/FestivalHero.css";
// Paleta extendida solicitada
const COLORS = [
  { id: "cyan", name: "Cian Neón", hex: "#00f2ff", r: 0, g: 242, b: 255 },
  { id: "purple", name: "Púrpura", hex: "#a855f7", r: 168, g: 85, b: 247 },
  { id: "amber", name: "Ámbar", hex: "#F7F210", r: 247, g: 242, b: 16, a: 97 },
  { id: "red", name: "Rojo Infierno", hex: "#ef4444", r: 239, g: 68, b: 68 },
  { id: "fire", name: "Fuego", hex: "#ff4d00", r: 255, g: 77, b: 0 },
  {
    id: "green", name: "Verde Neón", hex: "#55AB63", r: 85, g: 171, b: 99, a: 67,},
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

export default function FestivalHero() {
  const [colorIndex, setColorIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const lastMouse = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const activeColor = COLORS[colorIndex];


  const handleMouseMove = (e) => {
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    const v = Math.sqrt(dx * dx + dy * dy);
    setVelocity(v);
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };


  const cycleColor = () => {
    setColorIndex((prev) => (prev + 1) % COLORS.length);
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 2000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
      className="relative w-full bg-black text-white overflow-hidden font-sans select-none pb-10 pt-20"
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMouseMove(touch);
      }}
    >

      {/* --- SIMULACIÓN DE ONDAS FIJADA AL VIEWPORT --- */}
      <FluidSimulation
        mousePos={mousePos}
        velocity={velocity}
        activeColor={activeColor}
      />

      {/* --- INTERFAZ PRINCIPAL --- */}
      <div className="relative flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12">

        {/* Footer Info - Totalmente responsivo */}
        <div className="mt-4 sm:mt-0">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 items-end">
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
          </div>
        </div>
      </div>
    </div>
  );
}
