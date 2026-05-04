import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Html, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AbstractShirt({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const offset = scrollProgress.get();
      // Drop Down Section visibility
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, 0.1, 0.45));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.28 - offset) * 10 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + offset * Math.PI;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 1.0 : 1.3));
      
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
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-[#0a0a0a]/90 border border-white/10 px-3 py-2 backdrop-blur-md pointer-events-none whitespace-nowrap min-w-[120px]">
            <p className="text-xs text-white font-medium tracking-widest uppercase">CS-01-DD</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Abstract Form</p>
          </div>
        </Html>
      )}
      <mesh>
        <capsuleGeometry args={[0.7, 1.2, 4, 16]} />
        <MeshDistortMaterial color="#ffffff" roughness={0.1} metalness={0.9} distort={0.2} speed={1} />
      </mesh>
      {/* Accent rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.8, 0]}>
        <torusGeometry args={[0.75, 0.02, 16, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={1} />
      </mesh>
    </group>
  );
}

function AbstractSleeve({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const offset = scrollProgress.get();
      // Full Sleeves Section visibility
      const visibility = Math.sin(Math.PI * THREE.MathUtils.smoothstep(offset, 0.35, 0.75));
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.position.y = (0.55 - offset) * 10 + Math.cos(state.clock.elapsedTime * 1.5) * 0.1;
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.15 + offset * Math.PI;
      groupRef.current.rotation.z = 0.2;
      groupRef.current.scale.setScalar(visibility * (isMobile ? 1.0 : 1.25));
      
      const targetX = isMobile ? 0 : -2.2;
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
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
           <div className="bg-[#0a0a0a]/90 border border-white/10 px-3 py-2 backdrop-blur-md pointer-events-none whitespace-nowrap min-w-[120px]">
             <p className="text-xs text-white font-medium tracking-widest uppercase">CS-02-FS</p>
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Tech-Sleeve Form</p>
           </div>
        </Html>
      )}
      <mesh>
        <cylinderGeometry args={[0.3, 0.4, 2.5, 32]} />
        <meshPhysicalMaterial color="#050505" roughness={0.2} metalness={0.9} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Geometric outer shell */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.45, 2.4, 6]} />
        <meshPhysicalMaterial color="#ffffff" wireframe transparent opacity={0.1} roughness={0} metalness={1} />
      </mesh>
    </group>
  );
}

function SceneContent({ scrollProgress }: { scrollProgress: any }) {
  const { camera } = useThree();

  useFrame((state) => {
    const offset = scrollProgress.get();
    // Subtle camera movement
    camera.position.z = 5 + offset;
    camera.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
  });
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      {!isMobile && <Environment preset="studio" />}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} color="#aaaaaa" intensity={2} />
      
      {/* Minimal grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.2} />
        <gridHelper args={[100, 40, "#1a1a1a", "#0a0a0a"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]} />
      </mesh>

      <AbstractShirt scrollProgress={scrollProgress} />
      <AbstractSleeve scrollProgress={scrollProgress} />
    </>
  );
}

export default function ThreeScene({ scrollProgress }: { scrollProgress: any }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas shadows={!isMobile} dpr={isMobile ? [1, 1.5] : [1, 2]} performance={{ min: 0.5 }}>
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
