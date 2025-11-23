// Electrical System Integration
// This module handles the complete electrical flow from battery through ESC to motors

import {
  Battery,
  Motor,
  ESC,
  updateBattery,
  updateMotorState,
  updateESCOutput,
  calculateBatteryVoltage,
  canBatterySupplyCurrent,
} from './physicsEngine';

export interface ElectricalSystem {
  battery: Battery;
  escs: ESC[];
  motors: Motor[];
  totalCurrent: number;
  totalPower: number;
  efficiency: number;
  warnings: string[];
}

// Calculate total system current draw
export const calculateSystemCurrent = (motors: Motor[]): number => {
  return motors.reduce((total, motor) => total + motor.current, 0);
};

// Calculate total system power consumption
export const calculateSystemPower = (motors: Motor[]): number => {
  return motors.reduce((total, motor) => total + motor.power, 0);
};

// Calculate overall system efficiency
export const calculateSystemEfficiency = (
  powerOutput: number,
  powerInput: number
): number => {
  if (powerInput === 0) return 1;
  return Math.min(1, powerOutput / powerInput);
};

// Update entire electrical system for one time step
export const updateElectricalSystem = (
  system: ElectricalSystem,
  throttleInputs: number[],
  motorLoads: number[],
  deltaTime: number
): ElectricalSystem => {
  const warnings: string[] = [];
  
  // Step 1: Update ESCs with throttle inputs
  const updatedESCs = system.escs.map((esc, i) => 
    updateESCOutput(esc, throttleInputs[i] || 0, deltaTime)
  );
  
  // Step 2: Calculate voltage available from battery
  const batteryVoltage = calculateBatteryVoltage(system.battery);
  
  // Step 3: Update motors with ESC output and battery voltage
  const updatedMotors = system.motors.map((motor, i) => {
    const esc = updatedESCs[i];
    if (!esc) return motor;
    
    // Voltage to motor = battery voltage * ESC output power
    const motorVoltage = batteryVoltage * esc.outputPower;
    const load = motorLoads[i] || 0;
    
    return updateMotorState(motor, motorVoltage, load, deltaTime);
  });
  
  // Step 4: Calculate total current draw
  const totalCurrent = calculateSystemCurrent(updatedMotors);
  
  // Step 5: Check if battery can supply this current
  if (!canBatterySupplyCurrent(system.battery, totalCurrent)) {
    warnings.push('Battery cannot supply requested current - exceeds C-rating');
  }
  
  // Step 6: Check voltage sag
  if (batteryVoltage < system.battery.minVoltage * 1.1) {
    warnings.push('Battery voltage critically low');
  }
  
  // Step 7: Update battery
  const updatedBattery = updateBattery(system.battery, totalCurrent, deltaTime);
  
  // Step 8: Calculate system metrics
  const totalPower = calculateSystemPower(updatedMotors);
  const inputPower = batteryVoltage * totalCurrent;
  const efficiency = calculateSystemEfficiency(totalPower, inputPower);
  
  // Additional warnings
  if (system.battery.stateOfCharge < 0.2) {
    warnings.push('Battery below 20% - land soon');
  }
  
  updatedMotors.forEach((motor, i) => {
    if (motor.temperature > 80) {
      warnings.push(`Motor ${i + 1} overheating (${motor.temperature.toFixed(0)}°C)`);
    }
  });
  
  updatedESCs.forEach((esc, i) => {
    if (esc.temperature > 85) {
      warnings.push(`ESC ${i + 1} overheating (${esc.temperature.toFixed(0)}°C)`);
    }
  });
  
  return {
    battery: updatedBattery,
    escs: updatedESCs,
    motors: updatedMotors,
    totalCurrent,
    totalPower,
    efficiency,
    warnings,
  };
};

// Initialize electrical system from components
export const createElectricalSystem = (
  battery: Battery,
  escs: ESC[],
  motors: Motor[]
): ElectricalSystem => {
  return {
    battery,
    escs,
    motors,
    totalCurrent: 0,
    totalPower: 0,
    efficiency: 1,
    warnings: [],
  };
};

// Helper function to create a motor from component properties
export const createMotorFromComponent = (properties: any): Motor => {
  const type = properties.type || 'brushed';
  const maxRPM = properties.maxRPM || 10000;
  const kv = properties.kv || 1000;
  
  return {
    id: properties.id || 'motor',
    type,
    maxTorque: properties.maxTorque || 0.5,
    maxRPM,
    currentRPM: 0,
    targetRPM: 0,
    voltage: properties.voltage || 11.1,
    current: 0,
    resistance: properties.resistance || 0.1,
    inductance: properties.inductance || 0.0001,
    backEMFConstant: type === 'brushless' ? (1 / kv) * (60 / (2 * Math.PI)) : 0.01,
    torqueConstant: properties.torqueConstant || 0.01,
    efficiency: properties.efficiency || 0.8,
    power: 0,
    temperature: 25,
    maxCurrent: properties.maxCurrent || properties.stallCurrent || 20,
    noLoadCurrent: properties.noLoadCurrent || 0.5,
  };
};

// Helper function to create an ESC from component properties
export const createESCFromComponent = (properties: any): ESC => {
  return {
    id: properties.id || 'esc',
    maxCurrent: properties.maxCurrent || 30,
    voltage: properties.voltage || 11.1,
    pwmFrequency: properties.pwmFrequency || 400,
    throttleInput: 0,
    outputPower: 0,
    responseTime: properties.responseTime || 0.05,
    efficiency: properties.efficiency || 0.95,
    brakingEnabled: properties.brakingEnabled || true,
    currentThrottle: 0,
    temperature: 25,
  };
};

// Helper function to create a battery from component properties
export const createBatteryFromComponent = (properties: any): Battery => {
  const cellCount = properties.cellCount || 3;
  const nominalVoltage = 3.7;
  
  return {
    capacity: properties.capacity || 2200,
    nominalVoltage,
    cellCount,
    currentCharge: properties.capacity || 2200,
    internalResistance: properties.internalResistance || 0.01,
    dischargeCurrent: 0,
    cRating: properties.cRating || 25,
    maxVoltage: 4.2 * cellCount,
    minVoltage: 3.0 * cellCount,
    currentVoltage: nominalVoltage * cellCount,
    stateOfCharge: 1.0,
    cycleCount: 0,
    temperature: 25,
  };
};
