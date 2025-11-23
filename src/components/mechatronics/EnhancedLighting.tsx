// Advanced lighting system for realistic 3D visualization
import { useRef } from 'react';
import { Environment, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';

interface EnhancedLightingProps {
  preset?: 'studio' | 'city' | 'sunset' | 'warehouse' | 'forest' | 'dawn' | 'night' | 'park' | 'lobby' | 'apartment';
  intensity?: number;
}

export const EnhancedLighting = ({ preset = 'warehouse', intensity = 1 }: EnhancedLightingProps) => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3 * intensity} />

      {/* Main directional light (sun/key light) */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8 * intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Fill light (softer, from opposite side) */}
      <directionalLight
        position={[-3, 5, -4]}
        intensity={0.4 * intensity}
        color="#b0c4de"
      />

      {/* Rim light (from behind for edge highlights) */}
      <directionalLight
        position={[0, 3, -5]}
        intensity={0.3 * intensity}
        color="#ffd700"
      />

      {/* Hemisphere light for natural sky/ground bounce */}
      <hemisphereLight
        args={['#87ceeb', '#654321', 0.4 * intensity]}
        position={[0, 50, 0]}
      />

      {/* Point lights for accent */}
      <pointLight position={[-5, 5, 5]} intensity={0.3 * intensity} color="#ffffff" />
      <pointLight position={[5, 5, -5]} intensity={0.3 * intensity} color="#f0f0ff" />

      {/* Spot light for focused areas */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.5 * intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset={preset} />

      {/* Contact shadows for ground realism */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={1.5}
        far={10}
      />

      {/* Sky for outdoor preset */}
      {(preset === 'forest' || preset === 'park') && (
        <Sky
          distance={450000}
          sunPosition={[5, 1, 8]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}
    </>
  );
};

// Grid with enhanced materials
export const EnhancedGrid = () => {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.1}
          roughness={0.9}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[50, 50, '#404040', '#303030']}
        position={[0, 0, 0]}
      />

      {/* Center marker */}
      <mesh position={[0, 0.01, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
      </mesh>

      {/* Axis indicators */}
      {/* X axis - Red */}
      <mesh position={[1, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2, 0.05, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>

      {/* Y axis - Green */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
      </mesh>

      {/* Z axis - Blue */}
      <mesh position={[0, 0.01, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// Post-processing effects
export const PostProcessing = () => {
  // This can be extended with @react-three/postprocessing
  return null;
};
