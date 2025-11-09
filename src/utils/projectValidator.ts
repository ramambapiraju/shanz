import { MechanicalComponent } from "@/components/mechatronics/MechanicalComponent";

export interface ValidationError {
  severity: "error" | "warning" | "info";
  component: string;
  message: string;
  fix?: string;
}

export const validateProject = (components: MechanicalComponent[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check if project is empty
  if (components.length === 0) {
    errors.push({
      severity: "info",
      component: "Project",
      message: "No components added yet",
      fix: "Add components from the library to start building",
    });
    return errors;
  }

  // Track component counts
  const motorCount = components.filter(c => 
    c.type === "dc_motor" || c.type === "servo_motor" || c.type === "stepper_motor"
  ).length;
  const batteryCount = components.filter(c => c.type === "battery").length;
  const escCount = components.filter(c => c.type === "esc").length;
  const propellerCount = components.filter(c => c.type === "propeller").length;

  // Battery validation
  if (motorCount > 0 && batteryCount === 0) {
    errors.push({
      severity: "error",
      component: "Power",
      message: "Motors require a battery for power",
      fix: "Add a battery component",
    });
  }

  // ESC validation for brushless motors
  if (propellerCount > 0 && escCount === 0) {
    errors.push({
      severity: "error",
      component: "Electronics",
      message: "Propellers need ESC to control motor speed",
      fix: "Add ESC components for each motor/propeller",
    });
  }

  if (motorCount > escCount && propellerCount > 0) {
    errors.push({
      severity: "warning",
      component: "Electronics",
      message: `${motorCount} motors but only ${escCount} ESCs`,
      fix: `Add ${motorCount - escCount} more ESC(s)`,
    });
  }

  // Battery capacity check
  components.forEach((comp) => {
    if (comp.type === "battery") {
      const totalMotorPower = motorCount * 150; // ~150W per motor average
      const batteryPower = comp.properties.voltage * comp.properties.maxCurrent;
      
      if (batteryPower < totalMotorPower) {
        errors.push({
          severity: "warning",
          component: comp.name,
          message: "Battery may be underpowered for current motor load",
          fix: "Use higher capacity battery or reduce motors",
        });
      }
    }

    // Position validation
    if (comp.position.y < -0.5) {
      errors.push({
        severity: "warning",
        component: comp.name,
        message: "Component is below ground level",
        fix: "Adjust Y position to be above 0",
      });
    }

    // Weight distribution for drones
    if (propellerCount === 4) {
      const centerOfMass = components.reduce(
        (acc, c) => ({
          x: acc.x + c.position.x * (c.properties.weight || 0),
          y: acc.y + c.position.y * (c.properties.weight || 0),
          z: acc.z + c.position.z * (c.properties.weight || 0),
        }),
        { x: 0, y: 0, z: 0 }
      );
      
      const totalWeight = components.reduce((sum, c) => sum + (c.properties.weight || 0), 0);
      
      if (totalWeight > 0) {
        const com = {
          x: centerOfMass.x / totalWeight,
          y: centerOfMass.y / totalWeight,
          z: centerOfMass.z / totalWeight,
        };
        
        if (Math.abs(com.x) > 0.5 || Math.abs(com.z) > 0.5) {
          errors.push({
            severity: "warning",
            component: "Balance",
            message: "Center of mass is off-center, may affect stability",
            fix: "Redistribute component weights for better balance",
          });
        }
      }
    }
  });

  // Thrust-to-weight ratio for flying vehicles
  if (propellerCount >= 3) {
    const totalThrust = propellerCount * 8; // ~8N per propeller at full throttle
    const totalWeight = components.reduce((sum, c) => sum + (c.properties.weight || 0), 0) * 9.81;
    
    const thrustToWeight = totalThrust / totalWeight;
    
    if (thrustToWeight < 1.5) {
      errors.push({
        severity: "error",
        component: "Flight",
        message: `Thrust-to-weight ratio too low: ${thrustToWeight.toFixed(2)}:1 (need >1.5:1)`,
        fix: "Add more/larger propellers or reduce weight",
      });
    } else if (thrustToWeight < 2) {
      errors.push({
        severity: "warning",
        component: "Flight",
        message: `Low thrust-to-weight ratio: ${thrustToWeight.toFixed(2)}:1 (recommend >2:1)`,
        fix: "Consider adding thrust for better maneuverability",
      });
    } else {
      errors.push({
        severity: "info",
        component: "Flight",
        message: `Good thrust-to-weight ratio: ${thrustToWeight.toFixed(2)}:1`,
      });
    }
  }

  // RC Car specific validations
  const wheelCount = components.filter(c => c.type === "wheel").length;
  const servoCount = components.filter(c => c.type === "servo_motor").length;
  
  if (wheelCount >= 2 && motorCount > 0 && servoCount === 0) {
    errors.push({
      severity: "warning",
      component: "Steering",
      message: "RC car needs servo motor for steering",
      fix: "Add servo motor for steering control",
    });
  }

  if (wheelCount > 0 && wheelCount < 3) {
    errors.push({
      severity: "warning",
      component: "Wheels",
      message: "Vehicle needs at least 3 wheels for stability",
      fix: "Add more wheels",
    });
  }

  return errors;
};

export const getValidationSummary = (errors: ValidationError[]) => {
  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;
  const infoCount = errors.filter(e => e.severity === "info").length;

  return {
    errorCount,
    warningCount,
    infoCount,
    canSimulate: errorCount === 0,
    message: errorCount > 0 
      ? `${errorCount} critical error(s) must be fixed before simulation`
      : warningCount > 0
      ? `${warningCount} warning(s) - simulation possible but not optimal`
      : "All checks passed - ready to simulate",
  };
};
