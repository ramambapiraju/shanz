import { MechanicalComponent, ComponentType, createComponent } from "./MechanicalComponent";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  components: MechanicalComponent[];
  estimatedTime: string;
  learningObjectives: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "rc_car_basic",
    name: "Basic RC Car",
    description: "A simple 2-wheel drive RC car with steering",
    difficulty: "beginner",
    estimatedTime: "30 minutes",
    learningObjectives: [
      "DC motor control",
      "Servo steering mechanics",
      "Battery power management",
      "Basic vehicle dynamics"
    ],
    components: [
      { ...createComponent("chassis", { x: 0, y: 0.1, z: 0 }), scale: { x: 2, y: 0.2, z: 1.2 } },
      { ...createComponent("dc_motor", { x: -0.6, y: 0.1, z: -0.4 }) },
      { ...createComponent("dc_motor", { x: -0.6, y: 0.1, z: 0.4 }) },
      { ...createComponent("wheel", { x: -0.8, y: 0, z: -0.5 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("wheel", { x: -0.8, y: 0, z: 0.5 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("wheel", { x: 0.8, y: 0, z: -0.5 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("wheel", { x: 0.8, y: 0, z: 0.5 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("servo_motor", { x: 0.6, y: 0.1, z: 0 }) },
      { ...createComponent("battery", { x: 0, y: 0.3, z: 0 }) },
      { ...createComponent("esc", { x: -0.3, y: 0.25, z: 0 }) },
    ],
  },
  {
    id: "quadcopter_drone",
    name: "Quadcopter Drone",
    description: "A 4-motor drone with flight stabilization",
    difficulty: "intermediate",
    estimatedTime: "45 minutes",
    learningObjectives: [
      "Quadcopter physics",
      "Thrust vectoring",
      "IMU sensor integration",
      "PID control systems"
    ],
    components: [
      { ...createComponent("frame", { x: 0, y: 0, z: 0 }), scale: { x: 2, y: 0.1, z: 2 } },
      { ...createComponent("dc_motor", { x: 1, y: 0.1, z: 1 }) },
      { ...createComponent("dc_motor", { x: -1, y: 0.1, z: 1 }) },
      { ...createComponent("dc_motor", { x: 1, y: 0.1, z: -1 }) },
      { ...createComponent("dc_motor", { x: -1, y: 0.1, z: -1 }) },
      { ...createComponent("propeller", { x: 1, y: 0.4, z: 1 }) },
      { ...createComponent("propeller", { x: -1, y: 0.4, z: 1 }) },
      { ...createComponent("propeller", { x: 1, y: 0.4, z: -1 }) },
      { ...createComponent("propeller", { x: -1, y: 0.4, z: -1 }) },
      { ...createComponent("battery", { x: 0, y: -0.15, z: 0 }) },
      { ...createComponent("esc", { x: 0.5, y: -0.05, z: 0.5 }) },
      { ...createComponent("esc", { x: -0.5, y: -0.05, z: 0.5 }) },
      { ...createComponent("esc", { x: 0.5, y: -0.05, z: -0.5 }) },
      { ...createComponent("esc", { x: -0.5, y: -0.05, z: -0.5 }) },
      { ...createComponent("sensor", { x: 0, y: 0, z: 0 }) },
    ],
  },
  {
    id: "rc_boat",
    name: "RC Boat",
    description: "A water-propelled RC boat with rudder steering",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    learningObjectives: [
      "Hydrodynamic forces",
      "Propeller thrust in water",
      "Rudder control",
      "Buoyancy principles"
    ],
    components: [
      { ...createComponent("chassis", { x: 0, y: 0, z: 0 }), scale: { x: 3, y: 0.3, z: 1 } },
      { ...createComponent("dc_motor", { x: -1, y: 0, z: 0 }) },
      { ...createComponent("propeller", { x: -1.3, y: 0, z: 0 }), rotation: { x: 0, y: 0, z: Math.PI / 2 } },
      { ...createComponent("servo_motor", { x: 1, y: 0, z: 0 }) },
      { ...createComponent("battery", { x: 0, y: 0.2, z: 0 }) },
      { ...createComponent("esc", { x: -0.5, y: 0.2, z: 0 }) },
    ],
  },
];

export const loadProjectTemplate = (templateId: string): MechanicalComponent[] => {
  const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return [];
  
  // Deep clone components with new IDs
  return template.components.map(comp => ({
    ...comp,
    id: `${comp.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }));
};
