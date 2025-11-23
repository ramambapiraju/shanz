import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  TransferFunction, 
  createMotorTransferFunction, 
  createPIDTransferFunction,
  calculateBodeData,
  calculateStepResponse,
  analyzeStability 
} from "@/utils/controlTheory";
import BodePlot from "./BodePlot";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calculator, Zap, TrendingUp } from "lucide-react";

const TransferFunctionDesigner = () => {
  const [systemType, setSystemType] = useState<string>("motor");
  const [transferFunction, setTransferFunction] = useState<TransferFunction | null>(null);
  
  // Motor parameters
  const [motorJ, setMotorJ] = useState(0.01);
  const [motorB, setMotorB] = useState(0.1);
  const [motorK, setMotorK] = useState(0.01);
  const [motorR, setMotorR] = useState(1.0);
  const [motorL, setMotorL] = useState(0.5);
  
  // PID parameters
  const [pidKp, setPidKp] = useState(1.0);
  const [pidKi, setPidKi] = useState(0.1);
  const [pidKd, setPidKd] = useState(0.05);

  const handleGenerateSystem = () => {
    let tf: TransferFunction;
    
    if (systemType === "motor") {
      tf = createMotorTransferFunction(motorJ, motorB, motorK, motorR, motorL);
    } else if (systemType === "pid") {
      tf = createPIDTransferFunction(pidKp, pidKi, pidKd);
    } else {
      // Custom transfer function
      tf = {
        numerator: [1],
        denominator: [1, 2, 1],
        name: "Custom System",
      };
    }
    
    setTransferFunction(tf);
  };

  const stability = transferFunction ? analyzeStability(transferFunction) : null;
  const bodeData = transferFunction ? calculateBodeData(transferFunction) : null;
  const stepResponse = transferFunction ? calculateStepResponse(transferFunction, 5, 300) : null;

  const stepData = stepResponse ? stepResponse.time.map((t, i) => ({
    time: t,
    output: stepResponse.output[i],
  })) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Transfer Function Designer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>System Type</Label>
            <Select value={systemType} onValueChange={setSystemType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">DC Motor Model</SelectItem>
                <SelectItem value="pid">PID Controller</SelectItem>
                <SelectItem value="custom">Custom TF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={systemType} className="w-full">
            <TabsContent value="motor" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="motorJ">Inertia (J)</Label>
                  <Input
                    id="motorJ"
                    type="number"
                    step="0.001"
                    value={motorJ}
                    onChange={(e) => setMotorJ(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motorB">Damping (b)</Label>
                  <Input
                    id="motorB"
                    type="number"
                    step="0.01"
                    value={motorB}
                    onChange={(e) => setMotorB(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motorK">Motor Constant (K)</Label>
                  <Input
                    id="motorK"
                    type="number"
                    step="0.001"
                    value={motorK}
                    onChange={(e) => setMotorK(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motorR">Resistance (R)</Label>
                  <Input
                    id="motorR"
                    type="number"
                    step="0.1"
                    value={motorR}
                    onChange={(e) => setMotorR(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motorL">Inductance (L)</Label>
                  <Input
                    id="motorL"
                    type="number"
                    step="0.01"
                    value={motorL}
                    onChange={(e) => setMotorL(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pid" className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="pidKp">Proportional (Kp)</Label>
                  <Input
                    id="pidKp"
                    type="number"
                    step="0.1"
                    value={pidKp}
                    onChange={(e) => setPidKp(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="pidKi">Integral (Ki)</Label>
                  <Input
                    id="pidKi"
                    type="number"
                    step="0.01"
                    value={pidKi}
                    onChange={(e) => setPidKi(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="pidKd">Derivative (Kd)</Label>
                  <Input
                    id="pidKd"
                    type="number"
                    step="0.01"
                    value={pidKd}
                    onChange={(e) => setPidKd(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleGenerateSystem} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Generate & Analyze
          </Button>

          {transferFunction && stability && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium">System Analysis</span>
                <Badge variant={stability.stable ? "default" : "destructive"}>
                  {stability.message}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Transfer Function:</strong></p>
                <div className="font-mono text-xs bg-background p-2 rounded">
                  Num: [{transferFunction.numerator.map(n => n.toFixed(4)).join(', ')}]<br />
                  Den: [{transferFunction.denominator.map(d => d.toFixed(4)).join(', ')}]
                </div>
                <p><strong>Poles:</strong></p>
                {stability.poles.map((pole, i) => (
                  <div key={i} className="text-xs">
                    s{i + 1} = {pole.real.toFixed(3)} {pole.imag !== 0 ? `± ${Math.abs(pole.imag).toFixed(3)}j` : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {transferFunction && bodeData && (
        <BodePlot bodeData={bodeData} title="Frequency Response Analysis" />
      )}

      {transferFunction && stepData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Step Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis
                  label={{ value: 'Output', angle: -90, position: 'insideLeft' }}
                  stroke="hsl(var(--foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <ReferenceLine y={1} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label="Setpoint" />
                <Line
                  type="monotone"
                  dataKey="output"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Step response shows the system's output when given a unit step input.</p>
              <p>Analyze overshoot, settling time, and steady-state error.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransferFunctionDesigner;
