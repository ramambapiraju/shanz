import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SimulationData } from "@/pages/MechatronicsSimulator";

interface DataChartsProps {
  data: SimulationData;
}

export const DataCharts = ({ data }: DataChartsProps) => {
  const chartData = data.time.map((t, i) => ({
    time: t.toFixed(2),
    position: data.position[i]?.toFixed(3) || 0,
    velocity: data.velocity[i]?.toFixed(3) || 0,
    current: data.current[i]?.toFixed(3) || 0,
    voltage: data.voltage[i]?.toFixed(3) || 0,
  }));

  const hasData = data.time.length > 0;

  return (
    <div className="h-full p-4">
      <Tabs defaultValue="position" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-2">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="voltage">Voltage</TabsTrigger>
        </TabsList>

        {!hasData ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Run simulation to see data visualization
          </div>
        ) : (
          <>
            <TabsContent value="position" className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    label={{ value: 'Position (rad)', angle: -90, position: 'insideLeft' }}
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="velocity" className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    label={{ value: 'Velocity (rad/s)', angle: -90, position: 'insideLeft' }}
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="velocity" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="current" className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }}
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="voltage" className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="voltage" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
