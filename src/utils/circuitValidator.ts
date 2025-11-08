export interface ValidationError {
  id: string;
  severity: 'error' | 'warning' | 'critical';
  title: string;
  message: string;
  affectedComponents?: string[];
}

export interface CircuitComponent {
  id: string;
  type: string;
  [key: string]: any;
}

export function validateCircuit(circuit: CircuitComponent[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check 1: Must have an Arduino
  const hasArduino = circuit.some(c => c.type === 'arduino');
  if (!hasArduino && circuit.length > 0) {
    errors.push({
      id: 'no-arduino',
      severity: 'critical',
      title: '❌ No Microcontroller',
      message: 'Your circuit needs an Arduino board to function. Add an Arduino to your circuit.',
    });
  }

// Check 2: Power source validation
const hasPower = circuit.some(c =>
  ['power', 'battery', 'battery-aa', 'arduino'].includes(c.type)
);
if (!hasPower && circuit.length > 0) {
  errors.push({
    id: 'no-power',
    severity: 'critical',
    title: '⚡ No Power Source',
    message: 'Your circuit has no power source. Add an Arduino or battery/power supply.',
  });
}

// Check 3: Ground connection (implicit via components that provide GND)
const hasImplicitGround = circuit.some(c =>
  ['arduino', 'battery', 'battery-aa', 'breadboard', 'ground'].includes(c.type)
);
const hasComplexComponents = circuit.some(c => 
  ['led', 'buzzer', 'motor', 'sensor'].some(type => c.type.includes(type))
);
if (hasComplexComponents && !hasImplicitGround && circuit.length > 2) {
  errors.push({
    id: 'no-ground',
    severity: 'error',
    title: '🔌 Missing Ground Connection',
    message: 'Active components need a ground (GND) reference. Add a controller or battery to provide GND.',
  });
}

// Check 4: LEDs without resistors
const leds = circuit.filter(c => c.type.includes('led'));
const resistors = circuit.filter(c => c.type.includes('resistor'));
if (leds.length > 0 && resistors.length < leds.length) {
  const affectedLEDs = leds.map(led => led.id);
  errors.push({
    id: 'led-no-resistor',
    severity: 'error',
    title: '💥 LEDs Need Resistors!',
    message: `You have ${leds.length} LED(s) but only ${resistors.length} resistor(s). Each LED needs a 220Ω–330Ω resistor to prevent burnout.`,
    affectedComponents: affectedLEDs,
  });
}

// Check 5: Short circuit detection (power directly to ground)
const hasPowerSource = circuit.some(c => ['power', 'battery', 'battery-aa', 'arduino'].includes(c.type));
const hasGroundRef = circuit.some(c => ['ground', 'arduino', 'battery', 'battery-aa', 'breadboard'].includes(c.type));
if (hasPowerSource && hasGroundRef) {
  // Check if there are components between power and ground
  const activeComponents = circuit.filter(c => 
    !['power', 'ground', 'battery', 'battery-aa', 'wire', 'arduino', 'breadboard'].includes(c.type)
  );
  if (activeComponents.length === 0 && circuit.length > 2) {
    errors.push({
      id: 'short-circuit',
      severity: 'critical',
      title: '⚠️ SHORT CIRCUIT DETECTED!',
      message: 'Power is directly connected to ground with no components in between. This will damage your circuit!',
    });
  }
}

  // Check 6: Voltage level warnings
  const highVoltageComponents = circuit.filter(c => 
    c.type === 'battery' || c.type === 'power'
  );
  const sensitiveComponents = circuit.filter(c => 
    ['dht11', 'ultrasonic', 'ldr', 'pir-sensor'].includes(c.type)
  );
  if (highVoltageComponents.length > 1 && sensitiveComponents.length > 0) {
    errors.push({
      id: 'voltage-warning',
      severity: 'warning',
      title: '⚡ Voltage Level Check',
      message: 'Multiple power sources detected with sensitive sensors. Ensure voltage levels are compatible (typically 3.3V-5V).',
      affectedComponents: sensitiveComponents.map(c => c.id),
    });
  }

// Check 7: Motor without proper power
const motors = circuit.filter(c => c.type.includes('motor'));
const hasPowerSupply = circuit.some(c => ['power', 'battery', 'battery-aa', 'arduino'].includes(c.type));
if (motors.length > 0 && !hasPowerSupply) {
  errors.push({
    id: 'motor-power',
    severity: 'warning',
    title: '🔋 Motors Need External Power',
    message: 'DC motors typically require external power. Ensure adequate current is available.',
    affectedComponents: motors.map(m => m.id),
  });
}

  // Check 8: Multiple buzzers without resistors
  const buzzers = circuit.filter(c => c.type === 'buzzer');
  if (buzzers.length > 1 && resistors.length === 0) {
    errors.push({
      id: 'buzzer-protection',
      severity: 'warning',
      title: '🔊 Buzzer Protection',
      message: 'Multiple buzzers detected. Consider adding resistors to limit current draw.',
      affectedComponents: buzzers.map(b => b.id),
    });
  }

  // Check 9: Sensor compatibility
  const digitalSensors = circuit.filter(c => 
    ['pir-sensor', 'button', 'switch'].includes(c.type)
  );
  const analogSensors = circuit.filter(c => 
    ['ldr', 'potentiometer', 'dht11'].includes(c.type)
  );
  if (digitalSensors.length + analogSensors.length > 10) {
    errors.push({
      id: 'too-many-sensors',
      severity: 'warning',
      title: '📊 Component Limit',
      message: 'Arduino Uno has limited pins (6 analog, 14 digital). You may exceed available connections.',
    });
  }

// Check 10: RGB LED special requirements
const rgbLeds = circuit.filter(c => c.type === 'led-rgb');
if (rgbLeds.length > 0 && resistors.length < rgbLeds.length * 3) {
  errors.push({
    id: 'rgb-resistors',
    severity: 'warning',
    title: '🌈 RGB LED Requirements',
    message: `RGB LEDs need 3 resistors each (one per color channel). You have ${rgbLeds.length} RGB LED(s) requiring ${rgbLeds.length * 3} resistors.`,
    affectedComponents: rgbLeds.map(r => r.id),
  });
}

  return errors;
}

export function getValidationSummary(errors: ValidationError[]): {
  critical: number;
  errors: number;
  warnings: number;
  canRun: boolean;
} {
  const critical = errors.filter(e => e.severity === 'critical').length;
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warnings = errors.filter(e => e.severity === 'warning').length;

  return {
    critical,
    errors: errorCount,
    warnings,
    canRun: critical === 0, // Can only run if no critical errors
  };
}
