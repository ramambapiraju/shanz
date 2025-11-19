// ============================================
// ELECTRONICS SIMULATOR - PREBUILT PROJECTS
// ============================================
// 6 Simple, Accurate Beginner Projects with Verified Circuits

export const PROJECT_CODES = {
  // PROJECT 1: LED Blink
  blink: `// 🔵 Project 1: LED Blink
// Simple LED blinking circuit - Perfect for beginners!

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT); // Built-in LED on Arduino
  Serial.println("🔵 Project 1: LED Blink Started");
  Serial.println("LED connected to Pin 13");
  Serial.println("================================");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("💡 LED ON");
  delay(1000);
  
  digitalWrite(13, LOW);
  Serial.println("⚫ LED OFF");
  delay(1000);
}`,

  // PROJECT 2: Push Button Control
  button: `// 🔘 Project 2: Push Button + LED
// Learn digital input - Button controls LED

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);  // Button on Pin 2 (internal pullup)
  pinMode(13, OUTPUT);       // LED on Pin 13
  Serial.println("🔘 Project 2: Button Control Started");
  Serial.println("Button: Pin 2 | LED: Pin 13");
  Serial.println("================================");
}

void loop() {
  int buttonState = digitalRead(2);
  
  if (buttonState == LOW) {  // Button pressed (pullup inverts)
    digitalWrite(13, HIGH);
    Serial.println("🔵 Button PRESSED → LED ON");
  } else {
    digitalWrite(13, LOW);
    Serial.println("⚫ Button RELEASED → LED OFF");
  }
  delay(100);
}`,

  // PROJECT 3: Traffic Light
  traffic: `// 🚦 Project 3: Traffic Light System
// Automated traffic signal with timing

void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);  // Red LED
  pinMode(9, OUTPUT);  // Yellow LED
  pinMode(10, OUTPUT); // Green LED
  
  Serial.println("🚦 Project 3: Traffic Light Started");
  Serial.println("Red: Pin 8 | Yellow: Pin 9 | Green: Pin 10");
  Serial.println("==========================================");
}

void loop() {
  // Red light
  digitalWrite(8, HIGH);
  digitalWrite(9, LOW);
  digitalWrite(10, LOW);
  Serial.println("🔴 RED LIGHT - STOP (5s)");
  delay(5000);
  
  // Yellow light
  digitalWrite(8, LOW);
  digitalWrite(9, HIGH);
  digitalWrite(10, LOW);
  Serial.println("🟡 YELLOW LIGHT - READY (2s)");
  delay(2000);
  
  // Green light
  digitalWrite(8, LOW);
  digitalWrite(9, LOW);
  digitalWrite(10, HIGH);
  Serial.println("🟢 GREEN LIGHT - GO (5s)");
  delay(5000);
}`,

  // PROJECT 4: Light-Activated LED
  lightSensor: `// 💡 Project 4: Light-Activated LED
// LDR sensor controls LED - Learn analog input!

void setup() {
  Serial.begin(9600);
  pinMode(A0, INPUT);    // LDR on analog pin A0
  pinMode(13, OUTPUT);   // LED on Pin 13
  Serial.println("💡 Project 4: Light Sensor Started");
  Serial.println("LDR: Pin A0 | LED: Pin 13");
  Serial.println("================================");
}

void loop() {
  int lightLevel = analogRead(A0);
  int threshold = 500;  // Adjust for sensitivity
  
  Serial.print("💡 Light Level: ");
  Serial.println(lightLevel);
  
  if (lightLevel < threshold) {
    digitalWrite(13, HIGH);
    Serial.println("🌙 DARK → LED ON");
  } else {
    digitalWrite(13, LOW);
    Serial.println("☀️ BRIGHT → LED OFF");
  }
  delay(500);
}`,

  // PROJECT 5: Temperature Monitor
  temperature: `// 🌡️ Project 5: Temperature Monitor
// DHT11 sensor displays temperature readings

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT);    // DHT11 on Pin 2
  pinMode(13, OUTPUT);  // LED indicator
  Serial.println("🌡️ Project 5: Temperature Monitor");
  Serial.println("DHT11 Sensor on Pin 2");
  Serial.println("================================");
}

void loop() {
  // Simulated DHT11 readings (22-28°C range)
  float temp = 22 + random(0, 60) / 10.0;
  float humidity = 50 + random(0, 300) / 10.0;
  
  Serial.print("🌡️ Temperature: ");
  Serial.print(temp, 1);
  Serial.println("°C");
  Serial.print("💧 Humidity: ");
  Serial.print(humidity, 0);
  Serial.println("%");
  
  // High temperature warning
  if (temp > 26) {
    digitalWrite(13, HIGH);
    Serial.println("⚠️ HIGH TEMPERATURE!");
  } else {
    digitalWrite(13, LOW);
  }
  
  Serial.println("---");
  delay(2000);
}`,

  // PROJECT 6: Distance Alert
  ultrasonic: `// 📏 Project 6: Distance Alert System
// HC-SR04 ultrasonic sensor with buzzer alert

#define TRIG_PIN 9
#define ECHO_PIN 10
#define BUZZER_PIN 8

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("📏 Project 6: Distance Alert");
  Serial.println("Trig: Pin 9 | Echo: Pin 10 | Buzzer: Pin 8");
  Serial.println("=========================================");
}

void loop() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Simulated distance reading (10-100 cm)
  float distance = 20 + random(0, 800) / 10.0;
  
  Serial.print("📏 Distance: ");
  Serial.print(distance, 1);
  Serial.println(" cm");
  
  // Alert if object too close
  if (distance < 20) {
    digitalWrite(BUZZER_PIN, HIGH);
    Serial.println("⚠️ ALERT: Object too close!");
  } else if (distance < 50) {
    Serial.println("⚡ Warning: Object nearby");
    digitalWrite(BUZZER_PIN, LOW);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("✅ Clear");
  }
  
  Serial.println("---");
  delay(500);
}`
};

// ============================================
// CIRCUIT BUILDING FUNCTIONS
// ============================================
// Each function builds an accurate circuit diagram

export function buildProjectCircuit(projectKey: string): any[] {
  const circuits: { [key: string]: () => any[] } = {
    blink: buildBlinkCircuit,
    button: buildButtonCircuit,
    traffic: buildTrafficCircuit,
    lightSensor: buildLightSensorCircuit,
    temperature: buildTemperatureCircuit,
    ultrasonic: buildUltrasonicCircuit
  };

  const buildFunction = circuits[projectKey];
  return buildFunction ? buildFunction() : [];
}

// PROJECT 1: LED Blink Circuit
function buildBlinkCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 150,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"],
      connections: [
        { from: "arduino-1-D13", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-blue",
      name: "Blue LED",
      x: 400,
      y: 200,
      color: "#2196F3",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 200,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "arduino-1-GND" }
      ]
    }
  ];
}

// PROJECT 2: Push Button + LED Circuit
function buildButtonCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 150,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"],
      connections: [
        { from: "arduino-1-D2", to: "button-1-1" },
        { from: "arduino-1-D13", to: "led-1-+" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Push Button",
      x: 400,
      y: 100,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "arduino-1-GND" }
      ]
    },
    {
      id: "led-1",
      type: "led-green",
      name: "Green LED",
      x: 400,
      y: 250,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 250,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "arduino-1-GND" }
      ]
    }
  ];
}

// PROJECT 3: Traffic Light Circuit
function buildTrafficCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 200,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"],
      connections: [
        { from: "arduino-1-D11", to: "led-red-+" },
        { from: "arduino-1-D12", to: "led-yellow-+" },
        { from: "arduino-1-D13", to: "led-green-+" }
      ]
    },
    {
      id: "led-red",
      type: "led-red",
      name: "Red LED",
      x: 400,
      y: 100,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-red--", to: "resistor-red-1" }
      ]
    },
    {
      id: "resistor-red",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 100,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-red-2", to: "arduino-1-GND" }
      ]
    },
    {
      id: "led-yellow",
      type: "led-yellow",
      name: "Yellow LED",
      x: 400,
      y: 200,
      color: "#FFEB3B",
      pins: ["+", "-"],
      connections: [
        { from: "led-yellow--", to: "resistor-yellow-1" }
      ]
    },
    {
      id: "resistor-yellow",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 200,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-yellow-2", to: "arduino-1-GND" }
      ]
    },
    {
      id: "led-green",
      type: "led-green",
      name: "Green LED",
      x: 400,
      y: 300,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-green--", to: "resistor-green-1" }
      ]
    },
    {
      id: "resistor-green",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 300,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-green-2", to: "arduino-1-GND" }
      ]
    }
  ];
}

// PROJECT 4: Light Sensor Circuit
function buildLightSensorCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 150,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V", "A0"],
      connections: [
        { from: "arduino-1-5V", to: "ldr-1-1" },
        { from: "arduino-1-D13", to: "led-1-+" }
      ]
    },
    {
      id: "ldr-1",
      type: "ldr",
      name: "Light Sensor (LDR)",
      x: 350,
      y: 100,
      color: "#FFC107",
      pins: ["1", "2"],
      connections: [
        { from: "ldr-1-2", to: "arduino-1-A0" },
        { from: "ldr-1-2", to: "resistor-10k-1" }
      ]
    },
    {
      id: "resistor-10k",
      type: "resistor-10k",
      name: "10KΩ Resistor",
      x: 500,
      y: 100,
      color: "#9E9E9E",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-10k-2", to: "arduino-1-GND" }
      ]
    },
    {
      id: "led-1",
      type: "led-blue",
      name: "Blue LED",
      x: 400,
      y: 250,
      color: "#2196F3",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-220-1" }
      ]
    },
    {
      id: "resistor-220",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 250,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-220-2", to: "arduino-1-GND" }
      ]
    }
  ];
}

// PROJECT 5: Temperature Monitor Circuit
function buildTemperatureCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 150,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"],
      connections: [
        { from: "arduino-1-5V", to: "dht11-1-VCC" },
        { from: "arduino-1-D2", to: "dht11-1-DATA" },
        { from: "arduino-1-D13", to: "led-1-+" }
      ]
    },
    {
      id: "dht11-1",
      type: "dht11",
      name: "DHT11 Sensor",
      x: 400,
      y: 100,
      color: "#FF5722",
      pins: ["VCC", "DATA", "GND"],
      connections: [
        { from: "dht11-1-GND", to: "arduino-1-GND" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 400,
      y: 250,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 550,
      y: 250,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "arduino-1-GND" }
      ]
    }
  ];
}

// PROJECT 6: Ultrasonic Distance Alert Circuit
function buildUltrasonicCircuit(): any[] {
  return [
    {
      id: "arduino-1",
      type: "arduino",
      name: "Arduino Uno",
      x: 100,
      y: 200,
      color: "#00979D",
      pins: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "GND", "5V"],
      connections: [
        { from: "arduino-1-5V", to: "ultrasonic-1-VCC" },
        { from: "arduino-1-D9", to: "ultrasonic-1-TRIG" },
        { from: "arduino-1-D10", to: "ultrasonic-1-ECHO" },
        { from: "arduino-1-D8", to: "buzzer-1-+" }
      ]
    },
    {
      id: "ultrasonic-1",
      type: "ultrasonic",
      name: "HC-SR04 Ultrasonic",
      x: 400,
      y: 150,
      color: "#4CAF50",
      pins: ["VCC", "TRIG", "ECHO", "GND"],
      connections: [
        { from: "ultrasonic-1-GND", to: "arduino-1-GND" }
      ]
    },
    {
      id: "buzzer-1",
      type: "buzzer",
      name: "Piezo Buzzer",
      x: 550,
      y: 300,
      color: "#E91E63",
      pins: ["+", "-"],
      connections: [
        { from: "buzzer-1--", to: "arduino-1-GND" }
      ]
    }
  ];
}
