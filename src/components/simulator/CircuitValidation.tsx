import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, XCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { ValidationError, getValidationSummary } from "@/utils/circuitValidator";

interface CircuitValidationProps {
  errors: ValidationError[];
  isRunning: boolean;
}

export function CircuitValidation({ errors, isRunning }: CircuitValidationProps) {
  const summary = getValidationSummary(errors);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5" />;
      case 'error':
        return <ShieldAlert className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getVariant = (severity: string): "default" | "destructive" => {
    return severity === 'critical' || severity === 'error' ? 'destructive' : 'default';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'error':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'warning':
        return 'bg-yellow-500 text-white dark:bg-yellow-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full border-border/50 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Circuit Validation
          </CardTitle>
          {errors.length === 0 ? (
            <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
              <CheckCircle2 className="h-3 w-3" />
              All Clear
            </Badge>
          ) : (
            <div className="flex gap-1">
              {summary.critical > 0 && (
                <Badge className={getSeverityColor('critical')}>
                  {summary.critical} Critical
                </Badge>
              )}
              {summary.errors > 0 && (
                <Badge className={getSeverityColor('error')}>
                  {summary.errors} Error{summary.errors > 1 ? 's' : ''}
                </Badge>
              )}
              {summary.warnings > 0 && (
                <Badge className={getSeverityColor('warning')}>
                  {summary.warnings} Warning{summary.warnings > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {errors.length === 0 
            ? "Your circuit looks good! No issues detected." 
            : "Review and fix these issues before running your circuit"}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {errors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 dark:text-green-400 mb-4 animate-pulse" />
              <p className="text-lg font-medium text-foreground">
                Circuit Validated Successfully!
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                All components are properly connected. You're ready to run your simulation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {errors
                .sort((a, b) => {
                  const severityOrder = { critical: 0, error: 1, warning: 2 };
                  return severityOrder[a.severity] - severityOrder[b.severity];
                })
                .map((error) => (
                  <Alert
                    key={error.id}
                    variant={getVariant(error.severity)}
                    className="animate-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(error.severity)}
                      <div className="flex-1 space-y-1">
                        <AlertTitle className="flex items-center gap-2 text-base">
                          {error.title}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(error.severity)}`}
                          >
                            {error.severity.toUpperCase()}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="text-sm leading-relaxed">
                          {error.message}
                        </AlertDescription>
                        {error.affectedComponents && error.affectedComponents.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              Affected: {error.affectedComponents.length} component(s)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
            </div>
          )}
        </ScrollArea>
        
        {!summary.canRun && errors.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm font-medium text-destructive flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cannot run simulation - Fix critical errors first
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
