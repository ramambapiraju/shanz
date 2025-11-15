import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface WeaponDisplayProps {
  weaponType: string;
  isShooting: boolean;
}

export const WeaponDisplay = ({ weaponType, isShooting }: WeaponDisplayProps) => {
  const weaponRef = useRef<THREE.Group>(null);
  const recoilRef = useRef(0);

  useFrame((state, delta) => {
    if (!weaponRef.current) return;

    // Weapon sway
    weaponRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.01;
    weaponRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.005 - 0.3;
    
    // Recoil animation
    if (isShooting) {
      recoilRef.current = 0.1;
    }
    
    recoilRef.current = THREE.MathUtils.lerp(recoilRef.current, 0, delta * 10);
    weaponRef.current.position.z = 0.5 + recoilRef.current;
  });

  return (
    <group ref={weaponRef} position={[0.3, -0.3, 0.5]}>
      {/* Blaster design */}
      <Box args={[0.08, 0.08, 0.4]} position={[0, 0, -0.2]}>
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
      </Box>
      
      <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#6366f1" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </Cylinder>

      {/* Muzzle */}
      <Sphere args={[0.04, 8, 8]} position={[0, 0, -0.55]}>
        <meshStandardMaterial 
          color={isShooting ? "#ffffff" : "#6366f1"} 
          emissive={isShooting ? "#ffffff" : "#6366f1"} 
          emissiveIntensity={isShooting ? 2 : 0.5}
        />
      </Sphere>

      {/* Weapon glow */}
      {weaponType && (
        <Box args={[0.1, 0.05, 0.15]} position={[0, 0.05, -0.1]}>
          <meshStandardMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.6}
            emissive="#a855f7"
            emissiveIntensity={1}
          />
        </Box>
      )}
    </group>
  );
};
