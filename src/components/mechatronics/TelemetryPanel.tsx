import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { MechanicalComponent } from "./MechanicalComponent";
import { isChassisComponent, isBatteryComponent, isAnyMotorType } from "./ComponentCategories";

interface TelemetryPanelProps {
  components: MechanicalComponent[];
  time: number;
  isRunning: boolean;
}

interface TelemetryData {
  time: number;
  velocity: number;
  altitude: number;
  power: number;
  batteryVoltage: number;
}

const TelemetryPanel = ({ components, time, isRunning }: TelemetryPanelProps) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const maxDataPoints = 50;

  useEffect(() => {
    if (!isRunning) return;

    // Calculate current telemetry
    const chassis = components.find(c => isChassisComponent(c.type));
    const battery = components.find(c => isBatteryComponent(c.type));
    const motors = components.filter(c => isAnyMotorType(c.type));

    const avgAltitude = chassis ? chassis.position.y : 0;
    const totalPower = motors.reduce((sum, m) => {
      const torque = m.properties.maxTorque || 0;
      const rpm = m.properties.maxRPM || 0;
      return sum + (torque * rpm / 9.5488 * 0.5); // 50% throttle
    }, 0);

    const newDataPoint: TelemetryData = {
      time: parseFloat(time.toFixed(2)),
      velocity: Math.abs(avgAltitude * 2), // Simplified velocity calculation
      altitude: avgAltitude,
      power: totalPower,
      batteryVoltage: battery?.properties.voltage || 0,
    };

    setTelemetryData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-maxDataPoints);
    });
  }, [time, isRunning, components]);

  const resetData = () => {
    setTelemetryData([]);
  };

  useEffect(() => {
    if (!isRunning) {
      resetData();
    }
  }, [isRunning]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground text-xs">Velocity</div>
            <div className="font-mono font-semibold">
              {telemetryData[telemetryData.length - 1]?.velocity.toFixed(2) || "0.00"} m/s
            </div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground text-xs">Altitude</div>
            <div className="font-mono font-semibold">
              {telemetryData[telemetryData.length - 1]?.altitude.toFixed(2) || "0.00"} m
            </div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground text-xs">Power</div>
            <div className="font-mono font-semibold">
              {telemetryData[telemetryData.length - 1]?.power.toFixed(1) || "0.0"} W
            </div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground text-xs">Battery</div>
            <div className="font-mono font-semibold">
              {telemetryData[telemetryData.length - 1]?.batteryVoltage.toFixed(1) || "0.0"} V
            </div>
          </div>
        </div>

        {telemetryData.length > 1 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                  fontSize={10}
                />
                <YAxis fontSize={10} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="Velocity (m/s)"
                />
                <Line 
                  type="monotone" 
                  dataKey="altitude" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                  name="Altitude (m)"
                />
                <Line 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={false}
                  name="Power (W)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {telemetryData.length === 0 && (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            Press Play to start collecting telemetry data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelemetryPanel;
