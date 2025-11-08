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
    <Card className="p-5 space-y-5 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/30 shadow-lg">
      <div className="flex items-center gap-2 text-base font-bold">
        <Gauge className="h-5 w-5 text-primary animate-pulse" />
        🎮 Interactive Environment Controls
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Simulate real-world sensor inputs by adjusting these controls
      </p>

      {hasPotentiometer && (
        <div className="space-y-3 p-3 rounded-lg bg-background/50 border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Gauge className="h-4 w-4 text-primary" />
              Potentiometer (Knob)
            </span>
            <span className="font-mono bg-primary/10 px-3 py-1 rounded-md font-bold text-primary">{potValue}%</span>
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
          <p className="text-xs text-muted-foreground italic">Rotate the virtual knob</p>
        </div>
      )}

      {hasLDR && (
        <div className="space-y-3 p-3 rounded-lg bg-background/50 border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              {lightLevel > 50 ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
              Ambient Light
            </span>
            <span className="font-mono bg-primary/10 px-3 py-1 rounded-md font-bold text-primary">{lightLevel}%</span>
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
          <p className="text-xs text-muted-foreground italic">
            {lightLevel < 30 ? '🌙 Dark' : lightLevel < 70 ? '☁️ Dim' : '☀️ Bright'}
          </p>
        </div>
      )}

      {hasTemp && (
        <div className="space-y-3 p-3 rounded-lg bg-background/50 border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <ThermometerSun className="h-4 w-4 text-orange-500" />
              Temperature
            </span>
            <span className="font-mono bg-primary/10 px-3 py-1 rounded-md font-bold text-primary">{temperature}°C</span>
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
          <p className="text-xs text-muted-foreground italic">
            {temperature < 10 ? '🥶 Cold' : temperature < 25 ? '😊 Comfortable' : '🥵 Hot'}
          </p>
        </div>
      )}

      {hasUltrasonic && (
        <div className="space-y-3 p-3 rounded-lg bg-background/50 border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Move className="h-4 w-4 text-green-500" />
              Object Distance
            </span>
            <span className="font-mono bg-primary/10 px-3 py-1 rounded-md font-bold text-primary">{objectDistance}cm</span>
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
          <p className="text-xs text-muted-foreground italic">
            {objectDistance < 30 ? '🚨 Very Close' : objectDistance < 100 ? '⚠️ Near' : '✅ Far Away'}
          </p>
        </div>
      )}
    </Card>
  );
};
