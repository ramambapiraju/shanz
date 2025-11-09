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
  
  useFrame((state) => {
    if (component.type === "propeller" && groupRef.current) {
      groupRef.current.rotation.y += 0.15;
    }
    if (component.type === "wheel" && groupRef.current) {
      groupRef.current.rotation.x += 0.05;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e);
  };

  const getRealisticGeometry = () => {
    const baseColor = isSelected ? "#fbbf24" : component.color;
    
    switch (component.type) {
      case "dc_motor":
      case "stepper_motor":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.4, 32]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.7}
                roughness={0.3}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
            </mesh>
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
              <mesh 
                key={i}
                position={[Math.cos(angle) * 0.15, -0.15, Math.sin(angle) * 0.15]}
              >
                <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh 
                key={`fin-${i}`}
                position={[0, 0.05 - i * 0.05, 0]}
                rotation={[0, 0, 0]}
              >
                <torusGeometry args={[0.19, 0.01, 8, 32]} />
                <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      
      case "servo_motor":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.35, 0.2, 0.3]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.6}
                roughness={0.4}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
              <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <boxGeometry args={[0.15, 0.02, 0.03]} />
              <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.7} />
            </mesh>
            {[-1, 1].map((side, i) => (
              <mesh key={i} position={[side * 0.2, 0, 0]}>
                <boxGeometry args={[0.05, 0.15, 0.3]} />
                <meshStandardMaterial color={baseColor} metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </group>
        );
      
      case "wheel":
        return (
          <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
            {/* Tire */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.18, 32]} />
              <meshStandardMaterial 
                color="#1a1a1a" 
                roughness={0.95}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            {/* Rim */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.19, 32]} />
              <meshStandardMaterial color="#808080" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Rim spokes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos((i / 6) * Math.PI * 2) * 0.08,
                  0,
                  Math.sin((i / 6) * Math.PI * 2) * 0.08
                ]}
                rotation={[0, (i / 6) * Math.PI * 2, Math.PI / 2]}
              >
                <boxGeometry args={[0.02, 0.16, 0.19]} />
                <meshStandardMaterial color="#606060" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Hub */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.22, 16]} />
              <meshStandardMaterial color="#303030" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Tire tread */}
            {Array.from({ length: 24 }).map((_, i) => (
              <mesh 
                key={`tread-${i}`}
                position={[
                  Math.cos((i / 24) * Math.PI * 2) * 0.23,
                  0,
                  Math.sin((i / 24) * Math.PI * 2) * 0.23
                ]}
                rotation={[0, (i / 24) * Math.PI * 2, 0]}
              >
                <boxGeometry args={[0.03, 0.17, 0.01]} />
                <meshStandardMaterial color="#0a0a0a" roughness={1} />
              </mesh>
            ))}
          </group>
        );
      
      case "propeller":
        const bladeCount = component.properties.blades || 2;
        return (
          <group ref={groupRef}>
            {/* Hub */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.06, 16]} />
              <meshStandardMaterial 
                color="#1a1a1a"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Center mounting */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Blades */}
            {Array.from({ length: bladeCount }).map((_, i) => {
              const angle = (i / bladeCount) * Math.PI * 2;
              return (
                <group key={i} rotation={[0, angle, 0]}>
                  <mesh 
                    position={[0.4, 0, 0]}
                    rotation={[0, 0, Math.PI / 12]}
                    castShadow
                  >
                    <boxGeometry args={[0.75, 0.02, 0.12]} />
                    <meshStandardMaterial 
                      color={baseColor}
                      metalness={0.5}
                      roughness={0.15}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0.85}
                      emissive={isSelected ? "#f59e0b" : "#000000"}
                      emissiveIntensity={isSelected ? 0.4 : 0}
                    />
                  </mesh>
                  {/* Blade reinforcement */}
                  <mesh 
                    position={[0.4, 0.015, 0]}
                    rotation={[0, 0, Math.PI / 12]}
                  >
                    <boxGeometry args={[0.7, 0.005, 0.03]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      
      case "battery":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.45, 0.18, 0.28]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.5}
                roughness={0.5}
                emissive={isSelected ? "#f59e0b" : "#22c55e"}
                emissiveIntensity={isSelected ? 0.5 : 0.1}
              />
            </mesh>
            <mesh position={[0.15, 0.12, 0.1]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
              <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0.15, 0.12, -0.1]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.091, 0]}>
              <boxGeometry args={[0.3, 0.001, 0.2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {[-0.1, 0, 0.1].map((x, i) => (
              <mesh key={i} position={[-0.18, 0.091, x]}>
                <cylinderGeometry args={[0.015, 0.015, 0.005, 8]} />
                <meshStandardMaterial 
                  color={i < 2 ? "#00ff00" : "#ff0000"}
                  emissive={i < 2 ? "#00ff00" : "#ff0000"}
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        );
      
      case "esc":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.1, 0.2]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.7}
                roughness={0.3}
                emissive={isSelected ? "#f59e0b" : "#3b82f6"}
                emissiveIntensity={isSelected ? 0.5 : 0.2}
              />
            </mesh>
            {Array.from({ length: 7 }).map((_, i) => (
              <mesh 
                key={i}
                position={[0, 0.055, -0.08 + i * 0.027]}
                castShadow
              >
                <boxGeometry args={[0.26, 0.02, 0.015]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {[-0.09, -0.03, 0.03, 0.09].map((z, i) => (
              <mesh key={i} position={[0.15, 0, z]}>
                <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
                <meshStandardMaterial 
                  color={i < 3 ? "#ffd700" : "#ff0000"}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            ))}
            <mesh position={[-0.1, 0.051, 0.05]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial 
                color="#0000ff"
                emissive="#0000ff"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        );
      
      case "gear":
        const teeth = component.properties.teeth || 20;
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.1, teeth * 2]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.9}
                roughness={0.2}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.4 : 0}
              />
            </mesh>
            {Array.from({ length: teeth }).map((_, i) => {
              const angle = (i / teeth) * Math.PI * 2;
              return (
                <mesh 
                  key={i} 
                  position={[
                    Math.cos(angle) * 0.25,
                    0,
                    Math.sin(angle) * 0.25
                  ]}
                  rotation={[0, angle, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.06, 0.1, 0.05]} />
                  <meshStandardMaterial 
                    color={baseColor}
                    metalness={0.9}
                    roughness={0.15}
                  />
                </mesh>
              );
            })}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>
        );
      
      case "sensor":
        return (
          <group ref={groupRef}>
            {/* Sensor PCB */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.02, 0.18]} />
              <meshStandardMaterial 
                color="#006400" 
                roughness={0.8}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            {/* Sensor chip */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.08, 0.025, 0.08]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* LED indicator */}
            <mesh position={[0.05, 0.02, 0.05]}>
              <sphereGeometry args={[0.015, 12, 12]} />
              <meshStandardMaterial 
                color="#ff0000" 
                emissive="#ff0000"
                emissiveIntensity={0.7}
              />
            </mesh>
            {/* Pin headers */}
            {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
              <mesh key={i} position={[x, -0.025, 0.07]}>
                <boxGeometry args={[0.015, 0.04, 0.015]} />
                <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.1} />
              </mesh>
            ))}
          </group>
        );
      
      case "chassis":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1, 0.12, 0.65]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.6}
                roughness={0.4}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.4 : 0}
              />
            </mesh>
            {[-0.35, 0, 0.35].map((x, i) => (
              <mesh key={i} position={[x, -0.05, 0]}>
                <boxGeometry args={[0.03, 0.02, 0.6]} />
                <meshStandardMaterial color={baseColor} metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            {[-0.4, -0.2, 0.2, 0.4].map((x) =>
              [-0.25, 0.25].map((z, j) => (
                <mesh key={`${x}-${j}`} position={[x, 0.061, z]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
                  <meshStandardMaterial color="#1a1a1a" />
                </mesh>
              ))
            )}
          </group>
        );
      
      case "frame":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.9, 0.06, 0.9]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.6}
                roughness={0.4}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.4 : 0}
              />
            </mesh>
            {[
              [0.4, 0, 0.4], [-0.4, 0, 0.4],
              [0.4, 0, -0.4], [-0.4, 0, -0.4]
            ].map((pos, i) => (
              <group key={i}>
                <mesh position={pos as [number, number, number]} castShadow>
                  <cylinderGeometry args={[0.025, 0.025, 0.45, 16]} />
                  <meshStandardMaterial 
                    color={baseColor}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
                <mesh position={pos as [number, number, number]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
                  <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        );
      
      case "axle":
        return (
          <group ref={groupRef}>
            <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 1, 24]} />
              <meshStandardMaterial 
                color={baseColor}
                metalness={0.95}
                roughness={0.1}
                emissive={isSelected ? "#f59e0b" : "#000000"}
                emissiveIntensity={isSelected ? 0.4 : 0}
              />
            </mesh>
          </group>
        );
      
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color={baseColor}
              metalness={0.5}
              roughness={0.5}
              emissive={isSelected ? "#f59e0b" : "#000000"}
              emissiveIntensity={isSelected ? 0.4 : 0}
            />
          </mesh>
        );
    }
  };

  return (
    <group
      position={[component.position.x, component.position.y, component.position.z]}
      rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
      onClick={handleClick}
    >
      {getRealisticGeometry()}
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
