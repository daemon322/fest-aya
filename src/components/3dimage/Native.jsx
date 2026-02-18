import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

// Componente del modelo 3D optimizado
function Model({ modelPath, position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          if (typeof child.material.envMapIntensity !== 'undefined') {
            child.material.envMapIntensity = 1.8;
          }
          child.material.needsUpdate = true;
        }
      }
    });

    return () => {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose?.());
            } else {
              child.material.dispose?.();
            }
          }
        }
      });
    };
  }, [scene]);

  return (
    <primitive
      ref={meshRef}
      object={scene}
      position={position}
      scale={scale}
    />
  );
}

// Sistema de iluminación mejorado
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[200, 200]}
        shadow-camera-far={2}
        shadow-bias={-0.01}
      />
      <directionalLight
        position={[0, 0, -0]}
        intensity={0.2}
        color="#4a90e2"
      />
      <hemisphereLight
        args={['#ffffff', '#1a1a2e', 0.01]}
      />
    </>
  );
}

// Componente principal minimalista
function Native({ modelPath = "/death.glb" }) {
  const controlsRef = useRef();

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{
          position: [6, 4, 6],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        className="w-full h-full"
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.3;
          gl.setClearColor(0x000000, 1);
        }}
      >
        <Environment 
          preset="studio" 
          background={false} 
          environmentIntensity={1}
        />

        <StudioLighting />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.8}
          rotateSpeed={0.8}
          panSpeed={0.8}
          minDistance={1.8}
          maxDistance={115}
          maxPolarAngle={Math.PI / 2.1}
          dampingFactor={0.08}
        />

        {/* Suelo sutil para sombras */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>

        <Suspense fallback={null}>
          <Model
            modelPath={modelPath}
            scale={1.2}
            position={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Solo un indicador de carga discreto */}
      <div className="absolute top-8 right-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/60 font-mono">3D READY</span>
        </div>
      </div>
    </div>
  );
}

export default Native;