import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import "../../../styles/home/FestivalHero.css";

const COLORS = [
  { id: "cyan",   name: "Cian Neón",     hex: "#00f2ff", r: 0,   g: 242, b: 255 },
  { id: "purple", name: "Púrpura",        hex: "#a855f7", r: 168, g: 85,  b: 247 },
  { id: "amber",  name: "Ámbar",          hex: "#F7F210", r: 247, g: 242, b: 16  },
  { id: "red",    name: "Rojo Infierno",  hex: "#ef4444", r: 239, g: 68,  b: 68  },
  { id: "fire",   name: "Fuego",          hex: "#ff4d00", r: 255, g: 77,  b: 0   },
  { id: "green",  name: "Verde Neón",     hex: "#55AB63", r: 85,  g: 171, b: 99  },
];

// ─── Simulación de Fluido ────────────────────────────────────────────────────
const FluidSimulation = ({ mousePos, velocity, activeColor }) => {
  const canvasRef  = useRef(null);
  const simRef     = useRef({ width: 0, height: 0, buffer1: null, buffer2: null, ctx: null, texture: null, active: false });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = 0.4;
    const w = Math.floor(window.innerWidth  * scale);
    const h = Math.floor(window.innerHeight * scale);

    canvas.width  = w;
    canvas.height = h;
    canvas.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;object-fit:cover;";

    const ctx = canvas.getContext("2d", { alpha: true });
    simRef.current = {
      width: w, height: h,
      buffer1: new Float32Array(w * h).fill(0),
      buffer2: new Float32Array(w * h).fill(0),
      ctx,
      texture: ctx.createImageData(w, h),
      active: true,
    };
  }, []);

  // Renderizado con requestAnimationFrame
  useEffect(() => {
    init();
    window.addEventListener("resize", init);
    let frame;

    const render = () => {
      const s = simRef.current;
      if (!s?.active) { frame = requestAnimationFrame(render); return; }

      const { width, height, ctx, texture } = s;
      let { buffer1, buffer2 } = s;
      const data    = texture.data;
      const damping = 0.99;

      for (let i = width; i < width * height - width; i++) {
        buffer2[i] = (buffer1[i - 1] + buffer1[i + 1] + buffer1[i - width] + buffer1[i + width]) / 2 - buffer2[i];
        buffer2[i] *= damping;
      }

      for (let i = 0; i < buffer2.length; i++) {
        const val = Math.abs(buffer2[i]);
        const p   = i * 4;
        data[p]     = activeColor.r;
        data[p + 1] = activeColor.g;
        data[p + 2] = activeColor.b;
        data[p + 3] = Math.min(255, val * 8);
      }

      ctx.putImageData(texture, 0, 0);

      // Intercambiar buffers correctamente (swap por referencia en el ref)
      simRef.current.buffer1 = buffer2;
      simRef.current.buffer2 = buffer1;

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", init); };
  }, [init, activeColor]);

  // Actualizar ripple con posición del mouse
  useEffect(() => {
    const s = simRef.current;
    if (!s?.active) return;

    const nx = Math.max(0, Math.min(1, mousePos.x / window.innerWidth));
    const ny = Math.max(0, Math.min(1, mousePos.y / window.innerHeight));
    const x  = Math.floor(nx * s.width);
    const y  = Math.floor(ny * s.height);

    if (x > 2 && x < s.width - 2 && y > 2 && y < s.height - 2) {
      s.buffer1[y * s.width + x] += Math.min(125, velocity * 14);
    }
  }, [mousePos, velocity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none z-10 mix-blend-screen"
      style={{ filter: "blur(3px) contrast(1.5)", pointerEvents: "none" }}
    />
  );
};

// ─── Componente Principal ────────────────────────────────────────────────────
export default function FestivalHero() {
  const [colorIndex, setColorIndex] = useState(0);
  const [mousePos,   setMousePos]   = useState({ x: 0, y: 0 });
  const [velocity,   setVelocity]   = useState(0);
  // FIX: umbral correcto — antes era < 2000 (todas las pantallas serían "mobile")
  const [isMobile,   setIsMobile]   = useState(false);

  const lastMouse = useRef({ x: 0, y: 0 });
  const activeColor = COLORS[colorIndex];

  // FIX: memoizar con useCallback para que useEffect no cree/elimine
  //      el listener en cada render
  const handleMouseMove = useCallback((e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dx = clientX - lastMouse.current.x;
    const dy = clientY - lastMouse.current.y;
    setVelocity(Math.sqrt(dx * dx + dy * dy));
    setMousePos({ x: clientX, y: clientY });
    lastMouse.current = { x: clientX, y: clientY };
  }, []);

  const cycleColor = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % COLORS.length);
  }, []);

  // Detección de mobile con threshold correcto (768 px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Un solo listener global para mouse y touch
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove",  handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove",  handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="relative w-full bg-black text-white overflow-hidden font-sans select-none pb-10 pt-20">
      <FluidSimulation mousePos={mousePos} velocity={velocity} activeColor={activeColor} />

      <div className="relative flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="mt-4 sm:mt-0">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 items-end">
            <div className="flex justify-center order-1 md:order-2 mb-6 sm:mb-0">
              <a href="/tickets">
                <motion.button
                  onMouseEnter={cycleColor}
                  onClick={cycleColor}
                  onTouchStart={cycleColor}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-6 sm:p-8 rounded-3xl overflow-visible transition-all duration-500 group cursor-pointer"
                  aria-label="Adquirir entradas"
                >
                  <div
                    className="absolute inset-0 rounded-3xl blur-xl sm:blur-2xl opacity-40 transition-colors duration-500"
                    style={{ backgroundColor: activeColor.hex }}
                  />
                  <div
                    className="relative rounded-3xl border-2 flex items-center justify-center transition-all duration-500 p-4"
                    style={{ borderColor: activeColor.hex, color: activeColor.hex }}
                  >
                    <p className="flex gap-4 w-full text-center items-center font-bold">
                      ADQUIERE TUS ENTRADAS
                      <Zap
                        className="neon-text"
                        size={isMobile ? 24 : 40}
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
