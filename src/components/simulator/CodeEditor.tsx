import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
}

export const CodeEditor = ({ code, setCode, isRunning }: CodeEditorProps) => {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arduino Code Editor</CardTitle>
        <CardDescription>
          Write your Arduino C++ code with syntax highlighting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="500px"
            defaultLanguage="cpp"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              readOnly: isRunning,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
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