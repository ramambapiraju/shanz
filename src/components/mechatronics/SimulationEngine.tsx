import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Settings, Keyboard } from "lucide-react";
import { useState, useEffect } from "react";
import { MechanicalComponent } from "./MechanicalComponent";
import { isWheelComponent, isPropellerComponent, isMotorComponent, isESCComponent, isChassisComponent, isBatteryComponent, isAnyMotorType } from "./ComponentCategories";
import { 
  RigidBody, 
  updateRigidBody, 
  Force, 
  calculateMotorTorque,
  calculatePropellerThrust,
  calculateDrag,
  vecScale,
  vecSub,
  GRAVITY,
  Battery,
  updateBattery,
  Motor,
  PIDController,
  updatePID,
  resolveGroundCollision,
  calculateBuoyancy,
  calculateWaterDrag,
  calculateWaveForce
} from "@/utils/physicsEngine";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { Badge } from "@/components/ui/badge";
import PIDTuningPanel from "./PIDTuningPanel";
import FlightRecorder from "./FlightRecorder";
import PerformanceAnalytics from "./PerformanceAnalytics";

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

  // PID Controllers for stability (Phase 3)
  const [pidX, setPidX] = useState<PIDController>({
    kp: 1.5, ki: 0.05, kd: 0.5, integral: 0, previousError: 0
  });
  const [pidY, setPidY] = useState<PIDController>({
    kp: 2.0, ki: 0.1, kd: 0.8, integral: 0, previousError: 0
  });
  const [pidZ, setPidZ] = useState<PIDController>({
    kp: 1.5, ki: 0.05, kd: 0.5, integral: 0, previousError: 0
  });

  // Flight recorder (Phase 3)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState<RigidBody[]>([]);
  const [isPlayback, setIsPlayback] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  // Performance metrics (Phase 3)
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [efficiency, setEfficiency] = useState(100);
  const [powerConsumption, setPowerConsumption] = useState(0);

  // Handle keyboard controls - update continuously
  useEffect(() => {
    if (!isRunning) return;
    
    const updateControls = () => {
      // Update throttle based on keyboard
      if (keyboardControls.throttleUp || keyboardControls.forward) {
        setThrottle((prev) => Math.min(1, prev + 0.02));
      }
      if (keyboardControls.throttleDown || keyboardControls.backward) {
        setThrottle((prev) => Math.max(0, prev - 0.02));
      }
      
      // Update steering based on keyboard
      if (keyboardControls.left) {
        setSteering((prev) => Math.max(-1, prev - 0.05));
      } else if (keyboardControls.right) {
        setSteering((prev) => Math.min(1, prev + 0.05));
      } else {
        // Return to center
        setSteering((prev) => Math.abs(prev) < 0.05 ? 0 : prev * 0.9);
      }
    };

    // Update at 60fps
    const interval = setInterval(updateControls, 16);
    return () => clearInterval(interval);
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

      // Motor/Propeller thrust and steering
      const hasWheels = components.some(c => isWheelComponent(c.type));
      const hasPropellers = components.some(c => isPropellerComponent(c.type));
      
      components.forEach((comp) => {
        if (isPropellerComponent(comp.type)) {
          const thrust = calculatePropellerThrust({
            diameter: comp.properties.diameter,
            pitch: comp.properties.pitch,
            thrustCoefficient: comp.properties.thrustCoefficient,
            powerCoefficient: comp.properties.powerCoefficient,
            rpm: 8000 * throttle,
          });

          // Apply thrust based on position (for drones, forward for boats/planes)
          if (hasPropellers && !hasWheels) {
            // Drone - vertical thrust
            forces.push({
              vector: { x: 0, y: thrust, z: 0 },
              point: comp.position,
            });
          } else {
            // Boat/plane - forward thrust
            forces.push({
              vector: { x: 0, y: 0, z: thrust },
              point: comp.position,
            });
          }
        }

        if (isMotorComponent(comp.type)) {
          const current = (comp.properties.voltage / comp.properties.resistance) * throttle;
          totalCurrent += current;
          
          // For wheeled vehicles, apply forward/backward force
          if (hasWheels && throttle > 0) {
            const motorForce = throttle * 15; // N
            forces.push({
              vector: { x: 0, y: 0, z: motorForce },
              point: comp.position,
            });
          }
        }

        if (isESCComponent(comp.type)) {
          totalCurrent += 0.1;
        }
      });

      // Apply steering forces for wheeled vehicles
      if (hasWheels && Math.abs(steering) > 0.01) {
        const steeringForce = steering * 5; // Lateral force
        forces.push({
          vector: { x: steeringForce, y: 0, z: 0 },
          point: { x: 0, y: 0, z: 1 }, // Front of vehicle
        });
      }

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

      // Buoyancy for boats (Phase 3)
      const hasBoat = hasPropellers && !hasWheels;
      if (hasBoat && rigidBody.position.y < 0.2) {
        const submergedVolume = 0.05; // m³
        const buoyancy = calculateBuoyancy(submergedVolume);
        forces.push({ vector: buoyancy, point: { x: 0, y: 0, z: 0 } });

        const waterDrag = calculateWaterDrag(rigidBody.velocity);
        forces.push({ vector: waterDrag, point: { x: 0, y: 0, z: 0 } });

        const waveForce = calculateWaveForce(rigidBody.position, timeElapsed);
        forces.push({ vector: waveForce, point: { x: 0, y: 0, z: 0 } });
      }

      // Update physics
      let newBody = updateRigidBody({
        ...rigidBody,
        mass: totalMass,
      }, forces, deltaTime);

      // Ground collision (Phase 3)
      newBody = resolveGroundCollision(newBody, 0.5);

      // Apply PID control for drones (Phase 3)
      if (hasPropellers && !hasWheels && isRunning) {
        const targetAltitude = 2; // meters
        const altitudeError = targetAltitude - newBody.position.y;
        const pidResult = updatePID(pidY, altitudeError, deltaTime);
        setPidY(pidResult.pid);
        // Apply PID output as additional force (simplified)
      }

      // Update battery
      const newBattery = updateBattery(battery, totalCurrent, deltaTime);

      // Update metrics (Phase 3)
      setTotalCurrent(totalCurrent);
      const power = totalCurrent * newBattery.voltage;
      setPowerConsumption(power);
      const theoreticalPower = totalMass * GRAVITY * Math.abs(rigidBody.velocity.y);
      setEfficiency(theoreticalPower > 0 ? Math.min(100, (theoreticalPower / power) * 100) : 100);

      setRigidBody(newBody);
      setBattery(newBattery);
      setTimeElapsed((t) => {
        const newTime = t + deltaTime;
        onSimulationStateChange?.(newTime, true);
        return newTime;
      });

      // Record flight path (Phase 3)
      if (isRecording) {
        setRecordedPath((prev) => [...prev, newBody]);
      }

      // Update component positions based on simulation (use delta to avoid drift)
      const deltaPos = vecSub(newBody.position, rigidBody.position);
      const updatedComponents = components.map((comp) => ({
        ...comp,
        position: {
          x: comp.position.x + deltaPos.x,
          y: comp.position.y + deltaPos.y,
          z: comp.position.z + deltaPos.z,
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

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedPath([]);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handlePlayback = () => {
    // Implement playback logic
    setIsPlayback(true);
    setPlaybackIndex(0);
  };

  const handleDownloadPath = () => {
    const data = JSON.stringify(recordedPath, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight-path-${Date.now()}.json`;
    a.click();
  };

  const resetPID = () => {
    setPidX({ kp: 1.5, ki: 0.05, kd: 0.5, integral: 0, previousError: 0 });
    setPidY({ kp: 2.0, ki: 0.1, kd: 0.8, integral: 0, previousError: 0 });
    setPidZ({ kp: 1.5, ki: 0.05, kd: 0.5, integral: 0, previousError: 0 });
  };

  return (
    <div className="space-y-4">
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

    <PIDTuningPanel
      pidX={pidX}
      pidY={pidY}
      pidZ={pidZ}
      onUpdatePID={(axis, pid) => {
        if (axis === 'x') setPidX(pid);
        else if (axis === 'y') setPidY(pid);
        else setPidZ(pid);
      }}
      onReset={resetPID}
    />

    <FlightRecorder
      isRecording={isRecording}
      recordedPath={recordedPath}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onPlayback={handlePlayback}
      onDownload={handleDownloadPath}
    />

    <PerformanceAnalytics
      battery={battery}
      totalCurrent={totalCurrent}
      speedKmh={speedKmh}
      efficiency={efficiency}
      powerConsumption={powerConsumption}
    />
    </div>
  );
};

export default SimulationEngine;
