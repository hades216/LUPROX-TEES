import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  Environment, 
  PerspectiveCamera,
  Text,
  Center,
  Html,
  Cloud,
  Sparkles,
  MeshTransmissionMaterial
} from "@react-three/drei";
import * as THREE from "three";

function SigilParticles({ count = 100 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  useFrame((state) => {
    // Subtle movement
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#800000" transparent opacity={0.5} />
    </points>
  );
}

function BloodRain({ count = 600 }) {
  const meshRef = useRef<THREE.LineSegments>(null);
  const sigilsRef = useRef<THREE.Group>(null);
  
  // Pool for ground sigils
  const sigilPoolSize = window.innerWidth < 768 ? 15 : 30;
  const sigilPool = useMemo(() => {
    return Array.from({ length: sigilPoolSize }).map(() => ({
      active: false,
      x: 0,
      z: 0,
      time: 0,
      scale: 0,
      opacity: 0
    }));
  }, []);

  const [positions, speeds, lengths] = useMemo(() => {
    const pos = new Float32Array(count * 2 * 3);
    const spd = new Float32Array(count);
    const len = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = Math.random() * 20 - 5;
      const z = (Math.random() - 0.5) * 15;
      const l = 0.3 + Math.random() * 0.5;
      
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y - l;
      pos[i * 6 + 5] = z;
      
      spd[i] = 0.02 + Math.random() * 0.03; // SLOWED DOWN RAIN
      len[i] = l;
    }
    return [pos, spd, len];
  }, [count]);

  const groundY = -4;

  useFrame((state) => {
    if (!meshRef.current || !sigilsRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    // Update Rain
    for (let i = 0; i < count; i++) {
      const currentY = posAttr.getY(i * 2);
      const nextY = currentY - speeds[i];
      
      if (nextY < groundY) {
        // Impact!
        const impactX = posAttr.getX(i * 2);
        const impactZ = posAttr.getZ(i * 2);
        
        // Trigger a sigil from the pool
        const poolIdx = Math.floor(Math.random() * sigilPoolSize);
        if (!sigilPool[poolIdx].active || sigilPool[poolIdx].time < time - 1) {
          sigilPool[poolIdx].active = true;
          sigilPool[poolIdx].x = impactX;
          sigilPool[poolIdx].z = impactZ;
          sigilPool[poolIdx].time = time;
        }

        // Reset drop to top
        const newX = (Math.random() - 0.5) * 25;
        const newY = 15;
        const newZ = (Math.random() - 0.5) * 15;
        posAttr.setXYZ(i * 2, newX, newY, newZ);
        posAttr.setXYZ(i * 2 + 1, newX, newY - lengths[i], newZ);
      } else {
        posAttr.setY(i * 2, nextY);
        posAttr.setY(i * 2 + 1, nextY - lengths[i]);
      }
    }
    posAttr.needsUpdate = true;

    // Update Sigils
    sigilsRef.current.children.forEach((child, idx) => {
      const sigil = sigilPool[idx];
      if (sigil.active) {
        const age = time - sigil.time;
        if (age > 1.5) {
          sigil.active = false;
          child.visible = false;
        } else {
          child.visible = true;
          child.position.set(sigil.x, groundY + 0.01, sigil.z);
          const scale = age * 1.5;
          child.scale.set(scale, scale, scale);
          const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, 1 - age / 1.5) * 0.8;
          child.rotation.y += 0.02;
        }
      } else {
        child.visible = false;
      }
    });
  });

  return (
    <>
      <lineSegments ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count * 2}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#881337" 
          transparent 
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <group ref={sigilsRef}>
        {sigilPool.map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
            <ringGeometry args={[0.2, 0.25, 4]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Ground Plane for visual reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050505" transparent opacity={0.5} roughness={0.1} metalness={0.8} />
      </mesh>
    </>
  );
}

function CyberHelmet({ offset }: { offset: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const isMobile = window.innerWidth < 768;

  useFrame((state) => {
    if (groupRef.current) {
      // Visibility for the first section (Hero) - 0.0 to 0.25
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, -0.05, 0.3));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.12 - offset) * 15 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5 + offset * Math.PI;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 0.9 : 1.4));
      
      const targetX = isMobile ? 0 : (-viewport.width / 5);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/90 border border-cyan-600 p-2 backdrop-blur-md pointer-events-none scale-90 whitespace-nowrap min-w-[120px] shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <p className="text-[10px] text-cyan-500 font-black tracking-widest uppercase horror-glitch" data-text="HM-07-VOID">HM-07-VOID</p>
            <p className="text-[8px] text-white/40 uppercase tracking-tighter mt-1 italic">Type: Neuro-Interface Helmet</p>
          </div>
        </Html>
      )}
      {/* Helmet Base */}
      <mesh>
        <sphereGeometry args={[0.6, isMobile ? 16 : 32, isMobile ? 16 : 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshPhysicalMaterial color="#080808" metalness={0.9} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI * 0.2, 0, 0]}>
        <sphereGeometry args={[0.55, isMobile ? 16 : 32, isMobile ? 16 : 32, 0, Math.PI, 0, Math.PI * 0.5]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#b026ff"
        />
      </mesh>
      {/* Tech Details */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} clearcoat={1} />
      </mesh>
      <pointLight position={[0, 0, 0.8]} color="#00ffff" intensity={2} distance={3} />
    </group>
  );
}

function CyberShirt({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  useFrame((state) => {
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const offset = scrollProgress.get();
      // Visibility for the second section (Drop Down) 
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, 0.1, 0.45));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.28 - offset) * 10 + Math.sin(state.clock.elapsedTime * 6) * 0.02;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3 + offset * Math.PI * 2;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 1.0 : 1.3));
      
      // Fixed X offset to prevent running off ultra-wide screens
      const targetX = isMobile ? 0 : 2.2;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/90 border border-maroon-600 p-2 backdrop-blur-md pointer-events-none scale-90 whitespace-nowrap min-w-[120px] shadow-[0_0_15px_rgba(131,19,55,0.4)]">
            <p className="text-[10px] text-maroon-500 font-black tracking-widest uppercase horror-glitch" data-text="CS-01-DD">CS-01-DD</p>
            <p className="text-[8px] text-white/40 uppercase tracking-tighter mt-1 italic">Type: Forbidden Fiber / Chrome</p>
          </div>
        </Html>
      )}
      {/* Oversized Boxy Torso */}
      <mesh position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.7, 1.0, 4, 16]} />
        {isMobile ? <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.8} /> : <MeshDistortMaterial color="#050505" roughness={0.4} metalness={0.8} distort={0.3} speed={2} />}
      </mesh>
      {/* Cyber Mesh Overlay */}
      {!isMobile && (
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.72, 1.0, 4, 16]} />
          <MeshDistortMaterial color="#881337" wireframe transparent opacity={0.3} distort={0.3} speed={2} />
        </mesh>
      )}
      {/* Ribbed Collar */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.05, 12, 24]} />
        {isMobile ? <meshStandardMaterial color="#0a0a0a" roughness={0.8} /> : <meshPhysicalMaterial color="#0a0a0a" roughness={0.8} sheen={0.5} sheenColor="#ffffff" />}
      </mesh>
      {/* Chrome Shoulder Plates */}
      <mesh position={[-0.7, 0.4, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        {isMobile ? <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} /> : <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.05} clearcoat={1} />}
      </mesh>
      <mesh position={[0.7, 0.4, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        {isMobile ? <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} /> : <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.05} clearcoat={1} />}
      </mesh>
      {/* Short wide sleeves */}
      <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.3, 0.25, 0.8]} />
        {isMobile ? <meshStandardMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} /> : <meshPhysicalMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} sheen={1} sheenColor="#b026ff" clearcoat={0.1} />}
      </mesh>
      <mesh position={[0.8, 0.1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.3, 0.25, 0.8]} />
        {isMobile ? <meshStandardMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} /> : <meshPhysicalMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} sheen={1} sheenColor="#b026ff" clearcoat={0.1} />}
      </mesh>
      <pointLight position={[0, 0.2, 0.8]} color="#ff00ff" intensity={6} distance={4} />
    </group>
  );
}

function FullSleeveModel({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const hoverStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [intensity, setIntensity] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hoveredSigil, setHoveredSigil] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const offset = scrollProgress.get();
      // Visibility for the third section (Full Sleeves)
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, 0.35, 0.75));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.55 - offset) * 10 + Math.cos(state.clock.elapsedTime * 5) * 0.02;
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.6 + offset * Math.PI * 3;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 1.0 : 1.25));
      
      // Fixed X offset to prevent running off ultra-wide screens
      const targetX = isMobile ? 0 : -2.2;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    }

    // Dynamic Intensity Calculation
    if (hoveredSigil) {
        setIntensity(prev => Math.min(prev + delta * 2, 8)); // 0 to 8
    } else {
        setIntensity(prev => Math.max(prev - delta * 4, 0));
    }
    
    // Pitch shift hum
    if (sourceRef.current) {
        sourceRef.current.playbackRate.value = 0.8 + (intensity / 8) * 0.5;
        if (gainRef.current) gainRef.current.gain.value = 0.05 + (intensity / 8) * 0.1;
    }
  });

  const initAudio = async () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const response = await fetch("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
        const buffer = await audioContextRef.current.decodeAudioData(await response.arrayBuffer());
        
        sourceRef.current = audioContextRef.current.createBufferSource();
        sourceRef.current.buffer = buffer;
        sourceRef.current.loop = true;
        
        gainRef.current = audioContextRef.current.createGain();
        gainRef.current.gain.value = 0.05;
        
        sourceRef.current.connect(gainRef.current);
        gainRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
    if (sourceRef.current && sourceRef.current.buffer) sourceRef.current.start(0);
  };


  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/90 border border-maroon-600 p-2 backdrop-blur-md pointer-events-none scale-90 whitespace-nowrap min-w-[120px] shadow-[0_0_15px_rgba(131,19,55,0.4)]">
            <p className="text-[10px] text-maroon-500 font-black tracking-widest uppercase horror-glitch" data-text="CS-02-FS">CS-02-FS</p>
            <p className="text-[8px] text-white/40 uppercase tracking-tighter mt-1 italic">Type: Compressive Tech-Silk</p>
          </div>
        </Html>
      )}
      {/* Compressive Techwear Torso */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.45, 1.4, isMobile ? 4 : 8, isMobile ? 12 : 24]} />
        {isMobile ? <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.3} /> : <MeshWobbleMaterial color="#050505" roughness={0.4} metalness={0.3} factor={0.2} speed={4} />}
      </mesh>
      {/* Woven Sigil Overlay */}
      {!isMobile && (
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.46, 1.4, 8, 24]} />
          <MeshWobbleMaterial color="#b026ff" wireframe transparent opacity={0.25} factor={0.2} speed={4} />
        </mesh>
      )}
      {/* Sleeve detail - Elbow pads */}
      <mesh position={[-0.55, -0.2, 0]} rotation={[0, 0, 0.8]}>
        <boxGeometry args={[0.2, 0.4, 0.3]} />
        {isMobile ? <meshStandardMaterial color="#020202" metalness={0.9} roughness={0.1} /> : <meshPhysicalMaterial color="#020202" metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />}
      </mesh>
      <mesh position={[0.55, -0.2, 0]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.2, 0.4, 0.3]} />
        {isMobile ? <meshStandardMaterial color="#020202" metalness={0.9} roughness={0.1} /> : <meshPhysicalMaterial color="#020202" metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />}
      </mesh>
      {/* Long Sleeves */}
      <mesh position={[-0.6, 0.2, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.18, 0.12, 1.8, isMobile ? 4 : 8]} />
        {isMobile ? <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} /> : <meshPhysicalMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} sheen={1} sheenColor="#b026ff" />}
      </mesh>
      <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.18, 0.12, 1.8, isMobile ? 4 : 8]} />
        {isMobile ? <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} /> : <meshPhysicalMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} sheen={1} sheenColor="#b026ff" />}
      </mesh>
      {/* Glowing sigil details */}
      <group 
        onPointerOver={() => {
            setHoveredSigil(true);
            initAudio();
        }}
        onPointerOut={() => {
            setHoveredSigil(false);
            if (sourceRef.current) sourceRef.current.stop();
            sourceRef.current = null;
        }}
      >
          <mesh position={[0, 0.5, 0.45]}>
            <torusGeometry args={[0.2, 0.03, isMobile ? 4 : 16, isMobile ? 8 : 32]} />
            <meshStandardMaterial 
                color={hoveredSigil ? "#00ffff" : "#004444"} 
                emissive={hoveredSigil ? "#00ffff" : "#000000"} 
                emissiveIntensity={2 + intensity}
            />
          </mesh>
          <pointLight position={[0, 0.5, 0.6]} color="#00ffff" intensity={4 + intensity * 2} distance={4} />
      </group>

    </group>
  );
}

function IndustrialHoodie({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state) => {
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const offset = scrollProgress.get();
      // Visibility for the final section
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, 0.65, 1.0));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.83 - offset) * 10 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25 + offset * Math.PI * 0.5;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 0.9 : 1.35));
      
      // Fixed X offset
      const targetX = isMobile ? 0 : 2.2;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {hovered && (
        <Html position={[0, 1.8, 0]} center>
          <div className="bg-black/90 border border-maroon-800 p-2 backdrop-blur-md pointer-events-none scale-90 whitespace-nowrap min-w-[120px] shadow-[0_0_15px_rgba(131,19,55,0.5)]">
            <p className="text-[10px] text-maroon-600 font-black tracking-widest uppercase horror-glitch" data-text="HD-05-VOID">HD-05-VOID</p>
            <p className="text-[8px] text-white/40 uppercase tracking-tighter mt-1 italic">Type: Industrial Tech-Hoodie</p>
          </div>
        </Html>
      )}
      {/* Hoodie Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.7, 1.2, isMobile ? 6 : 8, isMobile ? 12 : 24]} />
        {isMobile ? <meshStandardMaterial color="#080808" roughness={0.9} /> : <meshPhysicalMaterial color="#080808" roughness={0.9} sheen={0.8} sheenColor="#881337" clearcoat={0.05} />}
      </mesh>
      {/* Outer Tactical Mesh */}
      {!isMobile && (
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.74, 1.15, 6, 12]} />
          <meshStandardMaterial color="#1a1a1a" wireframe transparent opacity={0.5} roughness={1} />
        </mesh>
      )}
      {/* Hood - inner */}
      <mesh position={[0, 0.8, -0.1]} rotation={[Math.PI * 0.1, 0, 0]}>
        <sphereGeometry args={[0.62, isMobile ? 8 : 16, isMobile ? 8 : 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        {isMobile ? <meshStandardMaterial color="#1a0000" roughness={0.7} side={THREE.BackSide} /> : <meshPhysicalMaterial color="#1a0000" roughness={0.7} side={THREE.BackSide} />}
      </mesh>
      {/* Hood - outer */}
      <mesh position={[0, 0.8, -0.1]} rotation={[Math.PI * 0.1, 0, 0]}>
        <sphereGeometry args={[0.65, isMobile ? 8 : 16, isMobile ? 8 : 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        {isMobile ? <meshStandardMaterial color="#050505" roughness={0.85} /> : <meshPhysicalMaterial color="#050505" roughness={0.85} sheen={0.6} sheenColor="#4c0519" />}
      </mesh>
      {/* Chrome Straps - more industrial */}
      <group position={[0, 0.3, 0.6]}>
         <mesh position={[-0.2, 0, 0]}>
           <boxGeometry args={[0.08, 0.8, 0.05]} />
           {isMobile ? <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} /> : <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} clearcoat={1} />}
         </mesh>
         <mesh position={[0.2, 0, 0]}>
           <boxGeometry args={[0.08, 0.8, 0.05]} />
           {isMobile ? <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} /> : <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} clearcoat={1} />}
         </mesh>
         {/* Buckle details */}
         <mesh position={[-0.2, 0.1, 0.03]}>
           <boxGeometry args={[0.12, 0.05, 0.05]} />
           {isMobile ? <meshStandardMaterial color="#222222" metalness={1} roughness={0.2} /> : <meshPhysicalMaterial color="#222222" metalness={1} roughness={0.2} clearcoat={1} />}
         </mesh>
         <mesh position={[0.2, 0.1, 0.03]}>
           <boxGeometry args={[0.12, 0.05, 0.05]} />
           {isMobile ? <meshStandardMaterial color="#222222" metalness={1} roughness={0.2} /> : <meshPhysicalMaterial color="#222222" metalness={1} roughness={0.2} clearcoat={1} />}
         </mesh>
      </group>
      <pointLight position={[0, 0.5, 0.8]} color="#ff0000" intensity={5} distance={5} />
    </group>
  );
}

function VoidLattice() {
  const meshRef = useRef<THREE.Group>(null);
  const isMobile = window.innerWidth < 768;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef} scale={isMobile ? 12 : 20}>
      <mesh>
        <sphereGeometry args={[1, isMobile ? 16 : 64, isMobile ? 16 : 64]} />
        <meshBasicMaterial 
          color="#1a0000" 
          wireframe 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      {!isMobile && (
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <sphereGeometry args={[1.02, 32, 32]} />
          <meshBasicMaterial 
            color="#000000" 
            wireframe 
            transparent 
            opacity={0.05} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}
    </group>
  );
}

function AbyssalGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial 
        color="#220000" 
        transparent 
        opacity={0.08} 
        side={THREE.BackSide} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function VoidDust({ count = 1000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color="#880000" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function NeonCity() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const buildings = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const x = (Math.random() - 0.5) * 60;
      const z = -15 - Math.random() * 25;
      const width = 2 + Math.random() * 4;
      const height = 5 + Math.random() * 30;
      const depth = 2 + Math.random() * 4;
      return { x, z, width, height, depth };
    });
  }, []);

  return (
    <group position={[0, -5, 0]}>
      {buildings.map((b, i) => (
        <group key={`b-${i}`} position={[b.x, b.height / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color="#050508" roughness={0.8} metalness={0.2} />
          </mesh>
          {/* Vertical Neon Strips */}
          {Math.random() > 0.4 && (
            <mesh position={[Math.random() > 0.5 ? -b.width / 2 - 0.05 : b.width / 2 + 0.05, 0, (Math.random() - 0.5) * b.depth * 0.8]}>
              <boxGeometry args={[0.1, b.height * (0.4 + Math.random() * 0.6), 0.1]} />
              <meshBasicMaterial color={Math.random() > 0.5 ? "#00ffff" : "#ff00ff"} />
            </mesh>
          )}
          {/* Horizontal Neon Strips */}
          {Math.random() > 0.6 && (
            <mesh position={[0, (Math.random() - 0.5) * b.height * 0.8, b.depth / 2 + 0.05]}>
              <boxGeometry args={[b.width * (0.5 + Math.random() * 0.5), 0.1, 0.1]} />
              <meshBasicMaterial color={Math.random() > 0.5 ? "#00ff88" : "#ff00aa"} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function AestheticBot({ position, rotation, color = "#00ffff", pose = 0 }: { position: [number, number, number], rotation: [number, number, number], color?: string, pose?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle runway pose animation/breathing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
      if (pose === 0) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      } else {
        groupRef.current.rotation.y = -Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={groupRef}>
        {/* Bot Spine/Base */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.05, 2, 16]} />
          <meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} />
        </mesh>
        
        {/* High-tech mannequin head */}
        <mesh position={[0, 2.7, 0]}>
          <octahedronGeometry args={[0.25, 4]} />
          <meshPhysicalMaterial color="#050505" metalness={1} roughness={0.1} clearcoat={1} />
        </mesh>
        {/* Glowing horizontal visor slit */}
        <mesh position={[0, 2.7, 0.2]} rotation={[0, 0, 0]}>
           <boxGeometry args={[0.3, 0.05, 0.1]} />
           <meshBasicMaterial color={color} />
        </mesh>
        <pointLight position={[0, 2.7, 0.3]} color={color} intensity={2} distance={3} />

        {/* Cybernetic Neck with glowing rings */}
        <group position={[0, 2.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 16]} />
            <meshPhysicalMaterial color="#222" metalness={0.9} roughness={0.3} wireframe />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.12, 0.01, 8, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>

        {/* Aesthetic Chrome Torso (wearing a virtual projection shirt) */}
        <group position={[0, 1.4, 0]}>
           {/* Internal core / chest */}
           <mesh>
              <capsuleGeometry args={[0.38, 0.9, 16, 16]} />
              <meshPhysicalMaterial color="#050505" metalness={0.8} roughness={0.2} clearcoat={1} />
           </mesh>
           
           {/* Holographic Shirt Layer */}
           <mesh scale={1.05}>
              <capsuleGeometry args={[0.38, 0.9, 16, 16]} />
              <meshPhysicalMaterial color="#08080c" metalness={0.5} roughness={0.8} transparent opacity={0.6} />
           </mesh>
           
           {/* Tech Decal on chest */}
           <mesh position={[0, 0.2, 0.44]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial color={color} transparent opacity={0.9} />
           </mesh>
           <mesh position={[0, -0.1, 0.44]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial color="#fff" transparent opacity={0.9} />
           </mesh>
        </group>

        {/* Shoulders - geometric & sleek */}
        <mesh position={[-0.6, 2.0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.6, 2.0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshPhysicalMaterial color="#fff" metalness={1} roughness={0.1} clearcoat={1} />
        </mesh>

        {/* Arms - robotic joints */}
        <group position={[-0.65, 1.2, 0]} rotation={[0, 0, 0.1]}>
           <mesh>
             <cylinderGeometry args={[0.06, 0.04, 1.4, 16]} />
             <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
           </mesh>
           {/* Arm glowing bands */}
           <mesh position={[0, 0.3, 0]}>
             <torusGeometry args={[0.08, 0.015, 16, 16]} />
             <meshBasicMaterial color={color} />
           </mesh>
           <mesh position={[0, -0.2, 0]}>
             <torusGeometry args={[0.07, 0.015, 16, 16]} />
             <meshBasicMaterial color={color} />
           </mesh>
        </group>
        
        <group position={[0.65, 1.2, 0]} rotation={[0, 0, -0.1]}>
           <mesh>
             <cylinderGeometry args={[0.06, 0.04, 1.4, 16]} />
             <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
           </mesh>
           <mesh position={[0, 0.3, 0]}>
             <torusGeometry args={[0.08, 0.015, 16, 16]} />
             <meshBasicMaterial color={color} />
           </mesh>
           <mesh position={[0, -0.2, 0]}>
             <torusGeometry args={[0.07, 0.015, 16, 16]} />
             <meshBasicMaterial color={color} />
           </mesh>
        </group>

        {/* Legs (fading out neatly into the void) */}
        <mesh position={[-0.2, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.0, 1.8, 16]} />
          <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.5} />
        </mesh>
        <mesh position={[0.2, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.0, 1.8, 16]} />
          <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.5} />
        </mesh>

        {/* High-fashion floating halo rings */}
         <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 3, pose === 0 ? Math.PI/4 : -Math.PI/4, 0]}>
            <torusGeometry args={[1.2, 0.005, 16, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
         </mesh>
         <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 3, pose === 0 ? -Math.PI/4 : Math.PI/4, 0]}>
            <torusGeometry args={[1.5, 0.008, 16, 64]} />
            <meshBasicMaterial color="#fff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
         </mesh>
      </group>
    </group>
  );
}

function AestheticModelsBots() {
  return (
    <group position={[0, -1, -6]}>
      {/* Left Back Model */}
      <AestheticBot position={[-3.5, 0, -2]} rotation={[0, Math.PI / 6, 0]} color="#00ffff" pose={1} />
      {/* Right Back Model */}
      <AestheticBot position={[3.5, 0, -2]} rotation={[0, -Math.PI / 6, 0]} color="#ff00ff" pose={0} />
      {/* Center Deep Model */}
      <AestheticBot position={[0, 0.5, -6]} rotation={[0, 0, 0]} color="#ff0044" pose={1} />
    </group>
  );
}

function SceneContent({ scrollProgress }: { scrollProgress: any }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const isMobile = state.size.width < 768;
    const offset = scrollProgress.get();
    if (lightRef.current) {
      // Unsettling flicker
      const n = Math.random();
      lightRef.current.intensity = n > 0.95 ? 0.5 : n > 0.9 ? 10 : 3;
    }

    // Camera distortion on scroll
    const cameraDist = isMobile ? 12 : 5;
    camera.position.z = cameraDist + Math.sin(offset * Math.PI) * 2;
    camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 * offset;
    
    // Heartbeat pulse for lighting - optimized to avoid unnecessary color object creation
    const heart = Math.pow(Math.sin(state.clock.elapsedTime * 1.5), 10) * 2;
    if (heart > 0.01) {
      state.scene.background = new THREE.Color(heart * 0.02, 0, 0);
    } else if (state.scene.background instanceof THREE.Color && state.scene.background.r > 0) {
      state.scene.background = new THREE.Color(0, 0, 0);
    }
  });
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <fog attach="fog" args={["#000000", 5, 25]} />
      {!isMobile && <Environment preset="city" />}
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#4c0519" intensity={5} />
      <pointLight ref={lightRef} position={[5, 10, 5]} color="#b026ff" intensity={8} />
      <pointLight position={[-5, 5, 2]} color="#ff0000" intensity={5} />
      
      {/* Rim light for better shape definition */}
      <pointLight position={[0, -5, -2]} color="#ffffff" intensity={2} />
      
      <NeonCity />
      <AbyssalGlow />
      {!isMobile && <VoidDust count={2000} />}
      
      <CyberShirt scrollProgress={scrollProgress} />
      <FullSleeveModel scrollProgress={scrollProgress} />
      <IndustrialHoodie scrollProgress={scrollProgress} />
      {!isMobile && <BloodRain count={800} />}

      {/* Pulsing Void Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>

      {/* Cinematic Horror Elements */}
      {!isMobile && (
        <>
          <Sparkles 
            count={200} 
            size={4} 
            speed={0.5} 
            scale={10} 
            color="#ffffff" 
            opacity={0.1} 
          />
          
          <group position={[0, -2, -5]}>
            <Cloud
              opacity={0.2}
              speed={0.2}
              segments={20}
              color="#4c0519"
            />
          </group>
        </>
      )}
    </>
  );
}

export default function ThreeScene({ scrollProgress }: { scrollProgress: any }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none selection:bg-maroon-600 selection:text-white">
      <Canvas shadows={!isMobile} dpr={isMobile ? [0.5, 1] : [1, 1.5]} performance={{ min: 0.2 }}>
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
