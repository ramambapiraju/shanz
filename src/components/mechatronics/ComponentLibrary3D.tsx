import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MECHANICAL_COMPONENTS, ComponentType } from "./MechanicalComponent";
import { Zap, Cog, Package, Battery, Cpu, Radio, Gauge } from "lucide-react";

interface ComponentLibrary3DProps {
  onAddComponent: (type: ComponentType) => void;
}

const ComponentLibrary3D: React.FC<ComponentLibrary3DProps> = ({ onAddComponent }) => {
  const categories = [
    {
      name: "Motors & Actuators",
      icon: Zap,
      types: ["dc_motor_775", "brushless_motor_2212", "servo_mg996r", "servo_sg90", "stepper_nema17"] as ComponentType[],
    },
    {
      name: "Wheels & Propulsion",
      icon: Cog,
      types: ["rubber_wheel_100mm", "omni_wheel", "mecanum_wheel", "propeller_10x4.5", "propeller_5x3"] as ComponentType[],
    },
    {
      name: "RC Control",
      icon: Radio,
      types: ["receiver_2.4ghz", "transmitter_2.4ghz", "esc_30a", "esc_60a"] as ComponentType[],
    },
    {
      name: "Controllers",
      icon: Cpu,
      types: ["arduino_uno", "arduino_nano", "raspberry_pi", "flight_controller"] as ComponentType[],
    },
    {
      name: "Power Systems",
      icon: Battery,
      types: ["lipo_2s_2200mah", "lipo_3s_5000mah", "lipo_4s_3300mah", "voltage_regulator"] as ComponentType[],
    },
    {
      name: "Structure",
      icon: Package,
      types: ["aluminum_chassis", "carbon_frame", "plastic_body"] as ComponentType[],
    },
    {
      name: "Sensors",
      icon: Gauge,
      types: ["ultrasonic_sensor", "gyro_mpu6050", "gps_module", "camera_module"] as ComponentType[],
    },
  ];

  const getComponentSpec = (type: ComponentType) => {
    const comp = MECHANICAL_COMPONENTS[type];
    const props = comp.properties;
    
    // Motor specs
    if (type === "dc_motor_775") return `${props.maxRPM} RPM, ${props.maxTorque}N⋅m`;
    if (type === "brushless_motor_2212") return `${props.kv}KV, ${props.maxCurrent}A max`;
    if (type === "servo_mg996r" || type === "servo_sg90") return `${props.maxAngle}°, ${props.stallTorque}kg⋅cm`;
    if (type === "stepper_nema17") return `${props.stepsPerRevolution} steps, ${props.holdingTorque}N⋅m`;
    
    // Wheels & Propulsion
    if (type.includes("wheel")) return `Ø${(props.diameter! * 1000).toFixed(0)}mm, ${props.material}`;
    if (type.includes("propeller")) return `${props.diameter}"×${props.pitch}", ${props.bladesCount} blades`;
    
    // RC Control
    if (type.includes("receiver") || type.includes("transmitter")) return `${props.frequency}MHz, ${props.channels}ch, ${props.range}m`;
    if (type.includes("esc")) return `${props.maxCurrent}A (${props.burstCurrent}A burst), ${props.cellCount}`;
    
    // Controllers
    if (type.includes("arduino")) return `${props.processor}, ${props.digitalPins}D ${props.analogPins}A pins`;
    if (type === "flight_controller") return `${props.processor}, ${props.clockSpeed}MHz`;
    if (type === "raspberry_pi") return `${props.processor}, ${props.clockSpeed}MHz`;
    
    // Power
    if (type.includes("lipo")) return `${props.capacity}mAh ${props.voltage}V (${props.cellCount}S), ${props.cRating}C`;
    if (type === "voltage_regulator") return `${props.voltage}V, ${props.maxCurrent}A`;
    
    // Structure
    if (type.includes("chassis") || type.includes("frame") || type.includes("body")) {
      return `${(props.length! * 100).toFixed(0)}×${(props.width! * 100).toFixed(0)}cm, ${props.material}`;
    }
    
    // Sensors
    if (type === "ultrasonic_sensor") return `${props.range}m range, ${props.updateRate}Hz`;
    if (type === "gyro_mpu6050") return `6-axis IMU, ${props.updateRate}Hz`;
    if (type === "gps_module") return `±${props.accuracy}m accuracy`;
    if (type === "camera_module") return `FPV ${props.range}m range`;
    
    return "";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Professional Components
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
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: comp.color }}
                      />
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm">{comp.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {getComponentSpec(type)}
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