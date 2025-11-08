import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Gauge, ThermometerSun, Move } from "lucide-react";

interface InteractiveControlsProps {
  circuit: any[];
  onControlChange: (componentId: string, value: number) => void;
}

export const InteractiveControls = ({ circuit, onControlChange }: InteractiveControlsProps) => {
  const [potValue, setPotValue] = useState(50);
  const [lightLevel, setLightLevel] = useState(50);
  const [temperature, setTemperature] = useState(22);
  const [objectDistance, setObjectDistance] = useState(50);

  const hasPotentiometer = circuit.some(c => c.type === 'potentiometer');
  const hasLDR = circuit.some(c => c.type === 'ldr');
  const hasTemp = circuit.some(c => c.type === 'dht11');
  const hasUltrasonic = circuit.some(c => c.type === 'ultrasonic');

  if (!hasPotentiometer && !hasLDR && !hasTemp && !hasUltrasonic) {
    return null;
  }

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Gauge className="h-4 w-4 text-primary" />
        Interactive Controls
      </div>

      {hasPotentiometer && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              Potentiometer
            </span>
            <span className="font-mono bg-background px-2 py-1 rounded">{potValue}%</span>
          </div>
          <Slider
            value={[potValue]}
            onValueChange={(val) => {
              setPotValue(val[0]);
              const pot = circuit.find(c => c.type === 'potentiometer');
              if (pot) onControlChange(pot.id, val[0]);
            }}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {hasLDR && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              {lightLevel > 50 ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              Light Level
            </span>
            <span className="font-mono bg-background px-2 py-1 rounded">{lightLevel}%</span>
          </div>
          <Slider
            value={[lightLevel]}
            onValueChange={(val) => {
              setLightLevel(val[0]);
              const ldr = circuit.find(c => c.type === 'ldr');
              if (ldr) onControlChange(ldr.id, val[0]);
            }}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {hasTemp && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <ThermometerSun className="h-3 w-3" />
              Temperature
            </span>
            <span className="font-mono bg-background px-2 py-1 rounded">{temperature}°C</span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(val) => {
              setTemperature(val[0]);
              const temp = circuit.find(c => c.type === 'dht11');
              if (temp) onControlChange(temp.id, val[0]);
            }}
            min={-10}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {hasUltrasonic && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Move className="h-3 w-3" />
              Object Distance
            </span>
            <span className="font-mono bg-background px-2 py-1 rounded">{objectDistance}cm</span>
          </div>
          <Slider
            value={[objectDistance]}
            onValueChange={(val) => {
              setObjectDistance(val[0]);
              const ultrasonic = circuit.find(c => c.type === 'ultrasonic');
              if (ultrasonic) onControlChange(ultrasonic.id, val[0]);
            }}
            min={5}
            max={200}
            step={1}
            className="w-full"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground italic">
        🎮 Adjust these controls to interact with your circuit in real-time!
      </p>
    </Card>
  );
};
