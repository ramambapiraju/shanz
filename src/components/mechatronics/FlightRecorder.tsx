import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Play, Square, Download } from "lucide-react";
import { useState } from "react";
import { RigidBody } from "@/utils/physicsEngine";
import { Badge } from "@/components/ui/badge";

interface FlightRecorderProps {
  isRecording: boolean;
  recordedPath: RigidBody[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayback: () => void;
  onDownload: () => void;
}

const FlightRecorder: React.FC<FlightRecorderProps> = ({
  isRecording,
  recordedPath,
  onStartRecording,
  onStopRecording,
  onPlayback,
  onDownload,
}) => {
  const duration = recordedPath.length * 0.016; // 60 FPS

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Circle className="h-5 w-5" />
          Flight Path Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <Badge variant="destructive" className="animate-pulse">
              <Circle className="h-3 w-3 mr-1 fill-current" />
              Recording
            </Badge>
          ) : (
            <Badge variant="outline">Standby</Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {recordedPath.length} frames ({duration.toFixed(1)}s)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!isRecording ? (
            <Button onClick={onStartRecording} variant="default" className="w-full">
              <Circle className="h-4 w-4 mr-2" />
              Record
            </Button>
          ) : (
            <Button onClick={onStopRecording} variant="destructive" className="w-full">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}

          <Button 
            onClick={onPlayback} 
            variant="outline" 
            disabled={recordedPath.length === 0}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Playback
          </Button>
        </div>

        <Button 
          onClick={onDownload} 
          variant="outline" 
          disabled={recordedPath.length === 0}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Path Data
        </Button>

        {recordedPath.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted/50 rounded">
            <div>Max Speed: {Math.max(...recordedPath.map(r => 
              Math.sqrt(r.velocity.x**2 + r.velocity.y**2 + r.velocity.z**2) * 3.6
            )).toFixed(1)} km/h</div>
            <div>Distance: {recordedPath.reduce((sum, r, i) => {
              if (i === 0) return 0;
              const prev = recordedPath[i - 1];
              return sum + Math.sqrt(
                (r.position.x - prev.position.x)**2 +
                (r.position.y - prev.position.y)**2 +
                (r.position.z - prev.position.z)**2
              );
            }, 0).toFixed(2)} m</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightRecorder;
