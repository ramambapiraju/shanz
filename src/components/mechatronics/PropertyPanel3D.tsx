import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MechanicalComponent } from "./MechanicalComponent";
import { Trash2, Settings } from "lucide-react";

interface PropertyPanel3DProps {
  component: MechanicalComponent | null;
  onUpdateComponent: (component: MechanicalComponent) => void;
  onDeleteComponent: () => void;
}

const PropertyPanel3D: React.FC<PropertyPanel3DProps> = ({
  component,
  onUpdateComponent,
  onDeleteComponent,
}) => {
  if (!component) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a component to view and edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateComponent({
      ...component,
      properties: {
        ...component.properties,
        [key]: value,
      },
    });
  };

  const updatePosition = (axis: "x" | "y" | "z", value: number) => {
    onUpdateComponent({
      ...component,
      position: {
        ...component.position,
        [axis]: value,
      },
    });
  };

  const updateRotation = (axis: "x" | "y" | "z", value: number) => {
    onUpdateComponent({
      ...component,
      rotation: {
        ...component.rotation,
        [axis]: (value * Math.PI) / 180, // convert degrees to radians
      },
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {component.name}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteComponent}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Position (m)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                step="0.1"
                value={component.position.x.toFixed(2)}
                onChange={(e) => updatePosition("x", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                step="0.1"
                value={component.position.y.toFixed(2)}
                onChange={(e) => updatePosition("y", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="text-xs">Z</Label>
              <Input
                type="number"
                step="0.1"
                value={component.position.z.toFixed(2)}
                onChange={(e) => updatePosition("z", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Rotation (°)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                step="15"
                value={((component.rotation.x * 180) / Math.PI).toFixed(0)}
                onChange={(e) => updateRotation("x", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                step="15"
                value={((component.rotation.y * 180) / Math.PI).toFixed(0)}
                onChange={(e) => updateRotation("y", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="text-xs">Z</Label>
              <Input
                type="number"
                step="15"
                value={((component.rotation.z * 180) / Math.PI).toFixed(0)}
                onChange={(e) => updateRotation("z", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Component-specific properties */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Properties</Label>
          <div className="space-y-2">
            {Object.entries(component.properties).map(([key, value]) => (
              <div key={key}>
                <Label className="text-xs capitalize">
                  {key.replace(/_/g, " ")}
                </Label>
                <Input
                  type={typeof value === "number" ? "number" : "text"}
                  step={typeof value === "number" ? "0.01" : undefined}
                  value={value}
                  onChange={(e) => {
                    const newValue = typeof value === "number" 
                      ? parseFloat(e.target.value) || 0 
                      : e.target.value;
                    updateProperty(key, newValue);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPanel3D;
