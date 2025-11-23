import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Gauge, TrendingUp } from "lucide-react";
import { Battery, Motor } from "@/utils/physicsEngine";
import { Progress } from "@/components/ui/progress";

interface PerformanceAnalyticsProps {
  battery: Battery;
  totalCurrent: number;
  speedKmh: number;
  efficiency: number;
  powerConsumption: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  battery,
  totalCurrent,
  speedKmh,
  efficiency,
  powerConsumption,
}) => {
  const batteryPercent = (battery.currentCharge / battery.capacity) * 100;
  const estimatedRuntime = totalCurrent > 0 
    ? (battery.currentCharge / totalCurrent) * 60 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="font-medium">Speed</span>
            </div>
            <div className="text-2xl font-bold">{speedKmh.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Power</span>
            </div>
            <div className="text-2xl font-bold">{powerConsumption.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Watts</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">Efficiency</span>
            </div>
            <div className="text-2xl font-bold">{efficiency.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">%</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Runtime</span>
            </div>
            <div className="text-2xl font-bold">{estimatedRuntime.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Battery Health</span>
            <span className="font-medium">{batteryPercent.toFixed(0)}%</span>
          </div>
          <Progress value={batteryPercent} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Draw</span>
            <span className="font-medium">{totalCurrent.toFixed(2)} A</span>
          </div>
          <Progress 
            value={(totalCurrent / 20) * 100} 
            className="h-2" 
          />
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <div className="flex justify-between">
            <span>Energy Used:</span>
            <span>{((battery.capacity - battery.currentCharge) / 1000).toFixed(2)} Ah</span>
          </div>
          <div className="flex justify-between">
            <span>Voltage:</span>
            <span>{battery.currentVoltage.toFixed(2)} V</span>
          </div>
          <div className="flex justify-between">
            <span>Cell Count:</span>
            <span>{battery.cellCount}S</span>
          </div>
          <div className="flex justify-between">
            <span>C-Rating:</span>
            <span>{battery.cRating}C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalytics;
