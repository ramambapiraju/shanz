import React, { useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { MechanicalComponent } from "./MechanicalComponent";
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
    if (meshRef.current && component.type === "propeller" && groupRef.current) {
      // Animate propellers
      groupRef.current.rotation.y += 0.1;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e);
  };

  const getRotation = (type: string): [number, number, number] => {
    // Adjust rotation for cylindrical components
    if (type === "wheel") {
      return [0, 0, Math.PI / 2]; // Rotate wheels to stand upright
    }
    if (type === "axle") {
      return [0, 0, Math.PI / 2]; // Rotate axles horizontally
    }
    return [component.rotation.x, component.rotation.y, component.rotation.z];
  };

  const getMaterial = () => {
    const baseColor = isSelected ? "#fbbf24" : component.color;
    
    switch (component.type) {
      case "dc_motor":
      case "servo_motor":
      case "stepper_motor":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.7}
            roughness={0.3}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.5 : 0}
          />
        );
      case "wheel":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.2}
            roughness={0.9}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        );
      case "propeller":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.7}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        );
      case "battery":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.5}
            roughness={0.5}
            emissive={isSelected ? "#f59e0b" : "#22c55e"}
            emissiveIntensity={isSelected ? 0.5 : 0.1}
          />
        );
      case "chassis":
      case "frame":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.6}
            roughness={0.4}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        );
      case "gear":
      case "axle":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.9}
            roughness={0.2}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        );
      case "esc":
      case "sensor":
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.3}
            roughness={0.6}
            emissive={isSelected ? "#f59e0b" : "#3b82f6"}
            emissiveIntensity={isSelected ? 0.5 : 0.2}
          />
        );
      default:
        return (
          <meshStandardMaterial 
            color={baseColor}
            metalness={0.5}
            roughness={0.5}
            emissive={isSelected ? "#f59e0b" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        );
    }
  };

  const getGeometry = () => {
    switch (component.type) {
      case "dc_motor":
      case "servo_motor":
      case "stepper_motor":
        return (
          <group>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
              {getMaterial()}
            </mesh>
            {/* Motor shaft */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
      case "wheel":
        return (
          <group>
            <mesh rotation={getRotation("wheel")} castShadow receiveShadow>
              <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.z, 32]} />
              {getMaterial()}
            </mesh>
            {/* Tire tread */}
            <mesh rotation={getRotation("wheel")} position={[0, 0, 0]}>
              <torusGeometry args={[component.scale.x * 0.9, 0.1, 16, 32]} />
              <meshStandardMaterial color="#1f2937" roughness={0.95} />
            </mesh>
          </group>
        );
      case "propeller":
        return (
          <group>
            {/* Main blade */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 0.08, 0.3]} />
              {getMaterial()}
            </mesh>
            {/* Cross blade */}
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.08, 0.3]} />
              {getMaterial()}
            </mesh>
            {/* Hub */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      case "chassis":
      case "frame":
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />
            {getMaterial()}
          </mesh>
        );
      case "battery":
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />
              {getMaterial()}
            </mesh>
            {/* Battery terminals */}
            <mesh position={[component.scale.x * 0.4, component.scale.y * 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
              <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[component.scale.x * 0.2, component.scale.y * 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      case "esc":
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />
              {getMaterial()}
            </mesh>
            {/* Heat sink fins */}
            {[0, 1, 2].map((i) => (
              <mesh 
                key={i} 
                position={[0, component.scale.y * 0.6, (i - 1) * 0.2]} 
                castShadow
              >
                <boxGeometry args={[component.scale.x * 0.8, 0.05, 0.15]} />
                <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      case "gear":
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.y, 24]} />
              {getMaterial()}
            </mesh>
            {/* Gear teeth */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * component.scale.x * 1.1,
                    0,
                    Math.sin(angle) * component.scale.x * 1.1,
                  ]}
                  rotation={[0, angle, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.15, component.scale.y, 0.2]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
                </mesh>
              );
            })}
          </group>
        );
      case "axle":
        return (
          <mesh rotation={getRotation("axle")} castShadow receiveShadow>
            <cylinderGeometry args={[component.scale.x, component.scale.x, component.scale.y, 24]} />
            {getMaterial()}
          </mesh>
        );
      case "sensor":
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[component.scale.x, component.scale.y, component.scale.z]} />
              {getMaterial()}
            </mesh>
            {/* LED indicator */}
            <mesh position={[component.scale.x * 0.3, component.scale.y * 0.6, component.scale.z * 0.6]} castShadow>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial 
                color="#22c55e" 
                emissive="#22c55e" 
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {getMaterial()}
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      onClick={handleClick}
    >
      <mesh ref={meshRef}>
        {getGeometry()}
      </mesh>
      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
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
  const handleCanvasClick = () => {
    // Deselect when clicking on empty space
    onSelectComponent(null);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-border overflow-hidden shadow-2xl">
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 50 }}
        onClick={handleCanvasClick}
      >
        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
        <OrbitControls 
          makeDefault 
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={50}
        />
        
        {/* Advanced Lighting Setup */}
        <ambientLight intensity={0.4} />
        
        {/* Main directional light with shadows */}
        <directionalLight 
          position={[10, 15, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Fill lights */}
        <directionalLight position={[-10, 10, -5]} intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
        <pointLight position={[5, 3, 5]} intensity={0.3} color="#3b82f6" />
        <hemisphereLight args={["#87ceeb", "#333333", 0.3]} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={["#1e293b", 20, 50]} />
        
        {/* Grid and helpers */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#475569"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#64748b"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport 
            axisColors={["#ef4444", "#22c55e", "#3b82f6"]} 
            labelColor="white"
          />
        </GizmoHelper>
        
        {/* Components */}
        {components.map((component) => (
          <ComponentMesh
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent(component.id);
            }}
          />
        ))}
        
        {/* Contact Shadows for realism */}
        <ContactShadows
          position={[0, -0.05, 0]}
          opacity={0.5}
          scale={50}
          blur={2}
          far={10}
        />
        
        {/* Ground plane with realistic material */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.05, 0]} 
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default MechatronicsCanvas3D;
