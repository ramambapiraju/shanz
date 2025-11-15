import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text, Sphere, Line } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, GitBranch } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

interface Qubit {
  id: string;
  position: [number, number, number];
  state: "0" | "1" | "superposition";
  entangled: boolean;
  entangledWith?: string;
}

const QubitSphere = ({ 
  qubit, 
  onClick 
}: { 
  qubit: Qubit; 
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getColor = () => {
    if (qubit.state === "superposition") return "#8b5cf6";
    if (qubit.state === "1") return "#3b82f6";
    return "#ef4444";
  };

  return (
    <group position={qubit.position}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} onClick={onClick}>
        <meshStandardMaterial 
          color={getColor()} 
          emissive={getColor()} 
          emissiveIntensity={0.5}
          transparent
          opacity={qubit.state === "superposition" ? 0.7 : 1}
        />
      </Sphere>
      
      {qubit.state === "superposition" && (
        <Sphere args={[0.52, 32, 32]}>
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.2}
            wireframe
          />
        </Sphere>
      )}
      
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        |{qubit.state === "superposition" ? "ψ⟩" : qubit.state}⟩
      </Text>
    </group>
  );
};

const EntanglementLine = ({ 
  from, 
  to 
}: { 
  from: [number, number, number]; 
  to: [number, number, number];
}) => {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  
  return (
    <Line
      points={points}
      color="#fbbf24"
      lineWidth={2}
      dashed
      dashScale={50}
      dashSize={0.1}
      gapSize={0.1}
    />
  );
};

export const QuantumCanvas = () => {
  const [qubits, setQubits] = useState<Qubit[]>([
    { id: "q1", position: [-3, 0, 0], state: "0", entangled: false },
    { id: "q2", position: [0, 0, 0], state: "0", entangled: false },
    { id: "q3", position: [3, 0, 0], state: "0", entangled: false },
  ]);
  const [selectedQubit, setSelectedQubit] = useState<string | null>(null);

  const handleQubitClick = (qubitId: string) => {
    if (!selectedQubit) {
      setSelectedQubit(qubitId);
      toast.info("Qubit selected! Click another to entangle, or use actions.");
    } else if (selectedQubit === qubitId) {
      setSelectedQubit(null);
    } else {
      // Entangle qubits
      setQubits(prev => prev.map(q => {
        if (q.id === selectedQubit || q.id === qubitId) {
          return {
            ...q,
            entangled: true,
            entangledWith: q.id === selectedQubit ? qubitId : selectedQubit
          };
        }
        return q;
      }));
      toast.success("Qubits entangled! 🌟", {
        description: "Pull one, and the other responds instantly!"
      });
      setSelectedQubit(null);
    }
  };

  const applySuperposition = () => {
    if (!selectedQubit) {
      toast.error("Select a qubit first!");
      return;
    }
    
    setQubits(prev => prev.map(q => 
      q.id === selectedQubit ? { ...q, state: "superposition" as const } : q
    ));
    toast.success("Superposition applied! ⚛️", {
      description: "The qubit now exists in multiple states at once!"
    });
    setSelectedQubit(null);
  };

  const measureQubit = () => {
    if (!selectedQubit) {
      toast.error("Select a qubit first!");
      return;
    }
    
    const measured = Math.random() > 0.5 ? "1" : "0";
    setQubits(prev => prev.map(q => {
      if (q.id === selectedQubit) {
        return { ...q, state: measured as "0" | "1" };
      }
      // If entangled, affect the partner qubit
      if (q.entangledWith === selectedQubit) {
        return { ...q, state: measured as "0" | "1" };
      }
      return q;
    }));
    toast.info(`Measured: |${measured}⟩`, {
      description: "The wavefunction collapsed!"
    });
    setSelectedQubit(null);
  };

  const resetQuantum = () => {
    setQubits(prev => prev.map(q => ({
      ...q,
      state: "0" as const,
      entangled: false,
      entangledWith: undefined
    })));
    setSelectedQubit(null);
    toast("Quantum state reset!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={applySuperposition} variant="default" size="sm" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Apply Superposition
        </Button>
        <Button onClick={measureQubit} variant="secondary" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Measure Qubit
        </Button>
        <Button onClick={resetQuantum} variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border border-primary/20">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <OrbitControls enablePan={false} />
          
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          {qubits.map(qubit => (
            <QubitSphere 
              key={qubit.id} 
              qubit={qubit} 
              onClick={() => handleQubitClick(qubit.id)}
            />
          ))}
          
          {qubits.map(qubit => {
            if (qubit.entangled && qubit.entangledWith) {
              const partner = qubits.find(q => q.id === qubit.entangledWith);
              if (partner && qubit.id < partner.id) {
                return (
                  <EntanglementLine
                    key={`${qubit.id}-${partner.id}`}
                    from={qubit.position}
                    to={partner.position}
                  />
                );
              }
            }
            return null;
          })}
          
          <gridHelper args={[20, 20, "#333", "#222"]} />
        </Canvas>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <Card className="p-4 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-start gap-2">
            <GitBranch className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <div className="font-semibold text-purple-500">Superposition</div>
              <div className="text-muted-foreground">A qubit exists in multiple states simultaneously</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start gap-2">
            <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-500">Entanglement</div>
              <div className="text-muted-foreground">Connected particles respond instantly to each other</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-500">Measurement</div>
              <div className="text-muted-foreground">Observing collapses the wavefunction</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
