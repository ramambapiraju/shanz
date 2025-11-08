import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Send, Lightbulb, Bug, BookOpen, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIAssistantProps {
  code: string;
  circuit: any[];
}

export const AIAssistant = ({ code, circuit }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (type: "suggest" | "debug" | "explain" | "optimize", customPrompt?: string) => {
    setLoading(true);
    setResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke("arduino-ai-assistant", {
        body: {
          type,
          prompt: customPrompt || prompt,
          code: type !== "suggest" ? code : undefined,
          circuit: circuit.length > 0 ? circuit : undefined,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to get AI response");
        return;
      }

      setResponse(data.response);
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast.error("Failed to connect to AI assistant");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      type: "suggest" as const,
      label: "💡 Get Project Ideas",
      icon: Lightbulb,
      prompt: "Give me 5 creative Arduino project ideas based on my skill level and available components. Include difficulty level and learning benefits for each.",
    },
    {
      type: "suggest" as const,
      label: "📋 15 DIY Projects",
      icon: Lightbulb,
      prompt: "Show me all 15 DIY electronics projects (10 basic + 5 advanced) with detailed circuit diagrams and component lists",
    },
    {
      type: "explain" as const,
      label: "Circuit Diagram",
      icon: BookOpen,
      prompt: "Explain the circuit diagram for my current project with wiring details",
    },
    {
      type: "debug" as const,
      label: "Debug Code",
      icon: Bug,
      prompt: "Help me debug this Arduino code and fix any issues",
    },
    {
      type: "optimize" as const,
      label: "Improve Project",
      icon: Zap,
      prompt: "Suggest improvements and optimizations for this project",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>
          Get help with your Arduino projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="quick">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Actions</TabsTrigger>
            <TabsTrigger value="custom">Custom Query</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.type}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => askAI(action.type, action.prompt)}
                  disabled={loading}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-2">
            <Textarea
              placeholder="Ask anything about Arduino, your code, or circuit design..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => askAI("explain")}
              disabled={loading || !prompt}
              className="w-full gap-2"
            >
              <Send className="h-4 w-4" />
              Ask AI
            </Button>
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {response && (
          <ScrollArea className="h-[300px] rounded-lg border p-4 bg-muted/50">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {response}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};