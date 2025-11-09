import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MECHANICAL_COMPONENTS, ComponentType, createComponent } from "./MechanicalComponent";
import { Zap, Cog, Package, Battery, Cpu, Ruler } from "lucide-react";

interface ComponentLibrary3DProps {
  onAddComponent: (type: ComponentType) => void;
}

const ComponentLibrary3D: React.FC<ComponentLibrary3DProps> = ({ onAddComponent }) => {
  const categories = [
    {
      name: "Motors",
      icon: Zap,
      types: ["dc_motor", "servo_motor", "stepper_motor"] as ComponentType[],
    },
    {
      name: "Mechanical",
      icon: Cog,
      types: ["wheel", "propeller", "gear", "axle"] as ComponentType[],
    },
    {
      name: "Structure",
      icon: Package,
      types: ["chassis", "frame"] as ComponentType[],
    },
    {
      name: "Electronics",
      icon: Battery,
      types: ["battery", "esc"] as ComponentType[],
    },
    {
      name: "Sensors",
      icon: Cpu,
      types: ["sensor"] as ComponentType[],
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Component Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                <category.icon className="h-4 w-4" />
                {category.name}
              </h3>
              <div className="grid gap-2">
                {category.types.map((type) => {
                  const comp = MECHANICAL_COMPONENTS[type];
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-3"
                      onClick={() => onAddComponent(type)}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: comp.color }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{comp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {type === "dc_motor" && `${comp.properties.maxRPM} RPM, ${comp.properties.maxTorque} N⋅m`}
                          {type === "servo_motor" && `${comp.properties.maxAngle}°, ${comp.properties.maxTorque} N⋅m`}
                          {type === "stepper_motor" && `${comp.properties.stepsPerRevolution} steps/rev`}
                          {type === "wheel" && `Ø${(comp.properties.diameter * 100).toFixed(1)}cm`}
                          {type === "propeller" && `${comp.properties.diameter}" x ${comp.properties.pitch}"`}
                          {type === "battery" && `${comp.properties.capacity}mAh ${comp.properties.voltage}V`}
                          {type === "chassis" && `${(comp.properties.length * 100).toFixed(0)}cm`}
                          {type === "frame" && `${(comp.properties.width * 100).toFixed(0)}cm quad`}
                          {type === "esc" && `${comp.properties.maxCurrent}A`}
                          {type === "gear" && `Ratio ${comp.properties.ratio}:1`}
                          {type === "axle" && `L${(comp.properties.length * 100).toFixed(0)}cm`}
                          {type === "sensor" && comp.properties.type}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ComponentLibrary3D;
