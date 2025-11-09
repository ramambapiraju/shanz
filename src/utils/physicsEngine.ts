// Simulation-grade physics engine for mechatronics
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface RigidBody {
  mass: number; // kg
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  rotation: Vector3D; // euler angles in radians
  angularVelocity: Vector3D; // rad/s
  angularAcceleration: Vector3D; // rad/s²
  inertia: Vector3D; // moment of inertia kg⋅m²
}

export interface Force {
  vector: Vector3D;
  point: Vector3D; // application point
}

export interface Motor {
  id: string;
  maxTorque: number; // N⋅m
  maxRPM: number;
  currentRPM: number;
  efficiency: number; // 0-1
  voltage: number; // V
  current: number; // A
  power: number; // W
}

export interface Battery {
  capacity: number; // mAh
  voltage: number; // V
  currentCharge: number; // mAh
  internalResistance: number; // Ω
  dischargeCurrent: number; // A
}

export interface Propeller {
  diameter: number; // inches
  pitch: number; // inches
  thrustCoefficient: number;
  powerCoefficient: number;
  rpm: number;
}

// Physical constants
export const GRAVITY = 9.81; // m/s²
export const AIR_DENSITY = 1.225; // kg/m³ at sea level
export const WATER_DENSITY = 1000; // kg/m³

// Vector operations
export const vecAdd = (a: Vector3D, b: Vector3D): Vector3D => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

export const vecSub = (a: Vector3D, b: Vector3D): Vector3D => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

export const vecScale = (v: Vector3D, s: number): Vector3D => ({
  x: v.x * s,
  y: v.y * s,
  z: v.z * s,
});

export const vecMag = (v: Vector3D): number => 
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

export const vecNorm = (v: Vector3D): Vector3D => {
  const mag = vecMag(v);
  return mag > 0 ? vecScale(v, 1 / mag) : { x: 0, y: 0, z: 0 };
};

export const vecDot = (a: Vector3D, b: Vector3D): number =>
  a.x * b.x + a.y * b.y + a.z * b.z;

export const vecCross = (a: Vector3D, b: Vector3D): Vector3D => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

// Motor physics
export const calculateMotorTorque = (motor: Motor, throttle: number): number => {
  // T = T_max * (1 - RPM/RPM_max) * throttle
  const rpmRatio = motor.currentRPM / motor.maxRPM;
  return motor.maxTorque * (1 - rpmRatio) * throttle;
};

export const calculateMotorPower = (motor: Motor): number => {
  // P = T * ω (Power = Torque * angular velocity)
  const omega = (motor.currentRPM * 2 * Math.PI) / 60; // convert RPM to rad/s
  return calculateMotorTorque(motor, 1) * omega;
};

export const calculateMotorCurrent = (motor: Motor, throttle: number): number => {
  // I = (V - k*RPM) / R + I_0
  // Simplified: I = P / (V * efficiency)
  const power = calculateMotorPower(motor) * throttle;
  return power / (motor.voltage * motor.efficiency);
};

// Propeller physics
export const calculatePropellerThrust = (prop: Propeller): number => {
  // Thrust = C_T * ρ * n² * D⁴
  // where n = RPS (revolutions per second), D = diameter in meters
  const rps = prop.rpm / 60;
  const diameter = prop.diameter * 0.0254; // inches to meters
  return prop.thrustCoefficient * AIR_DENSITY * Math.pow(rps, 2) * Math.pow(diameter, 4);
};

export const calculatePropellerPower = (prop: Propeller): number => {
  // Power = C_P * ρ * n³ * D⁵
  const rps = prop.rpm / 60;
  const diameter = prop.diameter * 0.0254;
  return prop.powerCoefficient * AIR_DENSITY * Math.pow(rps, 3) * Math.pow(diameter, 5);
};

// Drag forces
export const calculateDrag = (velocity: Vector3D, dragCoefficient: number, area: number): Vector3D => {
  // F_d = 0.5 * ρ * v² * C_d * A
  const speed = vecMag(velocity);
  if (speed === 0) return { x: 0, y: 0, z: 0 };
  
  const dragMag = 0.5 * AIR_DENSITY * speed * speed * dragCoefficient * area;
  const direction = vecNorm(velocity);
  return vecScale(direction, -dragMag); // opposite to velocity
};

// Lift forces (for wings/airfoils)
export const calculateLift = (velocity: Vector3D, liftCoefficient: number, area: number, upVector: Vector3D): Vector3D => {
  // F_l = 0.5 * ρ * v² * C_l * A
  const speed = vecMag(velocity);
  if (speed === 0) return { x: 0, y: 0, z: 0 };
  
  const liftMag = 0.5 * AIR_DENSITY * speed * speed * liftCoefficient * area;
  return vecScale(upVector, liftMag);
};

// Friction forces
export const calculateFriction = (normal: number, velocity: Vector3D, frictionCoeff: number): Vector3D => {
  // F_f = μ * N * direction
  const speed = vecMag(velocity);
  if (speed === 0) return { x: 0, y: 0, z: 0 };
  
  const frictionMag = frictionCoeff * normal;
  const direction = vecNorm(velocity);
  return vecScale(direction, -frictionMag);
};

// Battery discharge
export const updateBattery = (battery: Battery, current: number, deltaTime: number): Battery => {
  // Q_used = I * t (in hours)
  const chargeUsed = (current * deltaTime) / 3600; // convert seconds to hours
  const newCharge = Math.max(0, battery.currentCharge - chargeUsed);
  
  // Voltage drop due to internal resistance: V_actual = V_nominal - I*R
  const actualVoltage = battery.voltage - (current * battery.internalResistance);
  
  return {
    ...battery,
    currentCharge: newCharge,
    voltage: Math.max(0, actualVoltage),
    dischargeCurrent: current,
  };
};

// Gear ratio calculations
export const applyGearRatio = (inputTorque: number, inputRPM: number, gearRatio: number) => {
  // Output torque = Input torque * gear ratio
  // Output RPM = Input RPM / gear ratio
  return {
    outputTorque: inputTorque * gearRatio,
    outputRPM: inputRPM / gearRatio,
  };
};

// Rigid body dynamics integration (Euler method)
export const updateRigidBody = (body: RigidBody, forces: Force[], deltaTime: number): RigidBody => {
  // Sum all forces
  let netForce: Vector3D = { x: 0, y: 0, z: 0 };
  let netTorque: Vector3D = { x: 0, y: 0, z: 0 };
  
  forces.forEach(force => {
    netForce = vecAdd(netForce, force.vector);
    // Torque = r × F (cross product of position and force)
    const torque = vecCross(force.point, force.vector);
    netTorque = vecAdd(netTorque, torque);
  });
  
  // F = ma -> a = F/m
  const acceleration = vecScale(netForce, 1 / body.mass);
  
  // τ = Iα -> α = τ/I
  const angularAcceleration: Vector3D = {
    x: body.inertia.x > 0 ? netTorque.x / body.inertia.x : 0,
    y: body.inertia.y > 0 ? netTorque.y / body.inertia.y : 0,
    z: body.inertia.z > 0 ? netTorque.z / body.inertia.z : 0,
  };
  
  // Update velocity: v = v0 + a*dt
  const velocity = vecAdd(body.velocity, vecScale(acceleration, deltaTime));
  
  // Update position: x = x0 + v*dt
  const position = vecAdd(body.position, vecScale(velocity, deltaTime));
  
  // Update angular velocity: ω = ω0 + α*dt
  const angularVelocity = vecAdd(body.angularVelocity, vecScale(angularAcceleration, deltaTime));
  
  // Update rotation: θ = θ0 + ω*dt
  const rotation = vecAdd(body.rotation, vecScale(angularVelocity, deltaTime));
  
  return {
    ...body,
    position,
    velocity,
    acceleration,
    rotation,
    angularVelocity,
    angularAcceleration,
  };
};

// Collision detection (simple bounding sphere)
export const checkCollision = (pos1: Vector3D, radius1: number, pos2: Vector3D, radius2: number): boolean => {
  const distance = vecMag(vecSub(pos1, pos2));
  return distance < (radius1 + radius2);
};

// Collision response with elasticity
export const resolveCollision = (
  body1: RigidBody,
  body2: RigidBody,
  elasticity: number = 0.8
): { body1: RigidBody; body2: RigidBody } => {
  const normal = vecNorm(vecSub(body2.position, body1.position));
  const relativeVelocity = vecSub(body1.velocity, body2.velocity);
  const velocityAlongNormal = vecDot(relativeVelocity, normal);

  if (velocityAlongNormal > 0) return { body1, body2 };

  const impulse = -(1 + elasticity) * velocityAlongNormal / (1 / body1.mass + 1 / body2.mass);

  const impulseVector = vecScale(normal, impulse);
  
  return {
    body1: {
      ...body1,
      velocity: vecAdd(body1.velocity, vecScale(impulseVector, 1 / body1.mass)),
    },
    body2: {
      ...body2,
      velocity: vecSub(body2.velocity, vecScale(impulseVector, 1 / body2.mass)),
    },
  };
};

// Ground collision
export const checkGroundCollision = (position: Vector3D, groundLevel: number = 0): boolean => {
  return position.y <= groundLevel;
};

export const resolveGroundCollision = (body: RigidBody, elasticity: number = 0.5): RigidBody => {
  if (body.position.y < 0) {
    return {
      ...body,
      position: { ...body.position, y: 0 },
      velocity: { ...body.velocity, y: -body.velocity.y * elasticity },
    };
  }
  return body;
};

// Fluid dynamics for boats
export const calculateBuoyancy = (
  submergedVolume: number,
  fluidDensity: number = WATER_DENSITY
): Vector3D => {
  // F_b = ρ * V * g
  const buoyancyForce = fluidDensity * submergedVolume * GRAVITY;
  return { x: 0, y: buoyancyForce, z: 0 };
};

export const calculateWaterDrag = (velocity: Vector3D, dragCoefficient: number = 1.5): Vector3D => {
  // Water drag is similar to air drag but with water density
  const speed = vecMag(velocity);
  if (speed === 0) return { x: 0, y: 0, z: 0 };
  
  const dragMag = 0.5 * WATER_DENSITY * speed * speed * dragCoefficient * 0.1; // area
  const direction = vecNorm(velocity);
  return vecScale(direction, -dragMag);
};

export const calculateWaveForce = (position: Vector3D, time: number, amplitude: number = 0.3): Vector3D => {
  // Simple sinusoidal wave
  const waveHeight = amplitude * Math.sin(position.x * 0.5 + time * 2);
  const waveForce = waveHeight * 10; // Force based on wave
  return { x: 0, y: waveForce, z: 0 };
};

// Simple PID controller for stability
export interface PIDController {
  kp: number; // proportional gain
  ki: number; // integral gain
  kd: number; // derivative gain
  integral: number;
  previousError: number;
}

export const updatePID = (pid: PIDController, error: number, deltaTime: number): { output: number; pid: PIDController } => {
  const integral = pid.integral + error * deltaTime;
  const derivative = (error - pid.previousError) / deltaTime;
  
  const output = pid.kp * error + pid.ki * integral + pid.kd * derivative;
  
  return {
    output,
    pid: {
      ...pid,
      integral,
      previousError: error,
    },
  };
};
