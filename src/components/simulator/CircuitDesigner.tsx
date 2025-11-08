import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb, Thermometer, Gauge, Cable, Trash2, ZapIcon, Power, Activity, Radio, Battery, Grid3x3, Antenna } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { Badge } from "@/components/ui/badge";
import { buildProjectCircuit, PROJECT_CODES } from "./ProjectTemplates";
import { useEffect } from "react";
import { toast } from "sonner";

interface CircuitComponent {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  color: string;
  pins: string[];
  connections: { from: string; to: string }[];
  state?: any; // For simulation state (LED on/off, sensor values, etc.)
}

interface CircuitDesignerProps {
  circuit: CircuitComponent[];
  setCircuit: (circuit: CircuitComponent[]) => void;
  isRunning: boolean;
  componentStates?: Map<string, any>;
}

const COMPONENTS = [
  // Controllers & Base
  { type: "arduino", name: "Arduino Uno", icon: Cpu, color: "#00979D", pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V", "3.3V", "A0", "A1", "A2"], category: "Controllers" },
  { type: "breadboard", name: "Breadboard", icon: Grid3x3, color: "#FAFAFA", pins: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "+", "-"], category: "Base" },
  
  // Power
  { type: "battery", name: "9V Battery", icon: Battery, color: "#424242", pins: ["+", "-"], category: "Power" },
  { type: "battery-aa", name: "AA Battery Pack", icon: Battery, color: "#616161", pins: ["+", "-"], category: "Power" },
  
  // LEDs (Output)
  { type: "led-red", name: "Red LED", icon: Lightbulb, color: "#F44336", pins: ["+", "-"], category: "Output" },
  { type: "led-green", name: "Green LED", icon: Lightbulb, color: "#4CAF50", pins: ["+", "-"], category: "Output" },
  { type: "led-blue", name: "Blue LED", icon: Lightbulb, color: "#2196F3", pins: ["+", "-"], category: "Output" },
  { type: "led-yellow", name: "Yellow LED", icon: Lightbulb, color: "#FFEB3B", pins: ["+", "-"], category: "Output" },
  { type: "led-rgb", name: "RGB LED", icon: Lightbulb, color: "#9C27B0", pins: ["R", "G", "B", "GND"], category: "Output" },
  
  // Resistors (Passive)
  { type: "resistor-220", name: "220Ω Resistor", icon: ZapIcon, color: "#FF5722", pins: ["1", "2"], category: "Passive" },
  { type: "resistor-1k", name: "1KΩ Resistor", icon: ZapIcon, color: "#795548", pins: ["1", "2"], category: "Passive" },
  { type: "resistor-10k", name: "10KΩ Resistor", icon: ZapIcon, color: "#9E9E9E", pins: ["1", "2"], category: "Passive" },
  
  // Sensors
  { type: "ldr", name: "Light Sensor (LDR)", icon: Lightbulb, color: "#FFC107", pins: ["1", "2"], category: "Sensors" },
  { type: "pir-sensor", name: "PIR Motion Sensor", icon: Antenna, color: "#E91E63", pins: ["VCC", "OUT", "GND"], category: "Sensors" },
  { type: "dht11", name: "DHT11 Temp Sensor", icon: Thermometer, color: "#FF5722", pins: ["VCC", "DATA", "GND"], category: "Sensors" },
  { type: "ultrasonic", name: "HC-SR04 Ultrasonic", icon: Cable, color: "#4CAF50", pins: ["VCC", "TRIG", "ECHO", "GND"], category: "Sensors" },
  
  // Input
  { type: "button", name: "Push Button", icon: Power, color: "#607D8B", pins: ["1", "2"], category: "Input" },
  { type: "switch", name: "Toggle Switch", icon: Power, color: "#455A64", pins: ["1", "2"], category: "Input" },
  { type: "potentiometer", name: "Potentiometer", icon: Activity, color: "#FF9800", pins: ["VCC", "WIPER", "GND"], category: "Input" },
  
  // Output Devices
  { type: "buzzer", name: "Piezo Buzzer", icon: Radio, color: "#E91E63", pins: ["+", "-"], category: "Output" },
  { type: "servo", name: "Servo Motor", icon: Gauge, color: "#9C27B0", pins: ["VCC", "GND", "SIG"], category: "Output" },
  { type: "dc-motor", name: "DC Motor", icon: Gauge, color: "#673AB7", pins: ["+", "-"], category: "Output" },
];

const PROJECT_TEMPLATES = [
  { id: "blank", name: "Blank Canvas", description: "Start from scratch" },
  { id: "blink", name: "1. Blinking LED 💡", description: "Learn basic LED control" },
  { id: "traffic", name: "2. Traffic Light 🚦", description: "3 LEDs in sequence" },
  { id: "nightlight", name: "3. Night Light 🌙", description: "Auto light with LDR" },
  { id: "alarm", name: "4. Buzzer Alarm 🔊", description: "Sound alert system" },
  { id: "temp", name: "5. Temperature Monitor 🌡️", description: "Read DHT11 sensor" },
  { id: "motion", name: "6. Motion Detector 👋", description: "PIR sensor light" },
  { id: "rgb", name: "7. RGB Color Mixer 🌈", description: "Mix light colors" },
  { id: "counter", name: "8. Button Counter 🔘", description: "Count presses" },
  { id: "distance", name: "9. Distance Alert 📡", description: "Ultrasonic warning" },
  { id: "fan", name: "10. Fan Controller ⚙️", description: "Variable speed control" },
];

interface CircuitDesignerExtendedProps extends CircuitDesignerProps {
  onTemplateChange?: (code: string, templateId: string) => void;
}

export const CircuitDesigner = ({ circuit, setCircuit, isRunning, componentStates, onTemplateChange }: CircuitDesignerExtendedProps) => {
  const [wiringMode, setWiringMode] = useState(false);
  const [wireFrom, setWireFrom] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const updateXarrow = useXarrow();

  const loadTemplate = (templateId: string) => {
    if (templateId === "blank") {
      setCircuit([]);
      setSelectedTemplate("blank");
      toast.success("Canvas cleared - Build your own circuit!");
      return;
    }
    
    const prebuiltCircuit = buildProjectCircuit(templateId);
    setCircuit(prebuiltCircuit);
    setSelectedTemplate(templateId);
    
    const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
    toast.success(`${template?.name} loaded!`, {
      description: "✨ Circuit built! Click Run to start simulation"
    });
  };

  useEffect(() => {
    if (selectedTemplate !== "blank") {
      loadTemplate(selectedTemplate);
      // Load corresponding code if callback provided
      if (onTemplateChange && PROJECT_CODES[selectedTemplate as keyof typeof PROJECT_CODES]) {
        onTemplateChange(PROJECT_CODES[selectedTemplate as keyof typeof PROJECT_CODES], selectedTemplate);
      }
    }
  }, [selectedTemplate]);
  
  const categories = ["All", ...Array.from(new Set(COMPONENTS.map(c => c.category)))];
  const filteredComponents = selectedCategory === "All" 
    ? COMPONENTS 
    : COMPONENTS.filter(c => c.category === selectedCategory);

  const addComponent = (component: typeof COMPONENTS[0]) => {
    const newComponent: CircuitComponent = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      name: component.name,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      color: component.color,
      pins: component.pins,
      connections: [],
      state: { active: false, value: 0 }
    };
    setCircuit([...circuit, newComponent]);
  };

  const removeComponent = (id: string) => {
    setCircuit(circuit.filter((c) => c.id !== id));
  };

  const handlePinClick = (componentId: string, pin: string) => {
    if (!wiringMode) return;
    
    const pinId = `${componentId}-${pin}`;
    if (!wireFrom) {
      setWireFrom(pinId);
    } else {
      if (wireFrom !== pinId) {
        const updatedCircuit = circuit.map(c => {
          if (c.id === componentId) {
            return {
              ...c,
              connections: [...c.connections, { from: wireFrom, to: pinId }]
            };
          }
          return c;
        });
        setCircuit(updatedCircuit);
      }
      setWireFrom(null);
      setWiringMode(false);
    }
  };

  const getIcon = (type: string) => {
    const comp = COMPONENTS.find(c => c.type === type);
    return comp ? comp.icon : Cpu;
  };
  
  const getComponentState = (componentId: string) => {
    return componentStates?.get(componentId) || { active: false, value: 0 };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                🔧 Circuit Designer 
                {isRunning && <Badge variant="secondary" className="animate-pulse">Simulating</Badge>}
              </CardTitle>
              <CardDescription className="mb-3">
                Build one of 10 DIY projects or create your own circuit!
              </CardDescription>
              <select 
                className="w-full max-w-md p-2.5 rounded-lg border-2 bg-card text-sm font-medium hover:border-primary transition-colors shadow-sm"
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (onTemplateChange && e.target.value !== "blank") {
                    // Template code will be loaded in parent
                  }
                }}
              >
                {PROJECT_TEMPLATES.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                ✨ Select a project to auto-build the circuit
              </p>
            </div>
            <Button
              variant={wiringMode ? "default" : "outline"}
              onClick={() => {
                setWiringMode(!wiringMode);
                setWireFrom(null);
              }}
              disabled={isRunning}
              size="lg"
            >
              {wiringMode ? "✓ Wiring Mode" : "🔌 Connect Wires"}
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                disabled={isRunning}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              📦 Component Library
            </h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2 pr-2">
                {filteredComponents.map((component) => {
                  const Icon = component.icon;
                  return (
                    <Button
                      key={component.type}
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-3 hover:scale-105 transition-transform"
                      onClick={() => addComponent(component)}
                      disabled={isRunning}
                      size="sm"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" style={{ color: component.color }} />
                      <span className="text-xs font-medium">{component.name}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="md:col-span-4">
            <div className="border-2 border-dashed rounded-lg min-h-[600px] bg-grid-pattern relative overflow-hidden shadow-inner">
              {circuit.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🔌</div>
                    <p className="text-lg font-semibold mb-2">Start Building Your Circuit!</p>
                    <p className="text-sm mb-4">Click on components from the left to add them to your workspace</p>
                    <div className="flex gap-4 justify-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">1️⃣</span> Add components
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">2️⃣</span> Click "Connect Wires"
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">3️⃣</span> Click pins to connect
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Xwrapper>
                  <div className="relative w-full h-[600px]">
                    {circuit.map((component) => {
                      const Icon = getIcon(component.type);
                      const state = getComponentState(component.id);
                      const isLED = component.type.includes('led');
                      const isActive = state.active;
                      
                      return (
                        <Draggable
                          key={component.id}
                          position={{ x: component.x, y: component.y }}
                          onDrag={updateXarrow}
                          onStop={(e, data) => {
                            const updatedCircuit = circuit.map(c =>
                              c.id === component.id ? { ...c, x: data.x, y: data.y } : c
                            );
                            setCircuit(updatedCircuit);
                            updateXarrow();
                          }}
                          disabled={isRunning || wiringMode}
                        >
                           <div
                            id={component.id}
                            className={`absolute cursor-move transition-all duration-300 rounded-xl p-3
                              ${isRunning && isActive ? 'scale-110' : 'hover:scale-105'}
                              ${component.type === 'arduino' ? 'arduino-board' :
                                component.type === 'breadboard' ? 'breadboard-surface' :
                                component.type.includes('resistor') ? 'resistor-body' :
                                component.type === 'button' || component.type === 'switch' ? 'button-3d' + (isActive ? ' button-active' : '') :
                                component.type.includes('battery') ? 'battery-casing' :
                                component.type === 'dc-motor' || component.type === 'servo' ? 'motor-housing' + (isActive ? ' motor-active' : '') :
                                component.type === 'buzzer' ? (isActive ? 'buzzer-active' : '') + ' component-3d' :
                                component.type === 'dht11' || component.type === 'ultrasonic' || component.type === 'pir-sensor' || component.type === 'ldr' ? 'sensor-housing' + (isActive ? ' sensor-active' : '') :
                                component.type.includes('led') ? 'led-dome' + (isActive ? ' led-glow-active' : '') :
                                'component-3d'
                              }`}
                            style={{ 
                              backgroundColor: isLED && isActive ? `${component.color}` : undefined,
                              boxShadow: isLED && isActive ? `0 0 30px ${component.color}, 0 0 60px ${component.color}80, 0 8px 20px rgba(0,0,0,0.3)` : undefined,
                              border: component.type === 'breadboard' ? '1px solid #ccc' : undefined
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{
                              borderColor: component.type === 'arduino' ? 'rgba(255,255,255,0.2)' :
                                          component.type.includes('battery') || component.type.includes('motor') || 
                                          (component.type.includes('sensor') || component.type === 'ldr' || component.type === 'dht11') ? 
                                          'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                            }}>
                              {isLED && isActive ? (
                                <div className="relative h-5 w-5">
                                  <div 
                                    className="absolute inset-0 rounded-full led-dome"
                                    style={{ 
                                      backgroundColor: component.color,
                                      filter: 'brightness(1.5)',
                                      boxShadow: `0 0 10px ${component.color}, inset 0 -2px 4px rgba(0,0,0,0.3)`
                                    }}
                                  />
                                  <Icon 
                                    className="absolute inset-0 h-5 w-5" 
                                    style={{ 
                                      color: '#fff',
                                      filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                                    }} 
                                  />
                                </div>
                              ) : (
                                <Icon 
                                  className="h-5 w-5" 
                                  style={{ 
                                    color: component.type === 'arduino' || component.type.includes('battery') || 
                                           component.type.includes('motor') || component.type.includes('sensor') || 
                                           component.type === 'ldr' || component.type === 'dht11' || component.type === 'pir-sensor' ?
                                           'rgba(255,255,255,0.9)' : component.color,
                                    filter: component.type.includes('button') || component.type === 'switch' ? 'brightness(1.2)' : undefined
                                  }} 
                                />
                              )}
                              <span 
                                className="text-xs font-semibold"
                                style={{
                                  color: component.type === 'arduino' || component.type.includes('battery') || 
                                         component.type.includes('motor') || component.type.includes('sensor') || 
                                         component.type === 'ldr' || component.type === 'dht11' || component.type === 'pir-sensor' ?
                                         'rgba(255,255,255,0.95)' : 'inherit'
                                }}
                              >
                                {component.name}
                              </span>
                              {isActive && (
                                <Badge 
                                  variant={component.type === 'arduino' || component.type.includes('battery') || 
                                          component.type.includes('motor') || component.type.includes('sensor') || 
                                          component.type === 'ldr' || component.type === 'dht11' ? "secondary" : "default"} 
                                  className="text-[8px] px-1 py-0 font-bold"
                                >
                                  ON
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 ml-auto hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeComponent(component.id);
                                }}
                                disabled={isRunning}
                              >
                                <Trash2 className="h-3 w-3" style={{
                                  color: component.type === 'arduino' || component.type.includes('battery') || 
                                         component.type.includes('motor') || component.type.includes('sensor') || 
                                         component.type === 'ldr' || component.type === 'dht11' ?
                                         'rgba(255,255,255,0.8)' : undefined
                                }} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {component.pins.map((pin) => (
                                <div
                                  key={pin}
                                  id={`${component.id}-${pin}`}
                                  className={`text-[10px] px-2 py-1 rounded-md cursor-pointer transition-all font-bold text-center ${
                                    wiringMode 
                                      ? 'pin-metallic border-2 border-primary ring-2 ring-primary/50 hover:scale-105' 
                                      : 'pin-metallic border border-border/50 hover:border-primary/50'
                                  } ${
                                    wireFrom === `${component.id}-${pin}` 
                                      ? 'bg-primary text-primary-foreground ring-2 ring-primary scale-105' 
                                      : 'text-foreground/80 hover:text-foreground'
                                  }`}
                                  onClick={() => handlePinClick(component.id, pin)}
                                >
                                  {pin}
                                </div>
                              ))}
                            </div>
                          </div>
                        </Draggable>
                      );
                    })}
                    
                    {circuit.flatMap((component) =>
                      component.connections.map((conn, idx) => {
                        const state = getComponentState(component.id);
                        const isActive = state.active;
                        return (
                          <Xarrow
                            key={`${component.id}-${idx}`}
                            start={conn.from}
                            end={conn.to}
                            color={isActive ? component.color : '#666'}
                            strokeWidth={isActive ? 4 : 2}
                            headSize={6}
                            showHead={false}
                            dashness={isActive ? { strokeLen: 10, nonStrokeLen: 10, animation: 1 } : false}
                            animateDrawing={isActive ? 0.5 : false}
                          />
                        );
                      })
                    )}
                  </div>
                </Xwrapper>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};