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
      <group ref={groupRef} onClick={handleClick}>
        {isWheelComponent(component.type) && (
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.12, 24]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.5}
              roughness={0.6}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {isPropellerComponent(component.type) && (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.02, 0.1]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.3}
                roughness={0.5}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.8, 0.02, 0.1]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.3}
                roughness={0.5}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          </group>
        )}

        {isMotorComponent(component.type) && (
          <group>
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.3, 24]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.6}
                roughness={0.4}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.1, 12]} />
              <meshStandardMaterial color="#bbbbbb" />
            </mesh>
          </group>
        )}

        {isServoComponent(component.type) && (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.25, 0.2, 0.4]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.4}
                roughness={0.5}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
              <boxGeometry args={[0.1, 0.02, 0.2]} />
              <meshStandardMaterial color="#dddddd" />
            </mesh>
          </group>
        )}

        {isBatteryComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.2}
              roughness={0.6}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {isESCComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.1, 0.25]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.3}
              roughness={0.5}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {isControllerComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.1, 0.35]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.2}
              roughness={0.6}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {isChassisComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.1, 0.7]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.3}
              roughness={0.7}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {isSensorComponent(component.type) && (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.1, 0.1]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.2}
                roughness={0.6}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {component.type === 'ultrasonic_sensor' && (
              <group position={[0, 0.02, 0.06]}>
                <mesh>
                  <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
                  <meshStandardMaterial color="#666666" />
                </mesh>
                <mesh position={[0.08, 0, 0]}>
                  <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
                  <meshStandardMaterial color="#666666" />
                </mesh>
              </group>
            )}
          </group>
        )}

        {!isWheelComponent(component.type) && !isPropellerComponent(component.type) &&
         !isMotorComponent(component.type) && !isServoComponent(component.type) &&
         !isBatteryComponent(component.type) && !isESCComponent(component.type) &&
         !isControllerComponent(component.type) && !isChassisComponent(component.type) &&
         !isSensorComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.6}
              roughness={0.4}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

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
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
}

const MechatronicsCanvas3D: React.FC<MechatronicsCanvas3DProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
}) => {
  const handleComponentClick = (component: MechanicalComponent) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectComponent(component.id);
  };

  const handleCanvasClick = () => {
    onSelectComponent(null);
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
            isSelected={selectedComponent === component.id}
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
