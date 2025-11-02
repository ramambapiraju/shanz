import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface SerialMonitorProps {
  output: string[];
}

export const SerialMonitor = ({ output }: SerialMonitorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Serial Monitor
        </CardTitle>
        <CardDescription>
          View output from your Arduino
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-lg border bg-black/90 p-4 font-mono text-sm">
          {output.length === 0 ? (
            <div className="text-muted-foreground">
              No output yet. Run your simulation to see output...
            </div>
          ) : (
            <div className="space-y-1">
              {output.map((line, index) => (
                <div key={index} className="text-green-400">
                  {line}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};