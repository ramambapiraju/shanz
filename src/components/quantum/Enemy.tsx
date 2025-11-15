import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EnemyProps {
  id: string;
  initialPosition: [number, number, number];
  playerPosition: THREE.Vector3;
  onHit: (id: string) => void;
  onDeath: (id: string) => void;
}

export const Enemy = ({ id, initialPosition, playerPosition, onHit, onDeath }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [health, setHealth] = useState(100);
  const velocityRef = useRef(new THREE.Vector3());
  const targetRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current || health <= 0) return;

    // Simple AI: Move toward player
    targetRef.current.copy(playerPosition);
    const direction = targetRef.current.sub(groupRef.current.position).normalize();
    
    // Add some randomness to movement
    const wanderX = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    const wanderZ = Math.cos(state.clock.elapsedTime * 2) * 0.3;
    
    direction.x += wanderX;
    direction.z += wanderZ;
    direction.normalize();

    velocityRef.current.lerp(direction.multiplyScalar(2), delta * 2);
    groupRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
    
    // Keep at ground level
    groupRef.current.position.y = 1.5;

    // Look at player
    groupRef.current.lookAt(playerPosition.x, groupRef.current.position.y, playerPosition.z);

    // Attack player if close enough
    const distanceToPlayer = groupRef.current.position.distanceTo(playerPosition);
    if (distanceToPlayer < 2) {
      onHit(id);
    }
  });

  const takeDamage = (damage: number) => {
    const newHealth = health - damage;
    setHealth(newHealth);
    if (newHealth <= 0) {
      onDeath(id);
    }
  };

  if (health <= 0) return null;

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Enemy body */}
      <Box args={[0.8, 1.6, 0.8]}>
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#dc2626" 
          emissiveIntensity={0.5}
        />
      </Box>
      
      {/* Enemy head */}
      <Sphere args={[0.4, 16, 16]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color="#7f1d1d" 
          emissive="#991b1b" 
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Health indicator */}
      <Sphere args={[0.1, 8, 8]} position={[0, 2.2, 0]}>
        <meshBasicMaterial color={health > 50 ? "#10b981" : health > 25 ? "#f59e0b" : "#ef4444"} />
      </Sphere>
    </group>
  );
};

export default Enemy;

