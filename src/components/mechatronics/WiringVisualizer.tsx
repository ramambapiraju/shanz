import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { MechanicalComponent } from './MechanicalComponent';
import { 
  isMotorComponent, 
  isESCComponent, 
  isBatteryComponent, 
  isControllerComponent,
  isPropellerComponent
} from './ComponentCategories';

interface WiringVisualizerProps {
  components: MechanicalComponent[];
  showWiring: boolean;
  currentFlow: number; // 0-1 for animation
}

interface Wire {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  color: string;
  thickness: number;
  type: 'power' | 'signal' | 'ground';
}

export const WiringVisualizer: React.FC<WiringVisualizerProps> = ({
  components,
  showWiring,
  currentFlow,
}) => {
  const wires = useMemo(() => {
    if (!showWiring) return [];
    
    const wireList: Wire[] = [];
    
    // Find key components
    const battery = components.find(c => isBatteryComponent(c.type));
    const controller = components.find(c => isControllerComponent(c.type));
    const escs = components.filter(c => isESCComponent(c.type));
    const motors = components.filter(c => isMotorComponent(c.type));
    
    if (!battery) return [];
    
    // Battery to Controller (Power)
    if (controller) {
      wireList.push({
        from: battery.position,
        to: controller.position,
        color: '#ff0000', // Red for power
        thickness: 0.03,
        type: 'power',
      });
      wireList.push({
        from: battery.position,
        to: { ...controller.position, y: controller.position.y - 0.05 },
        color: '#000000', // Black for ground
        thickness: 0.03,
        type: 'ground',
      });
    }
    
    // Battery/Controller to ESCs (Power + Signal)
    escs.forEach((esc, index) => {
      const source = controller || battery;
      
      // Power wire
      wireList.push({
        from: source.position,
        to: esc.position,
        color: '#ff0000',
        thickness: 0.025,
        type: 'power',
      });
      
      // Signal wire (if controller exists)
      if (controller) {
        wireList.push({
          from: controller.position,
          to: { ...esc.position, x: esc.position.x + 0.05 },
          color: '#ffff00', // Yellow for signal
          thickness: 0.015,
          type: 'signal',
        });
      }
    });
    
    // ESCs to Motors (3-phase power)
    motors.forEach((motor, index) => {
      const esc = escs[index];
      if (!esc) return;
      
      // Three phase wires
      const colors = ['#ff0000', '#ffff00', '#0000ff']; // R-Y-B
      colors.forEach((color, phaseIndex) => {
        wireList.push({
          from: { ...esc.position, x: esc.position.x + (phaseIndex - 1) * 0.03 },
          to: { ...motor.position, x: motor.position.x + (phaseIndex - 1) * 0.03 },
          color,
          thickness: 0.02,
          type: 'power',
        });
      });
    });
    
    return wireList;
  }, [components, showWiring]);
  
  if (!showWiring || wires.length === 0) return null;
  
  return (
    <group>
      {wires.map((wire, index) => {
        // Create curved wire path
        const midPoint = {
          x: (wire.from.x + wire.to.x) / 2,
          y: Math.min(wire.from.y, wire.to.y) - 0.2, // Sag in the middle
          z: (wire.from.z + wire.to.z) / 2,
        };
        
        const points: [number, number, number][] = [
          [wire.from.x, wire.from.y, wire.from.z],
          [midPoint.x, midPoint.y, midPoint.z],
          [wire.to.x, wire.to.y, wire.to.z],
        ];
        
        return (
          <group key={index}>
            <Line
              points={points}
              color={wire.color}
              lineWidth={wire.thickness * 50}
              segments
            />
            
            {/* Current flow animation */}
            {wire.type === 'power' && (
              <mesh position={[
                wire.from.x + (wire.to.x - wire.from.x) * currentFlow,
                wire.from.y + (wire.to.y - wire.from.y) * currentFlow,
                wire.from.z + (wire.to.z - wire.from.z) * currentFlow,
              ]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
