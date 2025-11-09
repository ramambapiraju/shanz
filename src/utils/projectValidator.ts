import { MechanicalComponent } from "@/components/mechatronics/MechanicalComponent";
import { isAnyMotorType, isBatteryComponent, isESCComponent, isPropellerComponent, isWheelComponent, isServoComponent } from "@/components/mechatronics/ComponentCategories";

export interface ValidationError {
  severity: "error" | "warning" | "info";
  component: string;
  message: string;
  fix?: string;
}

export const validateProject = (components: MechanicalComponent[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (components.length === 0) {
    errors.push({
      severity: "info",
      component: "Project",
      message: "No components added yet",
      fix: "Add components from the library to start building",
    });
    return errors;
  }

  const motorCount = components.filter(c => isAnyMotorType(c.type)).length;
  const batteryCount = components.filter(c => isBatteryComponent(c.type)).length;
  const escCount = components.filter(c => isESCComponent(c.type)).length;
  const propellerCount = components.filter(c => isPropellerComponent(c.type)).length;
  const wheelCount = components.filter(c => isWheelComponent(c.type)).length;
  const servoCount = components.filter(c => isServoComponent(c.type)).length;

  if (motorCount > 0 && batteryCount === 0) {
    errors.push({
      severity: "error",
      component: "Power",
      message: "Motors require a battery for power",
      fix: "Add a battery component",
    });
  }

  if (propellerCount > 0 && escCount === 0) {
    errors.push({
      severity: "error",
      component: "Electronics",
      message: "Propellers need ESC to control motor speed",
      fix: "Add ESC components for each motor/propeller",
    });
  }

  if (wheelCount >= 2 && motorCount > 0 && servoCount === 0) {
    errors.push({
      severity: "warning",
      component: "Steering",
      message: "RC car needs servo motor for steering",
      fix: "Add servo motor for steering control",
    });
  }

  return errors;
};

export const getValidationSummary = (errors: ValidationError[]) => {
  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;
  
  return {
    errorCount,
    warningCount,
    infoCount: errors.filter(e => e.severity === "info").length,
    canSimulate: errorCount === 0,
    message: errorCount > 0 
      ? `${errorCount} critical error(s) must be fixed`
      : warningCount > 0
      ? `${warningCount} warning(s) - simulation possible`
      : "All checks passed - ready to simulate",
  };
};
