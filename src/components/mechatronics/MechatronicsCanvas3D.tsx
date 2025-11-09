import React, { useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { MechanicalComponent } from "./MechanicalComponent";
import { isPropellerComponent, isWheelComponent, isMotorComponent, isServoComponent, isBatteryComponent, isESCComponent, isSensorComponent, isControllerComponent, isRCComponent, isChassisComponent } from "./ComponentCategories";
import * as THREE from "three";

interface ComponentMeshProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

const ComponentMesh: React.FC<ComponentMeshProps> = ({ component, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (isPropellerComponent(component.type) && groupRef.current) {
      groupRef.current.rotation.y += 0.15;
    }
    if (isWheelComponent(component.type) && groupRef.current) {
      groupRef.current.rotation.x += 0.05;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e);
  };

  const baseColor = isSelected ? "#fbbf24" : component.color;
  const emissive = isSelected ? "#f59e0b" : "#000000";
  const emissiveIntensity = isSelected ? 0.5 : 0;

  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
    >
      <group ref={groupRef}>
        <mesh ref={meshRef} castShadow receiveShadow onClick={handleClick}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.6}
            roughness={0.4}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.52, 0.52, 0.52)]} />
            <lineBasicMaterial color="#fbbf24" linewidth={2} />
          </lineSegments>
        )}
      </group>
    </group>
  );
};

interface MechatronicsCanvas3DProps {
  components: MechanicalComponent[];
  selectedComponent: MechanicalComponent | null;
  onComponentSelect: (component: MechanicalComponent | null) => void;
  onComponentMove: (id: string, position: { x: number; y: number; z: number }) => void;
}

const MechatronicsCanvas3D: React.FC<MechatronicsCanvas3DProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
}) => {
  const handleComponentClick = (component: MechanicalComponent) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onComponentSelect(component);
  };

  const handleCanvasClick = () => {
    onComponentSelect(null);
  };

  return (
    <div className="w-full h-full bg-background">
      <Canvas shadows onClick={handleCanvasClick}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={60} />
        <OrbitControls makeDefault />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Grid infiniteGrid cellSize={0.5} cellThickness={0.5} sectionSize={2} fadeDistance={30} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={1.5} />
        
        {components.map((component) => (
          <ComponentMesh
            key={component.id}
            component={component}
            isSelected={selectedComponent?.id === component.id}
            onClick={handleComponentClick(component)}
          />
        ))}
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};

export default MechatronicsCanvas3D;
