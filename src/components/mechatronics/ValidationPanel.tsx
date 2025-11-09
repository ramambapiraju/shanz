import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { ValidationError, getValidationSummary } from "@/utils/projectValidator";

interface ValidationPanelProps {
  errors: ValidationError[];
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ errors }) => {
  const summary = getValidationSummary(errors);

  const getIcon = (severity: string) => {
    switch (severity) {
      case "error": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getVariant = (severity: string) => {
    switch (severity) {
      case "error": return "destructive";
      default: return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {summary.canSimulate ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
            Project Validation
          </span>
          <div className="flex gap-2">
            {summary.errorCount > 0 && (
              <Badge variant="destructive">{summary.errorCount} Errors</Badge>
            )}
            {summary.warningCount > 0 && (
              <Badge className="bg-yellow-500">{summary.warningCount} Warnings</Badge>
            )}
            {summary.infoCount > 0 && (
              <Badge variant="secondary">{summary.infoCount} Info</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant={summary.canSimulate ? "default" : "destructive"} className="mb-4">
          <AlertDescription>{summary.message}</AlertDescription>
        </Alert>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {errors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All validation checks passed!</p>
                <p className="text-sm">Your project is ready to simulate.</p>
              </div>
            ) : (
              errors.map((error, idx) => (
                <Alert key={idx} variant={getVariant(error.severity)}>
                  <div className="flex items-start gap-2">
                    {getIcon(error.severity)}
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{error.component}</div>
                      <div className="text-sm">{error.message}</div>
                      {error.fix && (
                        <div className="text-xs text-muted-foreground mt-1">
                          💡 {error.fix}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ValidationPanel;
