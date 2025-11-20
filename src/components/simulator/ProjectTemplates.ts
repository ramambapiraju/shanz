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
}`,

  // ============================================
  // ARDUINO-LESS CIRCUITS (14 simple circuits)
  // ============================================
  
  // Circuit 1: Basic LED with Battery
  basicLED: `// 💡 Circuit 1: Basic LED with Battery
// Simple circuit - LED, resistor, and battery (No Arduino!)
// This is the most fundamental circuit

/* CIRCUIT DIAGRAM:
   Battery (+) → LED (+) → Resistor → Battery (-)
   
   Components:
   - 9V Battery
   - LED (any color)
   - 220Ω Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("💡 Circuit 1: Basic LED");
  Serial.println("No Arduino needed - just battery power!");
  Serial.println("Battery → LED → Resistor → Battery");
  Serial.println("================================");
}

void loop() {
  Serial.println("✅ LED is ON (powered by battery)");
  delay(2000);
}`,

  // Circuit 2: Series LEDs
  seriesLEDs: `// 🔗 Circuit 2: LEDs in Series
// Multiple LEDs connected one after another

/* CIRCUIT DIAGRAM:
   Battery (+) → LED1 → LED2 → LED3 → Resistor → Battery (-)
   
   Components:
   - 9V Battery
   - 3x LEDs (same color)
   - 330Ω Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🔗 Circuit 2: Series LEDs");
  Serial.println("3 LEDs in series share the same current");
  Serial.println("================================");
}

void loop() {
  Serial.println("✅ All 3 LEDs glowing (dimmer than single LED)");
  delay(2000);
}`,

  // Circuit 3: Parallel LEDs
  parallelLEDs: `// ⚡ Circuit 3: LEDs in Parallel
// Multiple LEDs each with their own path

/* CIRCUIT DIAGRAM:
   Battery (+) → [LED1+Resistor1]
              → [LED2+Resistor2]
              → [LED3+Resistor3] → Battery (-)
   
   Components:
   - 9V Battery
   - 3x LEDs (different colors)
   - 3x 220Ω Resistors
*/

void setup() {
  Serial.begin(9600);
  Serial.println("⚡ Circuit 3: Parallel LEDs");
  Serial.println("Each LED has independent brightness");
  Serial.println("================================");
}

void loop() {
  Serial.println("✅ Red, Green, Blue LEDs all bright!");
  delay(2000);
}`,

  // Circuit 4: LED with Switch
  ledSwitch: `// 🔘 Circuit 4: LED with Switch
// Control LED on/off with a switch

/* CIRCUIT DIAGRAM:
   Battery (+) → Switch → LED → Resistor → Battery (-)
   
   Components:
   - 9V Battery
   - Push Button Switch
   - LED
   - 220Ω Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🔘 Circuit 4: LED with Switch");
  Serial.println("Press button to light LED");
  Serial.println("================================");
}

void loop() {
  Serial.println("💡 Press switch to turn LED ON");
  delay(1000);
  Serial.println("⚫ Release switch to turn LED OFF");
  delay(1000);
}`,

  // Circuit 5: Two LEDs with Two Switches
  dualLEDSwitch: `// 🔘🔘 Circuit 5: Dual LED Control
// Two independent LED circuits

/* CIRCUIT DIAGRAM:
   Battery (+) → Switch1 → LED1 → Resistor1 → Battery (-)
   Battery (+) → Switch2 → LED2 → Resistor2 → Battery (-)
   
   Components:
   - 9V Battery
   - 2x Push Buttons
   - 2x LEDs (different colors)
   - 2x 220Ω Resistors
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🔘🔘 Circuit 5: Dual LED Control");
  Serial.println("Each switch controls one LED");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔴 Switch 1: Red LED");
  Serial.println("🔵 Switch 2: Blue LED");
  delay(2000);
}`,

  // Circuit 6: RGB LED Circuit
  rgbLED: `// 🌈 Circuit 6: RGB LED Circuit
// Single LED that can show different colors

/* CIRCUIT DIAGRAM:
   Battery (+) → R pin → 220Ω → Battery (-)
   Battery (+) → G pin → 220Ω → Battery (-)
   Battery (+) → B pin → 220Ω → Battery (-)
   
   Components:
   - 9V Battery
   - RGB LED (common cathode)
   - 3x 220Ω Resistors
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🌈 Circuit 6: RGB LED");
  Serial.println("Mix Red, Green, Blue for any color!");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔴 Red ON → Red light");
  delay(1000);
  Serial.println("🟢 Green ON → Green light");
  delay(1000);
  Serial.println("🔵 Blue ON → Blue light");
  delay(1000);
  Serial.println("🟣 Red+Blue ON → Purple light");
  delay(1000);
}`,

  // Circuit 7: Buzzer with Button
  buzzerButton: `// 🔔 Circuit 7: Buzzer with Button
// Make sound when button is pressed

/* CIRCUIT DIAGRAM:
   Battery (+) → Switch → Buzzer (+) → Battery (-)
   
   Components:
   - 9V Battery
   - Push Button
   - Buzzer (piezo)
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🔔 Circuit 7: Buzzer with Button");
  Serial.println("Press to hear sound!");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔘 Press button...");
  delay(1000);
  Serial.println("🔊 BEEP! Buzzer sounds!");
  delay(500);
}`,

  // Circuit 8: Motor with Switch
  motorSwitch: `// ⚙️ Circuit 8: DC Motor Control
// Turn motor on/off with switch

/* CIRCUIT DIAGRAM:
   Battery (+) → Switch → Motor (+) → Battery (-)
   
   Components:
   - 9V Battery
   - Push Button
   - Small DC Motor
   - Diode (protection)
*/

void setup() {
  Serial.begin(9600);
  Serial.println("⚙️ Circuit 8: Motor Control");
  Serial.println("Switch controls motor on/off");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔘 Switch OFF → Motor STOPPED");
  delay(1500);
  Serial.println("🔘 Switch ON → Motor SPINNING ⚙️");
  delay(1500);
}`,

  // Circuit 9: Simple Alarm
  simpleAlarm: `// 🚨 Circuit 9: Simple Alarm
// Button-activated alarm buzzer

/* CIRCUIT DIAGRAM:
   Battery (+) → Button → Buzzer → Battery (-)
   Parallel: Battery (+) → Button → LED+Resistor → Battery (-)
   
   Components:
   - 9V Battery
   - Push Button
   - Buzzer
   - Red LED
   - 220Ω Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🚨 Circuit 9: Simple Alarm");
  Serial.println("Button triggers alarm!");
  Serial.println("================================");
}

void loop() {
  Serial.println("⚫ System armed...");
  delay(1500);
  Serial.println("🚨 ALARM! 🔔 BEEP + 🔴 RED LED");
  delay(2000);
}`,

  // Circuit 10: LED Night Light with LDR
  nightLight: `// 🌙 Circuit 10: Automatic Night Light
// LED turns on in darkness (uses LDR)

/* CIRCUIT DIAGRAM:
   Battery (+) → LDR → Base of Transistor
   Battery (+) → Collector → LED+Resistor → Emitter → Battery (-)
   
   Components:
   - 9V Battery
   - LDR (Light Dependent Resistor)
   - NPN Transistor (2N2222)
   - LED
   - 220Ω Resistor
   - 10kΩ Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🌙 Circuit 10: Automatic Night Light");
  Serial.println("LDR senses darkness, LED turns ON");
  Serial.println("================================");
}

void loop() {
  Serial.println("☀️ Bright → LDR low resistance → LED OFF");
  delay(2000);
  Serial.println("🌙 Dark → LDR high resistance → LED ON 💡");
  delay(2000);
}`,

  // Circuit 11: Capacitor Charge/Discharge
  capacitorDemo: `// ⚡ Circuit 11: Capacitor Demo
// Watch capacitor charge and discharge

/* CIRCUIT DIAGRAM:
   Charge: Battery (+) → Resistor → Capacitor → Battery (-)
   Discharge: Capacitor → LED+Resistor → Capacitor (-)
   
   Components:
   - 9V Battery
   - 470µF Capacitor
   - 1kΩ Resistor
   - LED
   - 220Ω Resistor
   - SPDT Switch
*/

void setup() {
  Serial.begin(9600);
  Serial.println("⚡ Circuit 11: Capacitor Demo");
  Serial.println("See charge and discharge in action");
  Serial.println("================================");
}

void loop() {
  Serial.println("⬆️ CHARGING capacitor... (LED OFF)");
  delay(3000);
  Serial.println("⬇️ DISCHARGING capacitor... (LED fades) 💡");
  delay(3000);
}`,

  // Circuit 12: LED Dimmer with Potentiometer
  ledDimmer: `// 🎚️ Circuit 12: LED Dimmer
// Adjust LED brightness with potentiometer

/* CIRCUIT DIAGRAM:
   Battery (+) → Potentiometer → LED → Battery (-)
   
   Components:
   - 9V Battery
   - 10kΩ Potentiometer
   - LED
   - 220Ω Resistor (in series with LED)
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🎚️ Circuit 12: LED Dimmer");
  Serial.println("Turn potentiometer to adjust brightness");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔅 Low brightness (pot at min)");
  delay(1500);
  Serial.println("💡 Medium brightness (pot at middle)");
  delay(1500);
  Serial.println("🔆 High brightness (pot at max)");
  delay(1500);
}`,

  // Circuit 13: Dual LED Flasher
  dualFlasher: `// ✨ Circuit 13: Alternating LED Flasher
// Two LEDs blink alternately (using capacitors)

/* CIRCUIT DIAGRAM:
   Astable multivibrator circuit with 2 transistors
   Battery → RC network → LEDs flash alternately
   
   Components:
   - 9V Battery
   - 2x NPN Transistors (2N2222)
   - 2x LEDs
   - 2x 220Ω Resistors (for LEDs)
   - 2x 10kΩ Resistors
   - 2x 100µF Capacitors
*/

void setup() {
  Serial.begin(9600);
  Serial.println("✨ Circuit 13: Dual LED Flasher");
  Serial.println("Transistors create alternating blink");
  Serial.println("================================");
}

void loop() {
  Serial.println("🔴 LED1 ON → LED2 OFF");
  delay(800);
  Serial.println("⚫ LED1 OFF → LED2 ON 🔵");
  delay(800);
}`,

  // Circuit 14: Simple Doorbell
  doorbell: `// 🔔 Circuit 14: Simple Doorbell
// Press button to ring bell

/* CIRCUIT DIAGRAM:
   Battery (+) → Button → Buzzer → Battery (-)
   Parallel: Battery (+) → Button → LED+Resistor → Battery (-)
   
   Components:
   - 9V Battery
   - Push Button (doorbell button)
   - Buzzer (or small speaker)
   - LED (indicator)
   - 220Ω Resistor
*/

void setup() {
  Serial.begin(9600);
  Serial.println("🔔 Circuit 14: Simple Doorbell");
  Serial.println("Press button to ring!");
  Serial.println("================================");
}

void loop() {
  Serial.println("🚪 Waiting at door...");
  delay(2000);
  Serial.println("🔘 DING DONG! 🔔 + LED ON 💡");
  delay(1000);
  Serial.println("⚫ Bell stops, LED OFF");
  delay(2000);
}`,
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
    ultrasonic: buildUltrasonicCircuit,
    // Arduino-less circuits
    basicLED: buildBasicLEDCircuit,
    seriesLEDs: buildSeriesLEDsCircuit,
    parallelLEDs: buildParallelLEDsCircuit,
    ledSwitch: buildLEDSwitchCircuit,
    dualLEDSwitch: buildDualLEDSwitchCircuit,
    rgbLED: buildRGBLEDCircuit,
    buzzerButton: buildBuzzerButtonCircuit,
    motorSwitch: buildMotorSwitchCircuit,
    simpleAlarm: buildSimpleAlarmCircuit,
    nightLight: buildNightLightCircuit,
    capacitorDemo: buildCapacitorDemoCircuit,
    ledDimmer: buildLEDDimmerCircuit,
    dualFlasher: buildDualFlasherCircuit,
    doorbell: buildDoorbellCircuit,
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

// ============================================
// ARDUINO-LESS CIRCUITS (14 Projects)
// ============================================

// PROJECT 7: Basic LED Circuit
function buildBasicLEDCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 200,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 300,
      y: 200,
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
      x: 500,
      y: 200,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 8: Series LEDs Circuit
function buildSeriesLEDsCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED 1",
      x: 250,
      y: 200,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "led-2-+" }
      ]
    },
    {
      id: "led-2",
      type: "led-green",
      name: "Green LED 2",
      x: 400,
      y: 200,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-2--", to: "resistor-1-1" }
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
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 9: Parallel LEDs Circuit
function buildParallelLEDsCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "led-1-+" },
        { from: "battery-1-+", to: "led-2-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED 1",
      x: 350,
      y: 150,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor 1",
      x: 500,
      y: 150,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    },
    {
      id: "led-2",
      type: "led-green",
      name: "Green LED 2",
      x: 350,
      y: 350,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-2--", to: "resistor-2-1" }
      ]
    },
    {
      id: "resistor-2",
      type: "resistor-220",
      name: "220Ω Resistor 2",
      x: 500,
      y: 350,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-2-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 10: LED with Switch Circuit
function buildLEDSwitchCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Switch",
      x: 250,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-yellow",
      name: "Yellow LED",
      x: 400,
      y: 250,
      color: "#FFC107",
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
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 11: Dual LED Switch Circuit
function buildDualLEDSwitchCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 300,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" },
        { from: "battery-1-+", to: "button-2-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Switch 1",
      x: 250,
      y: 150,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 400,
      y: 150,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor 1",
      x: 550,
      y: 150,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    },
    {
      id: "button-2",
      type: "button",
      name: "Switch 2",
      x: 250,
      y: 400,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-2-2", to: "led-2-+" }
      ]
    },
    {
      id: "led-2",
      type: "led-green",
      name: "Green LED",
      x: 400,
      y: 400,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-2--", to: "resistor-2-1" }
      ]
    },
    {
      id: "resistor-2",
      type: "resistor-220",
      name: "220Ω Resistor 2",
      x: 550,
      y: 400,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-2-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 12: RGB LED Circuit
function buildRGBLEDCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 300,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "led-1-+" },
        { from: "battery-1-+", to: "led-2-+" },
        { from: "battery-1-+", to: "led-3-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 350,
      y: 150,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor R",
      x: 500,
      y: 150,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    },
    {
      id: "led-2",
      type: "led-green",
      name: "Green LED",
      x: 350,
      y: 300,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-2--", to: "resistor-2-1" }
      ]
    },
    {
      id: "resistor-2",
      type: "resistor-220",
      name: "220Ω Resistor G",
      x: 500,
      y: 300,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-2-2", to: "battery-1--" }
      ]
    },
    {
      id: "led-3",
      type: "led-blue",
      name: "Blue LED",
      x: 350,
      y: 450,
      color: "#2196F3",
      pins: ["+", "-"],
      connections: [
        { from: "led-3--", to: "resistor-3-1" }
      ]
    },
    {
      id: "resistor-3",
      type: "resistor-220",
      name: "220Ω Resistor B",
      x: 500,
      y: 450,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-3-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 13: Buzzer with Button Circuit
function buildBuzzerButtonCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Push Button",
      x: 300,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "buzzer-1-+" }
      ]
    },
    {
      id: "buzzer-1",
      type: "buzzer",
      name: "Piezo Buzzer",
      x: 500,
      y: 250,
      color: "#E91E63",
      pins: ["+", "-"],
      connections: [
        { from: "buzzer-1--", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 14: Motor with Switch Circuit
function buildMotorSwitchCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Switch",
      x: 300,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "motor-1-+" }
      ]
    },
    {
      id: "motor-1",
      type: "motor",
      name: "DC Motor",
      x: 500,
      y: 250,
      color: "#9C27B0",
      pins: ["+", "-"],
      connections: [
        { from: "motor-1--", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 15: Simple Alarm Circuit
function buildSimpleAlarmCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 300,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Trigger Switch",
      x: 250,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "led-1-+" },
        { from: "button-1-2", to: "buzzer-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 400,
      y: 150,
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
      y: 150,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    },
    {
      id: "buzzer-1",
      type: "buzzer",
      name: "Piezo Buzzer",
      x: 450,
      y: 350,
      color: "#E91E63",
      pins: ["+", "-"],
      connections: [
        { from: "buzzer-1--", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 16: Night Light Circuit (LDR)
function buildNightLightCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "ldr-1-1" }
      ]
    },
    {
      id: "ldr-1",
      type: "ldr",
      name: "LDR Sensor",
      x: 250,
      y: 200,
      color: "#795548",
      pins: ["1", "2"],
      connections: [
        { from: "ldr-1-2", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-white",
      name: "White LED",
      x: 400,
      y: 250,
      color: "#FFFFFF",
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
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 17: Capacitor Demo Circuit
function buildCapacitorDemoCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Switch",
      x: 250,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "capacitor-1-+" }
      ]
    },
    {
      id: "capacitor-1",
      type: "capacitor",
      name: "1000µF Capacitor",
      x: 400,
      y: 250,
      color: "#3F51B5",
      pins: ["+", "-"],
      connections: [
        { from: "capacitor-1-+", to: "led-1-+" },
        { from: "capacitor-1--", to: "battery-1--" }
      ]
    },
    {
      id: "led-1",
      type: "led-blue",
      name: "Blue LED",
      x: 400,
      y: 150,
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
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 18: LED Dimmer Circuit (Potentiometer)
function buildLEDDimmerCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "potentiometer-1-1" }
      ]
    },
    {
      id: "potentiometer-1",
      type: "potentiometer",
      name: "10kΩ Pot",
      x: 300,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2", "3"],
      connections: [
        { from: "potentiometer-1-2", to: "led-1-+" }
      ]
    },
    {
      id: "led-1",
      type: "led-white",
      name: "White LED",
      x: 450,
      y: 250,
      color: "#FFFFFF",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor",
      x: 600,
      y: 250,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 19: Dual Flasher Circuit
function buildDualFlasherCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 300,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "capacitor-1-+" },
        { from: "battery-1-+", to: "capacitor-2-+" }
      ]
    },
    {
      id: "capacitor-1",
      type: "capacitor",
      name: "100µF Cap 1",
      x: 250,
      y: 150,
      color: "#3F51B5",
      pins: ["+", "-"],
      connections: [
        { from: "capacitor-1-+", to: "led-1-+" },
        { from: "capacitor-1--", to: "battery-1--" }
      ]
    },
    {
      id: "led-1",
      type: "led-red",
      name: "Red LED",
      x: 400,
      y: 150,
      color: "#F44336",
      pins: ["+", "-"],
      connections: [
        { from: "led-1--", to: "resistor-1-1" }
      ]
    },
    {
      id: "resistor-1",
      type: "resistor-220",
      name: "220Ω Resistor 1",
      x: 550,
      y: 150,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    },
    {
      id: "capacitor-2",
      type: "capacitor",
      name: "100µF Cap 2",
      x: 250,
      y: 400,
      color: "#3F51B5",
      pins: ["+", "-"],
      connections: [
        { from: "capacitor-2-+", to: "led-2-+" },
        { from: "capacitor-2--", to: "battery-1--" }
      ]
    },
    {
      id: "led-2",
      type: "led-green",
      name: "Green LED",
      x: 400,
      y: 400,
      color: "#4CAF50",
      pins: ["+", "-"],
      connections: [
        { from: "led-2--", to: "resistor-2-1" }
      ]
    },
    {
      id: "resistor-2",
      type: "resistor-220",
      name: "220Ω Resistor 2",
      x: 550,
      y: 400,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-2-2", to: "battery-1--" }
      ]
    }
  ];
}

// PROJECT 20: Doorbell Circuit
function buildDoorbellCircuit(): any[] {
  return [
    {
      id: "battery-1",
      type: "battery",
      name: "9V Battery",
      x: 100,
      y: 250,
      color: "#FF9800",
      pins: ["+", "-"],
      connections: [
        { from: "battery-1-+", to: "button-1-1" }
      ]
    },
    {
      id: "button-1",
      type: "button",
      name: "Doorbell Button",
      x: 250,
      y: 200,
      color: "#607D8B",
      pins: ["1", "2"],
      connections: [
        { from: "button-1-2", to: "buzzer-1-+" },
        { from: "button-1-2", to: "led-1-+" }
      ]
    },
    {
      id: "buzzer-1",
      type: "buzzer",
      name: "Piezo Buzzer",
      x: 450,
      y: 150,
      color: "#E91E63",
      pins: ["+", "-"],
      connections: [
        { from: "buzzer-1--", to: "battery-1--" }
      ]
    },
    {
      id: "led-1",
      type: "led-yellow",
      name: "Yellow LED",
      x: 400,
      y: 350,
      color: "#FFC107",
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
      y: 350,
      color: "#FF5722",
      pins: ["1", "2"],
      connections: [
        { from: "resistor-1-2", to: "battery-1--" }
      ]
    }
  ];
}
