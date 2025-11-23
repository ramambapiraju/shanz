import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  StateSpaceModel, 
  createDroneAltitudeModel,
  createQuadcopterModel,
  designLQR,
  identityMatrix
} from "@/utils/controlTheory";
import { Box, Layers, Sliders } from "lucide-react";

const StateSpaceDesigner = () => {
  const [modelType, setModelType] = useState<string>("altitude");
  const [stateSpace, setStateSpace] = useState<StateSpaceModel | null>(null);
  const [lqrGains, setLQRGains] = useState<number[][] | null>(null);
  
  // Model parameters
  const [mass, setMass] = useState(1.5);
  const [dragCoeff, setDragCoeff] = useState(0.1);
  
  // LQR weights
  const [qWeight1, setQWeight1] = useState(10);
  const [qWeight2, setQWeight2] = useState(1);
  const [rWeight, setRWeight] = useState(1);

  const handleGenerateModel = () => {
    let model: StateSpaceModel;
    
    if (modelType === "altitude") {
      model = createDroneAltitudeModel(mass, dragCoeff);
    } else if (modelType === "quadcopter") {
      model = createQuadcopterModel();
    } else {
      // Default model
      model = createDroneAltitudeModel(mass, dragCoeff);
    }
    
    setStateSpace(model);
    setLQRGains(null);
  };

  const handleDesignLQR = () => {
    if (!stateSpace) return;
    
    const n = stateSpace.A.length;
    const m = stateSpace.B[0].length;
    
    // Create Q and R matrices
    const Q = identityMatrix(n);
    Q[0][0] = qWeight1;
    Q[1][1] = qWeight2;
    
    const R = [[rWeight]];
    
    const controller = designLQR(stateSpace, Q, R);
    setLQRGains(controller.K);
  };

  const renderMatrix = (matrix: number[][], name: string) => (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">{name} Matrix</Label>
      <div className="font-mono text-xs bg-background p-2 rounded border">
        {matrix.map((row, i) => (
          <div key={i}>
            [{row.map(val => val.toFixed(4)).join(', ')}]
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            State-Space Model Designer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Model Type</Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="altitude">Drone Altitude Control</SelectItem>
                <SelectItem value="quadcopter">Quadcopter Roll/Pitch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {modelType === "altitude" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="mass">Mass (kg)</Label>
                <Input
                  id="mass"
                  type="number"
                  step="0.1"
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="drag">Drag Coefficient</Label>
                <Input
                  id="drag"
                  type="number"
                  step="0.01"
                  value={dragCoeff}
                  onChange={(e) => setDragCoeff(parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          <Button onClick={handleGenerateModel} className="w-full">
            <Layers className="w-4 h-4 mr-2" />
            Generate State-Space Model
          </Button>

          {stateSpace && (
            <div className="space-y-3 p-3 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium">System Matrices</span>
                <Badge>Order: {stateSpace.A.length}</Badge>
              </div>
              
              <div className="text-xs space-y-1 mb-2">
                <p><strong>States:</strong> {stateSpace.states.join(', ')}</p>
                <p><strong>Inputs:</strong> {stateSpace.inputs.join(', ')}</p>
                <p><strong>Outputs:</strong> {stateSpace.outputs.join(', ')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {renderMatrix(stateSpace.A, 'A')}
                {renderMatrix(stateSpace.B, 'B')}
                {renderMatrix(stateSpace.C, 'C')}
                {renderMatrix(stateSpace.D, 'D')}
              </div>

              <div className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                <p><strong>State-Space Representation:</strong></p>
                <p>dx/dt = Ax + Bu</p>
                <p>y = Cx + Du</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {stateSpace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders className="w-5 h-5" />
              LQR Controller Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="q1">Q[1,1] - State 1 Weight</Label>
                <Input
                  id="q1"
                  type="number"
                  step="1"
                  value={qWeight1}
                  onChange={(e) => setQWeight1(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="q2">Q[2,2] - State 2 Weight</Label>
                <Input
                  id="q2"
                  type="number"
                  step="0.1"
                  value={qWeight2}
                  onChange={(e) => setQWeight2(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="r">R - Control Weight</Label>
                <Input
                  id="r"
                  type="number"
                  step="0.1"
                  value={rWeight}
                  onChange={(e) => setRWeight(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <Button onClick={handleDesignLQR} className="w-full" variant="secondary">
              Calculate LQR Gains
            </Button>

            {lqrGains && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Controller Gains</span>
                  <Badge variant="outline">LQR Optimal</Badge>
                </div>
                {renderMatrix(lqrGains, 'K (Feedback Gain)')}
                <div className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                  <p><strong>Control Law:</strong> u = -Kx</p>
                  <p>Minimizes cost: J = ∫(x'Qx + u'Ru)dt</p>
                  <p className="mt-1">Higher Q weights → faster state response</p>
                  <p>Higher R weights → less aggressive control</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StateSpaceDesigner;
