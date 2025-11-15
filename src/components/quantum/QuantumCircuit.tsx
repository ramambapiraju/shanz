import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Gate {
  id: string;
  type: "H" | "X" | "Y" | "Z" | "CNOT";
  name: string;
  description: string;
  color: string;
}

const GATES: Gate[] = [
  { id: "h", type: "H", name: "Hadamard", description: "Creates superposition", color: "bg-purple-500" },
  { id: "x", type: "X", name: "Pauli-X", description: "Bit flip (NOT gate)", color: "bg-blue-500" },
  { id: "y", type: "Y", name: "Pauli-Y", description: "Y rotation", color: "bg-green-500" },
  { id: "z", type: "Z", name: "Pauli-Z", description: "Phase flip", color: "bg-yellow-500" },
  { id: "cnot", type: "CNOT", name: "CNOT", description: "Controlled NOT", color: "bg-red-500" },
];

interface CircuitGate {
  gate: Gate;
  qubit: number;
  position: number;
}

export const QuantumCircuit = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [circuit, setCircuit] = useState<CircuitGate[]>([]);
  const [numQubits] = useState(3);
  const [draggedGate, setDraggedGate] = useState<Gate | null>(null);

  const handleDragStart = (gate: Gate) => {
    setDraggedGate(gate);
  };

  const handleDrop = (qubit: number, position: number) => {
    if (draggedGate) {
      setCircuit(prev => [...prev, { gate: draggedGate, qubit, position }]);
      toast.success(`${draggedGate.name} gate added to qubit ${qubit}!`);
      setDraggedGate(null);
    }
  };

  const handleRun = () => {
    if (circuit.length === 0) {
      toast.error("Add some gates to your circuit first!");
      return;
    }

    toast.success("Circuit executed! ⚡", {
      description: `Applied ${circuit.length} quantum operations`,
    });
    
    const points = circuit.length * 10;
    onComplete(points);
  };

  const handleReset = () => {
    setCircuit([]);
    toast("Circuit cleared!");
  };

  return (
    <div className="space-y-6">
      {/* Gate Palette */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Quantum Gates</h3>
        <div className="flex flex-wrap gap-3">
          {GATES.map(gate => (
            <Card
              key={gate.id}
              className={`${gate.color} p-4 cursor-move hover:scale-105 transition-transform border-2 border-white/20`}
              draggable
              onDragStart={() => handleDragStart(gate)}
            >
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-1">{gate.type}</div>
                <div className="text-xs font-medium">{gate.name}</div>
                <div className="text-xs opacity-80 mt-1">{gate.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Circuit Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Circuit Builder</h3>
          <div className="flex gap-2">
            <Button onClick={handleRun} size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Run Circuit
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-slate-950 border-primary/20">
          <div className="space-y-4">
            {Array.from({ length: numQubits }).map((_, qubitIndex) => (
              <div key={qubitIndex} className="flex items-center gap-2">
                <div className="w-16 text-center font-mono text-primary">
                  |q{qubitIndex}⟩
                </div>
                <div className="flex-1 h-12 border-t-2 border-primary/30 relative">
                  {Array.from({ length: 8 }).map((_, posIndex) => (
                    <div
                      key={posIndex}
                      className="absolute h-12 w-16 border-l border-dashed border-primary/20 hover:bg-primary/10 transition-colors"
                      style={{ left: `${posIndex * 12.5}%`, top: '-1.5rem' }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(qubitIndex, posIndex)}
                    >
                      {circuit
                        .filter(c => c.qubit === qubitIndex && c.position === posIndex)
                        .map((c, i) => (
                          <div
                            key={i}
                            className={`${c.gate.color} text-white font-bold text-sm rounded px-2 py-1 text-center`}
                          >
                            {c.gate.type}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>How to play:</strong> Drag quantum gates from the palette above and drop them onto the circuit grid.
          Build your quantum algorithm by placing gates on different qubits and positions. Click "Run Circuit" to execute!
        </p>
      </Card>
    </div>
  );
};
