import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { MechanicalComponent } from './MechanicalComponent';
import { ComponentModel3D } from './ComponentModel3D';
import { FPVCamera } from './FPVCamera';
import { WiringVisualizer } from './WiringVisualizer';
import { Button } from '@/components/ui/button';
import { Eye, Zap } from 'lucide-react';
import { WebGLContextHandler } from './WebGLContextHandler';

interface MechatronicsCanvas3DProps {
  components: MechanicalComponent[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  vehiclePosition?: { x: number; y: number; z: number };
  vehicleRotation?: { x: number; y: number; z: number };
}

const MechatronicsCanvas3D: React.FC<MechatronicsCanvas3DProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  vehiclePosition = { x: 0, y: 0, z: 0 },
  vehicleRotation = { x: 0, y: 0, z: 0 },
}) => {
  const [fpvEnabled, setFpvEnabled] = useState(false);
  const [wiringEnabled, setWiringEnabled] = useState(false);

  return (
    <div className="relative h-full w-full bg-secondary/10 rounded-lg overflow-hidden border">
      {/* Control Buttons */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant={fpvEnabled ? "default" : "outline"}
          onClick={() => setFpvEnabled(!fpvEnabled)}
        >
          <Eye className="h-4 w-4 mr-2" />
          FPV
        </Button>
        <Button
          size="sm"
          variant={wiringEnabled ? "default" : "outline"}
          onClick={() => setWiringEnabled(!wiringEnabled)}
        >
          <Zap className="h-4 w-4 mr-2" />
          Wiring
        </Button>
      </div>
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows="basic"
        dpr={[1, 1.5]}
        style={{ background: '#f8f9fa' }}
        gl={{ 
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
      >
        {/* Simplified Lighting for Performance */}
        <ambientLight intensity={0.8} />
        
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        <hemisphereLight args={['#ffffff', '#8899aa', 0.6]} />
        
        {/* Simple Environment */}
        <Environment preset="sunset" background={false} />
        
        {/* WebGL Context Handler */}
        <WebGLContextHandler />
        
        {/* Grid */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#d1d5db"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#60a5fa"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* Ground plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.02, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#e5e7eb"
            roughness={0.8}
            metalness={0.05}
            transparent
            opacity={0.5}
          />
        </mesh>
        
        {/* Obstacle for IR sensor detection */}
        {components.some(c => c.type === 'ir_sensor') && (
          <mesh position={[0, 0.3, 3]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.6, 0.5]} />
            <meshStandardMaterial 
              color="#ef4444" 
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
        )}
        
        {/* FPV Camera */}
        <FPVCamera
          vehiclePosition={vehiclePosition}
          vehicleRotation={vehicleRotation}
          enabled={fpvEnabled}
        />
        
        {/* Wiring Visualization */}
        <WiringVisualizer
          components={components}
          showWiring={wiringEnabled}
          currentFlow={0}
        />
        
        {/* Render Components with standard models */}
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
          enabled={!fpvEnabled}
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
