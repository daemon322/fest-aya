import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize, RotateCcw, Users, CheckCircle2, Info, Calendar } from 'lucide-react';

const Tribuna = () => {
  const mountRef      = useRef(null);
  const [activeZone, setActiveZone] = useState('Overview');

  // Referencias persistentes para Three.js
  const sceneRef          = useRef(null);
  const cameraRef         = useRef(null);
  const rendererRef       = useRef(null);
  const complexRef        = useRef(null);
  const animationFrameRef = useRef(null);
  const targetCamPos      = useRef({ x: 25, y: 18, z: 25 });
  const targetRotation    = useRef({ x: 0.3, y: -0.6 });
  const threeInitialized  = useRef(false);

  // FIX: usar refs en lugar de state para activeZone e isRotating
  //      dentro del loop de rAF (el closure captura el valor inicial de state).
  const activeZoneRef  = useRef('Overview');
  const isRotatingRef  = useRef(true);

  // Sincronizar ref cuando cambia el estado
  useEffect(() => {
    activeZoneRef.current = activeZone;
  }, [activeZone]);

  // Inicialización Three.js (solo una vez)
  useEffect(() => {
    if (threeInitialized.current) return;

    const loadThree = () => {
      if (!window.THREE) {
        const script    = document.createElement('script');
        script.src      = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload   = initThree;
        document.head.appendChild(script);
      } else {
        initThree();
      }
    };

    const initThree = () => {
      const THREE = window.THREE;
      if (!mountRef.current || threeInitialized.current) return;

      // Escena
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      scene.fog        = new THREE.Fog(0x020202, 30, 80);
      sceneRef.current = scene;

      // Cámara
      const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 3.1, 2000);
      camera.position.set(25, 18, 25);
      cameraRef.current = camera;

      // Renderizador
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Luces
      scene.add(new THREE.AmbientLight(0x404040, 1.2));
      const spotLight = new THREE.SpotLight(0xffffff, 2);
      spotLight.position.set(20, 40, 20);
      spotLight.angle   = Math.PI / 4;
      spotLight.penumbra = 0.3;
      spotLight.castShadow = true;
      scene.add(spotLight);
      const pointLight = new THREE.PointLight(0x3b82f6, 1, 50);
      pointLight.position.set(0, 5, 0);
      scene.add(pointLight);

      // Construcción del complejo
      const sportsComplex = new THREE.Group();
      complexRef.current  = sportsComplex;

      const floorMat = new THREE.MeshStandardMaterial({ color: 0x242525, roughness: 0.9, metalness: 0.1 });
      const floor    = new THREE.Mesh(new THREE.PlaneGeometry(35, 45), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      sportsComplex.add(floor);

      const courtMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3, metalness: 0.2 });
      const court    = new THREE.Mesh(new THREE.PlaneGeometry(12, 22), courtMat);
      court.rotation.x  = -Math.PI / 2;
      court.position.y  = 0.08;
      court.receiveShadow = true;
      sportsComplex.add(court);

      // Líneas
      const lineMat  = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const perimeter = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 22.2), lineMat);
      perimeter.rotation.x = -Math.PI / 2;
      perimeter.position.y  = 0.075;
      sportsComplex.add(perimeter);
      const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 0.2), lineMat);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.y  = 0.09;
      sportsComplex.add(centerLine);

      // Postes
      const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5);
      const postMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.3 });
      [-6.2, 6.2].forEach((x) => {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(x, 1.75, 0);
        post.castShadow = true;
        sportsComplex.add(post);
      });

      // Red
      const netMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, wireframe: true, emissive: 0x224466 });
      const net    = new THREE.Mesh(new THREE.BoxGeometry(12.5, 1.8, 0.1), netMat);
      net.position.set(0, 2.3, 0);
      sportsComplex.add(net);

      // Graderías
      const createBleachers = (side) => {
        const group = new THREE.Group();
        for (let i = 0; i < 7; i++) {
          const step = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0.8, 26),
            new THREE.MeshStandardMaterial({ color: 0x0b6a8d, roughness: 0.7, metalness: 0.3 })
          );
          step.position.set(i * 1.6, i * 0.9, 0);
          step.castShadow = step.receiveShadow = true;
          group.add(step);
        }
        group.position.x  = side === 'left' ? -16 : 16;
        if (side === 'left') group.rotation.y = Math.PI;
        return group;
      };
      sportsComplex.add(createBleachers('left'));
      sportsComplex.add(createBleachers('right'));

      // Asientos VIP
      const createVIPRow = (xPos, side) => {
        const group  = new THREE.Group();
        const seatMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4, metalness: 0.2 });
        for (let i = 0; i < 14; i++) {
          const seat = new THREE.Group();
          seat.add(new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), seatMat));
          const back = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.15), seatMat);
          back.position.set(0, 0.5, -0.4);
          seat.add(back);
          seat.position.set(xPos, 0.4, -10 + i * 1.6);
          seat.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
          seat.castShadow = true;
          group.add(seat);
        }
        return group;
      };
      sportsComplex.add(createVIPRow(-8.5, 'left'));
      sportsComplex.add(createVIPRow( 8.5, 'right'));

      scene.add(sportsComplex);

      // Loop de animación — FIX: leer refs en lugar de state (evita stale closure)
      const animate = () => {
        if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

        if (complexRef.current) {
          complexRef.current.rotation.y += (targetRotation.current.y - complexRef.current.rotation.y) * 0.04;
          complexRef.current.rotation.x += (targetRotation.current.x - complexRef.current.rotation.x) * 0.04;
          // FIX: usar ref, no variable de closure
          if (isRotatingRef.current && activeZoneRef.current === 'Overview') {
            targetRotation.current.y += 0.0015;
          }
        }

        const cam = cameraRef.current;
        cam.position.x += (targetCamPos.current.x - cam.position.x) * 0.04;
        cam.position.y += (targetCamPos.current.y - cam.position.y) * 0.04;
        cam.position.z += (targetCamPos.current.z - cam.position.z) * 0.04;
        cam.lookAt(0, 0, 0);

        rendererRef.current.render(sceneRef.current, cam);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      threeInitialized.current = true;
    };

    loadThree();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && mountRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      threeInitialized.current = false;
    };
  }, []);

  // Cambios de vista — FIX: ahora actualiza refs además del estado
  useEffect(() => {
    if (!threeInitialized.current) return;

    if (activeZone === 'VIP') {
      targetCamPos.current     = { x: 1, y: 1, z: 12 };
      targetRotation.current   = { x: 0.3, y: -0.8 };
      isRotatingRef.current    = false;
    } else if (activeZone === 'General') {
      targetCamPos.current     = { x: 25, y: 10, z: -18 };
      targetRotation.current   = { x: 0, y: 0 };
      isRotatingRef.current    = false;
    } else {
      targetCamPos.current     = { x: 25, y: 18, z: 25 };
      targetRotation.current   = { x: 0, y: 0 };
      isRotatingRef.current    = true;
    }
  }, [activeZone]);

  // Resize
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getButtonClass = (id) => {
    const base = 'flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all border whitespace-nowrap cursor-pointer ';
    if (activeZone === id) {
      if (id === 'VIP')     return base + 'bg-purple-600 border-white/40 shadow-lg shadow-purple-500/20';
      if (id === 'General') return base + 'bg-blue-600 border-white/40 shadow-lg shadow-blue-500/20';
      return base + 'bg-white/20 border-white/40 shadow-lg shadow-white/20';
    }
    return base + 'bg-white/5 border-white/10 hover:bg-white/10';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white">
      <div ref={mountRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none pt-10 px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 pt-10 h-full">
          <div className="pointer-events-auto p-5 lg:p-7 max-w-sm w-full select-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><MapPin size={16} /></div>
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-200">Sede Central · Mercedes</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black italic tracking-tighter leading-none mb-4 uppercase">
              Plano de <span className="text-red-500 italic">Asientos</span>
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[12px] font-bold text-gray-100 uppercase">VIP</span>
                </div>
                <p className="text-xs font-bold text-gray-300">Butaca Campo</p>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[12px] font-bold text-gray-100 uppercase">General</span>
                </div>
                <p className="text-xs font-bold text-gray-300">Gradas Norte/Occidente</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-wrap lg:flex-col gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'VIP',      label: 'Zona VIP',    icon: Maximize  },
              { id: 'General',  label: 'General',     icon: Users     },
              { id: 'Overview', label: 'Vista Global', icon: RotateCcw },
            ].map((btn) => (
              <button key={btn.id} onClick={() => setActiveZone(btn.id)} className={getButtonClass(btn.id)}>
                <btn.icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-end items-end gap-6 pb-5">
          <div className="hidden lg:block pointer-events-auto bg-black/10 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] max-w-xs w-full select-none">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-blue-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">Detalles Sede</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-bold uppercase">Aforo Máx.</span>
                <span className="font-bold">1,000 Personas</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-bold uppercase">Seguridad</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Nivel 1
                </span>
              </div>
              <div className="pt-2 border-t border-white/5 flex gap-2">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="text-[10px] text-gray-400 leading-tight">
                  Acceso habilitado 1 hora antes del evento principal.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tribuna;
