import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircuitDesigner } from "@/components/simulator/CircuitDesigner";
import { CodeEditor } from "@/components/simulator/CodeEditor";
import { AIAssistant } from "@/components/simulator/AIAssistant";
import { SerialMonitor } from "@/components/simulator/SerialMonitor";
import { SimulatorControls } from "@/components/simulator/SimulatorControls";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Simulator() {
  const navigate = useNavigate();
  const [code, setCode] = useState(`// Arduino Code
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`);
  
  const [circuit, setCircuit] = useState<any[]>([]);
  const [compilationStatus, setCompilationStatus] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);

  const handleRun = () => {
    setIsRunning(true);
    setCompilationStatus([]);
    setSerialOutput([]);
    
    // Simulate compilation
    const compileSteps = [
      "Arduino: Compiling sketch...",
      `Sketch uses ${code.length} bytes of program storage space.`,
      "Connecting to Arduino Uno...",
      "Upload complete!"
    ];
    
    compileSteps.forEach((step, index) => {
      setTimeout(() => {
        setCompilationStatus(prev => [...prev, step]);
        if (index === compileSteps.length - 1) {
          setSerialOutput(["Serial Monitor initialized at 9600 baud", "Program running..."]);
          simulateSerialOutput();
        }
      }, index * 500);
    });
  };

  const simulateSerialOutput = () => {
    let count = 0;
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      setSerialOutput(prev => [...prev, `LED ${count % 2 === 0 ? 'ON' : 'OFF'}`, `Timestamp: ${Date.now()}`]);
      count++;
      if (count > 10) clearInterval(interval);
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSerialOutput(prev => [...prev, "Simulation stopped."]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSerialOutput([]);
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
              <h1 className="text-3xl font-bold">AI-Powered Arduino Simulator</h1>
              <p className="text-muted-foreground">Design, code, and test your projects virtually</p>
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