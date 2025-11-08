import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Download } from "lucide-react";

interface SimulatorControlsProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onExport: () => void;
}

export const SimulatorControls = ({ isRunning, onRun, onStop, onReset, onExport }: SimulatorControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      {!isRunning ? (
        <Button onClick={onRun} className="gap-2">
          <Play className="h-4 w-4" />
          Run Simulation
        </Button>
      ) : (
        <Button onClick={onStop} variant="destructive" className="gap-2">
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button onClick={onExport} variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};