// Enhanced Camera Controls with presets and smooth transitions
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Grid3x3, Eye, Focus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CameraControlsProps {
  onPresetChange: (preset: CameraPreset) => void;
  currentPreset?: string;
}

export type CameraPreset = {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

const CAMERA_PRESETS: CameraPreset[] = [
  {
    name: 'Isometric',
    position: [5, 5, 5],
    target: [0, 0, 0],
    fov: 50,
  },
  {
    name: 'Top View',
    position: [0, 10, 0],
    target: [0, 0, 0],
    fov: 60,
  },
  {
    name: 'Front View',
    position: [0, 1, 8],
    target: [0, 0.5, 0],
    fov: 50,
  },
  {
    name: 'Side View',
    position: [8, 1, 0],
    target: [0, 0.5, 0],
    fov: 50,
  },
  {
    name: 'Close-up',
    position: [2, 2, 2],
    target: [0, 0, 0],
    fov: 40,
  },
  {
    name: 'Wide',
    position: [10, 8, 10],
    target: [0, 0, 0],
    fov: 70,
  },
];

const CameraControls = ({ onPresetChange, currentPreset }: CameraControlsProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('Isometric');

  const handlePresetClick = (preset: CameraPreset) => {
    setSelectedPreset(preset.name);
    onPresetChange(preset);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="w-4 h-4" />
          Camera Presets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {CAMERA_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant={selectedPreset === preset.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="w-full"
            >
              {preset.name === 'Top View' && <Grid3x3 className="w-3 h-3 mr-1" />}
              {preset.name === 'Front View' && <Eye className="w-3 h-3 mr-1" />}
              {preset.name === 'Close-up' && <Focus className="w-3 h-3 mr-1" />}
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-mono">
                {CAMERA_PRESETS.find(p => p.name === selectedPreset)?.position.map(v => v.toFixed(1)).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">FOV:</span>
              <span className="font-mono">
                {CAMERA_PRESETS.find(p => p.name === selectedPreset)?.fov}°
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <p><strong>Tip:</strong> Use mouse to orbit, scroll to zoom</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraControls;
