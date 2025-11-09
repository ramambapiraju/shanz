import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Radio } from 'lucide-react';

interface RCTransmitterUIProps {
  onControlChange: (controls: RCControls) => void;
  vehicleType: 'drone' | 'car' | 'boat';
}

export interface RCControls {
  throttle: number;  // -1 to 1
  yaw: number;       // -1 to 1
  pitch: number;     // -1 to 1
  roll: number;      // -1 to 1
  steering: number;  // -1 to 1 (for cars/boats)
}

export const RCTransmitterUI: React.FC<RCTransmitterUIProps> = ({
  onControlChange,
  vehicleType,
}) => {
  const [controls, setControls] = useState<RCControls>({
    throttle: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    steering: 0,
  });
  
  const [leftStickPos, setLeftStickPos] = useState({ x: 0, y: 0 });
  const [rightStickPos, setRightStickPos] = useState({ x: 0, y: 0 });
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newControls = { ...controls };
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newControls.throttle = Math.min(1, newControls.throttle + 0.1);
          break;
        case 's':
        case 'arrowdown':
          newControls.throttle = Math.max(-1, newControls.throttle - 0.1);
          break;
        case 'a':
        case 'arrowleft':
          if (vehicleType === 'drone') {
            newControls.yaw = Math.max(-1, newControls.yaw - 0.1);
          } else {
            newControls.steering = Math.max(-1, newControls.steering - 0.1);
          }
          break;
        case 'd':
        case 'arrowright':
          if (vehicleType === 'drone') {
            newControls.yaw = Math.min(1, newControls.yaw + 0.1);
          } else {
            newControls.steering = Math.min(1, newControls.steering + 0.1);
          }
          break;
        case 'i':
          newControls.pitch = Math.min(1, newControls.pitch + 0.1);
          break;
        case 'k':
          newControls.pitch = Math.max(-1, newControls.pitch - 0.1);
          break;
        case 'j':
          newControls.roll = Math.max(-1, newControls.roll - 0.1);
          break;
        case 'l':
          newControls.roll = Math.min(1, newControls.roll + 0.1);
          break;
      }
      
      setControls(newControls);
      onControlChange(newControls);
      updateStickPositions(newControls);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const newControls = { ...controls };
      
      // Auto-center controls on key release
      switch (e.key.toLowerCase()) {
        case 'w':
        case 's':
        case 'arrowup':
        case 'arrowdown':
          newControls.throttle = 0;
          break;
        case 'a':
        case 'd':
        case 'arrowleft':
        case 'arrowright':
          if (vehicleType === 'drone') {
            newControls.yaw = 0;
          } else {
            newControls.steering = 0;
          }
          break;
        case 'i':
        case 'k':
          newControls.pitch = 0;
          break;
        case 'j':
        case 'l':
          newControls.roll = 0;
          break;
      }
      
      setControls(newControls);
      onControlChange(newControls);
      updateStickPositions(newControls);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controls, onControlChange, vehicleType]);
  
  const updateStickPositions = (newControls: RCControls) => {
    // Left stick: throttle (Y) and yaw/steering (X)
    setLeftStickPos({
      x: vehicleType === 'drone' ? newControls.yaw * 40 : newControls.steering * 40,
      y: -newControls.throttle * 40,
    });
    
    // Right stick: pitch (Y) and roll (X)
    setRightStickPos({
      x: newControls.roll * 40,
      y: -newControls.pitch * 40,
    });
  };
  
  const handleLeftStickDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingLeft) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const newControls = { ...controls };
    if (vehicleType === 'drone') {
      newControls.yaw = Math.max(-1, Math.min(1, deltaX / 40));
    } else {
      newControls.steering = Math.max(-1, Math.min(1, deltaX / 40));
    }
    newControls.throttle = Math.max(-1, Math.min(1, -deltaY / 40));
    
    setControls(newControls);
    onControlChange(newControls);
    setLeftStickPos({ x: deltaX, y: deltaY });
  };
  
  const handleRightStickDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRight) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const newControls = { ...controls };
    newControls.roll = Math.max(-1, Math.min(1, deltaX / 40));
    newControls.pitch = Math.max(-1, Math.min(1, -deltaY / 40));
    
    setControls(newControls);
    onControlChange(newControls);
    setRightStickPos({ x: deltaX, y: deltaY });
  };
  
  return (
    <Card className="p-4 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">RC Transmitter</h3>
      </div>
      
      <div className="flex justify-around items-center gap-8">
        {/* Left Stick - Throttle & Yaw/Steering */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-24 h-24 bg-muted rounded-full border-2 border-border cursor-pointer"
            onMouseDown={() => setIsDraggingLeft(true)}
            onMouseUp={() => setIsDraggingLeft(false)}
            onMouseLeave={() => setIsDraggingLeft(false)}
            onMouseMove={handleLeftStickDrag}
          >
            <div
              className="absolute w-8 h-8 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform"
              style={{
                left: `calc(50% + ${leftStickPos.x}px)`,
                top: `calc(50% + ${leftStickPos.y}px)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-full bg-border/30" />
              <div className="w-full h-1 bg-border/30 absolute" />
            </div>
          </div>
          <div className="mt-2 text-xs text-center">
            <div className="font-medium">Left Stick</div>
            <div className="text-muted-foreground">
              {vehicleType === 'drone' ? 'Throttle / Yaw' : 'Throttle / Steering'}
            </div>
            <div className="font-mono text-xs mt-1">
              {controls.throttle.toFixed(2)} / {vehicleType === 'drone' ? controls.yaw.toFixed(2) : controls.steering.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Right Stick - Pitch & Roll */}
        {vehicleType === 'drone' && (
          <div className="flex flex-col items-center">
            <div
              className="relative w-24 h-24 bg-muted rounded-full border-2 border-border cursor-pointer"
              onMouseDown={() => setIsDraggingRight(true)}
              onMouseUp={() => setIsDraggingRight(false)}
              onMouseLeave={() => setIsDraggingRight(false)}
              onMouseMove={handleRightStickDrag}
            >
              <div
                className="absolute w-8 h-8 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform"
                style={{
                  left: `calc(50% + ${rightStickPos.x}px)`,
                  top: `calc(50% + ${rightStickPos.y}px)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1 h-full bg-border/30" />
                <div className="w-full h-1 bg-border/30 absolute" />
              </div>
            </div>
            <div className="mt-2 text-xs text-center">
              <div className="font-medium">Right Stick</div>
              <div className="text-muted-foreground">Pitch / Roll</div>
              <div className="font-mono text-xs mt-1">
                {controls.pitch.toFixed(2)} / {controls.roll.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded text-xs">
        <div className="font-medium mb-2">Keyboard Controls:</div>
        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
          <div>↑/W: Throttle Up</div>
          <div>↓/S: Throttle Down</div>
          <div>←/A: {vehicleType === 'drone' ? 'Yaw Left' : 'Steer Left'}</div>
          <div>→/D: {vehicleType === 'drone' ? 'Yaw Right' : 'Steer Right'}</div>
          {vehicleType === 'drone' && (
            <>
              <div>I: Pitch Forward</div>
              <div>K: Pitch Back</div>
              <div>J: Roll Left</div>
              <div>L: Roll Right</div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
