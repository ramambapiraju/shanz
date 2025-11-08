import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircuitDesigner } from "@/components/simulator/CircuitDesigner";
import { CodeEditor } from "@/components/simulator/CodeEditor";
import { AIAssistant } from "@/components/simulator/AIAssistant";
import { SerialMonitor } from "@/components/simulator/SerialMonitor";
import { SimulatorControls } from "@/components/simulator/SimulatorControls";
import { InteractiveControls } from "@/components/simulator/InteractiveControls";
import { LiveSuggestions } from "@/components/simulator/LiveSuggestions";
import { CircuitValidation } from "@/components/simulator/CircuitValidation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PROJECT_CODES } from "@/components/simulator/ProjectTemplates";
import { playBuzzerSound, stopBuzzerSound } from "@/utils/audioUtils";
import { validateCircuit, ValidationError } from "@/utils/circuitValidator";

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
  const [interactiveValues, setInteractiveValues] = useState<Map<string, number>>(new Map());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Validate circuit whenever it changes
  useEffect(() => {
    const errors = validateCircuit(circuit);
    setValidationErrors(errors);
  }, [circuit]);

  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  // Auto-run simulation when template changes
  useEffect(() => {
    if (activeTemplate !== "blank" && circuit.length > 0 && !isRunning) {
      // Small delay to ensure circuit is rendered
      const timer = setTimeout(() => {
        handleRun();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTemplate, circuit.length]);

  const handleRun = () => {
    if (circuit.length === 0) {
      toast({
        title: "⚠️ No Circuit Built",
        description: "Add components to your circuit before running the simulation!",
        variant: "destructive"
      });
      return;
    }

    // Check for critical validation errors
    const errors = validateCircuit(circuit);
    const criticalErrors = errors.filter(e => e.severity === 'critical');
    
    if (criticalErrors.length > 0) {
      toast({
        title: "❌ Cannot Run Simulation",
        description: `Fix ${criticalErrors.length} critical error(s) first. Check the Circuit Validation panel.`,
        variant: "destructive"
      });
      return;
    }

    // Show warning for non-critical errors
    const otherErrors = errors.filter(e => e.severity !== 'critical');
    if (otherErrors.length > 0) {
      toast({
        title: "⚠️ Running with Warnings",
        description: `${otherErrors.length} warning(s) detected. Check Circuit Validation for details.`,
      });
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

    // Advanced combinations (Mid-level projects)
    if (hasLDR && hasPIR && hasLED) return 'smartLighting';
    if (hasUltrasonic && hasBuzzer && ledCount >= 3) return 'parkingSensor';
    if (hasTemp && hasMotor) return 'thermostat';
    if (hasPIR && hasBuzzer && hasButton && hasLED) return 'securitySystem';
    if (hasBuzzer && hasButton && hasLED && ledCount >= 1) return 'musicPlayer';
    
    // Basic projects
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
        // MID-LEVEL PROJECTS
        case 'smartLighting':
          const ldrSmart = circuit.find(c => c.type === 'ldr');
          const pirSmart = circuit.find(c => c.type === 'pir-sensor');
          const lightLevelSmart = ldrSmart && interactiveValues.has(ldrSmart.id) 
            ? interactiveValues.get(ldrSmart.id)! 
            : 30 + Math.sin(cycleCount / 3) * 70;
          const motionSmart = cycleCount % 6 === 0 || cycleCount % 6 === 1;
          const shouldLightSmart = lightLevelSmart < 50 && motionSmart;
          
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            newStates.set(led.id, { active: shouldLightSmart, value: shouldLightSmart ? 255 : 0 });
          });
          newOutput.push(`[${timestamp}] 💡 Smart System: Light=${lightLevelSmart.toFixed(0)}% Motion=${motionSmart ? 'YES' : 'NO'} → LED ${shouldLightSmart ? 'ON' : 'OFF'}`);
          break;

        case 'parkingSensor':
          const ultrasonicPark = circuit.find(c => c.type === 'ultrasonic');
          const distancePark = ultrasonicPark && interactiveValues.has(ultrasonicPark.id)
            ? interactiveValues.get(ultrasonicPark.id)!
            : 50 + Math.sin(cycleCount / 2) * 45;
          
          const ledsPark = circuit.filter(c => c.type.includes('led'));
          ledsPark.forEach(led => newStates.set(led.id, { active: false, value: 0 }));
          
          if (distancePark > 50) {
            const greenLed = ledsPark.find(l => l.type === 'led-green');
            if (greenLed) newStates.set(greenLed.id, { active: true, value: 255 });
            stopBuzzerSound();
            newOutput.push(`[${timestamp}] 🚗 ${distancePark.toFixed(0)}cm ✅ SAFE ZONE`);
          } else if (distancePark > 20) {
            const yellowLed = ledsPark.find(l => l.type === 'led-yellow');
            if (yellowLed) newStates.set(yellowLed.id, { active: true, value: 255 });
            if (cycleCount % 2 === 0) playBuzzerSound(1000);
            else stopBuzzerSound();
            newOutput.push(`[${timestamp}] 🚗 ${distancePark.toFixed(0)}cm ⚠️ WARNING ZONE`);
          } else {
            const redLed = ledsPark.find(l => l.type === 'led-red');
            if (redLed) newStates.set(redLed.id, { active: true, value: 255 });
            playBuzzerSound(2500);
            newOutput.push(`[${timestamp}] 🚗 ${distancePark.toFixed(0)}cm 🚨 DANGER! TOO CLOSE!`);
          }
          break;

        case 'thermostat':
          const tempSensorThermostat = circuit.find(c => c.type === 'dht11');
          const targetTemp = 24.0;
          const currentTemp = tempSensorThermostat && interactiveValues.has(tempSensorThermostat.id)
            ? interactiveValues.get(tempSensorThermostat.id)!
            : 22 + Math.sin(cycleCount / 5) * 6;
          
          const motorThermostat = circuit.find(c => c.type === 'dc-motor');
          const ledThermostat = circuit.find(c => c.type.includes('led'));
          
          if (currentTemp > targetTemp + 1) {
            if (motorThermostat) newStates.set(motorThermostat.id, { active: true, value: 255 });
            if (ledThermostat) newStates.set(ledThermostat.id, { active: true, value: 255 });
            newOutput.push(`[${timestamp}] 🌡️ ${currentTemp.toFixed(1)}°C → ❄️ COOLING (Fan ON)`);
          } else if (currentTemp < targetTemp - 1) {
            if (motorThermostat) newStates.set(motorThermostat.id, { active: false, value: 0 });
            if (ledThermostat) newStates.set(ledThermostat.id, { active: true, value: 128 });
            newOutput.push(`[${timestamp}] 🌡️ ${currentTemp.toFixed(1)}°C → 🔥 HEATING`);
          } else {
            if (motorThermostat) newStates.set(motorThermostat.id, { active: false, value: 0 });
            if (ledThermostat) newStates.set(ledThermostat.id, { active: false, value: 0 });
            newOutput.push(`[${timestamp}] 🌡️ ${currentTemp.toFixed(1)}°C → ✅ Temperature OK`);
          }
          break;

        case 'securitySystem':
          const motionSec = cycleCount % 7 === 0;
          const doorOpen = cycleCount % 9 === 0;
          const alarmActive = motionSec || doorOpen;
          
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            newStates.set(led.id, { active: alarmActive, value: alarmActive ? 255 : 0 });
          });
          
          circuit.filter(c => c.type === 'buzzer').forEach(buzzer => {
            newStates.set(buzzer.id, { active: alarmActive, value: alarmActive ? 1 : 0 });
          });
          
          if (alarmActive) {
            playBuzzerSound(2000 + (cycleCount % 5) * 200);
            let reason = motionSec ? 'Motion detected!' : '';
            if (doorOpen) reason += (reason ? ' + ' : '') + 'Door opened!';
            newOutput.push(`[${timestamp}] 🚨 ALARM! ${reason}`);
          } else {
            stopBuzzerSound();
            newOutput.push(`[${timestamp}] 🔒 System armed - Monitoring...`);
          }
          break;

        case 'musicPlayer':
          const isPlaying = cycleCount % 16 < 8;
          const notes = [262, 294, 330, 349, 392, 440, 494, 523];
          const noteIndex = cycleCount % 8;
          
          circuit.filter(c => c.type.includes('led')).forEach(led => {
            newStates.set(led.id, { active: isPlaying, value: isPlaying ? 255 : 0 });
          });
          
          if (isPlaying) {
            playBuzzerSound(notes[noteIndex]);
            newOutput.push(`[${timestamp}] 🎵 ♪ Playing Note ${noteIndex + 1} - ${notes[noteIndex]} Hz`);
          } else {
            stopBuzzerSound();
            newOutput.push(`[${timestamp}] ⏸️ Music paused`);
          }
          break;

        // BASIC PROJECTS
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
          const ledsTraffic = circuit.filter(c => c.type.includes('led'));
          const activeIndex = cycleCount % (ledsTraffic.length * 2);
          ledsTraffic.forEach((led, idx) => {
            const isOn = Math.floor(activeIndex / 2) === idx;
            newStates.set(led.id, { active: isOn, value: isOn ? 255 : 0 });
          });
          if (cycleCount % 2 === 0) {
            const colors = ['🔴 RED', '🟡 YELLOW', '🟢 GREEN'];
            newOutput.push(`[${timestamp}] ${colors[Math.floor(activeIndex / 2) % colors.length]} Light Active`);
          }
          break;

        case 'nightlight':
          const ldr = circuit.find(c => c.type === 'ldr');
          const lightLevel = ldr && interactiveValues.has(ldr.id) 
            ? interactiveValues.get(ldr.id)! 
            : 30 + Math.sin(cycleCount / 3) * 70;
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
          const buzzerFreq = 1000 + (cycleCount % 3) * 500;
          circuit.filter(c => c.type === 'buzzer').forEach(buzzer => {
            newStates.set(buzzer.id, { active: buzzing, value: buzzing ? 1 : 0 });
          });
          if (buzzing) {
            playBuzzerSound(buzzerFreq);
            newOutput.push(`[${timestamp}] 🔊 BEEP! Alarm Active - ${buzzerFreq}Hz`);
          } else {
            stopBuzzerSound();
          }
          break;

        case 'temperature':
          const tempSensor = circuit.find(c => c.type === 'dht11');
          const temp = tempSensor && interactiveValues.has(tempSensor.id)
            ? interactiveValues.get(tempSensor.id)!
            : 22 + Math.sin(cycleCount / 4) * 5;
          const humidity = 50 + Math.cos(cycleCount / 5) * 10;
          newOutput.push(`[${timestamp}] 🌡️ Temperature: ${temp.toFixed(1)}°C | Humidity: ${humidity.toFixed(0)}%`);
          break;

        case 'distance':
          const ultrasonic = circuit.find(c => c.type === 'ultrasonic');
          const distance = ultrasonic && interactiveValues.has(ultrasonic.id)
            ? interactiveValues.get(ultrasonic.id)!
            : 50 + Math.sin(cycleCount / 2) * 40;
          const alert = distance < 30;
          circuit.filter(c => c.type.includes('led') || c.type === 'buzzer').forEach(comp => {
            newStates.set(comp.id, { active: alert, value: alert ? 255 : 0 });
          });
          if (alert) {
            playBuzzerSound(2000);
          } else {
            stopBuzzerSound();
          }
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
          const pot = circuit.find(c => c.type === 'potentiometer');
          const speed = pot && interactiveValues.has(pot.id)
            ? interactiveValues.get(pot.id)!
            : 50 + Math.sin(cycleCount / 4) * 50;
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
    stopBuzzerSound();
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

  const handleExport = () => {
    const projectData = {
      template: activeTemplate,
      code: code,
      circuit: circuit,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arduino-project-${activeTemplate}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📦 Project Exported",
      description: "Your project has been downloaded successfully!",
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
            onExport={handleExport}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="circuit" className="w-full" key={activeTemplate}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="circuit">Circuit Design</TabsTrigger>
                <TabsTrigger value="code">
                  Arduino Code 
                  {activeTemplate !== "blank" && <span className="ml-1 text-xs">✨</span>}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="circuit" className="mt-4">
                <CircuitDesigner 
                  circuit={circuit}
                  setCircuit={setCircuit}
                  isRunning={isRunning}
                  componentStates={componentStates}
                  onTemplateChange={(templateCode, templateId) => {
                    setCode(templateCode);
                    setActiveTemplate(templateId);
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

            <SerialMonitor 
              output={serialOutput} 
              onClear={() => setSerialOutput([])}
            />
          </div>

          <div className="space-y-4">
            <CircuitValidation 
              errors={validationErrors}
              isRunning={isRunning}
            />
            
            <LiveSuggestions 
              circuit={circuit}
              isRunning={isRunning}
            />
            
            <InteractiveControls 
              circuit={circuit}
              onControlChange={(componentId, value) => {
                setInteractiveValues(prev => {
                  const next = new Map(prev);
                  next.set(componentId, value);
                  return next;
                });
              }}
            />
            
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