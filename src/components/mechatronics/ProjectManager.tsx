import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FolderOpen, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProjectManagerProps {
  user: User | null;
  currentProject: { id: string; name: string } | null;
  onSave: (name: string, description: string) => void;
  onLoad: (projectData: any) => void;
}

export const ProjectManager = ({ user, currentProject, onSave, onLoad }: ProjectManagerProps) => {
  const navigate = useNavigate();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || "");
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (user && loadDialogOpen) {
      loadProjects();
    }
  }, [user, loadDialogOpen]);

  const loadProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mechatronics_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
    }
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    onSave(projectName, projectDescription);
    setSaveDialogOpen(false);
  };

  const handleLoad = (project: any) => {
    onLoad(project.project_data);
    setLoadDialogOpen(false);
  };

  if (!user) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In to Save Projects
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {currentProject ? 'Update' : 'Save'} Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProject ? 'Update' : 'Save'} Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Mechatronics Project"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {currentProject ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FolderOpen className="h-4 w-4 mr-2" />
            Load Project
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96 pr-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved projects yet
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleLoad(project)}
                  >
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
