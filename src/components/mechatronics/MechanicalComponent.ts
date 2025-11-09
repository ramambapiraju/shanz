import { Vector3D } from "@/utils/physicsEngine";

export type ComponentType =
  // Motors & Actuators
  | "dc_motor_775"
  | "brushless_motor_2212"
  | "servo_mg996r"
  | "servo_sg90"
  | "stepper_nema17"
  // Wheels & Propulsion
  | "rubber_wheel_100mm"
  | "omni_wheel"
  | "mecanum_wheel"
  | "propeller_10x4.5"
  | "propeller_5x3"
  // Control Electronics
  | "receiver_2.4ghz"
  | "transmitter_2.4ghz"
  | "esc_30a"
  | "esc_60a"
  | "flight_controller"
  | "arduino_uno"
  | "arduino_nano"
  | "raspberry_pi"
  // Power
  | "lipo_2s_2200mah"
  | "lipo_3s_5000mah"
  | "lipo_4s_3300mah"
  | "voltage_regulator"
  // Structure
  | "aluminum_chassis"
  | "carbon_frame"
  | "plastic_body"
  // Sensors
  | "ultrasonic_sensor"
  | "gyro_mpu6050"
  | "gps_module"
  | "camera_module";

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

// Component library with real professional specifications
export const MECHANICAL_COMPONENTS: Record<ComponentType, Omit<MechanicalComponent, "id" | "position" | "rotation" | "connections">> = {
  // DC Motors
  dc_motor_775: {
    type: "dc_motor_775",
    name: "775 DC Motor",
    scale: { x: 1, y: 1, z: 1 },
    color: "#4A5568",
    properties: {
      maxRPM: 15000,
      maxTorque: 0.5,
      voltage: 12,
      noLoadCurrent: 0.8,
      stallCurrent: 35,
      efficiency: 0.75,
    },
  },
  brushless_motor_2212: {
    type: "brushless_motor_2212",
    name: "2212 Brushless Motor",
    scale: { x: 1, y: 1, z: 1 },
    color: "#2D3748",
    properties: {
      maxRPM: 11100,
      kv: 920,
      voltage: 11.1,
      maxCurrent: 18,
      efficiency: 0.85,
      mass: 0.052,
    },
  },
  
  // Servos
  servo_mg996r: {
    type: "servo_mg996r",
    name: "MG996R Servo",
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    color: "#3182CE",
    properties: {
      maxAngle: 180,
      speed: 0.17,
      stallTorque: 11,
      voltage: 6,
      noLoadCurrent: 0.1,
      stallCurrent: 2.5,
    },
  },
  servo_sg90: {
    type: "servo_sg90",
    name: "SG90 Micro Servo",
    scale: { x: 0.6, y: 0.6, z: 0.6 },
    color: "#4299E1",
    properties: {
      maxAngle: 180,
      speed: 0.12,
      stallTorque: 1.8,
      voltage: 5,
      noLoadCurrent: 0.01,
      stallCurrent: 0.65,
    },
  },
  
  // Stepper Motor
  stepper_nema17: {
    type: "stepper_nema17",
    name: "NEMA17 Stepper",
    scale: { x: 1, y: 1, z: 1 },
    color: "#1A202C",
    properties: {
      stepsPerRevolution: 200,
      holdingTorque: 0.4,
      voltage: 12,
      current: 1.7,
    },
  },
  
  // Wheels
  rubber_wheel_100mm: {
    type: "rubber_wheel_100mm",
    name: "100mm Rubber Wheel",
    scale: { x: 1, y: 1, z: 1 },
    color: "#1A1A1A",
    properties: {
      diameter: 0.1,
      width: 0.03,
      friction: 0.9,
      material: "Rubber",
      mass: 0.15,
    },
  },
  omni_wheel: {
    type: "omni_wheel",
    name: "Omni Wheel",
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    color: "#2D2D2D",
    properties: {
      diameter: 0.06,
      width: 0.04,
      friction: 0.7,
      material: "Plastic with rollers",
      mass: 0.08,
    },
  },
  mecanum_wheel: {
    type: "mecanum_wheel",
    name: "Mecanum Wheel",
    scale: { x: 1, y: 1, z: 1 },
    color: "#3A3A3A",
    properties: {
      diameter: 0.1,
      width: 0.05,
      friction: 0.75,
      material: "Plastic with 45° rollers",
      mass: 0.2,
    },
  },
  
  // Propellers
  "propeller_10x4.5": {
    type: "propeller_10x4.5",
    name: "10x4.5 Propeller",
    scale: { x: 1, y: 0.1, z: 1 },
    color: "#FFA500",
    properties: {
      diameter: 10,
      pitch: 4.5,
      bladesCount: 2,
      thrustCoefficient: 0.11,
      powerCoefficient: 0.045,
      mass: 0.015,
    },
  },
  "propeller_5x3": {
    type: "propeller_5x3",
    name: "5x3 Propeller",
    scale: { x: 0.6, y: 0.1, z: 0.6 },
    color: "#FF8C00",
    properties: {
      diameter: 5,
      pitch: 3,
      bladesCount: 3,
      thrustCoefficient: 0.09,
      powerCoefficient: 0.035,
      mass: 0.004,
    },
  },
  
  // Control Electronics
  "receiver_2.4ghz": {
    type: "receiver_2.4ghz",
    name: "2.4GHz Receiver",
    scale: { x: 0.8, y: 0.4, z: 0.6 },
    color: "#48BB78",
    properties: {
      frequency: 2400,
      channels: 6,
      range: 1000,
      protocol: "PPM/PWM",
      voltage: 5,
      current: 0.05,
    },
  },
  "transmitter_2.4ghz": {
    type: "transmitter_2.4ghz",
    name: "2.4GHz Transmitter",
    scale: { x: 1.5, y: 1, z: 2 },
    color: "#38A169",
    properties: {
      frequency: 2400,
      channels: 6,
      range: 1000,
      protocol: "PPM/PWM",
    },
  },
  esc_30a: {
    type: "esc_30a",
    name: "30A ESC",
    scale: { x: 1, y: 0.3, z: 0.7 },
    color: "#E53E3E",
    properties: {
      maxCurrent: 30,
      burstCurrent: 40,
      cellCount: "2-3S",
      pwmFrequency: 8000,
      voltage: 11.1,
    },
  },
  esc_60a: {
    type: "esc_60a",
    name: "60A ESC",
    scale: { x: 1.2, y: 0.4, z: 0.8 },
    color: "#C53030",
    properties: {
      maxCurrent: 60,
      burstCurrent: 80,
      cellCount: "3-6S",
      pwmFrequency: 8000,
      voltage: 14.8,
    },
  },
  flight_controller: {
    type: "flight_controller",
    name: "Flight Controller",
    scale: { x: 0.8, y: 0.3, z: 0.8 },
    color: "#805AD5",
    properties: {
      processor: "STM32F4",
      flashMemory: 512,
      sram: 128,
      clockSpeed: 168,
      pwmPins: 8,
      voltage: 5,
      current: 0.2,
    },
  },
  arduino_uno: {
    type: "arduino_uno",
    name: "Arduino UNO",
    scale: { x: 1, y: 0.3, z: 0.8 },
    color: "#00979D",
    properties: {
      processor: "ATmega328P",
      flashMemory: 32,
      sram: 2,
      clockSpeed: 16,
      digitalPins: 14,
      analogPins: 6,
      pwmPins: 6,
      voltage: 5,
    },
  },
  arduino_nano: {
    type: "arduino_nano",
    name: "Arduino Nano",
    scale: { x: 0.6, y: 0.3, z: 0.5 },
    color: "#00A5BB",
    properties: {
      processor: "ATmega328P",
      flashMemory: 32,
      sram: 2,
      clockSpeed: 16,
      digitalPins: 14,
      analogPins: 8,
      pwmPins: 6,
      voltage: 5,
    },
  },
  raspberry_pi: {
    type: "raspberry_pi",
    name: "Raspberry Pi 4B",
    scale: { x: 1.2, y: 0.3, z: 1 },
    color: "#C51A4A",
    properties: {
      processor: "Cortex-A72",
      sram: 4096000,
      clockSpeed: 1500,
      digitalPins: 40,
      voltage: 5,
      current: 3,
    },
  },
  
  // Batteries
  lipo_2s_2200mah: {
    type: "lipo_2s_2200mah",
    name: "2S 2200mAh LiPo",
    scale: { x: 1.5, y: 0.5, z: 0.8 },
    color: "#FFD700",
    properties: {
      capacity: 2200,
      cellCount: 2,
      voltage: 7.4,
      cRating: 30,
      maxDischarge: 66,
      internalResistance: 0.005,
      mass: 0.12,
    },
  },
  lipo_3s_5000mah: {
    type: "lipo_3s_5000mah",
    name: "3S 5000mAh LiPo",
    scale: { x: 2, y: 0.7, z: 1 },
    color: "#FFC107",
    properties: {
      capacity: 5000,
      cellCount: 3,
      voltage: 11.1,
      cRating: 50,
      maxDischarge: 250,
      internalResistance: 0.003,
      mass: 0.385,
    },
  },
  lipo_4s_3300mah: {
    type: "lipo_4s_3300mah",
    name: "4S 3300mAh LiPo",
    scale: { x: 1.8, y: 0.6, z: 0.9 },
    color: "#FF9800",
    properties: {
      capacity: 3300,
      cellCount: 4,
      voltage: 14.8,
      cRating: 45,
      maxDischarge: 148.5,
      internalResistance: 0.004,
      mass: 0.342,
    },
  },
  voltage_regulator: {
    type: "voltage_regulator",
    name: "5V Voltage Regulator",
    scale: { x: 0.6, y: 0.3, z: 0.6 },
    color: "#795548",
    properties: {
      voltage: 5,
      maxCurrent: 3,
      efficiency: 0.85,
    },
  },
  
  // Structure
  aluminum_chassis: {
    type: "aluminum_chassis",
    name: "Aluminum Chassis",
    scale: { x: 2, y: 0.2, z: 1.5 },
    color: "#90A4AE",
    properties: {
      length: 0.3,
      width: 0.15,
      height: 0.05,
      mass: 0.4,
      material: "Aluminum 6061",
    },
  },
  carbon_frame: {
    type: "carbon_frame",
    name: "Carbon Fiber Frame",
    scale: { x: 2, y: 0.15, z: 2 },
    color: "#212121",
    properties: {
      length: 0.25,
      width: 0.25,
      height: 0.02,
      mass: 0.15,
      material: "Carbon Fiber",
    },
  },
  plastic_body: {
    type: "plastic_body",
    name: "Plastic Body Shell",
    scale: { x: 2.5, y: 0.8, z: 1.2 },
    color: "#2196F3",
    properties: {
      length: 0.35,
      width: 0.18,
      height: 0.12,
      mass: 0.25,
      material: "ABS Plastic",
    },
  },
  
  // Sensors
  ultrasonic_sensor: {
    type: "ultrasonic_sensor",
    name: "HC-SR04 Ultrasonic",
    scale: { x: 0.7, y: 0.4, z: 0.5 },
    color: "#00BCD4",
    properties: {
      type: "Distance",
      range: 4,
      accuracy: 0.3,
      updateRate: 40,
      voltage: 5,
      current: 0.015,
    },
  },
  gyro_mpu6050: {
    type: "gyro_mpu6050",
    name: "MPU6050 Gyro/Accel",
    scale: { x: 0.5, y: 0.2, z: 0.5 },
    color: "#9C27B0",
    properties: {
      type: "IMU",
      range: 16,
      accuracy: 0.001,
      updateRate: 1000,
      voltage: 3.3,
      current: 0.005,
    },
  },
  gps_module: {
    type: "gps_module",
    name: "NEO-6M GPS",
    scale: { x: 0.8, y: 0.3, z: 0.8 },
    color: "#4CAF50",
    properties: {
      type: "GPS",
      range: 50000,
      accuracy: 2.5,
      updateRate: 5,
      voltage: 3.3,
      current: 0.045,
    },
  },
  camera_module: {
    type: "camera_module",
    name: "FPV Camera",
    scale: { x: 0.6, y: 0.6, z: 0.8 },
    color: "#FF5722",
    properties: {
      type: "Camera",
      range: 300,
      voltage: 5,
      current: 0.15,
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
