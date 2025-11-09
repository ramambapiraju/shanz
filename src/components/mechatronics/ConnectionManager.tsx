import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cable, Trash2, Link2 } from "lucide-react";
import { MechanicalComponent } from "./MechanicalComponent";
import { toast } from "sonner";

interface ConnectionManagerProps {
  components: MechanicalComponent[];
  selectedComponent: string | null;
  onUpdateComponent: (component: MechanicalComponent) => void;
}

const ConnectionManager = ({ 
  components, 
  selectedComponent,
  onUpdateComponent 
}: ConnectionManagerProps) => {
  const selected = components.find(c => c.id === selectedComponent);

  const handleConnect = (targetId: string) => {
    if (!selected) return;
    
    if (selected.connections.includes(targetId)) {
      toast.error("Components already connected");
      return;
    }

    // Update selected component connections
    const updated = {
      ...selected,
      connections: [...selected.connections, targetId],
    };
    onUpdateComponent(updated);

    // Update target component connections (bidirectional)
    const target = components.find(c => c.id === targetId);
    if (target && !target.connections.includes(selected.id)) {
      onUpdateComponent({
        ...target,
        connections: [...target.connections, selected.id],
      });
    }

    toast.success("Components connected");
  };

  const handleDisconnect = (targetId: string) => {
    if (!selected) return;

    // Update selected component
    const updated = {
      ...selected,
      connections: selected.connections.filter(id => id !== targetId),
    };
    onUpdateComponent(updated);

    // Update target component
    const target = components.find(c => c.id === targetId);
    if (target) {
      onUpdateComponent({
        ...target,
        connections: target.connections.filter(id => id !== selected.id),
      });
    }

    toast.success("Connection removed");
  };

  if (!selected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cable className="h-5 w-5" />
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a component to manage connections
          </p>
        </CardContent>
      </Card>
    );
  }

  const availableComponents = components.filter(c => 
    c.id !== selected.id && !selected.connections.includes(c.id)
  );

  const connectedComponents = components.filter(c => 
    selected.connections.includes(c.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Cable className="h-5 w-5" />
          Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Selected Component</div>
          <Badge variant="outline" className="w-full justify-start">
            {selected.name}
          </Badge>
        </div>

        {connectedComponents.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Connected To</div>
            <div className="space-y-2">
              {connectedComponents.map(comp => (
                <div 
                  key={comp.id}
                  className="flex items-center justify-between p-2 rounded border bg-muted/50"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="h-3 w-3" />
                    {comp.name}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDisconnect(comp.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableComponents.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Available Components</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {availableComponents.map(comp => (
                <Button
                  key={comp.id}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => handleConnect(comp.id)}
                >
                  <Cable className="h-3 w-3 mr-2" />
                  {comp.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {availableComponents.length === 0 && connectedComponents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No other components to connect
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionManager;
