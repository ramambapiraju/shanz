import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PROJECT_TEMPLATES } from "./ProjectTemplates3D";
import { Rocket, Car, Ship, FileText } from "lucide-react";

interface ProjectSelectorProps {
  onLoadProject: (templateId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onLoadProject }) => {
  const getIcon = (templateId: string) => {
    if (templateId.includes("car")) return Car;
    if (templateId.includes("drone") || templateId.includes("helicopter")) return Rocket;
    if (templateId.includes("boat")) return Ship;
    return FileText;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pre-built Projects</CardTitle>
        <CardDescription>
          Load a validated project template to get started quickly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {PROJECT_TEMPLATES.map((template) => {
              const Icon = getIcon(template.id);
              return (
                <Card key={template.id} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          </div>
                          <Badge 
                            className={`${getDifficultyColor(template.difficulty)} text-white`}
                          >
                            {template.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>⏱ {template.estimatedTime}</span>
                          <span>•</span>
                          <span>{template.components.length} components</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium">Learning objectives:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {template.learningObjectives.slice(0, 3).map((obj, idx) => (
                              <li key={idx}>• {obj}</li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          onClick={() => onLoadProject(template.id)}
                          size="sm"
                          className="w-full mt-2"
                        >
                          Load Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectSelector;
