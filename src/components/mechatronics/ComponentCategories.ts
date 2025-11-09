import { ComponentType } from "./MechanicalComponent";

// Helper functions to categorize components
export const isMotorComponent = (type: ComponentType): boolean => {
  return ["dc_motor_775", "brushless_motor_2212"].includes(type);
};

export const isServoComponent = (type: ComponentType): boolean => {
  return ["servo_mg996r", "servo_sg90"].includes(type);
};

export const isStepperComponent = (type: ComponentType): boolean => {
  return type === "stepper_nema17";
};

export const isAnyMotorType = (type: ComponentType): boolean => {
  return isMotorComponent(type) || isServoComponent(type) || isStepperComponent(type);
};

export const isWheelComponent = (type: ComponentType): boolean => {
  return ["rubber_wheel_100mm", "omni_wheel", "mecanum_wheel"].includes(type);
};

export const isPropellerComponent = (type: ComponentType): boolean => {
  return ["propeller_10x4.5", "propeller_5x3"].includes(type);
};

export const isESCComponent = (type: ComponentType): boolean => {
  return ["esc_30a", "esc_60a"].includes(type);
};

export const isBatteryComponent = (type: ComponentType): boolean => {
  return ["lipo_2s_2200mah", "lipo_3s_5000mah", "lipo_4s_3300mah"].includes(type);
};

export const isControllerComponent = (type: ComponentType): boolean => {
  return ["arduino_uno", "arduino_nano", "raspberry_pi", "flight_controller"].includes(type);
};

export const isRCComponent = (type: ComponentType): boolean => {
  return ["receiver_2.4ghz", "transmitter_2.4ghz"].includes(type);
};

export const isChassisComponent = (type: ComponentType): boolean => {
  return ["aluminum_chassis", "carbon_frame", "plastic_body"].includes(type);
};

export const isSensorComponent = (type: ComponentType): boolean => {
  return ["ultrasonic_sensor", "gyro_mpu6050", "gps_module", "camera_module"].includes(type);
};
