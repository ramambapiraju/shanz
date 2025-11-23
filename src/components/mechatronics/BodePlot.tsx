import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { BodeData } from "@/utils/controlTheory";

interface BodePlotProps {
  bodeData: BodeData;
  title?: string;
}

const BodePlot = ({ bodeData, title = "Bode Plot" }: BodePlotProps) => {
  // Prepare data for magnitude plot
  const magnitudeData = bodeData.frequency.map((freq, i) => ({
    frequency: freq,
    magnitude: bodeData.magnitudeDB[i],
  }));

  // Prepare data for phase plot
  const phaseData = bodeData.frequency.map((freq, i) => ({
    frequency: freq,
    phase: bodeData.phaseDeg[i],
  }));

  const formatFrequency = (value: number) => {
    if (value >= 1) return value.toFixed(0);
    return value.toFixed(2);
  };

  const isStable = bodeData.phaseMargin > 0 && bodeData.gainMargin > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={isStable ? "default" : "destructive"}>
              {isStable ? "Stable" : "Unstable"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stability Margins */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Gain Margin</div>
            <div className="font-semibold text-lg">
              {bodeData.gainMargin.toFixed(1)} dB
            </div>
            <div className="text-xs text-muted-foreground">
              @ {bodeData.phaseCrossover.toFixed(2)} rad/s
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Phase Margin</div>
            <div className="font-semibold text-lg">
              {bodeData.phaseMargin.toFixed(1)}°
            </div>
            <div className="text-xs text-muted-foreground">
              @ {bodeData.gainCrossover.toFixed(2)} rad/s
            </div>
          </div>
        </div>

        {/* Magnitude Plot */}
        <div>
          <h4 className="text-sm font-medium mb-2">Magnitude (dB)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={magnitudeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="frequency"
                scale="log"
                domain={['auto', 'auto']}
                tickFormatter={formatFrequency}
                label={{ value: 'Frequency (rad/s)', position: 'insideBottom', offset: -5 }}
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                label={{ value: 'Magnitude (dB)', angle: -90, position: 'insideLeft' }}
                stroke="hsl(var(--foreground))"
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} dB`, 'Magnitude']}
                labelFormatter={(label) => `ω = ${Number(label).toFixed(2)} rad/s`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="magnitude"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Phase Plot */}
        <div>
          <h4 className="text-sm font-medium mb-2">Phase (degrees)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={phaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="frequency"
                scale="log"
                domain={['auto', 'auto']}
                tickFormatter={formatFrequency}
                label={{ value: 'Frequency (rad/s)', position: 'insideBottom', offset: -5 }}
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                label={{ value: 'Phase (deg)', angle: -90, position: 'insideLeft' }}
                stroke="hsl(var(--foreground))"
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}°`, 'Phase']}
                labelFormatter={(label) => `ω = ${Number(label).toFixed(2)} rad/s`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <ReferenceLine y={-180} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="phase"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretation */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
          <p><strong>Gain Margin:</strong> Additional gain before instability ({bodeData.gainMargin > 6 ? 'Good' : 'Low'})</p>
          <p><strong>Phase Margin:</strong> Phase lag before instability ({bodeData.phaseMargin > 45 ? 'Good' : bodeData.phaseMargin > 30 ? 'Acceptable' : 'Poor'})</p>
          {!isStable && <p className="text-destructive"><strong>Warning:</strong> System may be unstable or poorly damped</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default BodePlot;
