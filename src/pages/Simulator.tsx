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
import { PROJECT_CODES } from "@/components/simulator/ProjectTemplates";

export default function Simulator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState<string>("blank");
  const [code, setCode] = useState(PROJECT_CODES.blink);
  
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

  const detectProjectType = () => {
    const hasLED = circuit.some(c => c.type.includes('led'));
    const hasLDR = circuit.some(c => c.type === 'ldr');
    const hasPIR = circuit.some(c => c.type === 'pir-sensor');
    const hasBuzzer = circuit.some(c => c.type === 'buzzer');
    const hasTemp = circuit.some(c => c.type === 'dht11');
    const hasUltrasonic = circuit.some(c => c.type === 'ultrasonic');
    const hasRGB = circuit.some(c => c.type === 'led-rgb');
    const hasButton = circuit.some(c => c.type === 'button');
    const hasMotor = circuit.some(c => c.type === 'dc-motor' || c.type === 'servo');
    const ledCount = circuit.filter(c => c.type.includes('led')).length;

    if (hasLDR && hasLED) return 'nightlight';
    if (hasPIR && hasLED) return 'motion';
    if (hasBuzzer && hasButton) return 'alarm';
    if (hasTemp) return 'temperature';
    if (hasUltrasonic && (hasLED || hasBuzzer)) return 'distance';
    if (hasRGB) return 'rgb';
    if (hasButton && hasLED) return 'counter';
    if (hasMotor) return 'fan';
    if (ledCount >= 3) return 'traffic';
    if (hasLED) return 'blink';
    return 'custom';
  };

  const startSimulation = () => {
    let cycleCount = 0;
    const projectType = detectProjectType();
    
    simulationInterval.current = setInterval(() => {
      cycleCount++;
      const timestamp = new Date().toLocaleTimeString();
      const newStates = new Map(componentStates);
      const newOutput: string[] = [];

      switch (projectType) {
        case 'blink':
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            const isOn = cycleCount % 2 === 0;
            newStates.set(led.id, { active: isOn, value: isOn ? 255 : 0 });
            if (cycleCount % 2 === 0) {
              newOutput.push(`[${timestamp}] 💡 LED ON - Brightness: 100%`);
            } else {
              newOutput.push(`[${timestamp}] 🌑 LED OFF`);
            }
          });
          break;

        case 'traffic':
          const leds = circuit.filter(c => c.type.includes('led'));
          const activeIndex = cycleCount % (leds.length * 2);
          leds.forEach((led, idx) => {
            const isOn = Math.floor(activeIndex / 2) === idx;
            newStates.set(led.id, { active: isOn, value: isOn ? 255 : 0 });
          });
          if (cycleCount % 2 === 0) {
            const colors = ['🔴 RED', '🟡 YELLOW', '🟢 GREEN'];
            newOutput.push(`[${timestamp}] ${colors[Math.floor(activeIndex / 2) % colors.length]} Light Active`);
          }
          break;

        case 'nightlight':
          const lightLevel = 30 + Math.sin(cycleCount / 3) * 70;
          const shouldLight = lightLevel < 50;
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            newStates.set(led.id, { active: shouldLight, value: shouldLight ? 200 : 0 });
          });
          newOutput.push(`[${timestamp}] ☀️ Light Level: ${lightLevel.toFixed(0)}% - LED ${shouldLight ? 'ON' : 'OFF'}`);
          break;

        case 'motion':
          const motionDetected = cycleCount % 5 === 0;
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            newStates.set(led.id, { active: motionDetected, value: motionDetected ? 255 : 0 });
          });
          if (motionDetected) {
            newOutput.push(`[${timestamp}] 👋 MOTION DETECTED! Light ON`);
          } else {
            newOutput.push(`[${timestamp}] ✓ No motion - Monitoring...`);
          }
          break;

        case 'alarm':
          const buzzing = cycleCount % 3 === 0;
          circuit.filter(c => c.type === 'buzzer').forEach(buzzer => {
            newStates.set(buzzer.id, { active: buzzing, value: buzzing ? 1 : 0 });
          });
          if (buzzing) {
            newOutput.push(`[${timestamp}] 🔊 BEEP! Alarm Active - ${1000 + (cycleCount % 3) * 500}Hz`);
          }
          break;

        case 'temperature':
          const temp = 22 + Math.sin(cycleCount / 4) * 5;
          const humidity = 50 + Math.cos(cycleCount / 5) * 10;
          newOutput.push(`[${timestamp}] 🌡️ Temperature: ${temp.toFixed(1)}°C | Humidity: ${humidity.toFixed(0)}%`);
          break;

        case 'distance':
          const distance = 50 + Math.sin(cycleCount / 2) * 40;
          const alert = distance < 30;
          circuit.filter(c => c.type.includes('led') || c.type === 'buzzer').forEach(comp => {
            newStates.set(comp.id, { active: alert, value: alert ? 255 : 0 });
          });
          newOutput.push(`[${timestamp}] 📡 Distance: ${distance.toFixed(0)}cm ${alert ? '⚠️ TOO CLOSE!' : '✓'}`);
          break;

        case 'rgb':
          const r = Math.sin(cycleCount / 3) * 127 + 128;
          const g = Math.sin(cycleCount / 3 + 2) * 127 + 128;
          const b = Math.sin(cycleCount / 3 + 4) * 127 + 128;
          circuit.filter(c => c.type === 'led-rgb').forEach(led => {
            newStates.set(led.id, { active: true, value: 200, r, g, b });
          });
          newOutput.push(`[${timestamp}] 🌈 RGB: R=${r.toFixed(0)} G=${g.toFixed(0)} B=${b.toFixed(0)}`);
          break;

        case 'counter':
          if (cycleCount % 3 === 0) {
            const count = Math.floor(cycleCount / 3);
            newOutput.push(`[${timestamp}] 🔘 Button Press #${count} detected!`);
            circuit.filter(c => c.type.includes('led')).forEach(led => {
              newStates.set(led.id, { active: true, value: 255 });
            });
          } else {
            circuit.filter(c => c.type.includes('led')).forEach(led => {
              newStates.set(led.id, { active: false, value: 0 });
            });
          }
          break;

        case 'fan':
          const speed = 50 + Math.sin(cycleCount / 4) * 50;
          circuit.filter(c => c.type === 'dc-motor' || c.type === 'servo').forEach(motor => {
            newStates.set(motor.id, { active: speed > 30, value: speed });
          });
          newOutput.push(`[${timestamp}] ⚙️ Motor Speed: ${speed.toFixed(0)}% RPM`);
          break;

        default:
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            const isOn = cycleCount % 2 === 0;
            newStates.set(led.id, { active: isOn, value: isOn ? 255 : 0 });
          });
          newOutput.push(`[${timestamp}] ⚡ Custom circuit running...`);
      }

      setComponentStates(newStates);
      setSerialOutput(prev => [...prev, ...newOutput].slice(-25));
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
                  onTemplateChange={(templateCode) => {
                    setCode(templateCode);
                    toast({
                      title: "✨ Code Updated",
                      description: "Project code loaded successfully"
                    });
                  }}
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