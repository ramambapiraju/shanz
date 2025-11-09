import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import { MechanicalComponent } from './MechanicalComponent';
import { ComponentModel3D } from './ComponentModel3D';
import * as THREE from 'three';

interface MechatronicsCanvas3DProps {
  components: MechanicalComponent[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
}

const MechatronicsCanvas3D: React.FC<MechatronicsCanvas3DProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
}) => {
  return (
    <div className="w-full h-full bg-background">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* Enhanced Photorealistic Lighting */}
        <ambientLight intensity={0.3} color="#f0f8ff" />
        
        <directionalLight
          position={[15, 20, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0001}
        />
        
        <hemisphereLight
          args={[0x87ceeb, 0x6b5d47, 0.5]}
        />
        
        <pointLight position={[-8, 8, -8]} intensity={0.6} color="#ffd4a3" />
        <pointLight position={[8, 6, 8]} intensity={0.4} color="#a3c9ff" />
        
        <spotLight
          position={[0, 15, 0]}
          angle={0.4}
          penumbra={1}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* HDR Environment for realistic reflections */}
        <Environment
          preset="city"
          background={false}
          blur={0.8}
        />
        
        {/* Contact Shadows for grounded realism */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={30}
          blur={2}
          far={10}
        />
        
        {/* Grid */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#3b82f6"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* Ground plane for additional shadow receiving */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.02, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.9}
            metalness={0.1}
            transparent
            opacity={0.1}
          />
        </mesh>
        
        {/* Render Components with realistic models */}
        {components.map((component) => {
          const isSelected = selectedComponent === component.id;
          return (
            <ComponentModel3D
              key={component.id}
              component={component}
              isSelected={isSelected}
              onClick={() => onSelectComponent(component.id)}
            />
          );
        })}
        
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default MechatronicsCanvas3D;
