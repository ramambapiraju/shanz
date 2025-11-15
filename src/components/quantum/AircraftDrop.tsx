import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sphere } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plane, ChevronDown } from "lucide-react";
import * as THREE from "three";

interface Props {
  playerName: string;
  onLanded: () => void;
}

const Aircraft = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Fuselage */}
      <mesh>
        <boxGeometry args={[8, 1.5, 2]} />
        <meshStandardMaterial color="#2563eb" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 8]} />
        <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tail */}
      <mesh position={[-3.5, 1, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

const ParachuteDrop = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Parachute canopy */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Lines */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <mesh key={i} position={[x / 2, 1, z / 2]} rotation={[Math.atan2(x, 2), 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}
      {/* Player capsule */}
      <mesh>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

export const AircraftDrop = ({ playerName, onLanded }: Props) => {
  const [phase, setPhase] = useState<"flying" | "jumping" | "landing">("flying");
  const [altitude, setAltitude] = useState(100);
  const [aircraftPosition, setAircraftPosition] = useState<[number, number, number]>([-50, 20, 0]);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 50, 0]);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (phase === "flying") {
      const interval = setInterval(() => {
        setAircraftPosition(([x, y, z]) => [x + 0.5, y, z]);
        if (aircraftPosition[0] > 0) {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase, aircraftPosition]);

  useEffect(() => {
    if (phase === "jumping") {
      const interval = setInterval(() => {
        setPlayerPosition(([x, y, z]) => {
          const newY = y - 0.5;
          setAltitude(Math.max(0, newY * 2));
          if (newY <= 1) {
            setPhase("landing");
            clearInterval(interval);
            setTimeout(() => onLanded(), 2000);
          }
          return [x, Math.max(1, newY), z];
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase, onLanded]);

  const handleJump = () => {
    setPhase("jumping");
    setPlayerPosition([aircraftPosition[0], aircraftPosition[1] - 2, aircraftPosition[2]]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-200">
      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto">
          <Card className="p-6 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plane className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold text-white">SHAN Z WORLD</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Pilot</div>
                  <div className="text-lg font-bold text-purple-400">{playerName}</div>
                </div>
              </div>

              {phase === "flying" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Drop Zone Approaching</span>
                    <span className="text-yellow-400 font-mono">
                      {countdown > 0 ? `${countdown}s` : "JUMP NOW!"}
                    </span>
                  </div>
                  <Progress value={(5 - countdown) * 20} className="h-2" />
                </div>
              )}

              {phase === "jumping" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-purple-400 animate-pulse">
                    <ChevronDown className="h-5 w-5" />
                    <span className="font-semibold">PARACHUTE DEPLOYED</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Altitude</span>
                    <span className="text-green-400 font-mono text-lg">
                      {Math.round(altitude)}m
                    </span>
                  </div>
                  <Progress value={(100 - altitude)} className="h-2" />
                </div>
              )}

              {phase === "landing" && (
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-400 animate-pulse">
                    LANDING SUCCESSFUL!
                  </div>
                  <div className="text-slate-300">Entering Quantum Universe...</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="h-screen">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 25, 40]} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={0.3} />

          {phase === "flying" && <Aircraft position={aircraftPosition} />}
          {(phase === "jumping" || phase === "landing") && <ParachuteDrop position={playerPosition} />}

          {/* Landing Zone */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[15, 64]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
          </mesh>

          {/* Ground Grid */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Quantum Particles */}
          {Array.from({ length: 50 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 100;
            const y = Math.random() * 30;
            const z = (Math.random() - 0.5) * 100;
            return (
              <Sphere key={i} args={[0.2, 8, 8]} position={[x, y, z]}>
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
              </Sphere>
            );
          })}
        </Canvas>
      </div>

      {/* Jump Button */}
      {phase === "flying" && countdown === 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Button
            size="lg"
            onClick={handleJump}
            className="text-2xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl"
          >
            <ChevronDown className="mr-2 h-8 w-8" />
            JUMP NOW!
          </Button>
        </div>
      )}
    </div>
  );
};
