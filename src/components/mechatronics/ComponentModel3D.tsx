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
        <cylinderGeometry args={[0.5, 0.5, 0.25, 16]} />
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
  
  // Default box
  return (
    <mesh castShadow>
      <boxGeometry args={[
        component.scale?.[0] || 0.5,
        component.scale?.[1] || 0.5,
        component.scale?.[2] || 0.5
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
        const scaleArray = component.scale 
          ? [component.scale[0], component.scale[1], component.scale[2]] as [number, number, number]
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
