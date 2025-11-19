import { MechanicalComponent, ComponentType, createComponent } from "./MechanicalComponent";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  components: MechanicalComponent[];
  estimatedTime: string;
  learningObjectives: string[];
  category: "car" | "drone" | "boat" | "robot";
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  // PROJECT 1: Basic Car
  {
    id: "basic_car",
    name: "Basic Car",
    description: "Simple 2-motor robot car with forward, backward, and turning capabilities",
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    category: "car",
    learningObjectives: [
      "DC motor control",
      "Basic movement programming",
      "Power distribution",
      "Chassis assembly"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1, y: 0.2, z: 0.6 } },
      
      // Motors (2 DC motors)
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: -0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: 0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: -0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: 0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: -0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: 0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.12, z: 0 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("lipo_3s_5000mah", { x: 0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
    ]
  },

  // PROJECT 2: Buddy Bot (Follows Hand)
  {
    id: "buddy_bot",
    name: "Buddy Bot",
    description: "Robot that follows your hand using proximity sensors",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    category: "robot",
    learningObjectives: [
      "Proximity sensor integration",
      "Distance measurement",
      "Follow logic programming",
      "Sensor-based navigation"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1, y: 0.2, z: 0.6 } },
      
      // Motors
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: -0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: 0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: -0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: 0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: -0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: 0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // Front proximity sensor
      { ...createComponent("ultrasonic_sensor", { x: 0.45, y: 0.08, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.12, z: 0 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("lipo_3s_5000mah", { x: 0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
    ]
  },

  // PROJECT 3: Back Off Bot (Obstacle Avoidance with IR Sensor)
  {
    id: "backoff_bot",
    name: "Back Off Bot",
    description: "Robot that reverses when IR sensor detects obstacle ahead",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    category: "robot",
    learningObjectives: [
      "IR sensor obstacle detection",
      "Automatic reversing logic",
      "Safety stop mechanisms",
      "Sensor-based decision making"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1, y: 0.2, z: 0.6 } },
      
      // Motors
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: -0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: 0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: -0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: 0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: -0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: 0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // IR sensor at front for obstacle detection
      { ...createComponent("ir_sensor", { x: 0.5, y: 0.08, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.12, z: 0 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("lipo_3s_5000mah", { x: 0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
    ]
  },

  // PROJECT 4: Traffic Bot
  {
    id: "traffic_bot",
    name: "Traffic Bot",
    description: "Robot that stops automatically when detecting obstacles ahead",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    category: "robot",
    learningObjectives: [
      "Traffic safety logic",
      "Stop-and-go programming",
      "Emergency braking",
      "Collision prevention"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1, y: 0.2, z: 0.6 } },
      
      // Motors
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: -0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: 0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: -0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: 0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: -0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: 0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // Front sensor for collision detection
      { ...createComponent("ultrasonic_sensor", { x: 0.45, y: 0.08, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.12, z: 0 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("lipo_3s_5000mah", { x: 0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
    ]
  },

  // PROJECT 5: Line Follower
  {
    id: "line_follower",
    name: "Line Follower",
    description: "Robot that autonomously follows a black line on the ground",
    difficulty: "intermediate",
    estimatedTime: "35 minutes",
    category: "robot",
    learningObjectives: [
      "Line detection algorithms",
      "PID control basics",
      "Path following logic",
      "Sensor calibration"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1, y: 0.2, z: 0.6 } },
      
      // Motors
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: -0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.3, y: 0.05, z: 0.2 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: -0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.4, y: -0.02, z: 0.25 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: -0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.4, y: -0.02, z: 0.25 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // Bottom-mounted line sensors
      { ...createComponent("ultrasonic_sensor", { x: 0.3, y: 0.03, z: -0.15 }), scale: { x: 0.25, y: 0.15, z: 0.25 } },
      { ...createComponent("ultrasonic_sensor", { x: 0.3, y: 0.03, z: 0 }), scale: { x: 0.25, y: 0.15, z: 0.25 } },
      { ...createComponent("ultrasonic_sensor", { x: 0.3, y: 0.03, z: 0.15 }), scale: { x: 0.25, y: 0.15, z: 0.25 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.12, z: 0 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("lipo_3s_5000mah", { x: 0.15, y: 0.12, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
    ]
  }
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