import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FolderOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import MechatronicsCanvas3D from "@/components/mechatronics/MechatronicsCanvas3D";
import ComponentLibrary3D from "@/components/mechatronics/ComponentLibrary3D";
import PropertyPanel3D from "@/components/mechatronics/PropertyPanel3D";
import SimulationEngine from "@/components/mechatronics/SimulationEngine";
import ProjectSelector from "@/components/mechatronics/ProjectSelector";
import ValidationPanel from "@/components/mechatronics/ValidationPanel";
import TelemetryPanel from "@/components/mechatronics/TelemetryPanel";
import ConnectionManager from "@/components/mechatronics/ConnectionManager";
import { CodePanel } from "@/components/mechatronics/CodePanel";
import { RCTransmitterUI, RCControls } from "@/components/mechatronics/RCTransmitterUI";
import { MechanicalComponent, createComponent, ComponentType } from "@/components/mechatronics/MechanicalComponent";
import { loadProjectTemplate } from "@/components/mechatronics/ProjectTemplates3D";
import { validateProject } from "@/utils/projectValidator";
import { getProjectCode } from "@/data/projectCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MechatronicsSimulator = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<MechanicalComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string>("rc_car_basic");
  const [projectCode, setProjectCode] = useState<string>(getProjectCode("rc_car_basic"));
  const [rcControls, setRCControls] = useState<RCControls>({
    throttle: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    steering: 0,
  });
  
  const vehicleType = useMemo(() => {
    if (currentProjectId.includes('quadcopter') || currentProjectId.includes('drone')) {
      return 'drone';
    } else if (currentProjectId.includes('car')) {
      return 'car';
    } else if (currentProjectId.includes('boat')) {
      return 'boat';
    }
    return 'drone';
  }, [currentProjectId]);

  // Memoize validation to prevent unnecessary recalculations
  const validationErrors = useMemo(() => validateProject(components), [components]);

  const handleSimulationStateChange = (time: number, running: boolean) => {
    setSimulationTime(time);
    setIsSimulating(running);
  };

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
    setCurrentProjectId(templateId);
    setProjectCode(getProjectCode(templateId));
    toast.success("Project loaded successfully!");
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
          <h1 className="text-xl font-bold">Mechatronics Simulator 3D (Phase 3 - Advanced)</h1>
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
        <div className="col-span-3 space-y-4 overflow-auto max-h-[calc(100vh-8rem)]">
          <Tabs defaultValue="library" className="h-full">
            <div className="space-y-2">
              {/* First row of tabs */}
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="validate">Validate</TabsTrigger>
              </TabsList>
              {/* Second row of tabs */}
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="connect">Connect</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="library" className="mt-4">
              <ComponentLibrary3D onAddComponent={handleAddComponent} />
            </TabsContent>
            <TabsContent value="projects" className="mt-4">
              <ProjectSelector onLoadProject={handleLoadProject} />
            </TabsContent>
            <TabsContent value="validate" className="mt-4">
              <ValidationPanel errors={validationErrors} />
            </TabsContent>
            <TabsContent value="connect" className="mt-4">
              <ConnectionManager 
                components={components}
                selectedComponent={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
              />
            </TabsContent>
            <TabsContent value="code" className="mt-4">
              <CodePanel
                projectId={currentProjectId}
                code={projectCode}
                onCodeChange={setProjectCode}
                readOnly={false}
              />
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
        <div className="col-span-3 space-y-4 overflow-auto max-h-[calc(100vh-8rem)]">
          <PropertyPanel3D
            component={selectedComp}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
          <SimulationEngine
            components={components}
            onUpdateComponents={setComponents}
            onSimulationStateChange={handleSimulationStateChange}
            rcControls={rcControls}
          />
          <RCTransmitterUI
            onControlChange={setRCControls}
            vehicleType={vehicleType as 'drone' | 'car' | 'boat'}
          />
          <TelemetryPanel
            components={components}
            time={simulationTime}
            isRunning={isSimulating}
          />
        </div>
      </div>
    </div>
  );
};

export default MechatronicsSimulator;
