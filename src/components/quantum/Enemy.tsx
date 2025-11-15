import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EnemyProps {
  id: string;
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  onDamagePlayer: () => void;
}

export const Enemy = ({ id, position, playerPosition, onDamagePlayer }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const lastHitTime = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Simple AI: Move toward player slowly
    const direction = new THREE.Vector3()
      .copy(playerPosition)
      .sub(groupRef.current.position)
      .normalize();
    
    groupRef.current.position.add(direction.multiplyScalar(0.02));
    groupRef.current.position.y = 1.5;

    // Look at player
    groupRef.current.lookAt(playerPosition.x, 1.5, playerPosition.z);

    // Attack player if close (with cooldown)
    const distanceToPlayer = groupRef.current.position.distanceTo(playerPosition);
    if (distanceToPlayer < 2 && state.clock.elapsedTime - lastHitTime.current > 1) {
      lastHitTime.current = state.clock.elapsedTime;
      onDamagePlayer();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Box args={[0.8, 1.6, 0.8]}>
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.3} />
      </Box>
      <Sphere args={[0.4, 8, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#7f1d1d" />
      </Sphere>
    </group>
  );
};

export default Enemy;

