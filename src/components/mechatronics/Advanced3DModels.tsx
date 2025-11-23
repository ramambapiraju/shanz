// Advanced 3D Component Models with realistic geometry and materials
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MechanicalComponent } from './MechanicalComponent';

interface ModelProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: () => void;
}

// Realistic DC Motor Model
export const DCMotor3D = ({ component, isSelected, onClick }: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const shaftRef = useRef<THREE.Mesh>(null);
  
  // Rotate shaft when motor is running
  useFrame(() => {
    if (shaftRef.current && component.properties.currentRPM) {
      const rpm = component.properties.currentRPM || 0;
      shaftRef.current.rotation.z += (rpm / 60) * 0.016 * (2 * Math.PI);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* Motor body - cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
        <meshStandardMaterial
          color={component.color}
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={1}
        />
      </mesh>

      {/* Motor end caps */}
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.21, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Output shaft */}
      <mesh ref={shaftRef} position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Mounting holes */}
      <mesh position={[0.1, 0, 0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, 0, 0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Temperature glow effect when hot */}
      {component.properties.temperature > 60 && (
        <pointLight
          position={[0, 0, 0]}
          color="#ff4400"
          intensity={(component.properties.temperature - 60) / 40}
          distance={0.5}
        />
      )}

      {/* Selection highlight */}
      {isSelected && (
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.45, 32]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Realistic Brushless Motor Model
export const BrushlessMotor3D = ({ component, isSelected, onClick }: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bellRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (bellRef.current && component.properties.currentRPM) {
      const rpm = component.properties.currentRPM || 0;
      bellRef.current.rotation.y += (rpm / 60) * 0.016 * (2 * Math.PI);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* Stator base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.15, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Stator windings (copper color) */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.12, 32]} />
        <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rotating bell */}
      <mesh ref={bellRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.2, 32]} />
        <meshStandardMaterial
          color={component.color}
          metalness={0.85}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Motor shaft */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.15, 16]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Mounting holes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.09, -0.08, Math.sin(angle) * 0.09]}
          castShadow
        >
          <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}

      {isSelected && (
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 32]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Realistic Battery Model
export const Battery3D = ({ component, isSelected, onClick }: ModelProps) => {
  const soc = component.properties.stateOfCharge || 1.0;
  const voltage = component.properties.currentVoltage || component.properties.voltage;
  const temp = component.properties.temperature || 25;

  // Color based on charge level
  const getChargeColor = () => {
    if (soc > 0.7) return '#4CAF50';
    if (soc > 0.3) return '#FFC107';
    return '#F44336';
  };

  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* Battery pack body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial
          color={component.color}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Battery cells visible through wrapper */}
      {Array.from({ length: component.properties.cellCount || 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[-0.1 + i * 0.1, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
          <meshStandardMaterial
            color={getChargeColor()}
            metalness={0.4}
            roughness={0.5}
            emissive={getChargeColor()}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Battery terminals */}
      <mesh position={[0.12, 0.06, 0.05]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
        <meshStandardMaterial color="#ff0000" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.12, 0.06, -0.05]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Charge indicator LED */}
      <mesh position={[-0.14, 0.055, 0]}>
        <sphereGeometry args={[0.01, 16, 16]} />
        <meshStandardMaterial
          color={getChargeColor()}
          emissive={getChargeColor()}
          emissiveIntensity={soc > 0.2 ? 1 : 0.3}
        />
      </mesh>
      {soc > 0.2 && (
        <pointLight
          position={[-0.14, 0.055, 0]}
          color={getChargeColor()}
          intensity={0.5}
          distance={0.3}
        />
      )}

      {/* Voltage display (holographic) */}
      <mesh position={[0, 0.06, 0]}>
        <planeGeometry args={[0.15, 0.04]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {isSelected && (
        <mesh>
          <boxGeometry args={[0.32, 0.12, 0.22]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Realistic ESC Model
export const ESC3D = ({ component, isSelected, onClick }: ModelProps) => {
  const temp = component.properties.temperature || 25;
  const current = component.properties.currentThrottle || 0;

  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* ESC circuit board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.05, 0.08]} />
        <meshStandardMaterial color="#1a5f1a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Heat sink */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Heat sink fins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[-0.05 + i * 0.015, 0.04, 0]}
          castShadow
        >
          <boxGeometry args={[0.01, 0.015, 0.06]} />
          <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}

      {/* Capacitors */}
      <mesh position={[0.04, 0.035, 0.02]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.03, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.04, 0.035, -0.02]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.03, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Wire connections */}
      <mesh position={[-0.08, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial color="#ff0000" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0, -0.03]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial color="#000000" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Activity LED */}
      {current > 0 && (
        <>
          <mesh position={[0.06, 0.03, 0]}>
            <sphereGeometry args={[0.008, 16, 16]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={current}
            />
          </mesh>
          <pointLight
            position={[0.06, 0.03, 0]}
            color="#00ff00"
            intensity={current * 0.5}
            distance={0.2}
          />
        </>
      )}

      {/* Heat glow when hot */}
      {temp > 70 && (
        <pointLight
          position={[0, 0.03, 0]}
          color="#ff8800"
          intensity={(temp - 70) / 30}
          distance={0.4}
        />
      )}

      {isSelected && (
        <mesh>
          <boxGeometry args={[0.17, 0.07, 0.1]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Realistic Wheel Model
export const Wheel3D = ({ component, isSelected, onClick }: ModelProps) => {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (wheelRef.current && component.properties.rpm) {
      wheelRef.current.rotation.x += (component.properties.rpm / 60) * 0.016 * (2 * Math.PI);
    }
  });

  const diameter = component.properties.diameter || 0.1;
  const width = component.properties.width || 0.04;

  return (
    <group
      ref={wheelRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* Tire (rubber) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[diameter / 2, diameter / 2, width, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.95}
        />
      </mesh>

      {/* Wheel rim */}
      <mesh castShadow>
        <cylinderGeometry args={[diameter / 2 - 0.015, diameter / 2 - 0.015, width * 0.8, 32]} />
        <meshStandardMaterial
          color={component.color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Spokes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 6;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (diameter / 4),
              0,
              Math.sin(angle) * (diameter / 4),
            ]}
            rotation={[0, angle, Math.PI / 2]}
            castShadow
          >
            <boxGeometry args={[0.008, diameter / 2.5, 0.008]} />
            <meshStandardMaterial color="#808080" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.02, width * 1.1, 16]} />
        <meshStandardMaterial color="#404040" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Tread pattern */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 16;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (diameter / 2 + 0.002),
              0,
              Math.sin(angle) * (diameter / 2 + 0.002),
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.004, width * 0.3, 0.008]} />
            <meshStandardMaterial color="#0a0a0a" roughness={1} />
          </mesh>
        );
      })}

      {isSelected && (
        <mesh>
          <cylinderGeometry args={[diameter / 2 + 0.02, diameter / 2 + 0.02, width + 0.02, 32]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Propeller Model
export const Propeller3D = ({ component, isSelected, onClick }: ModelProps) => {
  const propRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (propRef.current && component.properties.rpm) {
      propRef.current.rotation.y += (component.properties.rpm / 60) * 0.016 * (2 * Math.PI);
    }
  });

  const diameter = (component.properties.diameter || 10) * 0.0254; // inches to meters
  const bladeCount = component.properties.bladesCount || 2;

  return (
    <group
      ref={propRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
      onClick={onClick}
    >
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.015, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Propeller blades */}
      {Array.from({ length: bladeCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / bladeCount;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (diameter / 4), 0, Math.sin(angle) * (diameter / 4)]}
            rotation={[Math.PI / 6, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.005, diameter / 2, diameter / 8]} />
            <meshStandardMaterial
              color={component.color}
              metalness={0.3}
              roughness={0.4}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Spinning blur effect when fast */}
      {component.properties.rpm > 1000 && (
        <mesh>
          <cylinderGeometry args={[diameter / 2, diameter / 2, 0.002, 32]} />
          <meshBasicMaterial
            color={component.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh>
          <cylinderGeometry args={[diameter / 2 + 0.02, diameter / 2 + 0.02, 0.02, 32]} />
          <meshBasicMaterial color="#00ff00" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};
