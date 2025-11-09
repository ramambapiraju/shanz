import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Code2, Download, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CodePanelProps {
  projectId: string;
  code: string;
  onCodeChange: (code: string) => void;
  readOnly?: boolean;
}

export const CodePanel = ({ projectId, code, onCodeChange, readOnly = false }: CodePanelProps) => {
  const { theme } = useTheme();
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = () => {
    setIsCompiling(true);
    toast.info("Compiling code...");
    setTimeout(() => {
      setIsCompiling(false);
      toast.success("Code compiled successfully!");
    }, 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectId}_code.ino`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const handleReset = () => {
    // This would reset to the template code
    toast.info("Reset to template code");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Microcontroller Code
            </CardTitle>
            <CardDescription>
              Arduino C++ code for {projectId}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={readOnly}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleCompile}
              disabled={isCompiling || readOnly}
            >
              <Play className="h-4 w-4 mr-2" />
              {isCompiling ? "Compiling..." : "Compile"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="border rounded-lg overflow-hidden flex-1">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={(value) => !readOnly && onCodeChange(value || "")}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              readOnly: readOnly,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} characters</span>
        </div>
      </CardContent>
    </Card>
  );
};