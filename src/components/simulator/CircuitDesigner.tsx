import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb, Thermometer, Gauge, Cable, Trash2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface CircuitDesignerProps {
  circuit: any[];
  setCircuit: (circuit: any[]) => void;
  isRunning: boolean;
}

const COMPONENTS = [
  { id: "arduino", name: "Arduino Uno", icon: Cpu, color: "#00979D" },
  { id: "led", name: "LED", icon: Lightbulb, color: "#FFC107" },
  { id: "temp", name: "Temperature Sensor", icon: Thermometer, color: "#FF5722" },
  { id: "servo", name: "Servo Motor", icon: Gauge, color: "#9C27B0" },
  { id: "ultrasonic", name: "Ultrasonic Sensor", icon: Cable, color: "#4CAF50" },
];

export const CircuitDesigner = ({ circuit, setCircuit, isRunning }: CircuitDesignerProps) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const addComponent = (component: typeof COMPONENTS[0]) => {
    setCircuit([...circuit, { ...component, x: 100, y: 100, connections: [] }]);
  };

  const removeComponent = (index: number) => {
    setCircuit(circuit.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Circuit Designer</CardTitle>
        <CardDescription>
          Drag and drop components to design your circuit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Component Library</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {COMPONENTS.map((component) => {
                  const Icon = component.icon;
                  return (
                    <Button
                      key={component.id}
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => addComponent(component)}
                      disabled={isRunning}
                    >
                      <Icon className="h-4 w-4" style={{ color: component.color }} />
                      {component.name}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="md:col-span-3">
            <div className="border-2 border-dashed rounded-lg p-4 min-h-[400px] bg-muted/20 relative">
              {circuit.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Cpu className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Add components from the library to start designing</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold mb-2">Your Circuit</h3>
                  {circuit.map((component, index) => {
                    const Icon = component.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isRunning ? 'bg-primary/5 animate-pulse' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" style={{ color: component.color }} />
                          <span className="font-medium">{component.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            Pin: D{index + 2}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(index)}
                          disabled={isRunning}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};