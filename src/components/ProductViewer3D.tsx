import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

export function AestheticBot({ position, rotation, color = "#00ffff", pose = 0 }: { position: [number, number, number], rotation: [number, number, number], color?: string, pose?: number }) {
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

export function AestheticModelsBots({ color = "#00ffff", hovered = false }: { color?: string, hovered?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.05 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Left Back Model */}
      <AestheticBot position={[-2.5, 0, -1.5]} rotation={[0, Math.PI / 6, 0]} color={color} pose={1} />
      {/* Right Back Model */}
      <AestheticBot position={[2.5, 0, -1.5]} rotation={[0, -Math.PI / 6, 0]} color={color} pose={0} />
      {/* Center Deep Model */}
      <AestheticBot position={[0, 0, 0]} rotation={[0, 0, 0]} color={color} pose={1} />
    </group>
  );
}

export function ProductViewer3D({ color = "#00ffff" }: { color?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-full absolute inset-0 bg-transparent rounded-3xl overflow-hidden cursor-move"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color={color} />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} color={color} castShadow />
        
        <AestheticModelsBots color={color} hovered={hovered} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          autoRotate
          autoRotateSpeed={hovered ? 0.3 : 1}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
