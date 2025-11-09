import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Settings, Keyboard } from "lucide-react";
import { useState, useEffect } from "react";
import { MechanicalComponent } from "./MechanicalComponent";
import { 
  RigidBody, 
  updateRigidBody, 
  Force, 
  calculateMotorTorque,
  calculatePropellerThrust,
  calculateDrag,
  vecScale,
  GRAVITY,
  Battery,
  updateBattery,
  Motor
} from "@/utils/physicsEngine";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { Badge } from "@/components/ui/badge";

interface SimulationEngineProps {
  components: MechanicalComponent[];
  onUpdateComponents: (components: MechanicalComponent[]) => void;
  onSimulationStateChange?: (time: number, isRunning: boolean) => void;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({
  components,
  onUpdateComponents,
  onSimulationStateChange,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [steering, setSteering] = useState(0);
  const keyboardControls = useKeyboardControls(isRunning);
  const [rigidBody, setRigidBody] = useState<RigidBody>({
    mass: 2, // kg
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 },
    angularAcceleration: { x: 0, y: 0, z: 0 },
    inertia: { x: 0.1, y: 0.1, z: 0.1 }, // kg⋅m²
  });

  const [battery, setBattery] = useState<Battery>({
    capacity: 2200,
    voltage: 11.1,
    currentCharge: 2200,
    internalResistance: 0.01,
    dischargeCurrent: 0,
  });

  // Handle keyboard controls
  useEffect(() => {
    if (!isRunning) return;
    
    // Update throttle based on keyboard
    if (keyboardControls.throttleUp) {
      setThrottle((prev) => Math.min(1, prev + 0.02));
    }
    if (keyboardControls.throttleDown) {
      setThrottle((prev) => Math.max(0, prev - 0.02));
    }
    
    // Update steering based on keyboard
    if (keyboardControls.left) {
      setSteering((prev) => Math.max(-1, prev - 0.05));
    } else if (keyboardControls.right) {
      setSteering((prev) => Math.min(1, prev + 0.05));
    } else {
      // Return to center
      setSteering((prev) => prev * 0.9);
    }
    
    // Forward/backward for direct throttle control
    if (keyboardControls.forward) {
      setThrottle((prev) => Math.min(1, prev + 0.01));
    }
    if (keyboardControls.backward) {
      setThrottle((prev) => Math.max(0, prev - 0.01));
    }
  }, [isRunning, keyboardControls]);

  useEffect(() => {
    if (!isRunning) return;

    const deltaTime = 0.016; // 60 FPS
    const interval = setInterval(() => {
      // Calculate forces from all components
      const forces: Force[] = [];
      let totalCurrent = 0;

      // Calculate mass from components
      const totalMass = components.reduce((sum, comp) => {
        return sum + (comp.properties.weight || 0);
      }, 0.5); // minimum 0.5kg

      // Gravity
      forces.push({
        vector: { x: 0, y: -GRAVITY * totalMass, z: 0 },
        point: { x: 0, y: 0, z: 0 },
      });

      // Motor/Propeller thrust
      components.forEach((comp) => {
        if (comp.type === "propeller") {
          const thrust = calculatePropellerThrust({
            diameter: comp.properties.diameter,
            pitch: comp.properties.pitch,
            thrustCoefficient: comp.properties.thrustCoefficient,
            powerCoefficient: comp.properties.powerCoefficient,
            rpm: 8000 * throttle, // RPM based on throttle
          });

          forces.push({
            vector: { x: 0, y: thrust, z: 0 },
            point: comp.position,
          });
        }

        if (comp.type === "dc_motor") {
          const current = (comp.properties.voltage / comp.properties.resistance) * throttle;
          totalCurrent += current;
        }

        if (comp.type === "esc") {
          totalCurrent += 0.1; // ESC draw
        }
      });

      // Drag
      const dragForce = calculateDrag(
        rigidBody.velocity,
        0.8, // drag coefficient
        0.06 // frontal area m²
      );
      forces.push({
        vector: dragForce,
        point: { x: 0, y: 0, z: 0 },
      });

      // Update physics
      const newBody = updateRigidBody({
        ...rigidBody,
        mass: totalMass,
      }, forces, deltaTime);

      // Update battery
      const newBattery = updateBattery(battery, totalCurrent, deltaTime);

      setRigidBody(newBody);
      setBattery(newBattery);
      setTimeElapsed((t) => {
        const newTime = t + deltaTime;
        onSimulationStateChange?.(newTime, true);
        return newTime;
      });

      // Update component positions based on simulation
      const updatedComponents = components.map((comp) => ({
        ...comp,
        position: {
          x: comp.position.x + newBody.position.x,
          y: comp.position.y + newBody.position.y,
          z: comp.position.z + newBody.position.z,
        },
      }));

      onUpdateComponents(updatedComponents);

      // Stop if battery depleted
      if (newBattery.currentCharge <= 0) {
        setIsRunning(false);
      }
    }, deltaTime * 1000);

    return () => clearInterval(interval);
  }, [isRunning, throttle, rigidBody, battery, components]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setThrottle(0);
    onSimulationStateChange?.(0, false);
    setRigidBody({
      mass: 2,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      angularAcceleration: { x: 0, y: 0, z: 0 },
      inertia: { x: 0.1, y: 0.1, z: 0.1 },
    });
    setBattery({
      capacity: 2200,
      voltage: 11.1,
      currentCharge: 2200,
      internalResistance: 0.01,
      dischargeCurrent: 0,
    });
  };

  const batteryPercent = (battery.currentCharge / battery.capacity) * 100;
  const speedKmh = Math.sqrt(
    rigidBody.velocity.x ** 2 + 
    rigidBody.velocity.y ** 2 + 
    rigidBody.velocity.z ** 2
  ) * 3.6; // m/s to km/h

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Simulation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "secondary" : "default"}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {isRunning && (
          <div className="bg-muted p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Keyboard className="h-4 w-4" />
              <span className="text-sm font-medium">Keyboard Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <Badge variant="outline" className="mr-1">↑/W</Badge>
                Forward
              </div>
              <div>
                <Badge variant="outline" className="mr-1">↓/S</Badge>
                Backward
              </div>
              <div>
                <Badge variant="outline" className="mr-1">←/A</Badge>
                Left
              </div>
              <div>
                <Badge variant="outline" className="mr-1">→/D</Badge>
                Right
              </div>
              <div>
                <Badge variant="outline" className="mr-1">+</Badge>
                Throttle Up
              </div>
              <div>
                <Badge variant="outline" className="mr-1">-</Badge>
                Throttle Down
              </div>
            </div>
          </div>
        )}

        <div>
          <Label>Throttle: {(throttle * 100).toFixed(0)}%</Label>
          <Slider
            value={[throttle * 100]}
            onValueChange={(v) => setThrottle(v[0] / 100)}
            max={100}
            step={1}
            disabled={!isRunning}
          />
        </div>

        <div>
          <Label>Steering: {(steering * 100).toFixed(0)}%</Label>
          <Slider
            value={[(steering + 1) * 50]}
            onValueChange={(v) => setSteering((v[0] / 50) - 1)}
            max={100}
            step={1}
            disabled={!isRunning}
          />
        </div>

        <div className="space-y-2">
          <div>
            <Label className="text-sm">Time: {timeElapsed.toFixed(1)}s</Label>
          </div>
          
          <div>
            <Label className="text-sm">Speed: {speedKmh.toFixed(1)} km/h</Label>
          </div>

          <div>
            <Label className="text-sm">Battery: {batteryPercent.toFixed(0)}%</Label>
            <Progress value={batteryPercent} className="mt-1" />
            <div className="text-xs text-muted-foreground mt-1">
              {battery.currentCharge.toFixed(0)} / {battery.capacity} mAh
            </div>
          </div>

          <div>
            <Label className="text-sm">Current Draw: {battery.dischargeCurrent.toFixed(2)}A</Label>
          </div>

          <div>
            <Label className="text-sm">Position</Label>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>X: {rigidBody.position.x.toFixed(2)} m</div>
              <div>Y: {rigidBody.position.y.toFixed(2)} m</div>
              <div>Z: {rigidBody.position.z.toFixed(2)} m</div>
            </div>
          </div>

          <div>
            <Label className="text-sm">Velocity</Label>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>X: {rigidBody.velocity.x.toFixed(2)} m/s</div>
              <div>Y: {rigidBody.velocity.y.toFixed(2)} m/s</div>
              <div>Z: {rigidBody.velocity.z.toFixed(2)} m/s</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationEngine;
