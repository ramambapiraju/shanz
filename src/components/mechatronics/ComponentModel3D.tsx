import React, { useMemo } from 'react';
import { MechanicalComponent } from './MechanicalComponent';
import { MODEL_REGISTRY } from './ModelRegistry';
import * as THREE from 'three';

interface ComponentModel3DProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: () => void;
}

export const ComponentModel3D: React.FC<ComponentModel3DProps> = ({
  component,
  isSelected,
  onClick,
}) => {
  const modelConfig = MODEL_REGISTRY[component.type];
  
  const model = useMemo(() => {
    if (!modelConfig) return null;
    
    if (modelConfig.type === 'procedural' && modelConfig.generator) {
      // Use component's scale if available, otherwise use default
      const scaleArray = component.scale 
        ? [component.scale[0], component.scale[1], component.scale[2]] as [number, number, number]
        : modelConfig.defaultScale;
      return modelConfig.generator(scaleArray);
    }
    
    // For GLTF models (future implementation)
    return null;
  }, [modelConfig, component.scale]);
  
  if (!model) return null;
  
  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[
        component.rotation.x || 0,
        component.rotation.y || 0,
        component.rotation.z || 0,
      ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <primitive object={model} />
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[
            (component.scale?.[0] || 1) * 1.2,
            (component.scale?.[1] || 1) * 1.2,
            (component.scale?.[2] || 1) * 1.2,
          ]} />
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
