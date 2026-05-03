import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RefObject } from "react";

export function useDOMTracker(
  trackId: string, 
  groupRef: RefObject<THREE.Group>, 
  options: { rotationSpeed?: number, scaleMultiplier?: number, yOffsetAmount?: number } = {}
) {
  const { rotationSpeed = 0.5, scaleMultiplier = 1, yOffsetAmount = 0.05 } = options;
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const el = document.getElementById(trackId);
    if (!el) {
       groupRef.current.visible = false;
       return;
    }
    
    const rect = el.getBoundingClientRect();
    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    groupRef.current.visible = isVisible;
    
    if (isVisible) {
       const ndcX = ((rect.left + rect.right) / 2 / window.innerWidth) * 2 - 1;
       const ndcY = -((rect.top + rect.bottom) / 2 / window.innerHeight) * 2 + 1;
       
       const vec = new THREE.Vector3(ndcX, ndcY, 0);
       vec.unproject(state.camera);
       const dir = vec.sub(state.camera.position).normalize();
       const distance = -state.camera.position.z / dir.z;
       const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
       
       const vFov = (state.camera as THREE.PerspectiveCamera).fov * Math.PI / 180;
       const viewHeight = 2 * Math.tan(vFov / 2) * Math.abs(state.camera.position.z);
       const viewWidth = viewHeight * (window.innerWidth / window.innerHeight);
       
       const elAspect = rect.width / window.innerWidth;
       const elWidthIn3D = elAspect * viewWidth;
       
       // base scale on the container's 3D width, bounded to avoid exploding
       const targetBaseScale = Math.min(elWidthIn3D * 0.4, 1.8);
       const expectedScale = Math.max(0.5, targetBaseScale * scaleMultiplier);
       
       groupRef.current.position.lerp(pos, 0.1);
       // Re-apply bobbing offset using absolute position
       groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * yOffsetAmount;
       
       const currentScale = groupRef.current.scale.x;
       groupRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, expectedScale, 0.1));
       
       groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });
}
