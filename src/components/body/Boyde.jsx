import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PeruvianFlag - Simulación física optimizada para evitar errores de reconciliación
 */
const PeruvianFlag = () => {
  const meshRef = useRef();

  // Generar textura de la bandera de alta fidelidad
  const flagTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Rojo Peruano (Carmesí Profundo)
    ctx.fillStyle = '#fc1605';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Franja blanca central
    ctx.fillStyle = '#f8f8f8';
    const stripeWidth = canvas.width / 3;
    ctx.fillRect(stripeWidth, 0, stripeWidth, canvas.height);

    // Textura de micro-hilo
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#000';
    for (let i = 0; i < canvas.width; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Guardar posiciones originales de forma segura
  const originalPositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(5, 3, 60, 60);
    return geo.attributes.position.array.slice();
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3;
      const x = originalPositions[ix];
      const y = originalPositions[ix + 1];

      // Algoritmo de ondas fotorrealistas
      const mainWave = Math.sin(x * 1.2 + time * 2.2) * 0.2;
      const detailWave = Math.sin(x * 3.0 - time * 4.0 + y * 2.0) * 0.08;
      const microFlutter = Math.cos(x * 8.0 + time * 6.0) * 0.02;
      
      // Amortiguación lateral (simula el mástil a la izquierda)
      const pinFactor = Math.min(1, (x + 2.5) / 3);
      
      posAttr.array[ix + 2] = (mainWave + detailWave + microFlutter) * pinFactor;
    }

    posAttr.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[0.1, -0.15, 0]}>
      <planeGeometry args={[5, 3, 60, 60]} />
      <meshStandardMaterial 
        map={flagTexture} 
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.15}
        emissive="#110000"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const App = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#100000]">
      <Canvas
        camera={{ position: [0, -5, 5], fov: 23 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Luces de escenario deportivo */}
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <spotLight 
          position={[-5, 5, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={2} 
          color="#ff0000" 
        />
        <directionalLight position={[0, 0, 5]} intensity={0.9} color="#ffffff" />

        <PeruvianFlag />
      </Canvas>

      {/* Capas de atmósfera cinematográfica */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Resplandor superior */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; background: #000; overflow: hidden; }
      `}} />
    </div>
  );
};

export default App;