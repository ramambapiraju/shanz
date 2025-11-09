import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { MechanicalComponent } from "./MechanicalComponent";
import { isPropellerComponent, isWheelComponent, isMotorComponent, isServoComponent, isBatteryComponent, isESCComponent, isSensorComponent, isControllerComponent, isRCComponent, isChassisComponent } from "./ComponentCategories";
import * as THREE from "three";

interface ComponentMeshProps {
  component: MechanicalComponent;
  isSelected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

// Realistic Materials
const RealisticMaterials = {
  // Metals
  aluminum: { color: "#b8b8b8", metalness: 0.9, roughness: 0.2 },
  steel: { color: "#8a8a8a", metalness: 0.95, roughness: 0.3 },
  brass: { color: "#d4af37", metalness: 0.8, roughness: 0.25 },
  copper: { color: "#b87333", metalness: 0.85, roughness: 0.3 },
  
  // Plastics
  blackPlastic: { color: "#1a1a1a", metalness: 0.1, roughness: 0.6 },
  whitePlastic: { color: "#f0f0f0", metalness: 0.05, roughness: 0.5 },
  redPlastic: { color: "#cc0000", metalness: 0.1, roughness: 0.5 },
  bluePlastic: { color: "#0066cc", metalness: 0.1, roughness: 0.5 },
  
  // Electronics
  pcbGreen: { color: "#006633", metalness: 0.2, roughness: 0.7 },
  pcbBlue: { color: "#004466", metalness: 0.2, roughness: 0.7 },
  chipBlack: { color: "#0a0a0a", metalness: 0.3, roughness: 0.8 },
  
  // Carbon fiber
  carbonFiber: { color: "#1a1a1a", metalness: 0.6, roughness: 0.4 },
  
  // Rubber
  rubber: { color: "#2a2a2a", metalness: 0, roughness: 0.95 },
  
  // Battery
  lipo: { color: "#ffd700", metalness: 0.2, roughness: 0.6 },
  lipoLabel: { color: "#ffffff", metalness: 0, roughness: 0.8 },
};

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
  const emissiveIntensity = isSelected ? 0.3 : 0;

  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      scale={[component.scale.x, component.scale.y, component.scale.z]}
    >
      <group ref={groupRef} onClick={handleClick}>
        {/* REALISTIC WHEEL - Detailed tire with tread pattern and rim */}
        {isWheelComponent(component.type) && (
          <group rotation={[0, 0, Math.PI / 2]}>
            {/* Tire - Rubber part */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
              <meshStandardMaterial {...RealisticMaterials.rubber} emissive={emissive} emissiveIntensity={emissiveIntensity} />
            </mesh>
            
            {/* Rim - Aluminum wheel hub */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.16, 32]} />
              <meshStandardMaterial {...RealisticMaterials.aluminum} emissive={emissive} emissiveIntensity={emissiveIntensity} />
            </mesh>
            
            {/* Spokes - 5 spokes for realistic wheel */}
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]} position={[0.1, 0, 0]} castShadow>
                <boxGeometry args={[0.12, 0.16, 0.02]} />
                <meshStandardMaterial {...RealisticMaterials.aluminum} />
              </mesh>
            ))}
            
            {/* Center hub with bolts */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.17, 16]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* Tire tread pattern - grooves */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh key={`tread-${i}`} rotation={[0, (i * Math.PI * 2) / 8, 0]} position={[0.29, 0, 0]} castShadow>
                <boxGeometry args={[0.02, 0.12, 0.03]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC PROPELLER - Aircraft-grade with curved blades */}
        {isPropellerComponent(component.type) && (
          <group>
            {/* Two propeller blades with realistic airfoil shape */}
            {[0, 1].map((i) => (
              <group key={i} rotation={[0, i * Math.PI, 0]}>
                {/* Main blade body with twist */}
                <mesh castShadow receiveShadow position={[0.35, 0, 0]} rotation={[0, 0, -0.2]}>
                  <boxGeometry args={[0.7, 0.015, 0.12]} />
                  <meshStandardMaterial 
                    color="#2a2a2a"
                    metalness={0.4}
                    roughness={0.3}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Blade tip - rounded */}
                <mesh castShadow receiveShadow position={[0.68, 0, 0]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.3} />
                </mesh>
                
                {/* Blade root reinforcement */}
                <mesh castShadow receiveShadow position={[0.08, 0, 0]}>
                  <boxGeometry args={[0.1, 0.02, 0.14]} />
                  <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
                </mesh>
              </group>
            ))}
            
            {/* Center hub - aluminum */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.06, 16]} />
              <meshStandardMaterial {...RealisticMaterials.aluminum} />
            </mesh>
            
            {/* Motor shaft hole */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.07, 12]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* Mounting screws */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
              <mesh key={i} position={[Math.cos(angle) * 0.035, 0, Math.sin(angle) * 0.035]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
                <meshStandardMaterial {...RealisticMaterials.steel} />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC BRUSHLESS MOTOR - Detailed with stator, rotor, and bell */}
        {isMotorComponent(component.type) && (
          <group>
            {/* Motor can/bell - aluminum */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.35, 32]} />
              <meshStandardMaterial 
                {...RealisticMaterials.aluminum}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Motor base - black aluminum */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.05, 32]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </mesh>
            
            {/* Stator windings (copper coils visible through ventilation holes) */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={`coil-${i}`} rotation={[Math.PI / 2, (i * Math.PI) / 2, 0]} position={[0.16 * Math.cos((i * Math.PI) / 2), 0, 0.16 * Math.sin((i * Math.PI) / 2)]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial {...RealisticMaterials.copper} />
              </mesh>
            ))}
            
            {/* Output shaft - steel */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.12, 16]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* Shaft threaded section */}
            <mesh castShadow receiveShadow position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* Mounting holes (4 screws) */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
              <group key={`mount-${i}`} rotation={[Math.PI / 2, angle, 0]}>
                <mesh position={[0.15, -0.23, 0]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
                  <meshStandardMaterial {...RealisticMaterials.steel} />
                </mesh>
              </group>
            ))}
            
            {/* Ventilation holes in bell */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={`vent-${i}`} rotation={[Math.PI / 2, (i * Math.PI) / 3, 0]} position={[0.17 * Math.cos((i * Math.PI) / 3), 0.05, 0.17 * Math.sin((i * Math.PI) / 3)]}>
                <cylinderGeometry args={[0.01, 0.01, 0.36, 8]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0} roughness={0.9} />
              </mesh>
            ))}
            
            {/* Wire connectors - 3 phase */}
            {[-0.04, 0, 0.04].map((offset, i) => (
              <mesh key={`wire-${i}`} position={[-0.18, -0.23, offset]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
                <meshStandardMaterial {...RealisticMaterials.brass} />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC SERVO MOTOR - MG996R style with mounting tabs and horn */}
        {isServoComponent(component.type) && (
          <group>
            {/* Main servo body - black plastic */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.22, 0.24, 0.42]} />
              <meshStandardMaterial 
                {...RealisticMaterials.blackPlastic}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Mounting tabs - on both sides */}
            {[-1, 1].map((side, i) => (
              <mesh key={`tab-${i}`} castShadow receiveShadow position={[side * 0.16, 0, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.42]} />
                <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
              </mesh>
            ))}
            
            {/* Mounting screw holes */}
            {[-0.18, 0.18].map((z, zi) =>
              [-1, 1].map((side, si) => (
                <mesh key={`hole-${zi}-${si}`} position={[side * 0.16, 0, z]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.012, 0.012, 0.11, 8]} />
                  <meshStandardMaterial color="#0a0a0a" />
                </mesh>
              ))
            )}
            
            {/* Output shaft housing - metallic */}
            <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
              <meshStandardMaterial {...RealisticMaterials.aluminum} />
            </mesh>
            
            {/* Servo horn - white plastic cross-shaped */}
            <group position={[0, 0.18, 0]}>
              {/* Center hub */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.01, 16]} />
                <meshStandardMaterial {...RealisticMaterials.whitePlastic} />
              </mesh>
              
              {/* Four arms */}
              {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
                <mesh key={`arm-${i}`} rotation={[0, angle, 0]} position={[0.05, 0, 0]} castShadow>
                  <boxGeometry args={[0.09, 0.01, 0.025]} />
                  <meshStandardMaterial {...RealisticMaterials.whitePlastic} />
                </mesh>
              ))}
              
              {/* Mounting screw */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.015, 8]} />
                <meshStandardMaterial {...RealisticMaterials.steel} />
              </mesh>
            </group>
            
            {/* Wire bundle - 3 wires */}
            <group position={[0, -0.12, -0.25]}>
              {[-0.015, 0, 0.015].map((offset, i) => {
                const colors = ["#ff0000", "#000000", "#ffffff"];
                return (
                  <mesh key={`wire-${i}`} position={[offset, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />
                    <meshStandardMaterial color={colors[i]} metalness={0.1} roughness={0.7} />
                  </mesh>
                );
              })}
            </group>
            
            {/* Label/Brand sticker */}
            <mesh position={[0, 0, 0.211]} castShadow>
              <boxGeometry args={[0.18, 0.15, 0.001]} />
              <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.8} />
            </mesh>
            
            {/* Ventilation slots */}
            {[-0.08, -0.04, 0, 0.04, 0.08].map((x, i) => (
              <mesh key={`vent-${i}`} position={[x, 0.11, 0.21]} castShadow>
                <boxGeometry args={[0.02, 0.08, 0.002]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC LIPO BATTERY - With cells, connectors, and warning labels */}
        {isBatteryComponent(component.type) && (
          <group>
            {/* Main battery pack - yellow shrink wrap */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.15, 0.4]} />
              <meshStandardMaterial 
                {...RealisticMaterials.lipo}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Individual cell separations - 3S visible */}
            {[-0.13, 0.13].map((x, i) => (
              <mesh key={`sep-${i}`} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.005, 0.16, 0.41]} />
                <meshStandardMaterial color="#cc9900" metalness={0.1} roughness={0.7} />
              </mesh>
            ))}
            
            {/* Warning label - front */}
            <mesh position={[0, 0, 0.201]} castShadow>
              <boxGeometry args={[0.6, 0.12, 0.001]} />
              <meshStandardMaterial {...RealisticMaterials.lipoLabel} />
            </mesh>
            
            {/* Specs label - back */}
            <mesh position={[0, 0, -0.201]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.001]} />
              <meshStandardMaterial color="#000000" metalness={0} roughness={0.9} />
            </mesh>
            
            {/* Main power connector - XT60 style (yellow) */}
            <group position={[0.4, 0, 0]}>
              {/* Connector body */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.08, 0.08, 0.2]} />
                <meshStandardMaterial color="#ffcc00" metalness={0.2} roughness={0.6} />
              </mesh>
              
              {/* Metal pins */}
              {[-0.03, 0.03].map((offset, i) => (
                <mesh key={`pin-${i}`} position={[0.041, offset, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
                  <meshStandardMaterial {...RealisticMaterials.brass} />
                </mesh>
              ))}
            </group>
            
            {/* Balance connector - white JST-XH */}
            <group position={[-0.38, 0, 0.1]} rotation={[0, Math.PI / 2, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.06, 0.05, 0.04]} />
                <meshStandardMaterial {...RealisticMaterials.whitePlastic} />
              </mesh>
              
              {/* Balance connector pins - 4 for 3S */}
              {[-0.02, -0.007, 0.007, 0.02].map((offset, i) => (
                <mesh key={`bal-${i}`} position={[-0.031, offset, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.003, 0.003, 0.01, 6]} />
                  <meshStandardMaterial {...RealisticMaterials.brass} />
                </mesh>
              ))}
            </group>
            
            {/* Protective padding corners */}
            {[-0.35, 0.35].map((x) =>
              [-0.2, 0.2].map((z, i) => (
                <mesh key={`pad-${x}-${i}`} position={[x, 0, z]} castShadow>
                  <boxGeometry args={[0.015, 0.16, 0.015]} />
                  <meshStandardMaterial color="#333333" metalness={0} roughness={0.9} />
                </mesh>
              ))
            )}
          </group>
        )}

        {/* REALISTIC ESC - Electronic Speed Controller with heatsink and connectors */}
        {isESCComponent(component.type) && (
          <group>
            {/* Main ESC body - blue anodized aluminum */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.12, 0.28]} />
              <meshStandardMaterial 
                {...RealisticMaterials.bluePlastic}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Heatsink fins - aluminum */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={`fin-${i}`} position={[-0.22 + i * 0.06, 0.07, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.04, 0.03, 0.29]} />
                <meshStandardMaterial {...RealisticMaterials.aluminum} />
              </mesh>
            ))}
            
            {/* PCB - green circuit board visible on bottom */}
            <mesh position={[0, -0.061, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.002, 0.26]} />
              <meshStandardMaterial {...RealisticMaterials.pcbGreen} />
            </mesh>
            
            {/* Capacitors - black cylinders */}
            {[-0.15, 0, 0.15].map((x, i) => (
              <mesh key={`cap-${i}`} position={[x, -0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
              </mesh>
            ))}
            
            {/* Power input wires - red and black */}
            <group position={[-0.28, 0, -0.15]}>
              {[{c: "#ff0000", y: 0.02}, {c: "#000000", y: -0.02}].map((wire, i) => (
                <mesh key={`pwr-${i}`} position={[0, wire.y, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
                  <meshStandardMaterial color={wire.c} metalness={0.1} roughness={0.7} />
                </mesh>
              ))}
            </group>
            
            {/* Motor output wires - three phase (yellow, blue, orange) */}
            <group position={[0.28, 0, 0.05]}>
              {[{c: "#ffcc00", y: 0.03}, {c: "#0066cc", y: 0}, {c: "#ff6600", y: -0.03}].map((wire, i) => (
                <mesh key={`mot-${i}`} position={[0, wire.y, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
                  <meshStandardMaterial color={wire.c} metalness={0.1} roughness={0.7} />
                </mesh>
              ))}
            </group>
            
            {/* Signal wire - 3-pin servo connector */}
            <group position={[-0.28, 0, 0.12]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.04, 0.08, 0.06]} />
                <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
              </mesh>
              
              {[-0.015, 0, 0.015].map((offset, i) => (
                <mesh key={`sig-${i}`} position={[-0.021, offset, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.003, 0.003, 0.01, 6]} />
                  <meshStandardMaterial {...RealisticMaterials.brass} />
                </mesh>
              ))}
            </group>
            
            {/* LED indicator */}
            <mesh position={[0.15, 0.061, 0.1]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} metalness={0.2} roughness={0.6} />
            </mesh>
            
            {/* Mounting holes */}
            {[-0.2, 0.2].map((x) =>
              [-0.1, 0.1].map((z, i) => (
                <mesh key={`hole-${x}-${i}`} position={[x, 0.061, z]} castShadow>
                  <cylinderGeometry args={[0.012, 0.012, 0.005, 8]} />
                  <meshStandardMaterial color="#0a0a0a" />
                </mesh>
              ))
            )}
          </group>
        )}

        {/* REALISTIC FLIGHT CONTROLLER / ARDUINO - Detailed PCB with components */}
        {isControllerComponent(component.type) && (
          <group>
            {/* Main PCB board - green or blue depending on type */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.55, 0.015, 0.38]} />
              <meshStandardMaterial 
                {...(component.type === 'flight_controller' ? RealisticMaterials.pcbBlue : RealisticMaterials.pcbGreen)}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Main microcontroller chip - black */}
            <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.15, 0.008, 0.15]} />
              <meshStandardMaterial {...RealisticMaterials.chipBlack} />
            </mesh>
            
            {/* Chip pins - metallic leads */}
            {Array.from({ length: 12 }).map((_, i) => {
              const side = i < 6 ? -1 : 1;
              const idx = i < 6 ? i : i - 6;
              return (
                <mesh key={`pin-${i}`} position={[side * 0.08, 0.012, -0.05 + idx * 0.02]} castShadow>
                  <boxGeometry args={[0.02, 0.002, 0.006]} />
                  <meshStandardMaterial {...RealisticMaterials.brass} />
                </mesh>
              );
            })}
            
            {/* USB connector - silver */}
            <mesh position={[0, 0.02, -0.22]} castShadow receiveShadow>
              <boxGeometry args={[0.08, 0.03, 0.08]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* Pin headers - black plastic with brass pins */}
            {[-0.2, 0.2].map((x, xi) => (
              <group key={`header-${xi}`}>
                <mesh position={[x, 0.012, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.1, 0.024, 0.3]} />
                  <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
                </mesh>
                
                {/* Individual pins */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <mesh key={`hpin-${i}`} position={[x, 0.007, -0.14 + i * 0.03]} castShadow>
                    <boxGeometry args={[0.015, 0.03, 0.015]} />
                    <meshStandardMaterial {...RealisticMaterials.brass} />
                  </mesh>
                ))}
              </group>
            ))}
            
            {/* Power LED - red */}
            <mesh position={[-0.15, 0.018, -0.1]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} metalness={0.2} roughness={0.6} />
            </mesh>
            
            {/* Status LED - green */}
            <mesh position={[-0.15, 0.018, -0.14]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.4} metalness={0.2} roughness={0.6} />
            </mesh>
            
            {/* Capacitors - small yellow cylinders */}
            {[-0.12, 0, 0.12].map((z, i) => (
              <mesh key={`cap-${i}`} position={[0.15, 0.015, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
                <meshStandardMaterial color="#ffcc00" metalness={0.2} roughness={0.6} />
              </mesh>
            ))}
            
            {/* Crystal oscillator - silver */}
            <mesh position={[0.1, 0.015, -0.08]} castShadow receiveShadow>
              <boxGeometry args={[0.025, 0.01, 0.04]} />
              <meshStandardMaterial {...RealisticMaterials.steel} />
            </mesh>
            
            {/* IMU sensor chip (for flight controller) */}
            {component.type === 'flight_controller' && (
              <mesh position={[0, 0.018, 0.12]} castShadow receiveShadow>
                <boxGeometry args={[0.08, 0.008, 0.08]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.6} />
              </mesh>
            )}
            
            {/* Mounting holes in corners */}
            {[-0.25, 0.25].map((x) =>
              [-0.17, 0.17].map((z, i) => (
                <mesh key={`mhole-${x}-${i}`} position={[x, 0.008, z]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.016, 12]} />
                  <meshStandardMaterial color="#0a0a0a" />
                </mesh>
              ))
            )}
            
            {/* Resistors - tiny tan components */}
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={`res-${i}`} position={[-0.05 + i * 0.04, 0.013, 0.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <cylinderGeometry args={[0.006, 0.006, 0.018, 8]} />
                <meshStandardMaterial color="#d4c4a1" metalness={0.1} roughness={0.7} />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC CHASSIS - Detailed frame with mounting points and structure */}
        {isChassisComponent(component.type) && (
          <group>
            {/* Main chassis plate - aluminum or carbon fiber */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.04, 0.8]} />
              <meshStandardMaterial 
                {...(component.type === 'carbon_frame' ? RealisticMaterials.carbonFiber : RealisticMaterials.aluminum)}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            
            {/* Cross braces - structural support */}
            {[-0.3, 0.3].map((z, i) => (
              <mesh key={`brace-x-${i}`} position={[0, 0, z]} castShadow receiveShadow>
                <boxGeometry args={[1.4, 0.03, 0.03]} />
                <meshStandardMaterial {...(component.type === 'carbon_frame' ? RealisticMaterials.carbonFiber : RealisticMaterials.aluminum)} />
              </mesh>
            ))}
            
            {[-0.5, 0, 0.5].map((x, i) => (
              <mesh key={`brace-z-${i}`} position={[x, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.03, 0.03, 0.8]} />
                <meshStandardMaterial {...(component.type === 'carbon_frame' ? RealisticMaterials.carbonFiber : RealisticMaterials.aluminum)} />
              </mesh>
            ))}
            
            {/* Corner reinforcements */}
            {[-0.65, 0.65].map((x) =>
              [-0.38, 0.38].map((z, i) => (
                <group key={`corner-${x}-${i}`}>
                  <mesh position={[x, 0.03, z]} castShadow receiveShadow>
                    <boxGeometry args={[0.08, 0.02, 0.08]} />
                    <meshStandardMaterial {...RealisticMaterials.aluminum} />
                  </mesh>
                  
                  {/* Mounting hole */}
                  <mesh position={[x, 0.021, z]} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.03, 12]} />
                    <meshStandardMaterial color="#0a0a0a" />
                  </mesh>
                </group>
              ))
            )}
            
            {/* Motor mounts - raised platforms */}
            {[-0.6, 0.6].map((x) =>
              [-0.35, 0.35].map((z, i) => (
                <group key={`mount-${x}-${i}`}>
                  <mesh position={[x, 0.05, z]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.1, 0.08, 0.06, 16]} />
                    <meshStandardMaterial {...RealisticMaterials.aluminum} />
                  </mesh>
                  
                  {/* Four mounting screw holes around the mount */}
                  {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, ai) => (
                    <mesh key={`screw-${ai}`} position={[x + Math.cos(angle) * 0.06, 0.08, z + Math.sin(angle) * 0.06]} castShadow>
                      <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
                      <meshStandardMaterial {...RealisticMaterials.steel} />
                    </mesh>
                  ))}
                </group>
              ))
            )}
            
            {/* Battery mounting straps */}
            {[-0.15, 0.15].map((x, i) => (
              <mesh key={`strap-${i}`} position={[x, 0.025, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.01, 0.7]} />
                <meshStandardMaterial color="#333333" metalness={0} roughness={0.9} />
              </mesh>
            ))}
            
            {/* Electronics mounting standoffs */}
            {[-0.25, -0.05, 0.15].map((x, i) => (
              <mesh key={`standoff-${i}`} position={[x, 0.04, 0.15]} castShadow receiveShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
                <meshStandardMaterial {...RealisticMaterials.brass} />
              </mesh>
            ))}
            
            {/* Cable routing clips */}
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={`clip-${i}`} position={[-0.5 + i * 0.25, 0.025, -0.25]} castShadow receiveShadow>
                <torusGeometry args={[0.015, 0.005, 8, 12]} />
                <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
              </mesh>
            ))}
            
            {/* Lightening holes - weight reduction */}
            {Array.from({ length: 4 }).map((_, i) =>
              Array.from({ length: 3 }).map((_, j) => (
                <mesh key={`hole-${i}-${j}`} position={[-0.45 + i * 0.3, 0.021, -0.2 + j * 0.2]} castShadow>
                  <cylinderGeometry args={[0.05, 0.05, 0.042, 16]} />
                  <meshStandardMaterial color="#0a0a0a" />
                </mesh>
              ))
            )}
            
            {/* Side plates for protection */}
            {[-1, 1].map((side, i) => (
              <mesh key={`side-${i}`} position={[side * 0.71, 0.15, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.02, 0.25, 0.75]} />
                <meshStandardMaterial {...RealisticMaterials.blackPlastic} opacity={0.3} transparent />
              </mesh>
            ))}
          </group>
        )}

        {/* REALISTIC SENSORS - Different sensor types with accurate representations */}
        {isSensorComponent(component.type) && (
          <group>
            {/* Ultrasonic Sensor - HC-SR04 style */}
            {component.type === 'ultrasonic_sensor' && (
              <group>
                {/* Main PCB body - blue */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.45, 0.02, 0.2]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.pcbBlue}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Ultrasonic transducers - two silver cylinders */}
                {[-0.12, 0.12].map((x, i) => (
                  <group key={`trans-${i}`} position={[x, 0.025, 0]}>
                    {/* Outer metal can */}
                    <mesh castShadow receiveShadow>
                      <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
                      <meshStandardMaterial {...RealisticMaterials.aluminum} />
                    </mesh>
                    
                    {/* Mesh screen */}
                    <mesh position={[0, 0.031, 0]} castShadow>
                      <cylinderGeometry args={[0.075, 0.075, 0.002, 24]} />
                      <meshStandardMaterial color="#666666" metalness={0.3} roughness={0.8} />
                    </mesh>
                  </group>
                ))}
                
                {/* Crystal oscillator */}
                <mesh position={[0, 0.015, 0.08]} castShadow receiveShadow>
                  <boxGeometry args={[0.025, 0.01, 0.02]} />
                  <meshStandardMaterial {...RealisticMaterials.steel} />
                </mesh>
                
                {/* Pin headers - 4 pins */}
                <group position={[0, -0.015, -0.12]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.1, 0.03, 0.06]} />
                    <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
                  </mesh>
                  
                  {[-0.03, -0.01, 0.01, 0.03].map((offset, i) => (
                    <mesh key={`pin-${i}`} position={[offset, -0.02, 0]} castShadow>
                      <boxGeometry args={[0.015, 0.03, 0.015]} />
                      <meshStandardMaterial {...RealisticMaterials.brass} />
                    </mesh>
                  ))}
                </group>
              </group>
            )}
            
            {/* Gyroscope/IMU Sensor - MPU6050 style */}
            {component.type === 'gyro_mpu6050' && (
              <group>
                {/* PCB - purple/black */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.2, 0.015, 0.16]} />
                  <meshStandardMaterial 
                    color="#4a2c6f"
                    metalness={0.2}
                    roughness={0.7}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Main IMU chip */}
                <mesh position={[0, 0.013, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.08, 0.006, 0.08]} />
                  <meshStandardMaterial {...RealisticMaterials.chipBlack} />
                </mesh>
                
                {/* Chip pins */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const side = i < 4 ? -1 : 1;
                  const idx = i < 4 ? i : i - 4;
                  return (
                    <mesh key={`cpin-${i}`} position={[side * 0.045, 0.01, -0.03 + idx * 0.02]} castShadow>
                      <boxGeometry args={[0.015, 0.002, 0.005]} />
                      <meshStandardMaterial {...RealisticMaterials.brass} />
                    </mesh>
                  );
                })}
                
                {/* Pin header */}
                <group position={[0, -0.012, -0.1]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.08, 0.024, 0.04]} />
                    <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
                  </mesh>
                  
                  {Array.from({ length: 8 }).map((_, i) => (
                    <mesh key={`hpin-${i}`} position={[-0.035 + i * 0.01, -0.015, 0]} castShadow>
                      <boxGeometry args={[0.006, 0.02, 0.006]} />
                      <meshStandardMaterial {...RealisticMaterials.brass} />
                    </mesh>
                  ))}
                </group>
                
                {/* Capacitors */}
                {[-0.05, 0.05].map((x, i) => (
                  <mesh key={`cap-${i}`} position={[x, 0.012, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
                    <meshStandardMaterial color="#ffcc00" metalness={0.2} roughness={0.6} />
                  </mesh>
                ))}
              </group>
            )}
            
            {/* GPS Module */}
            {component.type === 'gps_module' && (
              <group>
                {/* Main PCB - green */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.28, 0.015, 0.28]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.pcbGreen}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* GPS chip - black */}
                <mesh position={[0, 0.013, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.12, 0.006, 0.12]} />
                  <meshStandardMaterial {...RealisticMaterials.chipBlack} />
                </mesh>
                
                {/* Ceramic patch antenna - white square */}
                <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.18, 0.01, 0.18]} />
                  <meshStandardMaterial {...RealisticMaterials.whitePlastic} />
                </mesh>
                
                {/* Antenna feed point */}
                <mesh position={[0, 0.026, 0]} castShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.004, 12]} />
                  <meshStandardMaterial {...RealisticMaterials.copper} />
                </mesh>
                
                {/* Connector for external antenna */}
                <mesh position={[0.12, 0.015, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.02, 0.015, 0.03, 16]} />
                  <meshStandardMaterial {...RealisticMaterials.brass} />
                </mesh>
                
                {/* Pin header */}
                <group position={[0, -0.012, -0.15]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.1, 0.024, 0.04]} />
                    <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
                  </mesh>
                  
                  {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={`pin-${i}`} position={[-0.025 + i * 0.01, -0.015, 0]} castShadow>
                      <boxGeometry args={[0.006, 0.02, 0.006]} />
                      <meshStandardMaterial {...RealisticMaterials.brass} />
                    </mesh>
                  ))}
                </group>
                
                {/* Status LED */}
                <mesh position={[0.1, 0.018, 0.1]} castShadow>
                  <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
                  <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} metalness={0.2} roughness={0.6} />
                </mesh>
              </group>
            )}
            
            {/* Camera Module */}
            {component.type === 'camera_module' && (
              <group>
                {/* PCB base */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.25, 0.015, 0.25]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.pcbGreen}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Image sensor chip */}
                <mesh position={[0, 0.013, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.08, 0.005, 0.08]} />
                  <meshStandardMaterial {...RealisticMaterials.chipBlack} />
                </mesh>
                
                {/* Lens assembly - multiple elements */}
                <group position={[0, 0.05, 0]}>
                  {/* Lens housing */}
                  <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.06, 0.05, 0.08, 24]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                  </mesh>
                  
                  {/* Lens glass */}
                  <mesh position={[0, 0.041, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.055, 0.055, 0.002, 24]} />
                    <meshStandardMaterial 
                      color="#333366"
                      metalness={0.9}
                      roughness={0.1}
                      transparent
                      opacity={0.9}
                    />
                  </mesh>
                  
                  {/* Lens coating reflection */}
                  <mesh position={[0, 0.042, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.001, 24]} />
                    <meshStandardMaterial 
                      color="#6666ff"
                      emissive="#6666ff"
                      emissiveIntensity={0.2}
                      metalness={0.9}
                      roughness={0.1}
                      transparent
                      opacity={0.3}
                    />
                  </mesh>
                </group>
                
                {/* Ribbon cable connector */}
                <mesh position={[0, 0.012, -0.14]} castShadow receiveShadow>
                  <boxGeometry args={[0.18, 0.01, 0.04]} />
                  <meshStandardMaterial color="#f5f5dc" metalness={0.1} roughness={0.8} />
                </mesh>
                
                {/* Mounting holes */}
                {[-0.1, 0.1].map((x) =>
                  [-0.1, 0.1].map((z, i) => (
                    <mesh key={`hole-${x}-${i}`} position={[x, 0.008, z]} castShadow>
                      <cylinderGeometry args={[0.01, 0.01, 0.016, 8]} />
                      <meshStandardMaterial color="#0a0a0a" />
                    </mesh>
                  ))
                )}
              </group>
            )}
            
            {/* Default generic sensor if type doesn't match */}
            {!['ultrasonic_sensor', 'gyro_mpu6050', 'gps_module', 'camera_module'].includes(component.type) && (
              <group>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.2, 0.1, 0.15]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.blackPlastic}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                <mesh position={[0, 0.05, 0.08]} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
                  <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.4} />
                </mesh>
              </group>
            )}
          </group>
        )}

        {/* RC Receivers and Transmitters */}
        {isRCComponent(component.type) && (
          <group>
            {component.type === 'receiver_2.4ghz' && (
              <group>
                {/* Receiver body - black plastic */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.35, 0.08, 0.18]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.blackPlastic}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Antenna wire */}
                <mesh position={[0, 0.05, 0.1]} rotation={[Math.PI / 4, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.004, 0.004, 0.25, 8]} />
                  <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.8} />
                </mesh>
                
                {/* Channel connectors - 8 channels */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <group key={`ch-${i}`} position={[-0.15 + i * 0.04, -0.045, 0]}>
                    <mesh castShadow receiveShadow>
                      <boxGeometry args={[0.03, 0.02, 0.1]} />
                      <meshStandardMaterial {...RealisticMaterials.blackPlastic} />
                    </mesh>
                    
                    {/* Three pins per channel */}
                    {[-0.025, 0, 0.025].map((offset, j) => (
                      <mesh key={`pin-${j}`} position={[0, -0.015, offset]} castShadow>
                        <boxGeometry args={[0.008, 0.015, 0.008]} />
                        <meshStandardMaterial {...RealisticMaterials.brass} />
                      </mesh>
                    ))}
                  </group>
                ))}
                
                {/* Status LEDs */}
                {[-0.08, 0, 0.08].map((x, i) => {
                  const colors = ["#ff0000", "#00ff00", "#0000ff"];
                  return (
                    <mesh key={`led-${i}`} position={[x, 0.041, 0.06]} castShadow>
                      <cylinderGeometry args={[0.008, 0.008, 0.004, 12]} />
                      <meshStandardMaterial 
                        color={colors[i]}
                        emissive={colors[i]}
                        emissiveIntensity={0.5}
                        metalness={0.2}
                        roughness={0.6}
                      />
                    </mesh>
                  );
                })}
                
                {/* Brand label */}
                <mesh position={[0, 0.041, -0.03]} castShadow>
                  <boxGeometry args={[0.2, 0.001, 0.08]} />
                  <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.9} />
                </mesh>
              </group>
            )}
            
            {component.type === 'transmitter_2.4ghz' && (
              <group>
                {/* Transmitter body - ergonomic shape */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.5, 0.25, 0.15]} />
                  <meshStandardMaterial 
                    {...RealisticMaterials.blackPlastic}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                
                {/* Grip sections */}
                {[-1, 1].map((side, i) => (
                  <mesh key={`grip-${i}`} position={[side * 0.22, -0.15, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.12, 0.15, 0.14]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.8} />
                  </mesh>
                ))}
                
                {/* Antenna */}
                <group position={[0, 0.15, 0]}>
                  <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.015, 0.01, 0.4, 12]} />
                    <meshStandardMaterial {...RealisticMaterials.aluminum} />
                  </mesh>
                  
                  <mesh position={[0, 0.22, 0]} castShadow>
                    <sphereGeometry args={[0.02, 12, 12]} />
                    <meshStandardMaterial {...RealisticMaterials.aluminum} />
                  </mesh>
                </group>
                
                {/* Control sticks - two gimbals */}
                {[-0.12, 0.12].map((x, i) => (
                  <group key={`stick-${i}`} position={[x, 0.13, 0]}>
                    <mesh castShadow receiveShadow>
                      <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
                      <meshStandardMaterial {...RealisticMaterials.aluminum} />
                    </mesh>
                    
                    <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
                      <meshStandardMaterial {...RealisticMaterials.aluminum} />
                    </mesh>
                    
                    <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
                      <sphereGeometry args={[0.025, 16, 16]} />
                      <meshStandardMaterial {...RealisticMaterials.redPlastic} />
                    </mesh>
                  </group>
                ))}
                
                {/* LCD screen */}
                <mesh position={[0, 0.126, 0.05]} castShadow receiveShadow>
                  <boxGeometry args={[0.18, 0.001, 0.08]} />
                  <meshStandardMaterial 
                    color="#2a5a3a"
                    emissive="#2a5a3a"
                    emissiveIntensity={0.3}
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
                
                {/* Buttons and switches */}
                {[-0.22, -0.18, 0.18, 0.22].map((x, i) => (
                  <mesh key={`btn-${i}`} position={[x, 0.126, -0.04]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
                    <meshStandardMaterial {...RealisticMaterials.redPlastic} />
                  </mesh>
                ))}
                
                {/* Trim switches */}
                {[-0.24, 0.24].map((x, i) => (
                  <mesh key={`trim-${i}`} position={[x, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.02, 0.06, 0.02]} />
                    <meshStandardMaterial {...RealisticMaterials.aluminum} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        )}

        {/* Default fallback for unrecognized component types */}
        {!isWheelComponent(component.type) && !isPropellerComponent(component.type) &&
         !isMotorComponent(component.type) && !isServoComponent(component.type) &&
         !isBatteryComponent(component.type) && !isESCComponent(component.type) &&
         !isControllerComponent(component.type) && !isChassisComponent(component.type) &&
         !isSensorComponent(component.type) && !isRCComponent(component.type) && (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.6}
              roughness={0.4}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {/* Selection highlight outline */}
        {isSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color="#fbbf24" wireframe opacity={0.3} transparent />
          </mesh>
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
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        
        {/* Professional lighting setup for photorealism */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#444444" />
        <pointLight position={[-10, 10, -10]} intensity={0.4} />
        <spotLight 
          position={[0, 15, 0]} 
          intensity={0.6}
          angle={0.6}
          penumbra={0.5}
          castShadow
        />
        
        {/* Environment lighting for realistic reflections */}
        <Environment preset="city" />
        
        <Grid 
          infiniteGrid 
          cellSize={0.5} 
          cellThickness={0.8} 
          sectionSize={2} 
          fadeDistance={50}
          fadeStrength={2}
        />
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.6} 
          scale={30} 
          blur={2}
          far={10}
        />
        
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
