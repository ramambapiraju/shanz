import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import { useState } from "react";

export interface SimulationSettings {
  throttleSensitivity: number;
  steeringSensitivity: number;
  wheelSizeMultiplier: number;
  maxSpeed: number;
  acceleration: number;
}

interface SettingsPanelProps {
  settings: SimulationSettings;
  onSettingsChange: (settings: SimulationSettings) => void;
}

const DEFAULT_SETTINGS: SimulationSettings = {
  throttleSensitivity: 0.3,
  steeringSensitivity: 1.0,
  wheelSizeMultiplier: 1.0,
  maxSpeed: 10,
  acceleration: 5,
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onSettingsChange(DEFAULT_SETTINGS);
  };

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Simulation Settings
          </span>
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">
              Throttle Sensitivity: {settings.throttleSensitivity.toFixed(1)}x
            </Label>
            <Slider
              value={[settings.throttleSensitivity]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, throttleSensitivity: value[0] })
              }
              min={0.1}
              max={2.0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              Steering Sensitivity: {settings.steeringSensitivity.toFixed(1)}x
            </Label>
            <Slider
              value={[settings.steeringSensitivity]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, steeringSensitivity: value[0] })
              }
              min={0.5}
              max={2.0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              Wheel Size: {settings.wheelSizeMultiplier.toFixed(1)}x
            </Label>
            <Slider
              value={[settings.wheelSizeMultiplier]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, wheelSizeMultiplier: value[0] })
              }
              min={0.5}
              max={1.5}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              Max Speed: {settings.maxSpeed.toFixed(0)} m/s
            </Label>
            <Slider
              value={[settings.maxSpeed]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, maxSpeed: value[0] })
              }
              min={5}
              max={20}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              Acceleration: {settings.acceleration.toFixed(0)} m/s²
            </Label>
            <Slider
              value={[settings.acceleration]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, acceleration: value[0] })
              }
              min={2}
              max={10}
              step={0.5}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SettingsPanel;
export { DEFAULT_SETTINGS };
