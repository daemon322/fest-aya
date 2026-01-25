// FluidMouseEffects.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Componente de simulación de fluidos
const FluidSimulation = ({ mousePos, velocity, activeColor }) => {
  const canvasRef = useRef(null);
  const rippleData = useRef({
    width: 0, height: 800, 
    buffer1: null, buffer2: null,
    ctx: null, texture: null,
    active: false
  });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = 0.2;
    const w = Math.floor(window.innerWidth * scale);
    const h = Math.floor(window.innerHeight * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: true });
    rippleData.current = {
      width: w, height: h,
      buffer1: new Float32Array(w * h).fill(0),
      buffer2: new Float32Array(w * h).fill(0),
      ctx,
      texture: ctx.createImageData(w, h),
      active: true
    };
  }, []);

  useEffect(() => {
    init();
    window.addEventListener('resize', init);
    let frame;
    
    const render = () => {
      const s = rippleData.current;
      if (!s || !s.active) { 
        frame = requestAnimationFrame(render); 
        return; 
      }
      
      const { width, height, buffer1, buffer2, ctx, texture } = s;
      const data = texture.data;
      const damping = 0.98;

      // Cálculo de las ondas
      for (let i = width; i < width * height - width; i++) {
        buffer2[i] = ((buffer1[i - 1] + buffer1[i + 1] + buffer1[i - width] + buffer1[i + width]) / 2) - buffer2[i];
        buffer2[i] *= damping;
      }

      // Aplicar color a los píxeles
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
      window.removeEventListener('resize', init); 
    };
  }, [init, activeColor]);

  // Efecto cuando se mueve el mouse
  useEffect(() => {
    const s = rippleData.current;
    if (!s || !s.active) return;
    
    const scale = s.width / window.innerWidth;
    const x = Math.floor(mousePos.x * scale);
    const y = Math.floor(mousePos.y * scale);
    
    if (x > 2 && x < s.width - 2 && y > 2 && y < s.height - 2) {
      const idx = y * s.width + x;
      s.buffer1[idx] += Math.min(100, velocity * 14);
    }
  }, [mousePos, velocity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-screen" 
      style={{ filter: 'blur(3px) contrast(1.5)' }} 
    />
  );
};

// Componente del cursor personalizado
const DynamicCursor = ({ mousePos, velocity, activeColor, isMobile }) => {
  if (isMobile) return null;
  
  return (
    <motion.div 
      className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-[1000] border-2 rounded-full flex items-center justify-center"
      animate={{ 
        x: mousePos.x - 16, 
        y: mousePos.y - 16,
        borderColor: activeColor.hex,
        scale: velocity > 5 ? 1.5 : 1,
        boxShadow: `0 0 20px ${activeColor.hex}44`
      }}
      transition={{ 
        type: 'spring', 
        damping: 25, 
        stiffness: 400, 
        mass: 0.5 
      }}
    >
      <div 
        className="w-1 h-1 rounded-full" 
        style={{ backgroundColor: activeColor.hex }} 
      />
    </motion.div>
  );
};

// Componente principal de efectos del mouse
const FluidMouseEffects = ({ 
  colorIndex = 0,
  showCursor = true,
  showFluid = true,
  customColor 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const lastMouse = useRef({ x: 0, y: 0 });
  
  // Paleta de colores por defecto
  const defaultColors = [
    { id: 'cyan', name: "Cian Neón", hex: "#00f2ff", r: 0, g: 242, b: 255 },
    { id: 'purple', name: "Púrpura", hex: "#a855f7", r: 168, g: 85, b: 247 },
    { id: 'amber', name: "Ámbar", hex: "#F27405", r: 242, g: 116, b: 5 },
    { id: 'red', name: "Rojo Infierno", hex: "#ef4444", r: 239, g: 68, b: 68 },
    { id: 'fire', name: "Fuego", hex: "#ff4d00", r: 255, g: 77, b: 0 },
    { id: 'green', name: "Verde Neón", hex: "#39ff14", r: 57, g: 255, b: 20 }
  ];
  
  // Usar color personalizado o de la paleta
  const activeColor = customColor || defaultColors[colorIndex % defaultColors.length];
  
  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    const v = Math.sqrt(dx * dx + dy * dy);
    
    setVelocity(v);
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMouseMove(touch);
  }, [handleMouseMove]);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <>
      {/* Contenedor para capturar movimiento */}
      <div 
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
      
      {/* Efectos visuales */}
      {showFluid && (
        <FluidSimulation 
          mousePos={mousePos} 
          velocity={velocity} 
          activeColor={activeColor} 
        />
      )}
      
      {/* Cursor personalizado */}
      {showCursor && (
        <DynamicCursor 
          mousePos={mousePos} 
          velocity={velocity} 
          activeColor={activeColor} 
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default FluidMouseEffects;

