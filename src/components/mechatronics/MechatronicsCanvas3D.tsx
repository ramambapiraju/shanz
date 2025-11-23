import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import { MechanicalComponent } from './MechanicalComponent';
import { ComponentModel3D } from './ComponentModel3D';
import { FPVCamera } from './FPVCamera';
import { WiringVisualizer } from './WiringVisualizer';
import { Button } from '@/components/ui/button';
import { Eye, Zap } from 'lucide-react';
import * as THREE from 'three';
import { 
  DCMotor3D, 
  BrushlessMotor3D, 
  Battery3D, 
  ESC3D, 
  Wheel3D, 
  Propeller3D 
} from './Advanced3DModels';

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
  const [currentFlow, setCurrentFlow] = useState(0);
  
  // Animate current flow
  React.useEffect(() => {
    if (!wiringEnabled) return;
    const interval = setInterval(() => {
      setCurrentFlow((prev) => (prev + 0.05) % 1);
    }, 50);
    return () => clearInterval(interval);
  }, [wiringEnabled]);
  
  return (
    <div className="w-full h-full bg-background relative">
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
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
        
        {/* Obstacle for IR sensor detection (only shown if IR sensor present) */}
        {components.some(c => c.type === 'ir_sensor') && (
          <mesh position={[0, 0.3, 3]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.6, 0.5]} />
            <meshStandardMaterial 
              color="#ff4444" 
              roughness={0.7}
              metalness={0.2}
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
          currentFlow={currentFlow}
        />
        
        {/* Render Components with enhanced 3D models */}
        {components.map((component) => {
          const isSelected = selectedComponent === component.id;
          const onClick = () => onSelectComponent(component.id);
          
          // Use advanced models for specific component types
          if (component.type === 'dc_motor_775') {
            return <DCMotor3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          } else if (component.type === 'brushless_motor_2212') {
            return <BrushlessMotor3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          } else if (component.type.startsWith('lipo_')) {
            return <Battery3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          } else if (component.type.startsWith('esc_')) {
            return <ESC3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          } else if (component.type === 'rubber_wheel_100mm' || component.type === 'omni_wheel' || component.type === 'mecanum_wheel') {
            return <Wheel3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          } else if (component.type.startsWith('propeller_')) {
            return <Propeller3D key={component.id} component={component} isSelected={isSelected} onClick={onClick} />;
          }
          
          // Fall back to standard model for other components
          return (
            <ComponentModel3D
              key={component.id}
              component={component}
              isSelected={isSelected}
              onClick={onClick}
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
