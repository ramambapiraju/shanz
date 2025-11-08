import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface LiveSuggestionsProps {
  circuit: any[];
  isRunning: boolean;
}

export const LiveSuggestions = ({ circuit, isRunning }: LiveSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Array<{ type: 'info' | 'warning' | 'success'; message: string }>>([]);

  useEffect(() => {
    const newSuggestions: Array<{ type: 'info' | 'warning' | 'success'; message: string }> = [];

    if (circuit.length === 0) {
      newSuggestions.push({
        type: 'info',
        message: '💡 Start by selecting a project template or add components from the library'
      });
      setSuggestions(newSuggestions);
      return;
    }

    const hasArduino = circuit.some(c => c.type === 'arduino');
    const hasLED = circuit.some(c => c.type.includes('led'));
    const hasResistor = circuit.some(c => c.type.includes('resistor'));
    const hasPowerSource = circuit.some(c => c.type.includes('battery') || c.type === 'arduino');
    const hasSensor = circuit.some(c => c.type === 'ldr' || c.type === 'pir-sensor' || c.type === 'dht11' || c.type === 'ultrasonic');
    const hasOutput = circuit.some(c => c.type === 'buzzer' || c.type === 'dc-motor' || c.type === 'servo' || c.type.includes('led'));

    // Check for Arduino
    if (!hasArduino) {
      newSuggestions.push({
        type: 'warning',
        message: '⚠️ Add an Arduino board to control your circuit'
      });
    } else {
      newSuggestions.push({
        type: 'success',
        message: '✅ Arduino board detected - Your controller is ready!'
      });
    }

    // LED without resistor warning
    if (hasLED && !hasResistor) {
      newSuggestions.push({
        type: 'warning',
        message: '⚠️ LEDs need resistors (220Ω-1KΩ) to prevent damage'
      });
    }

    // Sensor projects
    if (hasSensor && hasOutput) {
      newSuggestions.push({
        type: 'success',
        message: '🎯 Great! You have sensors + outputs for an interactive project'
      });
    }

    // Power source check
    if (!hasPowerSource && circuit.length > 2) {
      newSuggestions.push({
        type: 'warning',
        message: '🔋 Your circuit needs a power source (Arduino or battery)'
      });
    }

    // Running suggestions
    if (isRunning) {
      newSuggestions.push({
        type: 'info',
        message: '🎮 Simulation active! Use interactive controls to test sensors'
      });
    } else if (circuit.length >= 3) {
      newSuggestions.push({
        type: 'info',
        message: '▶️ Circuit looks good! Click RUN to test your project'
      });
    }

    // Component count feedback
    if (circuit.length >= 5 && circuit.length < 10) {
      newSuggestions.push({
        type: 'success',
        message: '📦 Nice complexity! You\'re building an intermediate project'
      });
    } else if (circuit.length >= 10) {
      newSuggestions.push({
        type: 'success',
        message: '🚀 Advanced circuit detected! This is a complex project'
      });
    }

    setSuggestions(newSuggestions);
  }, [circuit, isRunning]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500 animate-pulse" />
          Live Build Assistant
          <Badge variant="secondary" className="ml-auto">Real-time</Badge>
        </CardTitle>
        <CardDescription>
          Smart suggestions as you build your circuit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {suggestions.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Add components to get real-time suggestions
              </AlertDescription>
            </Alert>
          ) : (
            suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2">
                <div className="flex items-start gap-2">
                  {getIcon(suggestion.type)}
                  <AlertDescription className="text-sm leading-relaxed">
                    {suggestion.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
