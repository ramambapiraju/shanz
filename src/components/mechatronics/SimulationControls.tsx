import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const SimulationControls = ({
  onRun,
  onStop,
  onReset,
  isSimulating
}: SimulationControlsProps) => {
  return (
    <div className="border-t border-border bg-card p-3 flex items-center justify-center gap-3">
      <Button
        onClick={onRun}
        disabled={isSimulating}
        className="min-w-24"
      >
        <Play className="h-4 w-4 mr-2" />
        Run
      </Button>
      <Button
        onClick={onStop}
        disabled={!isSimulating}
        variant="destructive"
        className="min-w-24"
      >
        <Square className="h-4 w-4 mr-2" />
        Stop
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="min-w-24"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};
