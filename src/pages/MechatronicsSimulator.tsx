import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MechatronicsCanvas3D from "@/components/mechatronics/MechatronicsCanvas3D";
import ComponentLibrary3D from "@/components/mechatronics/ComponentLibrary3D";
import PropertyPanel3D from "@/components/mechatronics/PropertyPanel3D";
import SimulationEngine from "@/components/mechatronics/SimulationEngine";
import ProjectSelector from "@/components/mechatronics/ProjectSelector";
import { MechanicalComponent, createComponent, ComponentType } from "@/components/mechatronics/MechanicalComponent";
import { loadProjectTemplate } from "@/components/mechatronics/ProjectTemplates3D";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MechatronicsSimulator = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<MechanicalComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleAddComponent = (type: ComponentType) => {
    const newComponent = createComponent(type, { x: 0, y: 1, z: 0 });
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
    toast.success(`Added ${newComponent.name}`);
  };

  const handleUpdateComponent = (updatedComponent: MechanicalComponent) => {
    setComponents(components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    ));
  };

  const handleDeleteComponent = () => {
    if (!selectedComponent) return;
    setComponents(components.filter(c => c.id !== selectedComponent));
    setSelectedComponent(null);
    toast.success("Component deleted");
  };

  const handleLoadProject = (templateId: string) => {
    const projectComponents = loadProjectTemplate(templateId);
    setComponents(projectComponents);
    setSelectedComponent(null);
    toast.success("Project loaded successfully");
  };

  const selectedComp = components.find(c => c.id === selectedComponent) || null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold">Mechatronics Simulator (3D)</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 grid grid-cols-12 gap-4">
        {/* Left Panel */}
        <div className="col-span-3 space-y-4 overflow-auto">
          <Tabs defaultValue="library">
            <TabsList className="w-full">
              <TabsTrigger value="library" className="flex-1">Library</TabsTrigger>
              <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="library">
              <ComponentLibrary3D onAddComponent={handleAddComponent} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectSelector onLoadProject={handleLoadProject} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Canvas */}
        <div className="col-span-6 h-[calc(100vh-8rem)]">
          <MechatronicsCanvas3D
            components={components}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
          />
        </div>

        {/* Right Panel */}
        <div className="col-span-3 space-y-4 overflow-auto">
          <PropertyPanel3D
            component={selectedComp}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
          <SimulationEngine
            components={components}
            onUpdateComponents={setComponents}
          />
        </div>
      </div>
    </div>
  );
};

export default MechatronicsSimulator;
