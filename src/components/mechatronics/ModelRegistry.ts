import { ComponentType } from "./MechanicalComponent";
import * as THREE from "three";

// Model configuration for each component type
export interface ComponentModelConfig {
  type: "gltf" | "procedural";
  path?: string; // For GLTF models
  generator?: (scale: [number, number, number]) => THREE.Group; // For procedural models
  defaultScale: [number, number, number];
  rotationOffset?: [number, number, number];
}

// Procedural model generators for realistic components
export const generateMotor2212 = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // Motor body (aluminum)
  const bodyGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.3, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b8b8b,
    metalness: 0.9,
    roughness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.x = Math.PI / 2;
  group.add(body);
  
  // Motor shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.15, 16);
  const shaftMaterial = new THREE.MeshStandardMaterial({
    color: 0x404040,
    metalness: 1,
    roughness: 0.1,
  });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.z = 0.2;
  group.add(shaft);
  
  // Motor bell (top)
  const bellGeometry = new THREE.CylinderGeometry(0.16, 0.14, 0.08, 32);
  const bellMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    metalness: 0.85,
    roughness: 0.25,
  });
  const bell = new THREE.Mesh(bellGeometry, bellMaterial);
  bell.rotation.x = Math.PI / 2;
  bell.position.z = 0.19;
  group.add(bell);
  
  // Mounting holes (4x)
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const holeGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8);
    const holeMaterial = new THREE.MeshStandardMaterial({
      color: 0x202020,
      metalness: 0.3,
      roughness: 0.8,
    });
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    hole.position.x = Math.cos(angle) * 0.08;
    hole.position.y = Math.sin(angle) * 0.08;
    hole.position.z = -0.14;
    hole.rotation.x = Math.PI / 2;
    group.add(hole);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generatePropeller = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // Hub
  const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
  const hubMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    metalness: 0.1,
    roughness: 0.6,
  });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);
  
  // Blades (2x)
  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.05,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  
  for (let i = 0; i < 2; i++) {
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(0.3, 0.05, 0.5, 0.02);
    bladeShape.lineTo(0.5, -0.02);
    bladeShape.quadraticCurveTo(0.3, -0.05, 0, -0.01);
    bladeShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 0.01, bevelEnabled: false };
    const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.rotation.y = (i * Math.PI) + Math.PI / 2;
    blade.position.z = -0.005;
    group.add(blade);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generateWheel = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // Tire (rubber)
  const tireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32);
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 0.95,
  });
  const tire = new THREE.Mesh(tireGeometry, tireMaterial);
  tire.rotation.z = Math.PI / 2;
  group.add(tire);
  
  // Rim (plastic/aluminum)
  const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.27, 32);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.6,
    roughness: 0.3,
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.z = Math.PI / 2;
  group.add(rim);
  
  // Hub spokes (6x)
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const spokeGeometry = new THREE.BoxGeometry(0.04, 0.25, 0.02);
    const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
    spoke.position.x = Math.cos(angle) * 0.12;
    spoke.position.y = Math.sin(angle) * 0.12;
    spoke.rotation.z = angle;
    group.add(spoke);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generateArduino = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // PCB board
  const boardGeometry = new THREE.BoxGeometry(0.53, 0.68, 0.02);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x006666,
    metalness: 0.1,
    roughness: 0.7,
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  group.add(board);
  
  // ATmega chip
  const chipGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.03);
  const chipMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.2,
    roughness: 0.6,
  });
  const chip = new THREE.Mesh(chipGeometry, chipMaterial);
  chip.position.set(0, -0.1, 0.025);
  group.add(chip);
  
  // USB port
  const usbGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.06);
  const usbMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.7,
    roughness: 0.3,
  });
  const usb = new THREE.Mesh(usbGeometry, usbMaterial);
  usb.position.set(0, 0.34, 0.03);
  group.add(usb);
  
  // Header pins (digital side)
  const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.9,
    roughness: 0.2,
  });
  for (let i = 0; i < 14; i++) {
    const pinGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.08);
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(0.22, -0.28 + i * 0.04, 0.04);
    group.add(pin);
  }
  
  // Header pins (analog side)
  for (let i = 0; i < 6; i++) {
    const pinGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.08);
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(-0.22, -0.08 + i * 0.04, 0.04);
    group.add(pin);
  }
  
  // Power jack
  const jackGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
  const jackMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.5,
    roughness: 0.5,
  });
  const jack = new THREE.Mesh(jackGeometry, jackMaterial);
  jack.rotation.x = Math.PI / 2;
  jack.position.set(-0.15, 0.32, 0.03);
  group.add(jack);
  
  group.scale.set(...scale);
  return group;
};

export const generateESC = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // ESC body
  const bodyGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.08);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);
  
  // Heat sink fins
  const finMaterial = new THREE.MeshStandardMaterial({
    color: 0x404040,
    metalness: 0.8,
    roughness: 0.3,
  });
  for (let i = 0; i < 5; i++) {
    const finGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.06);
    const fin = new THREE.Mesh(finGeometry, finMaterial);
    fin.position.y = -0.08 + i * 0.04;
    fin.position.z = 0.07;
    group.add(fin);
  }
  
  // Input wires (3x - red, black, yellow)
  const wireColors = [0xff0000, 0x000000, 0xffff00];
  for (let i = 0; i < 3; i++) {
    const wireGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: wireColors[i],
      metalness: 0.05,
      roughness: 0.8,
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0.25, -0.05 + i * 0.05, 0);
    group.add(wire);
  }
  
  // Output wires (3x - thick, motor wires)
  const motorWireColors = [0xff0000, 0xffff00, 0x0000ff];
  for (let i = 0; i < 3; i++) {
    const wireGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: motorWireColors[i],
      metalness: 0.05,
      roughness: 0.8,
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(-0.275, -0.05 + i * 0.05, 0);
    group.add(wire);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generateBattery = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // Battery body (LiPo pouch)
  const bodyGeometry = new THREE.BoxGeometry(0.7, 0.35, 0.2);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    metalness: 0.05,
    roughness: 0.6,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);
  
  // Label (black rectangle)
  const labelGeometry = new THREE.BoxGeometry(0.65, 0.3, 0.01);
  const labelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 0.8,
  });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.z = 0.105;
  group.add(label);
  
  // Connector (XT60)
  const connectorGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.06);
  const connectorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    metalness: 0.1,
    roughness: 0.7,
  });
  const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
  connector.position.set(0, -0.21, 0);
  group.add(connector);
  
  // Balance connector
  const balanceGeometry = new THREE.BoxGeometry(0.08, 0.04, 0.03);
  const balanceMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.6,
  });
  const balance = new THREE.Mesh(balanceGeometry, balanceMaterial);
  balance.position.set(0.15, -0.175, 0);
  group.add(balance);
  
  // Wires
  const wireGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8);
  const redWireMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.05,
    roughness: 0.8,
  });
  const blackWireMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.05,
    roughness: 0.8,
  });
  
  const redWire = new THREE.Mesh(wireGeometry, redWireMaterial);
  redWire.position.set(-0.03, -0.26, 0);
  redWire.rotation.x = Math.PI / 2;
  group.add(redWire);
  
  const blackWire = new THREE.Mesh(wireGeometry, blackWireMaterial);
  blackWire.position.set(0.03, -0.26, 0);
  blackWire.rotation.x = Math.PI / 2;
  group.add(blackWire);
  
  group.scale.set(...scale);
  return group;
};

export const generateFlightController = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // PCB
  const boardGeometry = new THREE.BoxGeometry(0.36, 0.36, 0.015);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a472a,
    metalness: 0.1,
    roughness: 0.7,
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  group.add(board);
  
  // Main processor
  const cpuGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.02);
  const cpuMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.3,
    roughness: 0.5,
  });
  const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
  cpu.position.z = 0.0175;
  group.add(cpu);
  
  // IMU sensor
  const imuGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.015);
  const imuMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.4,
    roughness: 0.4,
  });
  const imu = new THREE.Mesh(imuGeometry, imuMaterial);
  imu.position.set(0.08, 0.08, 0.0175);
  group.add(imu);
  
  // Mounting holes (4x)
  const holeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    metalness: 0.8,
    roughness: 0.2,
  });
  const positions = [
    [-0.15, -0.15],
    [0.15, -0.15],
    [-0.15, 0.15],
    [0.15, 0.15],
  ];
  positions.forEach(([x, y]) => {
    const holeGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 12);
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    hole.position.set(x, y, 0);
    hole.rotation.x = Math.PI / 2;
    group.add(hole);
  });
  
  // LED indicators
  const ledColors = [0xff0000, 0x00ff00, 0x0000ff];
  ledColors.forEach((color, i) => {
    const ledGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.015, 8);
    const ledMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      metalness: 0,
      roughness: 0.3,
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(-0.12 + i * 0.03, 0.15, 0.02);
    led.rotation.x = Math.PI / 2;
    group.add(led);
  });
  
  group.scale.set(...scale);
  return group;
};

export const generateUltrasonicSensor = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // PCB
  const boardGeometry = new THREE.BoxGeometry(0.45, 0.2, 0.015);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x006633,
    metalness: 0.1,
    roughness: 0.7,
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  group.add(board);
  
  // Transducers (2x)
  const transducerGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
  const transducerMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.7,
    roughness: 0.2,
  });
  
  const leftTransducer = new THREE.Mesh(transducerGeometry, transducerMaterial);
  leftTransducer.rotation.x = Math.PI / 2;
  leftTransducer.position.set(-0.12, 0, 0.03);
  group.add(leftTransducer);
  
  const rightTransducer = new THREE.Mesh(transducerGeometry, transducerMaterial);
  rightTransducer.rotation.x = Math.PI / 2;
  rightTransducer.position.set(0.12, 0, 0.03);
  group.add(rightTransducer);
  
  // Pins (4x)
  const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1,
  });
  for (let i = 0; i < 4; i++) {
    const pinGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.08);
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(-0.15 + i * 0.1, -0.09, -0.04);
    group.add(pin);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generateGyroSensor = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // PCB
  const boardGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.012);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x220066,
    metalness: 0.1,
    roughness: 0.7,
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  group.add(board);
  
  // MPU6050 chip
  const chipGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.01);
  const chipMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.3,
    roughness: 0.5,
  });
  const chip = new THREE.Mesh(chipGeometry, chipMaterial);
  chip.position.z = 0.011;
  group.add(chip);
  
  // Pins (8x)
  const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1,
  });
  for (let i = 0; i < 8; i++) {
    const pinGeometry = new THREE.BoxGeometry(0.015, 0.015, 0.06);
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(-0.075 + i * 0.021, 0.065, -0.036);
    group.add(pin);
  }
  
  group.scale.set(...scale);
  return group;
};

export const generateChassis = (scale: [number, number, number]): THREE.Group => {
  const group = new THREE.Group();
  
  // Main plate (aluminum/carbon)
  const plateGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.03);
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0x505050,
    metalness: 0.8,
    roughness: 0.3,
  });
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  group.add(plate);
  
  // Frame rails (4x)
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.7,
    roughness: 0.4,
  });
  
  const positions = [
    [-0.55, -0.35],
    [0.55, -0.35],
    [-0.55, 0.35],
    [0.55, 0.35],
  ];
  
  positions.forEach(([x, y]) => {
    const railGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.15);
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.position.set(x, y, 0.09);
    group.add(rail);
  });
  
  // Cross braces (2x)
  const braceGeometry = new THREE.BoxGeometry(1.1, 0.04, 0.02);
  const braceMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    metalness: 0.75,
    roughness: 0.35,
  });
  
  const brace1 = new THREE.Mesh(braceGeometry, braceMaterial);
  brace1.position.set(0, -0.25, 0.075);
  group.add(brace1);
  
  const brace2 = new THREE.Mesh(braceGeometry, braceMaterial);
  brace2.position.set(0, 0.25, 0.075);
  group.add(brace2);
  
  group.scale.set(...scale);
  return group;
};

// Model registry mapping component types to their 3D models
export const MODEL_REGISTRY: Record<ComponentType, ComponentModelConfig> = {
  // Motors
  dc_motor_775: {
    type: "procedural",
    generator: generateMotor2212,
    defaultScale: [1.2, 1.2, 1.2],
  },
  brushless_motor_2212: {
    type: "procedural",
    generator: generateMotor2212,
    defaultScale: [1, 1, 1],
  },
  
  // Servos
  servo_mg996r: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.38);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.2,
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      const hornGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16);
      const hornMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.6,
      });
      const horn = new THREE.Mesh(hornGeometry, hornMaterial);
      horn.rotation.x = Math.PI / 2;
      horn.position.z = 0.21;
      group.add(horn);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  servo_sg90: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.23, 0.125, 0.225);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066cc,
        metalness: 0.2,
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      const hornGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
      const hornMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.6,
      });
      const horn = new THREE.Mesh(hornGeometry, hornMaterial);
      horn.rotation.x = Math.PI / 2;
      horn.position.z = 0.1225;
      group.add(horn);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  stepper_nema17: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.42, 0.42, 0.47);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.6,
        roughness: 0.4,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      const shaftGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.22);
      const shaftMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        metalness: 1,
        roughness: 0.1,
      });
      const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
      shaft.rotation.x = Math.PI / 2;
      shaft.position.z = 0.345;
      group.add(shaft);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  
  // Wheels
  rubber_wheel_100mm: {
    type: "procedural",
    generator: generateWheel,
    defaultScale: [1, 1, 1],
  },
  omni_wheel: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const hubGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
      const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.6,
        roughness: 0.3,
      });
      const hub = new THREE.Mesh(hubGeometry, hubMaterial);
      hub.rotation.z = Math.PI / 2;
      group.add(hub);
      
      // Omni rollers (12x)
      const rollerMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.1,
        roughness: 0.9,
      });
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const rollerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12);
        const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
        roller.position.x = Math.cos(angle) * 0.4;
        roller.position.y = Math.sin(angle) * 0.4;
        roller.rotation.y = angle;
        group.add(roller);
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  mecanum_wheel: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const hubGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
      const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0x505050,
        metalness: 0.7,
        roughness: 0.3,
      });
      const hub = new THREE.Mesh(hubGeometry, hubMaterial);
      hub.rotation.z = Math.PI / 2;
      group.add(hub);
      
      // Mecanum rollers (16x at 45-degree angle)
      const rollerMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.05,
        roughness: 0.95,
      });
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const rollerGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12);
        const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
        roller.position.x = Math.cos(angle) * 0.35;
        roller.position.y = Math.sin(angle) * 0.35;
        roller.rotation.y = angle + Math.PI / 4;
        group.add(roller);
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  
  // Propellers
  "propeller_10x4.5": {
    type: "procedural",
    generator: generatePropeller,
    defaultScale: [2, 2, 2],
  },
  "propeller_5x3": {
    type: "procedural",
    generator: generatePropeller,
    defaultScale: [1, 1, 1],
  },
  
  // ESCs
  esc_30a: {
    type: "procedural",
    generator: generateESC,
    defaultScale: [0.8, 0.8, 0.8],
  },
  esc_60a: {
    type: "procedural",
    generator: generateESC,
    defaultScale: [1.2, 1.2, 1.2],
  },
  
  // Batteries
  lipo_2s_2200mah: {
    type: "procedural",
    generator: generateBattery,
    defaultScale: [0.8, 0.8, 0.8],
  },
  lipo_3s_5000mah: {
    type: "procedural",
    generator: generateBattery,
    defaultScale: [1.2, 1.2, 1],
  },
  lipo_4s_3300mah: {
    type: "procedural",
    generator: generateBattery,
    defaultScale: [1, 1, 1],
  },
  
  // Controllers
  arduino_uno: {
    type: "procedural",
    generator: generateArduino,
    defaultScale: [1, 1, 1],
  },
  arduino_nano: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const boardGeometry = new THREE.BoxGeometry(0.18, 0.43, 0.015);
      const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x003366,
        metalness: 0.1,
        roughness: 0.7,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      group.add(board);
      
      const chipGeometry = new THREE.BoxGeometry(0.07, 0.07, 0.02);
      const chipMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.2,
        roughness: 0.6,
      });
      const chip = new THREE.Mesh(chipGeometry, chipMaterial);
      chip.position.z = 0.0175;
      group.add(chip);
      
      const pinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.9,
        roughness: 0.2,
      });
      for (let i = 0; i < 15; i++) {
        const pinGeometry = new THREE.BoxGeometry(0.015, 0.015, 0.06);
        const pin1 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin1.position.set(0.075, -0.195 + i * 0.026, 0.03);
        group.add(pin1);
        
        const pin2 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin2.position.set(-0.075, -0.195 + i * 0.026, 0.03);
        group.add(pin2);
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  raspberry_pi: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const boardGeometry = new THREE.BoxGeometry(0.85, 0.56, 0.02);
      const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aa00,
        metalness: 0.1,
        roughness: 0.7,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      group.add(board);
      
      // CPU chip
      const cpuGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.025);
      const cpuMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.5,
      });
      const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
      cpu.position.set(0, 0.05, 0.0225);
      group.add(cpu);
      
      // USB ports (4x)
      const usbMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.7,
        roughness: 0.3,
      });
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const usbGeometry = new THREE.BoxGeometry(0.06, 0.13, 0.05);
          const usb = new THREE.Mesh(usbGeometry, usbMaterial);
          usb.position.set(0.425, -0.13 + j * 0.15, 0.025 + i * 0.05);
          group.add(usb);
        }
      }
      
      // GPIO header
      const pinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.9,
        roughness: 0.2,
      });
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 2; j++) {
          const pinGeometry = new THREE.BoxGeometry(0.015, 0.015, 0.06);
          const pin = new THREE.Mesh(pinGeometry, pinMaterial);
          pin.position.set(-0.15 + i * 0.025, 0.15 + j * 0.025, 0.04);
          group.add(pin);
        }
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  flight_controller: {
    type: "procedural",
    generator: generateFlightController,
    defaultScale: [1, 1, 1],
  },
  
  // RC Equipment
  "receiver_2.4ghz": {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.24, 0.45, 0.12);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.2,
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      // Antenna
      const antennaGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.3, 8);
      const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.1,
        roughness: 0.8,
      });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(0, 0.225, 0.15);
      group.add(antenna);
      
      // Servo connectors (6x)
      const connectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.5,
      });
      for (let i = 0; i < 6; i++) {
        const connectorGeometry = new THREE.BoxGeometry(0.2, 0.04, 0.06);
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(0, -0.18 + i * 0.06, 0.09);
        group.add(connector);
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  "transmitter_2.4ghz": {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.3);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.3,
        roughness: 0.6,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      // LCD screen
      const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.02);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x003300,
        metalness: 0.1,
        roughness: 0.3,
        emissive: 0x001100,
        emissiveIntensity: 0.3,
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 0.3, 0.16);
      group.add(screen);
      
      // Control sticks (2x)
      const stickMaterial = new THREE.MeshStandardMaterial({
        color: 0x606060,
        metalness: 0.5,
        roughness: 0.4,
      });
      const leftStick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.04, 0.08, 16),
        stickMaterial
      );
      leftStick.position.set(-0.2, -0.2, 0.19);
      group.add(leftStick);
      
      const rightStick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.04, 0.08, 16),
        stickMaterial
      );
      rightStick.position.set(0.2, -0.2, 0.19);
      group.add(rightStick);
      
      // Antenna
      const antennaGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8);
      const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.2,
        roughness: 0.7,
      });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(0, 0.6, 0.25);
      group.add(antenna);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  
  // Chassis
  aluminum_chassis: {
    type: "procedural",
    generator: generateChassis,
    defaultScale: [1, 1, 1],
  },
  carbon_frame: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.2,
        roughness: 0.6,
      });
      
      // Center plate
      const centerGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.03);
      const center = new THREE.Mesh(centerGeometry, armMaterial);
      group.add(center);
      
      // Arms (4x for quadcopter)
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const armGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.025);
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.rotation.z = angle;
        arm.position.x = Math.cos(angle) * 0.3;
        arm.position.y = Math.sin(angle) * 0.3;
        group.add(arm);
      }
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  plastic_body: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 0.25);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        metalness: 0.05,
        roughness: 0.5,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      // Windshield
      const windshieldGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.15);
      const windshieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
      });
      const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
      windshield.position.set(0.2, 0, 0.2);
      group.add(windshield);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  
  // Sensors
  ultrasonic_sensor: {
    type: "procedural",
    generator: generateUltrasonicSensor,
    defaultScale: [1, 1, 1],
  },
  ir_sensor: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      
      // Main PCB board
      const boardGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.2);
      const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a472a,
        metalness: 0.1,
        roughness: 0.8,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      group.add(board);
      
      // IR LED (emitter)
      const ledGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12);
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x0000ff,
        emissiveIntensity: 0.3,
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.08, 0.03, 0.1);
      group.add(led);
      
      // IR Receiver (photodiode)
      const receiverGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12);
      const receiverMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.7,
        roughness: 0.3,
      });
      const receiver = new THREE.Mesh(receiverGeometry, receiverMaterial);
      receiver.rotation.x = Math.PI / 2;
      receiver.position.set(0.08, 0.03, 0.1);
      group.add(receiver);
      
      // Potentiometer for sensitivity adjustment
      const potGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 16);
      const potMaterial = new THREE.MeshStandardMaterial({
        color: 0x4169e1,
        metalness: 0.2,
        roughness: 0.6,
      });
      const pot = new THREE.Mesh(potGeometry, potMaterial);
      pot.position.set(0, 0.03, -0.05);
      group.add(pot);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  gyro_mpu6050: {
    type: "procedural",
    generator: generateGyroSensor,
    defaultScale: [1, 1, 1],
  },
  gps_module: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const boardGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.015);
      const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a3a0a,
        metalness: 0.1,
        roughness: 0.7,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      group.add(board);
      
      // Ceramic antenna
      const antennaGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.06);
      const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.1,
        roughness: 0.6,
      });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.z = 0.0375;
      group.add(antenna);
      
      // Connector
      const connectorGeometry = new THREE.BoxGeometry(0.06, 0.04, 0.03);
      const connectorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.6,
      });
      const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
      connector.position.set(0, -0.145, 0.015);
      group.add(connector);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  camera_module: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.25, 0.24, 0.1);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x003300,
        metalness: 0.1,
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      // Lens
      const lensGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
      const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.5,
        roughness: 0.1,
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.z = 0.07;
      group.add(lens);
      
      // Ribbon cable
      const cableGeometry = new THREE.BoxGeometry(0.12, 0.015, 0.1);
      const cableMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.05,
        roughness: 0.8,
      });
      const cable = new THREE.Mesh(cableGeometry, cableMaterial);
      cable.position.set(0, -0.1275, 0);
      group.add(cable);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
  
  // Power Components
  voltage_regulator: {
    type: "procedural",
    generator: (scale) => {
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.05);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.2,
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      // Heat sink fins
      const finMaterial = new THREE.MeshStandardMaterial({
        color: 0x404040,
        metalness: 0.8,
        roughness: 0.3,
      });
      for (let i = 0; i < 6; i++) {
        const finGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.08);
        const fin = new THREE.Mesh(finGeometry, finMaterial);
        fin.position.y = -0.06 + i * 0.024;
        fin.position.z = 0.04;
        group.add(fin);
      }
      
      // Input/output connectors
      const connectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.7,
        roughness: 0.3,
      });
      
      const inputConnector = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.06, 0.03),
        connectorMaterial
      );
      inputConnector.position.set(-0.11, 0, 0.04);
      group.add(inputConnector);
      
      const outputConnector = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.06, 0.03),
        connectorMaterial
      );
      outputConnector.position.set(0.11, 0, 0.04);
      group.add(outputConnector);
      
      group.scale.set(...scale);
      return group;
    },
    defaultScale: [1, 1, 1],
  },
};
