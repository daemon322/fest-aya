// MouseOndaFixed.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// --- Motor de Ondas de Agua con Tamaño Fijo ---
const FixedSizeWaves = ({ mousePos, velocity }) => {
  const canvasRef = useRef(null);
  const rippleRef = useRef({
    width: 0, height: 0, buffer1: null, buffer2: null,
    ctx: null, texture: null, isInitialized: false
  });

  // Tamaño FIJADO del canvas - no depende del tamaño de la página
  const CANVAS_WIDTH = Math.min(800, window.innerWidth); // Máximo 800px
  const CANVAS_HEIGHT = Math.min(600, window.innerHeight); // Máximo 600px

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Usar dimensiones FIJAS, no relativas
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;
    
    canvas.width = w;
    canvas.height = h;
    
    // Estilos para posicionar y escalar manteniendo proporciones
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.objectFit = 'cover'; // Esto mantiene las proporciones
    
    const ctx = canvas.getContext('2d', { alpha: true });
    
    rippleRef.current = {
      width: w, height: h,
      buffer1: new Float32Array(w * h).fill(0),
      buffer2: new Float32Array(w * h).fill(0),
      ctx, 
      texture: ctx.createImageData(w, h),
      isInitialized: true
    };
  }, [CANVAS_WIDTH, CANVAS_HEIGHT]);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    let animationFrame;
    const update = () => {
      const state = rippleRef.current;
      if (!state.isInitialized) {
        animationFrame = requestAnimationFrame(update);
        return;
      }

      const { width, height, buffer1, buffer2, ctx, texture } = state;
      const data = texture.data;
      
      // Simulación Física de Fluidos
      for (let i = width; i < width * height - width; i++) {
        buffer2[i] = ((
          buffer1[i - 1] + 
          buffer1[i + 1] + 
          buffer1[i - width] + 
          buffer1[i + width]
        ) >> 1) - buffer2[i];
        
        buffer2[i] -= buffer2[i] >> 5; 
      }

      // Renderizado
      for (let i = 0; i < buffer2.length; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) continue;

        const dx = buffer2[i] - buffer2[i + 1];
        const dy = buffer2[i] - buffer2[i + width];
        const shade = dx * 1.5;
        
        const idx = i * 4;
        const val = Math.abs(buffer2[i]);
        
        data[idx] = 10 + shade;
        data[idx + 1] = 40 + val + shade;
        data[idx + 2] = 80 + val * 2;
        data[idx + 3] = Math.min(255, 30 + val * 10);
      }

      ctx.putImageData(texture, 0, 0);
      
      rippleRef.current.buffer1 = buffer2;
      rippleRef.current.buffer2 = buffer1;
      
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => { 
      cancelAnimationFrame(animationFrame); 
      window.removeEventListener('resize', initCanvas); 
    };
  }, [initCanvas]);

  // Interacción del mouse - NORMALIZADA para que no dependa del tamaño
  useEffect(() => {
    const state = rippleRef.current;
    if (!state.isInitialized) return;

    const { width, height, buffer1 } = state;
    
    // NORMALIZAR coordenadas del mouse a coordenadas del canvas
    // Usamos viewport, no el tamaño del documento
    const normalizedX = Math.max(0, Math.min(1, mousePos.x / window.innerWidth));
    const normalizedY = Math.max(0, Math.min(1, mousePos.y / window.innerHeight));
    
    const x = Math.floor(normalizedX * width);
    const y = Math.floor(normalizedY * height);

    if (x > 3 && x < width - 3 && y > 3 && y < height - 3) {
      const radius = 2;
      for(let j = -radius; j <= radius; j++) {
        for(let k = -radius; k <= radius; k++) {
          const index = (y + j) * width + (x + k);
          if (index >= 0 && index < buffer1.length) {
            // La fuerza se mantiene constante sin importar la altura de la página
            buffer1[index] += Math.min(250, velocity * 2);
          }
        }
      }
    }
  }, [mousePos, velocity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-20 pointer-events-none mix-blend-screen opacity-70" 
      style={{ 
        filter: 'blur(3px) contrast(1.4) brightness(1.1)',
        pointerEvents: 'none'
      }} 
    />
  );
};

// Versión alternativa: Efecto de ondas que solo cubre el viewport
const ViewportWaves = ({ mousePos, velocity }) => {
  const canvasRef = useRef(null);
  const rippleRef = useRef({
    width: 0, height: 0, buffer1: null, buffer2: null,
    ctx: null, texture: null, isInitialized: false
  });

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Usar el viewport, no el documento completo
    const w = Math.floor(window.innerWidth / 3.5);
    const h = Math.floor(window.innerHeight / 3.5);
    
    canvas.width = w;
    canvas.height = h;
    
    // Canvas FIJADO al viewport
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.objectFit = 'cover';
    
    const ctx = canvas.getContext('2d', { alpha: true });
    
    rippleRef.current = {
      width: w, height: h,
      buffer1: new Float32Array(w * h).fill(0),
      buffer2: new Float32Array(w * h).fill(0),
      ctx, 
      texture: ctx.createImageData(w, h),
      isInitialized: true
    };
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    let animationFrame;
    const update = () => {
      const state = rippleRef.current;
      if (!state.isInitialized) {
        animationFrame = requestAnimationFrame(update);
        return;
      }

      const { width, height, buffer1, buffer2, ctx, texture } = state;
      const data = texture.data;
      
      for (let i = width; i < width * height - width; i++) {
        buffer2[i] = ((
          buffer1[i - 1] + 
          buffer1[i + 1] + 
          buffer1[i - width] + 
          buffer1[i + width]
        ) >> 1) - buffer2[i];
        
        buffer2[i] -= buffer2[i] >> 5; 
      }

      for (let i = 0; i < buffer2.length; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) continue;

        const dx = buffer2[i] - buffer2[i + 1];
        const dy = buffer2[i] - buffer2[i + width];
        const shade = dx * 1.5;
        
        const idx = i * 4;
        const val = Math.abs(buffer2[i]);
        
        data[idx] = 10 + shade;
        data[idx + 1] = 40 + val + shade;
        data[idx + 2] = 80 + val * 2;
        data[idx + 3] = Math.min(255, 30 + val * 10);
      }

      ctx.putImageData(texture, 0, 0);
      
      rippleRef.current.buffer1 = buffer2;
      rippleRef.current.buffer2 = buffer1;
      
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => { 
      cancelAnimationFrame(animationFrame); 
      window.removeEventListener('resize', initCanvas); 
    };
  }, [initCanvas]);

  useEffect(() => {
    const state = rippleRef.current;
    if (!state.isInitialized) return;

    const { width, height, buffer1 } = state;
    
    // Coordenadas NORMALIZADAS al viewport
    const normalizedX = Math.max(0, Math.min(1, mousePos.x / window.innerWidth));
    const normalizedY = Math.max(0, Math.min(1, mousePos.y / window.innerHeight));
    
    const x = Math.floor(normalizedX * width);
    const y = Math.floor(normalizedY * height);

    if (x > 3 && x < width - 3 && y > 3 && y < height - 3) {
      const radius = 2;
      for(let j = -radius; j <= radius; j++) {
        for(let k = -radius; k <= radius; k++) {
          const index = (y + j) * width + (x + k);
          if (index >= 0 && index < buffer1.length) {
            buffer1[index] += Math.min(250, velocity * 2);
          }
        }
      }
    }
  }, [mousePos, velocity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-20 pointer-events-none mix-blend-screen opacity-70" 
      style={{ 
        filter: 'blur(3px) contrast(1.4) brightness(1.1)',
        pointerEvents: 'none'
      }} 
    />
  );
};

// Componente principal - Usa ViewportWaves por defecto
const MouseOndaFixed = ({ children, showCursor = true, useFixedSize = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const vel = Math.sqrt(dx*dx + dy*dy);
    setVelocity(vel);
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMouseMove(touch);
  }, [handleMouseMove]);

  // Solo capturar movimiento en el viewport
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) handleTouchMove(e);
    });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full text-white"
      style={{ minHeight: '100vh' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,900;1,900&family=Space+Grotesk:wght@300;700&family=JetBrains+Mono:wght@400;800&display=swap');
        .font-bodoni { font-family: 'Bodoni Moda', serif; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-outline { -webkit-text-stroke: 1px rgba(0, 242, 255, 0.2); color: transparent; }
      `}</style>

      {/* Efecto de ondas FIJADO al viewport */}
      {useFixedSize ? (
        <FixedSizeWaves mousePos={mousePos} velocity={velocity} />
      ) : (
        <ViewportWaves mousePos={mousePos} velocity={velocity} />
      )}

      {/* Contenido */}
      <div className="relative z-30">
        {children}
      </div>

      {/* Cursor personalizado */}
      {showCursor && (
        <motion.div 
          className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50 border border-cyan-400 rounded-full"
          animate={{ 
            x: mousePos.x - 8, 
            y: mousePos.y - 8,
            scale: velocity > 10 ? 1.5 : 1
          }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300, 
            mass: 0.5 
          }}
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </motion.div>
      )}
    </div>
  );
};

export default MouseOndaFixed;

// Versión simplificada solo para el efecto
export const MouseWavesOnly = ({ showCursor = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const vel = Math.sqrt(dx*dx + dy*dy);
    setVelocity(vel);
    setMousePos({ x: e.clientX, y: e.clientY });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <>
      <ViewportWaves mousePos={mousePos} velocity={velocity} />
      
      {showCursor && (
        <motion.div 
          className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50 border border-cyan-400 rounded-full"
          animate={{ 
            x: mousePos.x - 8, 
            y: mousePos.y - 8,
            scale: velocity > 10 ? 1.5 : 1
          }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300, 
            mass: 0.5 
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </motion.div>
      )}
    </>
  );
};