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
  {
    id: "rc_car_4wd",
    name: "4WD RC Car",
    description: "Professional 4-wheel drive RC car with independent motor control and servo steering",
    difficulty: "intermediate",
    estimatedTime: "45 minutes",
    category: "car",
    learningObjectives: [
      "4WD drivetrain mechanics",
      "Differential steering control",
      "2.4GHz RC receiver integration",
      "ESC motor control",
      "Battery power distribution"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1.5, y: 0.3, z: 0.8 } },
      
      // Motors (4 DC motors for 4WD)
      { ...createComponent("dc_motor_775", { x: -0.5, y: 0.05, z: -0.35 }), scale: { x: 0.6, y: 0.6, z: 0.8 } },
      { ...createComponent("dc_motor_775", { x: -0.5, y: 0.05, z: 0.35 }), scale: { x: 0.6, y: 0.6, z: 0.8 } },
      { ...createComponent("dc_motor_775", { x: 0.5, y: 0.05, z: -0.35 }), scale: { x: 0.6, y: 0.6, z: 0.8 } },
      { ...createComponent("dc_motor_775", { x: 0.5, y: 0.05, z: 0.35 }), scale: { x: 0.6, y: 0.6, z: 0.8 } },
      
      // Wheels
      { ...createComponent("rubber_wheel_100mm", { x: -0.6, y: -0.02, z: -0.4 }), scale: { x: 1, y: 1, z: 1 } },
      { ...createComponent("rubber_wheel_100mm", { x: -0.6, y: -0.02, z: 0.4 }), scale: { x: 1, y: 1, z: 1 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.6, y: -0.02, z: -0.4 }), scale: { x: 1, y: 1, z: 1 } },
      { ...createComponent("rubber_wheel_100mm", { x: 0.6, y: -0.02, z: 0.4 }), scale: { x: 1, y: 1, z: 1 } },
      
      // Steering servo
      { ...createComponent("servo_mg996r", { x: 0.5, y: 0.08, z: 0 }), scale: { x: 0.8, y: 0.8, z: 0.8 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: -0.1, y: 0.12, z: 0 }), scale: { x: 0.6, y: 0.4, z: 0.8 } },
      { ...createComponent("receiver_2.4ghz", { x: 0.15, y: 0.12, z: 0.15 }), scale: { x: 0.5, y: 0.3, z: 0.6 } },
      { ...createComponent("esc_30a", { x: -0.35, y: 0.12, z: -0.15 }), scale: { x: 0.6, y: 0.3, z: 0.5 } },
      { ...createComponent("esc_30a", { x: -0.35, y: 0.12, z: 0.15 }), scale: { x: 0.6, y: 0.3, z: 0.5 } },
      
      // Power
      { ...createComponent("lipo_2s_2200mah", { x: 0, y: 0.18, z: 0 }), scale: { x: 1, y: 0.6, z: 0.8 } },
      { ...createComponent("voltage_regulator", { x: 0.2, y: 0.12, z: -0.15 }), scale: { x: 0.4, y: 0.3, z: 0.4 } },
      
      // Sensors
      { ...createComponent("ultrasonic_sensor", { x: 0.65, y: 0.08, z: 0 }), scale: { x: 0.5, y: 0.4, z: 0.5 } },
    ],
  },
  {
    id: "racing_quadcopter",
    name: "FPV Racing Quadcopter",
    description: "High-performance racing drone with 4 brushless motors, flight controller, and FPV camera",
    difficulty: "advanced",
    estimatedTime: "90 minutes",
    category: "drone",
    learningObjectives: [
      "Quadcopter flight dynamics",
      "Brushless motor control",
      "Flight controller programming",
      "PID tuning for stability",
      "ESC calibration",
      "FPV system integration"
    ],
    components: [
      // Frame
      { ...createComponent("carbon_frame", { x: 0, y: 0, z: 0 }), scale: { x: 1.2, y: 0.15, z: 1.2 } },
      
      // Motors (4 brushless motors)
      { ...createComponent("brushless_motor_2212", { x: 0.5, y: 0.02, z: 0.5 }), scale: { x: 0.6, y: 0.8, z: 0.6 } },
      { ...createComponent("brushless_motor_2212", { x: -0.5, y: 0.02, z: 0.5 }), scale: { x: 0.6, y: 0.8, z: 0.6 } },
      { ...createComponent("brushless_motor_2212", { x: 0.5, y: 0.02, z: -0.5 }), scale: { x: 0.6, y: 0.8, z: 0.6 } },
      { ...createComponent("brushless_motor_2212", { x: -0.5, y: 0.02, z: -0.5 }), scale: { x: 0.6, y: 0.8, z: 0.6 } },
      
      // Propellers
      { ...createComponent("propeller_5x3", { x: 0.5, y: 0.15, z: 0.5 }), scale: { x: 1, y: 0.2, z: 1 } },
      { ...createComponent("propeller_5x3", { x: -0.5, y: 0.15, z: 0.5 }), scale: { x: 1, y: 0.2, z: 1 } },
      { ...createComponent("propeller_5x3", { x: 0.5, y: 0.15, z: -0.5 }), scale: { x: 1, y: 0.2, z: 1 } },
      { ...createComponent("propeller_5x3", { x: -0.5, y: 0.15, z: -0.5 }), scale: { x: 1, y: 0.2, z: 1 } },
      
      // Electronics
      { ...createComponent("flight_controller", { x: 0, y: -0.03, z: 0 }), scale: { x: 0.5, y: 0.2, z: 0.5 } },
      { ...createComponent("receiver_2.4ghz", { x: 0, y: -0.06, z: 0.15 }), scale: { x: 0.4, y: 0.2, z: 0.4 } },
      { ...createComponent("esc_30a", { x: 0.3, y: -0.04, z: 0.3 }), scale: { x: 0.5, y: 0.2, z: 0.4 } },
      { ...createComponent("esc_30a", { x: -0.3, y: -0.04, z: 0.3 }), scale: { x: 0.5, y: 0.2, z: 0.4 } },
      { ...createComponent("esc_30a", { x: 0.3, y: -0.04, z: -0.3 }), scale: { x: 0.5, y: 0.2, z: 0.4 } },
      { ...createComponent("esc_30a", { x: -0.3, y: -0.04, z: -0.3 }), scale: { x: 0.5, y: 0.2, z: 0.4 } },
      
      // Power
      { ...createComponent("lipo_3s_5000mah", { x: 0, y: -0.1, z: 0 }), scale: { x: 1, y: 0.5, z: 0.6 } },
      
      // Sensors & Camera
      { ...createComponent("gyro_mpu6050", { x: 0, y: -0.03, z: -0.05 }), scale: { x: 0.3, y: 0.2, z: 0.3 } },
      { ...createComponent("camera_module", { x: 0, y: 0.02, z: 0.5 }), scale: { x: 0.5, y: 0.4, z: 0.4 } },
    ],
  },
  {
    id: "rc_speed_boat",
    name: "High-Speed RC Boat",
    description: "Water-propelled RC boat with powerful brushless motor, rudder steering, and waterproof electronics",
    difficulty: "intermediate",
    estimatedTime: "60 minutes",
    category: "boat",
    learningObjectives: [
      "Hydrodynamic hull design",
      "Water propulsion systems",
      "Rudder control mechanics",
      "Waterproof electronics",
      "Buoyancy and stability"
    ],
    components: [
      // Hull
      { ...createComponent("plastic_body", { x: 0, y: 0, z: 0 }), scale: { x: 2, y: 0.5, z: 0.8 } },
      
      // Motor & Propeller
      { ...createComponent("brushless_motor_2212", { x: -0.7, y: 0, z: 0 }), scale: { x: 0.6, y: 0.8, z: 0.6 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
      { ...createComponent("propeller_5x3", { x: -0.85, y: 0, z: 0 }), scale: { x: 0.8, y: 0.8, z: 0.15 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
      
      // Steering
      { ...createComponent("servo_mg996r", { x: 0.6, y: 0.05, z: 0 }), scale: { x: 0.6, y: 0.6, z: 0.6 } },
      
      // Electronics
      { ...createComponent("arduino_nano", { x: 0, y: 0.15, z: 0 }), scale: { x: 0.4, y: 0.3, z: 0.5 } },
      { ...createComponent("receiver_2.4ghz", { x: 0.2, y: 0.15, z: 0.15 }), scale: { x: 0.4, y: 0.25, z: 0.4 } },
      { ...createComponent("esc_60a", { x: -0.3, y: 0.15, z: 0 }), scale: { x: 0.7, y: 0.3, z: 0.5 } },
      
      // Power
      { ...createComponent("lipo_3s_5000mah", { x: 0, y: 0.2, z: 0 }), scale: { x: 1.2, y: 0.5, z: 0.7 } },
      { ...createComponent("voltage_regulator", { x: 0.15, y: 0.15, z: -0.12 }), scale: { x: 0.35, y: 0.25, z: 0.35 } },
    ],
  },
  {
    id: "mecanum_robot",
    name: "Mecanum Wheel Robot",
    description: "Omnidirectional robot with mecanum wheels capable of moving in any direction",
    difficulty: "advanced",
    estimatedTime: "75 minutes",
    category: "robot",
    learningObjectives: [
      "Mecanum wheel kinematics",
      "Omnidirectional movement",
      "Individual wheel control",
      "Sensor-based navigation",
      "Complex motor coordination"
    ],
    components: [
      // Chassis
      { ...createComponent("aluminum_chassis", { x: 0, y: 0.05, z: 0 }), scale: { x: 1.2, y: 0.25, z: 1.2 } },
      
      // Motors
      { ...createComponent("dc_motor_775", { x: -0.45, y: 0.05, z: -0.45 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: -0.45, y: 0.05, z: 0.45 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: 0.45, y: 0.05, z: -0.45 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      { ...createComponent("dc_motor_775", { x: 0.45, y: 0.05, z: 0.45 }), scale: { x: 0.5, y: 0.5, z: 0.6 } },
      
      // Mecanum Wheels
      { ...createComponent("mecanum_wheel", { x: -0.5, y: 0, z: -0.5 }), scale: { x: 0.9, y: 0.9, z: 0.9 } },
      { ...createComponent("mecanum_wheel", { x: -0.5, y: 0, z: 0.5 }), scale: { x: 0.9, y: 0.9, z: 0.9 } },
      { ...createComponent("mecanum_wheel", { x: 0.5, y: 0, z: -0.5 }), scale: { x: 0.9, y: 0.9, z: 0.9 } },
      { ...createComponent("mecanum_wheel", { x: 0.5, y: 0, z: 0.5 }), scale: { x: 0.9, y: 0.9, z: 0.9 } },
      
      // Electronics
      { ...createComponent("arduino_uno", { x: 0, y: 0.13, z: 0 }), scale: { x: 0.6, y: 0.4, z: 0.7 } },
      { ...createComponent("receiver_2.4ghz", { x: 0.2, y: 0.13, z: 0.2 }), scale: { x: 0.45, y: 0.3, z: 0.5 } },
      { ...createComponent("esc_30a", { x: -0.25, y: 0.13, z: -0.2 }), scale: { x: 0.55, y: 0.3, z: 0.45 } },
      { ...createComponent("esc_30a", { x: -0.25, y: 0.13, z: 0.2 }), scale: { x: 0.55, y: 0.3, z: 0.45 } },
      
      // Power
      { ...createComponent("lipo_3s_5000mah", { x: 0, y: 0.2, z: 0 }), scale: { x: 1, y: 0.5, z: 0.7 } },
      
      // Sensors
      { ...createComponent("ultrasonic_sensor", { x: 0.55, y: 0.1, z: 0 }), scale: { x: 0.5, y: 0.4, z: 0.5 } },
      { ...createComponent("gyro_mpu6050", { x: 0, y: 0.15, z: 0.1 }), scale: { x: 0.3, y: 0.25, z: 0.3 } },
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