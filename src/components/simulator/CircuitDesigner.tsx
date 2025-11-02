import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb, Thermometer, Gauge, Cable, Trash2, ZapIcon, Power, Activity, Radio } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

interface CircuitComponent {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  color: string;
  pins: string[];
  connections: { from: string; to: string }[];
}

interface CircuitDesignerProps {
  circuit: CircuitComponent[];
  setCircuit: (circuit: CircuitComponent[]) => void;
  isRunning: boolean;
}

const COMPONENTS = [
  { type: "arduino", name: "Arduino Uno", icon: Cpu, color: "#00979D", pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"] },
  { type: "led", name: "LED", icon: Lightbulb, color: "#FFC107", pins: ["ANODE", "CATHODE"] },
  { type: "resistor", name: "Resistor", icon: ZapIcon, color: "#795548", pins: ["PIN1", "PIN2"] },
  { type: "button", name: "Push Button", icon: Power, color: "#9E9E9E", pins: ["PIN1", "PIN2"] },
  { type: "temp", name: "DHT22 Sensor", icon: Thermometer, color: "#FF5722", pins: ["VCC", "DATA", "GND"] },
  { type: "servo", name: "Servo Motor", icon: Gauge, color: "#9C27B0", pins: ["VCC", "GND", "SIGNAL"] },
  { type: "ultrasonic", name: "HC-SR04", icon: Cable, color: "#4CAF50", pins: ["VCC", "TRIG", "ECHO", "GND"] },
  { type: "potentiometer", name: "Potentiometer", icon: Activity, color: "#FF9800", pins: ["VCC", "WIPER", "GND"] },
  { type: "buzzer", name: "Buzzer", icon: Radio, color: "#E91E63", pins: ["POSITIVE", "NEGATIVE"] },
];

export const CircuitDesigner = ({ circuit, setCircuit, isRunning }: CircuitDesignerProps) => {
  const [wiringMode, setWiringMode] = useState(false);
  const [wireFrom, setWireFrom] = useState<string | null>(null);
  const updateXarrow = useXarrow();

  const addComponent = (component: typeof COMPONENTS[0]) => {
    const newComponent: CircuitComponent = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      name: component.name,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      color: component.color,
      pins: component.pins,
      connections: []
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Circuit Designer</CardTitle>
            <CardDescription>
              Drag components and connect wires to build your circuit
            </CardDescription>
          </div>
          <Button
            variant={wiringMode ? "default" : "outline"}
            onClick={() => {
              setWiringMode(!wiringMode);
              setWireFrom(null);
            }}
            disabled={isRunning}
          >
            {wiringMode ? "Cancel Wiring" : "Wire Mode"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3 text-sm">Components</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {COMPONENTS.map((component) => {
                  const Icon = component.icon;
                  return (
                    <Button
                      key={component.type}
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-2"
                      onClick={() => addComponent(component)}
                      disabled={isRunning}
                      size="sm"
                    >
                      <Icon className="h-3 w-3 flex-shrink-0" style={{ color: component.color }} />
                      <span className="text-xs">{component.name}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="md:col-span-4">
            <div className="border-2 border-dashed rounded-lg min-h-[500px] bg-grid-pattern relative overflow-hidden">
              {circuit.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Cpu className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Drag components from the library</p>
                    <p className="text-xs mt-2">Click "Wire Mode" to connect pins</p>
                  </div>
                </div>
              ) : (
                <Xwrapper>
                  <div className="relative w-full h-[500px]">
                    {circuit.map((component) => {
                      const Icon = getIcon(component.type);
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
                            className={`absolute bg-card border-2 rounded-lg p-2 shadow-lg cursor-move ${
                              isRunning ? 'animate-pulse-glow' : ''
                            }`}
                            style={{ borderColor: component.color }}
                          >
                            <div className="flex items-center gap-2 mb-2 border-b pb-2">
                              <Icon className="h-4 w-4" style={{ color: component.color }} />
                              <span className="text-xs font-semibold">{component.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 ml-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeComponent(component.id);
                                }}
                                disabled={isRunning}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {component.pins.map((pin) => (
                                <div
                                  key={pin}
                                  id={`${component.id}-${pin}`}
                                  className={`text-[10px] px-2 py-1 rounded border cursor-pointer hover:bg-primary/10 transition-colors ${
                                    wiringMode ? 'border-primary' : 'border-border'
                                  } ${wireFrom === `${component.id}-${pin}` ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
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
                      component.connections.map((conn, idx) => (
                        <Xarrow
                          key={`${component.id}-${idx}`}
                          start={conn.from}
                          end={conn.to}
                          color={component.color}
                          strokeWidth={2}
                          headSize={4}
                          showHead={false}
                        />
                      ))
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