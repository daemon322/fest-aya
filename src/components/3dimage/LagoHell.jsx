import React, { useRef, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, useAnimations } from '@react-three/drei';

// Modelo 3D con soporte de animaciones robusto
function Model({ modelPath, position = [0, 0, 0], scale = 1 }) {
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names, mixer } = useAnimations(animations, scene);
  const meshRef = useRef();

  useEffect(() => {
    // Ajustes iniciales de materiales / sombras
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

    // Manejo de animaciones:
    let finishedCallback;
    const actionKeys = Object.keys(actions || {});

    if (mixer && actionKeys.length > 0) {
      if (actionKeys.length === 1) {
        // Si solo hay una animación, la reproducimos en bucle
        const a = actions[actionKeys[0]];
        a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
      } else {
        // Si hay varias animaciones, las reproducimos en secuencia y loop global
        let idx = 0;
        // Asegurar que todas estén en stop
        actionKeys.forEach(k => actions[k].stop());

        // Función para reproducir índice
        const playIndex = (i) => {
          const key = actionKeys[i];
          const action = actions[key];
          action.reset().setLoop(THREE.LoopOnce, 0).play();
        };

        // Al terminar una animación, reproducir la siguiente
        finishedCallback = () => {
          // parar todas por seguridad
          actionKeys.forEach(k => actions[k].stop());
          idx = (idx + 1) % actionKeys.length;
          playIndex(idx);
        };

        mixer.addEventListener('finished', finishedCallback);
        // arrancar la primera
        playIndex(0);
      }
    }

    // Cleanup: liberar geometrías, materiales y listeners de animación
    return () => {
      try {
        if (mixer) {
          mixer.stopAllAction();
          if (finishedCallback) mixer.removeEventListener('finished', finishedCallback);
        }
      } catch (e) { /* ignorar */ }

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
  }, [scene, animations, actions, mixer]);

  return (
    <primitive
      ref={meshRef}
      object={scene}
      position={position}
      scale={scale}
    />
  );
}

// Iluminación dinámica día/noche. Se puede controlar cycleLength (segundos por ciclo completo).
function StudioLighting({ cycleLength = 20 }) {
  const sunRef = useRef();
  const moonRef = useRef();
  const ambientRef = useRef();
  const hemiRef = useRef();
  const timeRef = useRef(0);
  const tmpDayColor = useRef(new THREE.Color(0x87ceeb)); // cielo día
  const tmpNightColor = useRef(new THREE.Color(0x04061a)); // noche profunda

  // useThree para acceder a gl y poder cambiar exposure / clear color dinámicamente
  const { gl } = useThree();

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = (timeRef.current % cycleLength) / cycleLength; // 0..1
    const angle = t * Math.PI * 2; // rotación completa
    const sunY = Math.sin(angle); // -1 .. 1
    const dayFactor = THREE.MathUtils.clamp((sunY + 0.0) / 1.0, 0, 1); // 0 .. 1 (solo cuando sol arriba)

    // Posicionar sol y luna
    const radius = 12;
    if (sunRef.current) {
      sunRef.current.position.set(Math.cos(angle) * radius, sunY * radius, Math.sin(angle) * radius);
      // intensidad del sol: más brillante de día
      sunRef.current.intensity = THREE.MathUtils.lerp(0.12, 1.8, dayFactor);
      // color ligeramente amarillento en día, más frío al amanecer/atardecer
      sunRef.current.color.setHSL(0.12, 0.9, THREE.MathUtils.lerp(0.35, 0.7, dayFactor));
    }

    if (moonRef.current) {
      // luna en posición opuesta
      moonRef.current.position.set(-Math.cos(angle) * radius, -sunY * radius, -Math.sin(angle) * radius);
      moonRef.current.intensity = THREE.MathUtils.lerp(0.25, 0.02, dayFactor); // más visible por la noche
      moonRef.current.color.setHSL(0.62, 0.6, 0.9);
    }

    // luces ambientales / hemisphere
    if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.lerp(0.02, 0.7, dayFactor);
    if (hemiRef.current) hemiRef.current.intensity = THREE.MathUtils.lerp(0.02, 0.4, dayFactor);

    // Ajuste de exposición para dar sensación de diferencia de brillo entre día y noche
    gl.toneMappingExposure = THREE.MathUtils.lerp(0.35, 1.2, dayFactor);

    // Interpolación del color de fondo (cielo) entre noche y día
    const clearColor = tmpNightColor.current.clone().lerp(tmpDayColor.current, dayFactor);
    gl.setClearColor(clearColor, 1);
  });

  return (
    <>
      {/* Sol principal */}
      <directionalLight
        ref={sunRef}
        position={[10, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
      />
      {/* Luz de luna (azulada, sutil) */}
      <directionalLight
        ref={moonRef}
        position={[-10, -10, -5]}
        intensity={0.1}
        color="#8fb5ff"
      />
      {/* Ambient / Hemisphere */}
      <ambientLight ref={ambientRef} intensity={0.2} />
      <hemisphereLight
        ref={hemiRef}
        args={['#ffffff', '#222244', 0.05]}
      />
    </>
  );
}

// Componente principal
function LagoHell({ modelPath = "/death.glb", cycleLength = 20 }) {
  const controlsRef = useRef();

  return (
    <div className="w-full h-full bg-black overflow-hidden inset-0 fixed">
      <Canvas
        shadows
        camera={{
          position: [60, 0, 50],
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
        {/* Environment para reflexiones (no background, lo manejamos dinámicamente) */}
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={1}
        />

        {/* Iluminación dinámica */}
        <StudioLighting cycleLength={cycleLength} />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.8}
          rotateSpeed={0.8}
          panSpeed={0.8}
          minDistance={58.8}
          maxDistance={115}
          maxPolarAngle={Math.PI / 2.1}
          dampingFactor={0.08}
        />

        {/* Suelo sutil para sombras */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[24, 24]} />
          <shadowMaterial transparent opacity={0.18} />
        </mesh>

        <Suspense fallback={null}>
          <Model
            modelPath={modelPath}
            scale={1.2}
            position={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Indicador discreto */}
      <div className="absolute top-8 right-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/60 font-mono">3D READY</span>
        </div>
      </div>
    </div>
  );
}

export default LagoHell;
