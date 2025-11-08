import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SerialMonitorProps {
  output: string[];
  onClear?: () => void;
}

export const SerialMonitor = ({ output, onClear }: SerialMonitorProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [output]);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle>Serial Monitor</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>9600 baud</span>
            </div>
          </div>
          {output.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
        <CardDescription>
          Live output from Arduino serial port
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollRef} className="h-[250px] w-full rounded-lg border-2 border-primary/30 bg-slate-950/95 p-4 font-mono text-sm shadow-inner">
          {output.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-muted-foreground">
              <Terminal className="h-12 w-12 opacity-30" />
              <div>No output yet</div>
              <div className="text-xs">Run your simulation to see serial output...</div>
            </div>
          ) : (
            <div className="space-y-1">
              {output.map((line, index) => (
                <div 
                  key={index} 
                  className={`text-green-400 leading-relaxed animate-fade-in ${
                    line.includes('ERROR') || line.includes('⚠️') || line.includes('CLOSE') 
                      ? 'text-red-400 font-bold' 
                      : line.includes('✓') || line.includes('✅') 
                      ? 'text-emerald-400' 
                      : line.includes('──') 
                      ? 'text-cyan-400/50' 
                      : ''
                  }`}
                >
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