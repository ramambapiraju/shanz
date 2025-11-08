import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { MechatronicsCanvas } from "@/components/mechatronics/MechatronicsCanvas";
import { ComponentLibrary } from "@/components/mechatronics/ComponentLibrary";
import { ParameterPanel } from "@/components/mechatronics/ParameterPanel";
import { SimulationControls } from "@/components/mechatronics/SimulationControls";
import { DataCharts } from "@/components/mechatronics/DataCharts";
import { ProjectManager } from "@/components/mechatronics/ProjectManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface MechatronicsComponent {
  id: string;
  type: 'dc-motor' | 'encoder' | 'gear' | 'linkage' | 'power-source' | 'controller' | 'wheel';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  parameters: Record<string, number>;
  connections: string[];
}

export interface SimulationData {
  time: number[];
  position: number[];
  velocity: number[];
  current: number[];
  voltage: number[];
}

const MechatronicsSimulator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [components, setComponents] = useState<MechatronicsComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<MechatronicsComponent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData>({
    time: [],
    position: [],
    velocity: [],
    current: [],
    voltage: []
  });
  const [currentProject, setCurrentProject] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addComponent = (type: MechatronicsComponent['type']) => {
    const newComponent: MechatronicsComponent = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      parameters: getDefaultParameters(type),
      connections: []
    };
    setComponents([...components, newComponent]);
    toast.success(`${type} added to workspace`);
  };

  const getDefaultParameters = (type: MechatronicsComponent['type']): Record<string, number> => {
    switch (type) {
      case 'dc-motor':
        return { torqueConstant: 0.1, resistance: 1.5, inductance: 0.01, voltage: 12 };
      case 'encoder':
        return { resolution: 1024, maxSpeed: 3000 };
      case 'gear':
        return { ratio: 2, efficiency: 0.95 };
      case 'wheel':
        return { radius: 0.05, mass: 0.1 };
      case 'power-source':
        return { voltage: 12, current: 5 };
      case 'controller':
        return { kp: 1, ki: 0.1, kd: 0.01 };
      case 'linkage':
        return { length: 0.1, mass: 0.05 };
      default:
        return {};
    }
  };

  const updateComponent = (id: string, updates: Partial<MechatronicsComponent>) => {
    setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
    toast.success("Component removed");
  };

  const runSimulation = () => {
    if (components.length === 0) {
      toast.error("Add components before running simulation");
      return;
    }
    setIsSimulating(true);
    toast.success("Simulation started");

    // Simple simulation logic for DC motor and wheel system
    const motor = components.find(c => c.type === 'dc-motor');
    const wheel = components.find(c => c.type === 'wheel');
    
    if (motor && wheel) {
      const dt = 0.01; // time step
      const duration = 5; // 5 seconds
      const steps = duration / dt;
      
      const time: number[] = [];
      const position: number[] = [];
      const velocity: number[] = [];
      const current: number[] = [];
      const voltage: number[] = [];
      
      let pos = 0;
      let vel = 0;
      
      for (let i = 0; i < steps; i++) {
        const t = i * dt;
        const V = motor.parameters.voltage;
        const R = motor.parameters.resistance;
        const Kt = motor.parameters.torqueConstant;
        const I = V / R;
        const torque = Kt * I;
        const wheelRadius = wheel.parameters.radius;
        const wheelMass = wheel.parameters.mass;
        const inertia = wheelMass * wheelRadius * wheelRadius / 2;
        const angularAccel = torque / inertia;
        
        vel += angularAccel * dt;
        pos += vel * dt;
        
        time.push(t);
        position.push(pos);
        velocity.push(vel);
        current.push(I);
        voltage.push(V);
      }
      
      setSimulationData({ time, position, velocity, current, voltage });
      
      setTimeout(() => {
        setIsSimulating(false);
        toast.success("Simulation completed");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsSimulating(false);
        toast.error("Need DC motor and wheel for simulation");
      }, 500);
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    toast.info("Simulation stopped");
  };

  const resetSimulation = () => {
    setSimulationData({
      time: [],
      position: [],
      velocity: [],
      current: [],
      voltage: []
    });
    toast.info("Simulation reset");
  };

  const saveProject = async (name: string, description: string) => {
    if (!user) {
      toast.error("Please sign in to save projects");
      return;
    }

    const projectData = {
      components,
      simulationData
    };

    if (currentProject) {
      const { error } = await supabase
        .from('mechatronics_projects')
        .update({ 
          name, 
          description, 
          project_data: projectData as any 
        })
        .eq('id', currentProject.id);

      if (error) {
        toast.error("Failed to update project");
      } else {
        toast.success("Project updated");
        setCurrentProject({ id: currentProject.id, name });
      }
    } else {
      const { data, error } = await supabase
        .from('mechatronics_projects')
        .insert([{
          user_id: user.id,
          name,
          description,
          project_data: projectData as any
        }])
        .select()
        .single();

      if (error) {
        toast.error("Failed to save project");
      } else {
        toast.success("Project saved");
        setCurrentProject({ id: data.id, name });
      }
    }
  };

  const loadProject = (projectData: any) => {
    setComponents(projectData.components || []);
    setSimulationData(projectData.simulationData || {
      time: [],
      position: [],
      velocity: [],
      current: [],
      voltage: []
    });
    toast.success("Project loaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Mechatronics Simulator</h1>
            {currentProject && (
              <span className="text-sm text-muted-foreground">
                Project: {currentProject.name}
              </span>
            )}
          </div>
          <ProjectManager
            user={user}
            currentProject={currentProject}
            onSave={saveProject}
            onLoad={loadProject}
          />
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <ComponentLibrary onAddComponent={addComponent} />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <MechatronicsCanvas
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onUpdateComponent={updateComponent}
              isSimulating={isSimulating}
            />
          </div>

          <SimulationControls
            onRun={runSimulation}
            onStop={stopSimulation}
            onReset={resetSimulation}
            isSimulating={isSimulating}
          />

          <div className="h-64 border-t border-border bg-card">
            <DataCharts data={simulationData} />
          </div>
        </div>

        {selectedComponent && (
          <ParameterPanel
            component={selectedComponent}
            onUpdateParameters={(params) => updateComponent(selectedComponent.id, { parameters: params })}
            onDelete={() => deleteComponent(selectedComponent.id)}
            onClose={() => setSelectedComponent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MechatronicsSimulator;
