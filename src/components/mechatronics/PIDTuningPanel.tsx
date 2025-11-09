import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Settings2, RotateCcw } from "lucide-react";
import { PIDController } from "@/utils/physicsEngine";

interface PIDTuningPanelProps {
  pidX: PIDController;
  pidY: PIDController;
  pidZ: PIDController;
  onUpdatePID: (axis: 'x' | 'y' | 'z', pid: PIDController) => void;
  onReset: () => void;
}

const PIDTuningPanel: React.FC<PIDTuningPanelProps> = ({
  pidX,
  pidY,
  pidZ,
  onUpdatePID,
  onReset,
}) => {
  const updatePIDParam = (axis: 'x' | 'y' | 'z', param: 'kp' | 'ki' | 'kd', value: number) => {
    const currentPID = axis === 'x' ? pidX : axis === 'y' ? pidY : pidZ;
    onUpdatePID(axis, { ...currentPID, [param]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          PID Controller Tuning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(['x', 'y', 'z'] as const).map((axis) => {
          const pid = axis === 'x' ? pidX : axis === 'y' ? pidY : pidZ;
          return (
            <div key={axis} className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm uppercase">{axis}-Axis</h4>
              
              <div>
                <Label className="text-xs">Kp (Proportional): {pid.kp.toFixed(2)}</Label>
                <Slider
                  value={[pid.kp]}
                  onValueChange={(v) => updatePIDParam(axis, 'kp', v[0])}
                  max={10}
                  step={0.1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Ki (Integral): {pid.ki.toFixed(2)}</Label>
                <Slider
                  value={[pid.ki]}
                  onValueChange={(v) => updatePIDParam(axis, 'ki', v[0])}
                  max={5}
                  step={0.05}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Kd (Derivative): {pid.kd.toFixed(2)}</Label>
                <Slider
                  value={[pid.kd]}
                  onValueChange={(v) => updatePIDParam(axis, 'kd', v[0])}
                  max={5}
                  step={0.05}
                  className="mt-1"
                />
              </div>
            </div>
          );
        })}

        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};

export default PIDTuningPanel;
