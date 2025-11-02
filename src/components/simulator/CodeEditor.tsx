import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
}

export const CodeEditor = ({ code, setCode, isRunning }: CodeEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Arduino Code Editor</CardTitle>
        <CardDescription>
          Write your Arduino sketch here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-[400px]"
          disabled={isRunning}
          placeholder="Write your Arduino code here..."
        />
        <div className="mt-2 text-xs text-muted-foreground">
          {code.split('\n').length} lines
        </div>
      </CardContent>
    </Card>
  );
};