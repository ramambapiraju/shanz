import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Cog, 
  Gauge, 
  Power, 
  Cpu, 
  Circle,
  Box,
  Link as LinkIcon
} from "lucide-react";

interface ComponentLibraryProps {
  onAddComponent: (type: string) => void;
}

const componentTypes = [
  { type: 'dc-motor', label: 'DC Motor', icon: Cog, description: 'Rotary electric motor' },
  { type: 'encoder', label: 'Encoder', icon: Gauge, description: 'Position/speed sensor' },
  { type: 'gear', label: 'Gear', icon: Cog, description: 'Mechanical gear system' },
  { type: 'wheel', label: 'Wheel', icon: Circle, description: 'Rotary wheel element' },
  { type: 'linkage', label: 'Linkage', icon: LinkIcon, description: 'Mechanical linkage' },
  { type: 'power-source', label: 'Power Source', icon: Power, description: 'Voltage/current source' },
  { type: 'controller', label: 'PID Controller', icon: Cpu, description: 'Control system' },
];

export const ComponentLibrary = ({ onAddComponent }: ComponentLibraryProps) => {
  return (
    <Card className="w-64 border-r border-border rounded-none flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Component Library</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag or click to add components
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {componentTypes.map(({ type, label, icon: Icon, description }) => (
            <Button
              key={type}
              variant="outline"
              className="w-full justify-start h-auto py-3 px-3"
              onClick={() => onAddComponent(type)}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Click components to configure parameters
        </p>
      </div>
    </Card>
  );
};
