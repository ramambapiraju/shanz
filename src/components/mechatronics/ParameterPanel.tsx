import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Trash2 } from "lucide-react";
import { MechatronicsComponent } from "@/pages/MechatronicsSimulator";

interface ParameterPanelProps {
  component: MechatronicsComponent;
  onUpdateParameters: (parameters: Record<string, number>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ParameterPanel = ({
  component,
  onUpdateParameters,
  onDelete,
  onClose
}: ParameterPanelProps) => {
  const handleParameterChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdateParameters({
        ...component.parameters,
        [key]: numValue
      });
    }
  };

  const getParameterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      torqueConstant: 'Torque Constant (Nm/A)',
      resistance: 'Resistance (Ω)',
      inductance: 'Inductance (H)',
      voltage: 'Voltage (V)',
      current: 'Max Current (A)',
      resolution: 'Resolution (pulses/rev)',
      maxSpeed: 'Max Speed (RPM)',
      ratio: 'Gear Ratio',
      efficiency: 'Efficiency (0-1)',
      radius: 'Radius (m)',
      mass: 'Mass (kg)',
      length: 'Length (m)',
      kp: 'Proportional Gain (Kp)',
      ki: 'Integral Gain (Ki)',
      kd: 'Derivative Gain (Kd)'
    };
    return labels[key] || key;
  };

  return (
    <Card className="w-80 border-l border-border rounded-none flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {component.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Component ID</Label>
            <div className="text-sm font-mono bg-muted px-3 py-2 rounded">
              {component.id}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Parameters</h3>
            <div className="space-y-3">
              {Object.entries(component.parameters).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-sm">
                    {getParameterLabel(key)}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => handleParameterChange(key, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Position (m)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="pos-x" className="text-xs">X</Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={component.position.x}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs">Y</Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={component.position.y}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pos-z" className="text-xs">Z</Label>
                <Input
                  id="pos-z"
                  type="number"
                  value={component.position.z}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Component
        </Button>
      </div>
    </Card>
  );
};
