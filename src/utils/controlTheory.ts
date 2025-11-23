// Advanced Control Theory - State-Space, Transfer Functions, Frequency Analysis

export interface StateSpaceModel {
  // State-space representation: dx/dt = Ax + Bu, y = Cx + Du
  A: number[][]; // State matrix (n×n)
  B: number[][]; // Input matrix (n×m)
  C: number[][]; // Output matrix (p×n)
  D: number[][]; // Feedthrough matrix (p×m)
  states: string[]; // State variable names
  inputs: string[]; // Input names
  outputs: string[]; // Output names
}

export interface TransferFunction {
  numerator: number[]; // Coefficients of numerator polynomial (descending order)
  denominator: number[]; // Coefficients of denominator polynomial
  name: string;
}

export interface FrequencyResponse {
  frequency: number[]; // rad/s
  magnitude: number[]; // dB
  phase: number[]; // degrees
}

export interface BodeData {
  frequency: number[];
  magnitudeDB: number[];
  phaseDeg: number[];
  gainMargin: number; // dB
  phaseMargin: number; // degrees
  gainCrossover: number; // rad/s
  phaseCrossover: number; // rad/s
}

// Matrix Operations
export const matrixMultiply = (A: number[][], B: number[][]): number[][] => {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  
  const result: number[][] = [];
  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

export const matrixAdd = (A: number[][], B: number[][]): number[][] => {
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
};

export const matrixScale = (A: number[][], scalar: number): number[][] => {
  return A.map(row => row.map(val => val * scalar));
};

export const matrixTranspose = (A: number[][]): number[][] => {
  const rows = A.length;
  const cols = A[0].length;
  const result: number[][] = [];
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = A[i][j];
    }
  }
  return result;
};

export const identityMatrix = (n: number): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      result[i][j] = i === j ? 1 : 0;
    }
  }
  return result;
};

// Transfer Function Evaluation
export const evaluateTransferFunction = (
  tf: TransferFunction,
  s: { real: number; imag: number }
): { real: number; imag: number } => {
  // Evaluate polynomial at complex s
  const evalPoly = (coeffs: number[], s: { real: number; imag: number }) => {
    let result = { real: 0, imag: 0 };
    for (let i = 0; i < coeffs.length; i++) {
      const power = coeffs.length - 1 - i;
      // s^power
      let term = { real: 1, imag: 0 };
      for (let p = 0; p < power; p++) {
        const temp = term.real * s.real - term.imag * s.imag;
        term.imag = term.real * s.imag + term.imag * s.real;
        term.real = temp;
      }
      result.real += coeffs[i] * term.real;
      result.imag += coeffs[i] * term.imag;
    }
    return result;
  };

  const num = evalPoly(tf.numerator, s);
  const den = evalPoly(tf.denominator, s);

  // Complex division: (a + bi) / (c + di) = [(ac + bd) + (bc - ad)i] / (c² + d²)
  const denomMag = den.real * den.real + den.imag * den.imag;
  return {
    real: (num.real * den.real + num.imag * den.imag) / denomMag,
    imag: (num.imag * den.real - num.real * den.imag) / denomMag,
  };
};

// Frequency Response Calculation
export const calculateFrequencyResponse = (
  tf: TransferFunction,
  startFreq: number = 0.01,
  endFreq: number = 1000,
  numPoints: number = 200
): FrequencyResponse => {
  const frequencies: number[] = [];
  const magnitudes: number[] = [];
  const phases: number[] = [];

  // Logarithmic spacing
  const logStart = Math.log10(startFreq);
  const logEnd = Math.log10(endFreq);
  const logStep = (logEnd - logStart) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const freq = Math.pow(10, logStart + i * logStep);
    frequencies.push(freq);

    // Evaluate at s = jω
    const s = { real: 0, imag: freq };
    const response = evaluateTransferFunction(tf, s);

    // Magnitude in dB: 20*log10(|H(jω)|)
    const magnitude = Math.sqrt(response.real * response.real + response.imag * response.imag);
    magnitudes.push(20 * Math.log10(magnitude));

    // Phase in degrees
    const phase = Math.atan2(response.imag, response.real) * (180 / Math.PI);
    phases.push(phase);
  }

  return { frequency: frequencies, magnitude: magnitudes, phase: phases };
};

// Bode Plot Data with Stability Margins
export const calculateBodeData = (tf: TransferFunction): BodeData => {
  const fr = calculateFrequencyResponse(tf, 0.01, 1000, 300);
  
  // Find gain crossover (where magnitude = 0 dB)
  let gainCrossover = 0;
  let phaseMargin = 0;
  for (let i = 1; i < fr.magnitude.length; i++) {
    if (fr.magnitude[i - 1] >= 0 && fr.magnitude[i] < 0) {
      // Linear interpolation
      const t = -fr.magnitude[i - 1] / (fr.magnitude[i] - fr.magnitude[i - 1]);
      gainCrossover = fr.frequency[i - 1] + t * (fr.frequency[i] - fr.frequency[i - 1]);
      phaseMargin = 180 + (fr.phase[i - 1] + t * (fr.phase[i] - fr.phase[i - 1]));
      break;
    }
  }

  // Find phase crossover (where phase = -180°)
  let phaseCrossover = 0;
  let gainMargin = 0;
  for (let i = 1; i < fr.phase.length; i++) {
    if (fr.phase[i - 1] > -180 && fr.phase[i] <= -180) {
      const t = (-180 - fr.phase[i - 1]) / (fr.phase[i] - fr.phase[i - 1]);
      phaseCrossover = fr.frequency[i - 1] + t * (fr.frequency[i] - fr.frequency[i - 1]);
      gainMargin = -(fr.magnitude[i - 1] + t * (fr.magnitude[i] - fr.magnitude[i - 1]));
      break;
    }
  }

  return {
    frequency: fr.frequency,
    magnitudeDB: fr.magnitude,
    phaseDeg: fr.phase,
    gainMargin,
    phaseMargin,
    gainCrossover,
    phaseCrossover,
  };
};

// State-Space to Transfer Function Conversion (SISO only)
export const stateSpaceToTransferFunction = (ss: StateSpaceModel): TransferFunction => {
  // For SISO: G(s) = C(sI - A)^(-1)B + D
  // This is a simplified version - full implementation would need matrix inversion
  // For now, return a placeholder
  return {
    numerator: [1],
    denominator: [1, 1],
    name: "System TF",
  };
};

// LQR Controller Design (Linear Quadratic Regulator)
export interface LQRController {
  K: number[][]; // Feedback gain matrix
  P: number[][]; // Solution to Riccati equation
  Q: number[][]; // State weighting matrix
  R: number[][]; // Control weighting matrix
}

// Simplified LQR calculation (would need iterative solver for full implementation)
export const designLQR = (
  ss: StateSpaceModel,
  Q: number[][],
  R: number[][]
): LQRController => {
  // Placeholder - full LQR requires solving the Algebraic Riccati Equation
  const n = ss.A.length;
  const m = ss.B[0].length;
  
  // Simple proportional gains as placeholder
  const K: number[][] = [];
  for (let i = 0; i < m; i++) {
    K[i] = new Array(n).fill(0);
    K[i][i] = 1.0; // Placeholder gain
  }

  return {
    K,
    P: identityMatrix(n),
    Q,
    R,
  };
};

// Pole Placement Controller
export const designPolePlace = (
  ss: StateSpaceModel,
  desiredPoles: { real: number; imag: number }[]
): number[][] => {
  // Simplified pole placement
  const n = ss.A.length;
  const m = ss.B[0].length;
  
  // Placeholder gains
  const K: number[][] = [];
  for (let i = 0; i < m; i++) {
    K[i] = new Array(n).fill(1.0);
  }
  return K;
};

// Common Transfer Functions for Mechatronics

export const createMotorTransferFunction = (
  J: number,    // Moment of inertia
  b: number,    // Damping coefficient
  K: number,    // Motor constant
  R: number,    // Resistance
  L: number     // Inductance
): TransferFunction => {
  // Motor TF: θ(s)/V(s) = K / (s((Js + b)(Ls + R) + K²))
  // Simplified: K / (JLs² + (JR + bL)s + (bR + K²))
  const a2 = J * L;
  const a1 = J * R + b * L;
  const a0 = b * R + K * K;
  
  return {
    numerator: [K],
    denominator: [a2, a1, a0, 0], // Added 0 for integrator
    name: "DC Motor",
  };
};

export const createPIDTransferFunction = (
  Kp: number,
  Ki: number,
  Kd: number
): TransferFunction => {
  // PID: Kp + Ki/s + Kd*s = (Kd*s² + Kp*s + Ki) / s
  return {
    numerator: [Kd, Kp, Ki],
    denominator: [1, 0],
    name: "PID Controller",
  };
};

export const createDroneAltitudeModel = (
  mass: number,
  dragCoeff: number
): StateSpaceModel => {
  // Simplified altitude model: d²z/dt² = (thrust - mg - drag*v) / m
  // State: [z, v], Input: [thrust], Output: [z]
  const g = 9.81;
  
  return {
    A: [
      [0, 1],
      [0, -dragCoeff / mass]
    ],
    B: [
      [0],
      [1 / mass]
    ],
    C: [[1, 0]],
    D: [[0]],
    states: ["altitude", "velocity"],
    inputs: ["thrust"],
    outputs: ["altitude"],
  };
};

export const createQuadcopterModel = (): StateSpaceModel => {
  // Simplified quadcopter model (roll axis)
  // State: [phi, phi_dot], Input: [torque], Output: [phi]
  const Ixx = 0.01; // Moment of inertia
  
  return {
    A: [
      [0, 1],
      [0, 0]
    ],
    B: [
      [0],
      [1 / Ixx]
    ],
    C: [[1, 0]],
    D: [[0]],
    states: ["roll_angle", "roll_rate"],
    inputs: ["roll_torque"],
    outputs: ["roll_angle"],
  };
};

// Step Response Calculation
export const calculateStepResponse = (
  tf: TransferFunction,
  duration: number = 10,
  numPoints: number = 500
): { time: number[]; output: number[] } => {
  const time: number[] = [];
  const output: number[] = [];
  const dt = duration / numPoints;
  
  // Simplified using inverse Laplace (numerical approximation)
  // For simple systems only
  for (let i = 0; i < numPoints; i++) {
    const t = i * dt;
    time.push(t);
    
    // Very simplified - assumes second order system
    if (tf.denominator.length === 3) {
      const [a, b, c] = tf.denominator;
      const K = tf.numerator[0] / c;
      const wn = Math.sqrt(c / a);
      const zeta = b / (2 * Math.sqrt(a * c));
      
      if (zeta < 1) {
        // Underdamped
        const wd = wn * Math.sqrt(1 - zeta * zeta);
        const y = K * (1 - Math.exp(-zeta * wn * t) * 
          (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t)));
        output.push(y);
      } else {
        // Overdamped or critically damped
        output.push(K * (1 - Math.exp(-wn * t)));
      }
    } else {
      output.push(0);
    }
  }
  
  return { time, output };
};

// Stability Analysis
export const analyzeStability = (tf: TransferFunction): {
  stable: boolean;
  poles: { real: number; imag: number }[];
  message: string;
} => {
  // Find roots of denominator (poles)
  // Simplified for up to 2nd order systems
  const poles: { real: number; imag: number }[] = [];
  const denom = tf.denominator;
  
  if (denom.length === 2) {
    // First order: as + b = 0 -> s = -b/a
    poles.push({ real: -denom[1] / denom[0], imag: 0 });
  } else if (denom.length === 3) {
    // Second order: as² + bs + c = 0
    const a = denom[0];
    const b = denom[1];
    const c = denom[2];
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant >= 0) {
      const sqrt = Math.sqrt(discriminant);
      poles.push({ real: (-b + sqrt) / (2 * a), imag: 0 });
      poles.push({ real: (-b - sqrt) / (2 * a), imag: 0 });
    } else {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-discriminant) / (2 * a);
      poles.push({ real, imag });
      poles.push({ real, imag: -imag });
    }
  }
  
  const stable = poles.every(p => p.real < 0);
  const message = stable ? "System is stable" : "System is unstable!";
  
  return { stable, poles, message };
};
