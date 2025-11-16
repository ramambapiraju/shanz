import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Block {
  id: string;
  type: "setup" | "loop" | "pinMode" | "digitalWrite" | "delay" | "digitalRead" | "analogRead" | "if" | "serial";
  params: Record<string, any>;
}

interface BlockCodeEditorProps {
  onCodeGenerated: (code: string) => void;
}

export const BlockCodeEditor = ({ onCodeGenerated }: BlockCodeEditorProps) => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "setup", params: {} },
    { id: "2", type: "loop", params: {} }
  ]);

  const blockTemplates = [
    { type: "pinMode", label: "Set Pin Mode", icon: "📌", params: { pin: "13", mode: "OUTPUT" } },
    { type: "digitalWrite", label: "Digital Write", icon: "💡", params: { pin: "13", value: "HIGH" } },
    { type: "delay", label: "Delay", icon: "⏱️", params: { ms: "1000" } },
    { type: "digitalRead", label: "Digital Read", icon: "📥", params: { pin: "2" } },
    { type: "analogRead", label: "Analog Read", icon: "📊", params: { pin: "A0" } },
    { type: "if", label: "If Condition", icon: "🔀", params: { condition: "true" } },
    { type: "serial", label: "Serial Print", icon: "💬", params: { text: "Hello" } }
  ];

  const addBlock = (template: any) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: template.type as any,
      params: { ...template.params }
    };
    setBlocks([...blocks, newBlock]);
    toast.success(`Added ${template.label} block`);
  };

  const removeBlock = (id: string) => {
    if (id === "1" || id === "2") {
      toast.error("Cannot remove setup or loop blocks");
      return;
    }
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlockParam = (id: string, param: string, value: string) => {
    setBlocks(blocks.map(b => 
      b.id === id ? { ...b, params: { ...b.params, [param]: value } } : b
    ));
  };

  const generateCode = () => {
    let setupCode = "";
    let loopCode = "";
    let currentSection = "setup";

    blocks.forEach(block => {
      let code = "";
      
      switch (block.type) {
        case "setup":
          currentSection = "setup";
          setupCode += "  Serial.begin(9600);\n";
          break;
        case "loop":
          currentSection = "loop";
          break;
        case "pinMode":
          code = `  pinMode(${block.params.pin}, ${block.params.mode});\n`;
          break;
        case "digitalWrite":
          code = `  digitalWrite(${block.params.pin}, ${block.params.value});\n`;
          break;
        case "delay":
          code = `  delay(${block.params.ms});\n`;
          break;
        case "digitalRead":
          code = `  int val = digitalRead(${block.params.pin});\n`;
          break;
        case "analogRead":
          code = `  int val = analogRead(${block.params.pin});\n`;
          break;
        case "if":
          code = `  if (${block.params.condition}) {\n    // Add your code here\n  }\n`;
          break;
        case "serial":
          code = `  Serial.println("${block.params.text}");\n`;
          break;
      }

      if (currentSection === "setup" && code) {
        setupCode += code;
      } else if (currentSection === "loop" && code) {
        loopCode += code;
      }
    });

    const fullCode = `// Generated from Block Editor\n\nvoid setup() {\n${setupCode}}\n\nvoid loop() {\n${loopCode}}`;
    onCodeGenerated(fullCode);
    toast.success("Code generated successfully!");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Block Code Editor
            </CardTitle>
            <CardDescription>
              Drag blocks to build your Arduino code
            </CardDescription>
          </div>
          <Button size="sm" onClick={generateCode}>
            <Play className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex gap-4 min-h-0">
        {/* Block Palette */}
        <div className="w-48 border rounded-lg p-3 overflow-y-auto space-y-2">
          <h3 className="font-semibold text-sm mb-2">Block Palette</h3>
          {blockTemplates.map((template, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => addBlock(template)}
            >
              <span className="mr-2">{template.icon}</span>
              {template.label}
            </Button>
          ))}
        </div>

        {/* Block Canvas */}
        <div className="flex-1 border rounded-lg p-4 overflow-y-auto space-y-3 bg-muted/20">
          <h3 className="font-semibold mb-2">Your Program</h3>
          {blocks.map((block) => (
            <div
              key={block.id}
              className="bg-card border-2 border-primary/20 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm capitalize">
                  {block.type === "pinMode" && "📌 Set Pin Mode"}
                  {block.type === "digitalWrite" && "💡 Digital Write"}
                  {block.type === "delay" && "⏱️ Delay"}
                  {block.type === "digitalRead" && "📥 Digital Read"}
                  {block.type === "analogRead" && "📊 Analog Read"}
                  {block.type === "if" && "🔀 If Condition"}
                  {block.type === "serial" && "💬 Serial Print"}
                  {block.type === "setup" && "🔧 Setup"}
                  {block.type === "loop" && "🔄 Loop"}
                </span>
                {block.id !== "1" && block.id !== "2" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.id)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
              
              {block.type !== "setup" && block.type !== "loop" && (
                <div className="space-y-2">
                  {Object.entries(block.params).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="text-xs font-medium capitalize">{key}:</label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => updateBlockParam(block.id, key, e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
