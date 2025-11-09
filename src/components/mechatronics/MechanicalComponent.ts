import { Vector3D } from "@/utils/physicsEngine";

export type ComponentType = 
  | "dc_motor" 
  | "servo_motor" 
  | "stepper_motor"
  | "wheel"
  | "propeller"
  | "chassis"
  | "battery"
  | "esc"
  | "gear"
  | "axle"
  | "frame"
  | "sensor";

export interface MechanicalComponent {
  id: string;
  type: ComponentType;
  name: string;
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
  color: string;
  properties: Record<string, any>;
  connections: string[];
}

// Component library with real specifications
export const MECHANICAL_COMPONENTS: Record<ComponentType, Omit<MechanicalComponent, "id" | "position" | "rotation" | "connections">> = {
  dc_motor: {
    type: "dc_motor",
    name: "DC Brushless Motor",
    scale: { x: 1, y: 1, z: 1 },
    color: "#3b82f6",
    properties: {
      maxTorque: 0.5, // N⋅m
      maxRPM: 8000,
      voltage: 12, // V
      efficiency: 0.85,
      weight: 0.15, // kg
      kv: 1000, // RPM per volt
      resistance: 0.1, // Ω
      noLoadCurrent: 0.5, // A
    },
  },
  servo_motor: {
    type: "servo_motor",
    name: "Servo Motor",
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    color: "#f59e0b",
    properties: {
      maxTorque: 0.15, // N⋅m
      maxAngle: 180, // degrees
      speed: 0.17, // sec/60°
      voltage: 6, // V
      weight: 0.055, // kg
      stallCurrent: 1.5, // A
      operatingCurrent: 0.3, // A
    },
  },
  stepper_motor: {
    type: "stepper_motor",
    name: "Stepper Motor",
    scale: { x: 1, y: 1, z: 1 },
    color: "#8b5cf6",
    properties: {
      stepsPerRevolution: 200,
      holdingTorque: 0.4, // N⋅m
      voltage: 12, // V
      current: 1.7, // A per phase
      weight: 0.28, // kg
      stepAngle: 1.8, // degrees
    },
  },
  wheel: {
    type: "wheel",
    name: "Wheel",
    scale: { x: 1, y: 1, z: 1 },
    color: "#1f2937",
    properties: {
      diameter: 0.1, // meters
      width: 0.04, // meters
      weight: 0.05, // kg
      frictionCoeff: 0.7,
      material: "rubber",
    },
  },
  propeller: {
    type: "propeller",
    name: "Propeller",
    scale: { x: 1, y: 0.1, z: 1 },
    color: "#06b6d4",
    properties: {
      diameter: 10, // inches
      pitch: 4.5, // inches
      blades: 2,
      thrustCoefficient: 0.109,
      powerCoefficient: 0.04,
      weight: 0.015, // kg
      material: "carbon_fiber",
    },
  },
  chassis: {
    type: "chassis",
    name: "Chassis",
    scale: { x: 2, y: 0.2, z: 1.5 },
    color: "#ef4444",
    properties: {
      length: 0.3, // meters
      width: 0.2, // meters
      height: 0.05, // meters
      weight: 0.5, // kg
      material: "aluminum",
      dragCoefficient: 0.8,
      frontalArea: 0.06, // m²
    },
  },
  battery: {
    type: "battery",
    name: "LiPo Battery",
    scale: { x: 1.5, y: 0.5, z: 0.8 },
    color: "#22c55e",
    properties: {
      capacity: 2200, // mAh
      voltage: 11.1, // V (3S)
      cells: 3,
      weight: 0.185, // kg
      cRating: 30, // discharge rate
      internalResistance: 0.01, // Ω
      maxCurrent: 66, // A (capacity * C-rating / 1000)
    },
  },
  esc: {
    type: "esc",
    name: "ESC (Electronic Speed Controller)",
    scale: { x: 1, y: 0.3, z: 0.7 },
    color: "#6366f1",
    properties: {
      maxCurrent: 30, // A
      voltage: "2-4S", // LiPo cells
      weight: 0.035, // kg
      bec: "5V/2A", // battery eliminator circuit
      frequency: 400, // Hz
      protocol: "PWM/OneShot",
    },
  },
  gear: {
    type: "gear",
    name: "Gear",
    scale: { x: 0.8, y: 0.3, z: 0.8 },
    color: "#64748b",
    properties: {
      teeth: 20,
      module: 1, // mm
      pressureAngle: 20, // degrees
      ratio: 2, // gear ratio
      efficiency: 0.95,
      weight: 0.02, // kg
    },
  },
  axle: {
    type: "axle",
    name: "Axle",
    scale: { x: 0.2, y: 2, z: 0.2 },
    color: "#475569",
    properties: {
      diameter: 0.006, // meters (6mm)
      length: 0.15, // meters
      weight: 0.015, // kg
      material: "steel",
      frictionCoeff: 0.15,
    },
  },
  frame: {
    type: "frame",
    name: "Frame",
    scale: { x: 2, y: 2, z: 0.2 },
    color: "#f97316",
    properties: {
      width: 0.45, // meters
      length: 0.45, // meters
      height: 0.15, // meters
      weight: 0.8, // kg
      material: "carbon_fiber",
      armLength: 0.225, // meters (for drone/quadcopter)
    },
  },
  sensor: {
    type: "sensor",
    name: "IMU Sensor",
    scale: { x: 0.5, y: 0.2, z: 0.5 },
    color: "#a855f7",
    properties: {
      type: "IMU", // accelerometer + gyroscope
      sampleRate: 1000, // Hz
      weight: 0.003, // kg
      voltage: 5, // V
      current: 0.015, // A
      outputs: ["accel_x", "accel_y", "accel_z", "gyro_x", "gyro_y", "gyro_z"],
    },
  },
};

export const createComponent = (type: ComponentType, position: Vector3D): MechanicalComponent => {
  const template = MECHANICAL_COMPONENTS[type];
  return {
    ...template,
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    position,
    rotation: { x: 0, y: 0, z: 0 },
    connections: [],
  };
};
