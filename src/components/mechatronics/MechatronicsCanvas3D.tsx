import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { MechanicalComponent } from "./MechanicalComponent";
import * as THREE from "three";

interface ComponentMeshProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: () => void;
}

const ComponentMesh: React.FC<ComponentMeshProps> = ({ component, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && component.type === "propeller") {
      // Animate propellers
      meshRef.current.rotation.y += 0.1;
    }
  });

  const getGeometry = () => {
    switch (component.type) {
      case "dc_motor":
      case "servo_motor":
      case "stepper_motor":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case "wheel":
        return <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.z, 32]} />;
      case "propeller":
        return <boxGeometry args={[2, 0.1, 0.3]} />;
      case "chassis":
      case "frame":
        return <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />;
      case "battery":
        return <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />;
      case "esc":
        return <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />;
      case "gear":
        return <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.y, 16]} />;
      case "axle":
        return <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.y, 16]} />;
      case "sensor":
        return <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      onClick={onClick}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={isSelected ? "#fbbf24" : component.color}
        emissive={isSelected ? "#f59e0b" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
};

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
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls makeDefault />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        {/* Grid and helpers */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#374151"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="white" />
        </GizmoHelper>
        
        {/* Components */}
        {components.map((component) => (
          <ComponentMesh
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent}
            onClick={() => onSelectComponent(component.id)}
          />
        ))}
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1f2937" opacity={0.3} transparent />
        </mesh>
      </Canvas>
    </div>
  );
};

export default MechatronicsCanvas3D;
