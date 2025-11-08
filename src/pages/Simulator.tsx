import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircuitDesigner } from "@/components/simulator/CircuitDesigner";
import { CodeEditor } from "@/components/simulator/CodeEditor";
import { AIAssistant } from "@/components/simulator/AIAssistant";
import { SerialMonitor } from "@/components/simulator/SerialMonitor";
import { SimulatorControls } from "@/components/simulator/SimulatorControls";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Simulator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState(`// Blink LED Example
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("🚀 Arduino Started!");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("💡 LED ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("🌑 LED OFF");
  delay(1000);
}`);
  
  const [circuit, setCircuit] = useState<any[]>([]);
  const [compilationStatus, setCompilationStatus] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);
  const [componentStates, setComponentStates] = useState<Map<string, any>>(new Map());
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  const handleRun = () => {
    if (circuit.length === 0) {
      toast({
        title: "⚠️ No Circuit Built",
        description: "Add components to your circuit before running the simulation!",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setCompilationStatus([]);
    setSerialOutput([]);
    
    toast({
      title: "🔧 Compiling...",
      description: "Preparing your circuit simulation",
    });
    
    // Simulate compilation
    const compileSteps = [
      "⚙️ Arduino: Compiling sketch...",
      `📦 Sketch uses ${code.length} bytes (${Math.round(code.length/32768*100)}% of available memory)`,
      "🔌 Connecting to Arduino Uno...",
      "✅ Upload complete! Starting simulation..."
    ];
    
    compileSteps.forEach((step, index) => {
      setTimeout(() => {
        setCompilationStatus(prev => [...prev, step]);
        if (index === compileSteps.length - 1) {
          setSerialOutput(["🖥️ Serial Monitor @ 9600 baud", "🚀 Simulation started!", "─────────────────────"]);
          startSimulation();
        }
      }, index * 600);
    });
  };

  const startSimulation = () => {
    let cycleCount = 0;
    
    simulationInterval.current = setInterval(() => {
      cycleCount++;
      
      // Find LEDs in circuit and toggle their state
      const ledComponents = circuit.filter(c => c.type.includes('led'));
      const newStates = new Map(componentStates);
      
      ledComponents.forEach((led, index) => {
        const isOn = Math.floor(cycleCount / 2) % 2 === index % 2;
        newStates.set(led.id, { active: isOn, value: isOn ? 255 : 0 });
      });
      
      setComponentStates(newStates);
      
      // Add serial output
      const timestamp = new Date().toLocaleTimeString();
      setSerialOutput(prev => {
        const newOutput = [...prev];
        if (cycleCount % 2 === 0) {
          newOutput.push(`[${timestamp}] 💡 LED ON - Pin HIGH`);
        } else {
          newOutput.push(`[${timestamp}] 🌑 LED OFF - Pin LOW`);
        }
        // Keep only last 20 messages
        return newOutput.slice(-20);
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    
    // Turn off all components
    const newStates = new Map();
    circuit.forEach(c => {
      newStates.set(c.id, { active: false, value: 0 });
    });
    setComponentStates(newStates);
    
    setSerialOutput(prev => [...prev, "─────────────────────", "⏸️ Simulation stopped."]);
    
    toast({
      title: "⏸️ Simulation Stopped",
      description: "Your circuit is now idle",
    });
  };

  const handleReset = () => {
    handleStop();
    setSerialOutput([]);
    setCompilationStatus([]);
    setComponentStates(new Map());
    
    toast({
      title: "🔄 Reset Complete",
      description: "Simulation has been reset",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                🎮 Electronics Simulator for Kids
              </h1>
              <p className="text-muted-foreground">Build, learn, and experiment with electronics - no physical components needed!</p>
            </div>
          </div>
          <SimulatorControls 
            isRunning={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            onReset={handleReset}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="circuit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="circuit">Circuit Design</TabsTrigger>
                <TabsTrigger value="code">Code Editor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="circuit" className="mt-4">
                <CircuitDesigner 
                  circuit={circuit}
                  setCircuit={setCircuit}
                  isRunning={isRunning}
                  componentStates={componentStates}
                />
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <CodeEditor 
                  code={code}
                  setCode={setCode}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>

            <SerialMonitor output={serialOutput} />
          </div>

          <div>
            <AIAssistant 
              code={code}
              circuit={circuit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}