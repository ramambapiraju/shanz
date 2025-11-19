import React, { useMemo } from 'react';
import { MechanicalComponent } from './MechanicalComponent';
import { MODEL_REGISTRY } from './ModelRegistry';
import * as THREE from 'three';
import { 
  isPropellerComponent, 
  isWheelComponent, 
  isMotorComponent, 
  isServoComponent, 
  isBatteryComponent, 
  isESCComponent, 
  isControllerComponent,
  isChassisComponent,
  isSensorComponent
} from './ComponentCategories';

interface ComponentModel3DProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: () => void;
}

// Simple fallback shapes for better performance
const SimpleFallback: React.FC<{ component: MechanicalComponent; isSelected: boolean }> = ({ component, isSelected }) => {
  const color = isSelected ? "#fbbf24" : component.color;
  
  if (isWheelComponent(component.type)) {
    return (
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
    );
  }
  
  if (isPropellerComponent(component.type)) {
    return (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
        {[0, 1].map((i) => (
          <mesh key={i} rotation={[0, i * Math.PI, 0]} position={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.015, 0.1]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.3} />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (isMotorComponent(component.type)) {
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    );
  }
  
  if (isBatteryComponent(component.type)) {
    return (
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.15, 0.4]} />
        <meshStandardMaterial color="#ffd700" metalness={0.2} roughness={0.6} />
      </mesh>
    );
  }
  
  if (isESCComponent(component.type)) {
    return (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.08, 0.25]} />
          <meshStandardMaterial color="#1a472a" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.35, 0.02, 0.2]} />
          <meshStandardMaterial color="#2ecc71" metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
    );
  }
  
  if (isControllerComponent(component.type)) {
    return (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.05, 0.3]} />
          <meshStandardMaterial color="#0a3d62" metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Pin headers */}
        <mesh position={[-0.2, 0.03, 0]} castShadow>
          <boxGeometry args={[0.05, 0.06, 0.25]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.03, 0]} castShadow>
          <boxGeometry args={[0.05, 0.06, 0.25]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    );
  }
  
  if (isSensorComponent(component.type)) {
    return (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.05, 0.2]} />
          <meshStandardMaterial color="#e74c3c" metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Sensor eyes/lenses */}
        <mesh position={[-0.08, 0.03, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
          <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.03, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
          <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    );
  }
  
  // Default box for any other component type
  return (
    <mesh castShadow>
      <boxGeometry args={[
        component.scale?.x ?? 0.3,
        component.scale?.y ?? 0.3,
        component.scale?.z ?? 0.3
      ]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
    </mesh>
  );
};

export const ComponentModel3D: React.FC<ComponentModel3DProps> = ({
  component,
  isSelected,
  onClick,
}) => {
  const modelConfig = MODEL_REGISTRY[component.type];
  
  const model = useMemo(() => {
    if (!modelConfig) return null;
    
    try {
      if (modelConfig.type === 'procedural' && modelConfig.generator) {
        const scaleArray: [number, number, number] = component.scale 
          ? [component.scale.x || 1, component.scale.y || 1, component.scale.z || 1]
          : modelConfig.defaultScale;
        return modelConfig.generator(scaleArray);
      }
    } catch (error) {
      console.error('Error generating model for', component.type, error);
      return null;
    }
    
    return null;
  }, [modelConfig, component.type, component.scale]);
  
  // Use simple fallback if model generation failed or registry missing
  const useSimpleFallback = !model || !modelConfig;
  
  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[
        component.rotation.x || 0,
        component.rotation.y || 0,
        component.rotation.z || 0,
      ]}
      scale={[
        component.scale?.[0] || 1,
        component.scale?.[1] || 1,
        component.scale?.[2] || 1,
      ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {useSimpleFallback ? (
        <SimpleFallback component={component} isSelected={isSelected} />
      ) : (
        <primitive object={model} />
      )}
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};
