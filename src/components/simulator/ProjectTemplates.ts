// Pre-built circuit templates for all projects

export const PROJECT_CODES = {
  siren: `// 🎵 Musical Bell / Siren Generator (555 Timer IC Circuit)
// ========================================================
// CIRCUIT EXPLANATION - No programming needed!
// This is a hardware-based circuit using 555 timer IC

/* CIRCUIT COMPONENTS:
 * - 555 Timer IC (NE555 or LM555)
 * - 8-ohm Speaker or Buzzer
 * - Transistor BC547 (for amplification)
 * - Resistors: 10kΩ (R1), 100kΩ (R2), 1kΩ (R3 - base resistor)
 * - Capacitors: 10µF (C1 - timing), 100µF (C2 - coupling)
 * - 9V Battery or 5V power supply
 * - Switch (optional - for on/off)
 */

/* HOW IT WORKS:
 * The 555 timer is configured in ASTABLE mode to generate 
 * continuous square wave pulses. These pulses create sound
 * when connected to a speaker through an amplifier transistor.
 * 
 * Frequency Formula: f = 1.44 / ((R1 + 2*R2) * C1)
 * With R1=10k, R2=100k, C1=10µF: f ≈ 0.69 Hz (adjustable)
 * 
 * The transistor BC547 amplifies the 555 output signal to 
 * drive the speaker with enough current.
 */

Serial Output:
"🎵 Musical Bell/Siren Generator"
"=============================="
"Circuit Type: 555 Timer Astable Oscillator"
"Components: IC 555, BC547, Speaker, Resistors, Capacitors"
""
"⚡ 555 Timer Pins:"
"  Pin 1: GND → Ground"
"  Pin 2: TRIGGER → Connected to Pin 6"
"  Pin 3: OUTPUT → To transistor base via 1kΩ"
"  Pin 4: RESET → Connected to VCC"
"  Pin 5: CONTROL → 0.01µF to GND (noise filter)"
"  Pin 6: THRESHOLD → R2 and Pin 2"
"  Pin 7: DISCHARGE → Between R1 and R2"
"  Pin 8: VCC → +9V"
""
"🔊 Sound Generation:"
"  R1 (10kΩ) + R2 (100kΩ) + C1 (10µF) set frequency"
"  Frequency ≈ 0.69 Hz (modify R2/C1 for different tones)"
"  Output drives BC547 transistor → Speaker"
""
"🎼 Tone Variations:"
"  - Change R2 for pitch (lower R = higher pitch)"
"  - Change C1 for tone quality"
"  - Add potentiometer for variable pitch control"
""
"✅ Circuit Active - Generating Sound!"
"💡 LED flashes in sync with audio pulses"`,

  trafficIC: `// 🚦 Traffic Light Controller (CD4017 + 555 Timer ICs)
// ====================================================
// CIRCUIT EXPLANATION - Pure IC logic, no microcontroller!

/* CIRCUIT COMPONENTS:
 * - 555 Timer IC (clock pulse generator)
 * - CD4017 Decade Counter IC
 * - 3x LEDs: Red, Yellow, Green
 * - 3x 220Ω Resistors (for LEDs)
 * - 2x 10kΩ Resistors (R1, R2 for 555 timer)
 * - 100µF Capacitor (C1 for 555 timing)
 * - 2x Diodes 1N4148 (optional - for logic)
 * - 9V Battery or 5V power supply
 */

/* HOW IT WORKS:
 * 555 TIMER (Clock Generator):
 * - Configured in astable mode
 * - Generates regular clock pulses (≈0.5 Hz)
 * - Each pulse advances the CD4017 counter
 * 
 * CD4017 DECADE COUNTER:
 * - Counts from 0 to 9, outputs go HIGH one at a time
 * - Q0 (Pin 3): Red LED
 * - Q1 (Pin 2): Yellow LED  
 * - Q2 (Pin 4): Green LED
 * - Q3 (Pin 7): Yellow LED (or use diode OR with Q1)
 * - Reset (Pin 15) connected to Q4 to create 4-state cycle
 * 
 * Sequence: RED → YELLOW → GREEN → YELLOW → repeat
 */

Serial Output:
"🚦 Traffic Light Controller"
"==========================="
"Circuit: CD4017 Counter + 555 Timer Clock"
"Pure IC Logic - No Programming Required!"
""
"⚡ 555 Timer Configuration (Clock Generator):"
"  Pin 1: GND"
"  Pin 2: TRIGGER → Pin 6"
"  Pin 3: OUTPUT → CD4017 Pin 14 (Clock)"
"  Pin 4: RESET → VCC"
"  Pin 5: CONTROL → 0.01µF to GND"
"  Pin 6: THRESHOLD → R2"
"  Pin 7: DISCHARGE → Between R1 & R2"
"  Pin 8: VCC"
"  Clock Frequency: ~0.5 Hz (2 sec per state)"
""
"🔢 CD4017 Decade Counter:"
"  Pin 14: CLOCK (from 555 pin 3)"
"  Pin 13: ENABLE → GND (always enabled)"
"  Pin 15: RESET → Q4 (Pin 10) for 4-state cycle"
"  Pin 16: VCC"
"  Pin 8: GND"
""
"💡 LED Connections:"
"  Q0 (Pin 3) → Red LED → 220Ω → GND"
"  Q1 (Pin 2) → Yellow LED → 220Ω → GND"
"  Q2 (Pin 4) → Green LED → 220Ω → GND"
"  Q3 (Pin 7) → Yellow LED (parallel with Q1)"
""
"🔄 State Sequence:"
"State 0 (Q0 HIGH): 🔴 RED LIGHT - STOP!"
"State 1 (Q1 HIGH): 🟡 YELLOW - Get Ready"  
"State 2 (Q2 HIGH): 🟢 GREEN - GO!"
"State 3 (Q3 HIGH): 🟡 YELLOW - Slow Down"
"[Q4 triggers RESET, cycle repeats]"
""
"⏱️ Timing controlled by 555: R1=10kΩ, R2=100kΩ, C1=100µF"
"Adjust R2 or C1 to change light duration"
""
"✅ Circuit Running - Traffic Light Sequencing!"`,

  blink: `// 1. Blinking LED
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("💡 Blinking LED Project");
  Serial.println("====================");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,

  traffic: `// 2. Traffic Light System
#define RED_PIN 11
#define YELLOW_PIN 12
#define GREEN_PIN 13

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🚦 Traffic Light System");
}

void loop() {
  // Red light
  digitalWrite(RED_PIN, HIGH);
  Serial.println("🔴 RED LIGHT - STOP!");
  delay(5000);
  digitalWrite(RED_PIN, LOW);
  
  // Yellow light
  digitalWrite(YELLOW_PIN, HIGH);
  Serial.println("🟡 YELLOW LIGHT - Get Ready");
  delay(2000);
  digitalWrite(YELLOW_PIN, LOW);
  
  // Green light
  digitalWrite(GREEN_PIN, HIGH);
  Serial.println("🟢 GREEN LIGHT - GO!");
  delay(5000);
  digitalWrite(GREEN_PIN, LOW);
  
  // Yellow again
  digitalWrite(YELLOW_PIN, HIGH);
  Serial.println("🟡 YELLOW LIGHT - Slow Down");
  delay(2000);
  digitalWrite(YELLOW_PIN, LOW);
}`,

  nightlight: `// 3. Automatic Night Light
#define LDR_PIN A0
#define LED_PIN 13
#define THRESHOLD 400

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🌙 Night Light Active");
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  Serial.print("Light Level: ");
  Serial.print(lightLevel);
  
  if (lightLevel < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println(" - LED ON 💡");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println(" - LED OFF");
  }
  delay(1000);
}`,

  alarm: `// 4. Buzzer Alarm System
#define BUTTON_PIN 2
#define BUZZER_PIN 8

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🔊 Alarm System Ready");
  Serial.println("Press button to trigger alarm");
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if (buttonState == LOW) {  // Active LOW with pullup
    Serial.println("🚨 ALARM ACTIVATED!");
    for(int i = 0; i < 3; i++) {
      tone(BUZZER_PIN, 1000);
      delay(300);
      tone(BUZZER_PIN, 1500);
      delay(300);
    }
    noTone(BUZZER_PIN);
  }
  delay(100);
}`,

  temperature: `// 5. Temperature Monitor
#define DHT_PIN 2

void setup() {
  pinMode(DHT_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("🌡️ Temperature Monitor");
  Serial.println("DHT11 Sensor Active");
  Serial.println("===================");
}

void loop() {
  // Simulate DHT11 readings (in real project, use DHT library)
  float temperature = 22.5 + random(-50, 50) / 10.0;
  float humidity = 55.0 + random(-100, 100) / 10.0;
  
  Serial.print("🌡️ Temp: ");
  Serial.print(temperature, 1);
  Serial.print("°C | 💧 Humidity: ");
  Serial.print(humidity, 0);
  Serial.println("%");
  
  if(temperature > 25) {
    Serial.println("⚠️ High temperature!");
  }
  
  delay(2000);
}`,

  motion: `// 6. Motion Detector Light
#define PIR_PIN 7
#define LED_PIN 13

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("👋 Motion Detector Active");
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("🚨 MOTION DETECTED! Light ON");
    delay(5000);
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("No motion...");
    delay(1000);
  }
}`,

  rgb: `// 7. RGB Color Mixer
#define RED_PIN 9
#define GREEN_PIN 10
#define BLUE_PIN 11

int r = 0, g = 0, b = 0;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🌈 RGB Color Mixer");
}

void loop() {
  for(int i = 0; i < 256; i++) {
    r = 255 - i;
    g = i;
    b = (i + 128) % 256;
    
    analogWrite(RED_PIN, r);
    analogWrite(GREEN_PIN, g);
    analogWrite(BLUE_PIN, b);
    
    Serial.print("RGB: ");
    Serial.print(r); Serial.print(",");
    Serial.print(g); Serial.print(",");
    Serial.println(b);
    delay(50);
  }
}`,

  counter: `// 8. Button Press Counter
#define BUTTON_PIN 2
#define LED_PIN 13

int counter = 0;
int lastState = HIGH;  // Start HIGH for pullup

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🔘 Button Counter Ready");
  Serial.println("Press button to count");
  Serial.println("Count: 0");
}

void loop() {
  int currentState = digitalRead(BUTTON_PIN);
  
  if (currentState == LOW && lastState == HIGH) {  // Button pressed (active LOW)
    delay(50);  // Debounce
    counter++;
    digitalWrite(LED_PIN, HIGH);
    Serial.print("🔘 Button Press #");
    Serial.println(counter);
    delay(200);
    digitalWrite(LED_PIN, LOW);
  }
  
  lastState = currentState;
  delay(10);
}`,

  distance: `// 9. Distance Alert System
#define TRIG_PIN 9
#define ECHO_PIN 10
#define BUZZER_PIN 8
#define LED_PIN 13

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("📡 Distance Alert System");
}

void loop() {
  long duration, distance;
  
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance < 30) {
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 2000);
    Serial.println("⚠️ TOO CLOSE!");
    delay(200);
    noTone(BUZZER_PIN);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(500);
}`,

  fan: `// 10. Variable Fan Speed Controller
#define POT_PIN A0
#define MOTOR_PIN 6

void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("⚙️ Fan Speed Controller");
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int speed = map(potValue, 0, 1023, 0, 255);
  
  analogWrite(MOTOR_PIN, speed);
  
  Serial.print("Fan Speed: ");
  Serial.print(map(speed, 0, 255, 0, 100));
  Serial.println("%");
  
  delay(500);
}`,

  // MID-LEVEL PROJECTS (More Complex)
  
  smartLighting: `// 11. Smart Lighting System (Mid-Level)
#define LDR_PIN A0
#define PIR_PIN 7
#define LED_PIN 13
#define THRESHOLD 400

bool motionDetected = false;
int lightLevel = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("💡 Smart Lighting System v2.0");
  Serial.println("Auto mode: Light + Motion sensing");
  Serial.println("================================");
}

void loop() {
  lightLevel = analogRead(LDR_PIN);
  motionDetected = digitalRead(PIR_PIN);
  
  Serial.print("Light: ");
  Serial.print(lightLevel);
  Serial.print(" | Motion: ");
  Serial.print(motionDetected ? "YES" : "NO");
  
  if (lightLevel < THRESHOLD && motionDetected) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println(" → 💡 LIGHT ON (Auto)");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.print(" → Light OFF");
    if (lightLevel >= THRESHOLD) Serial.print(" (Bright)");
    if (!motionDetected) Serial.print(" (No motion)");
    Serial.println();
  }
  
  delay(800);
}`,

  parkingSensor: `// 12. Parking Sensor System (Mid-Level)
#define TRIG_PIN 9
#define ECHO_PIN 10
#define BUZZER_PIN 8
#define LED_GREEN 11
#define LED_YELLOW 12
#define LED_RED 13

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  Serial.begin(9600);
  Serial.println("🚗 Parking Sensor System");
  Serial.println("Safe: >50cm | Warning: 20-50cm | Danger: <20cm");
  Serial.println("=============================================");
}

void loop() {
  long duration, distance;
  
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm → ");
  
  // Turn off all first
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  noTone(BUZZER_PIN);
  
  if (distance > 50) {
    digitalWrite(LED_GREEN, HIGH);
    Serial.println("✅ SAFE ZONE");
  } else if (distance > 20) {
    digitalWrite(LED_YELLOW, HIGH);
    tone(BUZZER_PIN, 1000);
    delay(100);
    noTone(BUZZER_PIN);
    Serial.println("⚠️ WARNING ZONE");
  } else {
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER_PIN, 2500);
    Serial.println("🚨 DANGER! TOO CLOSE!");
  }
  
  delay(300);
}`,

  thermostat: `// 13. Smart Thermostat (Mid-Level)
#define DHT_PIN 2
#define FAN_PIN 6
#define HEATER_PIN 7
#define TEMP_DISPLAY_PIN 13

float targetTemp = 24.0;
float currentTemp = 0;
float hysteresis = 1.0;

void setup() {
  pinMode(FAN_PIN, OUTPUT);
  pinMode(HEATER_PIN, OUTPUT);
  pinMode(TEMP_DISPLAY_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🌡️ Smart Thermostat Control");
  Serial.print("Target Temperature: ");
  Serial.print(targetTemp);
  Serial.println("°C");
  Serial.println("================================");
}

void loop() {
  currentTemp = 22.0 + random(-30, 80) / 10.0;
  float humidity = 50.0 + random(-100, 100) / 10.0;
  
  Serial.print("Current: ");
  Serial.print(currentTemp, 1);
  Serial.print("°C | Target: ");
  Serial.print(targetTemp, 1);
  Serial.print("°C | Humidity: ");
  Serial.print(humidity, 0);
  Serial.print("% → ");
  
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(HEATER_PIN, LOW);
  
  if (currentTemp > targetTemp + hysteresis) {
    digitalWrite(FAN_PIN, HIGH);
    digitalWrite(TEMP_DISPLAY_PIN, HIGH);
    Serial.println("❄️ COOLING (Fan ON)");
  } else if (currentTemp < targetTemp - hysteresis) {
    digitalWrite(HEATER_PIN, HIGH);
    digitalWrite(TEMP_DISPLAY_PIN, HIGH);
    Serial.println("🔥 HEATING (Heater ON)");
  } else {
    digitalWrite(TEMP_DISPLAY_PIN, LOW);
    Serial.println("✅ Temperature OK");
  }
  
  delay(1500);
}`,

  securitySystem: `// 14. Security Alarm System (Mid-Level)
#define PIR_PIN 7
#define BUTTON_ARM 2
#define BUZZER_PIN 8
#define LED_ALARM 13

bool systemArmed = true;
bool alarmTriggered = false;
int lastButtonState = HIGH;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(BUTTON_ARM, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_ALARM, OUTPUT);
  Serial.begin(9600);
  Serial.println("🔒 Security System v2.0");
  Serial.println("========================");
  Serial.println("System: ARMED ✓");
  Serial.println("Press button to toggle arm/disarm");
}

void loop() {
  bool motion = digitalRead(PIR_PIN);
  int buttonState = digitalRead(BUTTON_ARM);
  
  // Button press detection (active LOW with pullup)
  if (buttonState == LOW && lastButtonState == HIGH) {
    delay(50);  // Debounce
    systemArmed = !systemArmed;
    alarmTriggered = false;
    noTone(BUZZER_PIN);
    digitalWrite(LED_ALARM, LOW);
    
    Serial.println("========================");
    Serial.print("System: ");
    Serial.println(systemArmed ? "🔒 ARMED" : "🔓 DISARMED");
    Serial.println("========================");
    delay(300);
  }
  lastButtonState = buttonState;
  
  // Alarm logic
  if (systemArmed && motion) {
    alarmTriggered = true;
  }
  
  if (alarmTriggered && systemArmed) {
    digitalWrite(LED_ALARM, HIGH);
    tone(BUZZER_PIN, 2000 + (millis() % 500));
    Serial.println("🚨 ALARM! Motion detected!");
  } else {
    digitalWrite(LED_ALARM, LOW);
    noTone(BUZZER_PIN);
    if (systemArmed) {
      Serial.println("🔒 System armed - Monitoring...");
    }
  }
  
  delay(800);
}`,

  musicPlayer: `// 15. Music Player with Buzzer (Mid-Level)
#define BUZZER_PIN 8
#define BUTTON_PLAY 2
#define BUTTON_NEXT 3
#define LED_PIN 13

int currentSong = 0;
bool isPlaying = true;  // Auto-start
int noteIndex = 0;
unsigned long lastNoteTime = 0;
int lastPlayState = HIGH;
int lastNextState = HIGH;

// Two simple melodies
int melody1[] = {262, 294, 330, 349, 392, 440, 494, 523};  // C Major scale
int melody2[] = {523, 494, 440, 392, 349, 330, 294, 262};  // Descending
int tempo = 500;  // Note duration

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PLAY, INPUT_PULLUP);
  pinMode(BUTTON_NEXT, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("🎵 Music Player System");
  Serial.println("=======================");
  Serial.println("Button 1: Play/Pause");
  Serial.println("Button 2: Next Song");
  Serial.println("▶️ Auto-playing Song 1...");
}

void loop() {
  int playState = digitalRead(BUTTON_PLAY);
  int nextState = digitalRead(BUTTON_NEXT);
  
  // Play/Pause toggle
  if (playState == LOW && lastPlayState == HIGH) {
    delay(50);
    isPlaying = !isPlaying;
    Serial.println(isPlaying ? "▶️ Resumed" : "⏸️ Paused");
    if (!isPlaying) {
      noTone(BUZZER_PIN);
      digitalWrite(LED_PIN, LOW);
    }
    delay(200);
  }
  lastPlayState = playState;
  
  // Next song
  if (nextState == LOW && lastNextState == HIGH) {
    delay(50);
    currentSong = (currentSong + 1) % 2;
    noteIndex = 0;
    Serial.print("⏭️ Switched to Song ");
    Serial.println(currentSong + 1);
    delay(200);
  }
  lastNextState = nextState;
  
  // Play music
  if (isPlaying && (millis() - lastNoteTime >= tempo)) {
    int* currentMelody = (currentSong == 0) ? melody1 : melody2;
    
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, currentMelody[noteIndex]);
    
    Serial.print("♪ Note ");
    Serial.print(noteIndex + 1);
    Serial.print("/8 - ");
    Serial.print(currentMelody[noteIndex]);
    Serial.println(" Hz");
    
    noteIndex = (noteIndex + 1) % 8;
    lastNoteTime = millis();
  }
  
  delay(10);
}`,
};

export const buildProjectCircuit = (projectId: string) => {
  const baseX = 100;
  const baseY = 50;
  
  switch (projectId) {
    case 'siren':
      // 555 Timer IC Sound Generator Circuit (Breadboard)
      return [
        { id: 'breadboard-1', type: 'breadboard', name: 'Breadboard', x: baseX + 200, y: baseY + 100, color: '#F5F5F5', pins: [], connections: [] },
        { id: 'battery-1', type: 'battery', name: '9V Battery', x: baseX, y: baseY, color: '#4CAF50', pins: ['+', '-'], connections: [
          { from: 'battery-1-+', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-2-1' }
        ] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10kΩ R1', x: baseX + 150, y: baseY, color: '#FF9800', pins: ['1', '2'], connections: [] },
        { id: 'led-1', type: 'led-red', name: 'Status LED', x: baseX + 150, y: baseY + 70, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 150, y: baseY + 130, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-3', type: 'resistor-100k', name: '100kΩ R2', x: baseX + 300, y: baseY, color: '#FF9800', pins: ['1', '2'], connections: [
          { from: 'resistor-3-1', to: 'resistor-1-2' },
          { from: 'resistor-3-2', to: 'resistor-4-1' }
        ] },
        { id: 'resistor-4', type: 'resistor-1k', name: '1kΩ R3', x: baseX + 450, y: baseY + 50, color: '#FF5722', pins: ['1', '2'], connections: [
          { from: 'resistor-4-2', to: 'buzzer-1-+' }
        ] },
        { id: 'buzzer-1', type: 'buzzer', name: '8Ω Speaker', x: baseX + 450, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [
          { from: 'buzzer-1--', to: 'battery-1--' }
        ] }
      ];

    case 'trafficIC':
      // CD4017 + 555 Timer Traffic Light Circuit (Breadboard)
      return [
        { id: 'breadboard-1', type: 'breadboard', name: 'Breadboard', x: baseX + 200, y: baseY + 150, color: '#F5F5F5', pins: [], connections: [] },
        { id: 'battery-1', type: 'battery', name: '9V Battery', x: baseX, y: baseY, color: '#4CAF50', pins: ['+', '-'], connections: [
          { from: 'battery-1-+', to: 'resistor-1-1' }
        ] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10kΩ R1', x: baseX + 150, y: baseY, color: '#FF9800', pins: ['1', '2'], connections: [
          { from: 'resistor-1-2', to: 'resistor-2-1' }
        ] },
        { id: 'resistor-2', type: 'resistor-100k', name: '100kΩ R2', x: baseX + 300, y: baseY, color: '#FF9800', pins: ['1', '2'], connections: [
          { from: 'resistor-2-2', to: 'led-red-+' }
        ] },
        { id: 'led-red', type: 'led-red', name: 'Red LED', x: baseX + 450, y: baseY + 50, color: '#F44336', pins: ['+', '-'], connections: [
          { from: 'led-red--', to: 'resistor-3-1' }
        ] },
        { id: 'resistor-3', type: 'resistor-220', name: '220Ω', x: baseX + 600, y: baseY + 50, color: '#FF5722', pins: ['1', '2'], connections: [
          { from: 'resistor-3-2', to: 'battery-1--' }
        ] },
        { id: 'led-yellow', type: 'led-yellow', name: 'Yellow LED', x: baseX + 450, y: baseY + 150, color: '#FFEB3B', pins: ['+', '-'], connections: [
          { from: 'led-yellow-+', to: 'resistor-2-2' },
          { from: 'led-yellow--', to: 'resistor-4-1' }
        ] },
        { id: 'resistor-4', type: 'resistor-220', name: '220Ω', x: baseX + 600, y: baseY + 150, color: '#FF5722', pins: ['1', '2'], connections: [
          { from: 'resistor-4-2', to: 'battery-1--' }
        ] },
        { id: 'led-green', type: 'led-green', name: 'Green LED', x: baseX + 450, y: baseY + 250, color: '#4CAF50', pins: ['+', '-'], connections: [
          { from: 'led-green-+', to: 'resistor-2-2' },
          { from: 'led-green--', to: 'resistor-5-1' }
        ] },
        { id: 'resistor-5', type: 'resistor-220', name: '220Ω', x: baseX + 600, y: baseY + 250, color: '#FF5722', pins: ['1', '2'], connections: [
          { from: 'resistor-5-2', to: 'battery-1--' }
        ] }
      ];

    case 'blink':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY, color: '#00979D', pins: ['D13', 'GND'], connections: [
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'led-1', type: 'led-red', name: 'Red LED', x: baseX + 250, y: baseY + 50, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω Resistor', x: baseX + 250, y: baseY + 150, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'traffic':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D11', 'D12', 'D13', 'GND'], connections: [
          { from: 'arduino-1-D11', to: 'led-red-+' },
          { from: 'arduino-1-D12', to: 'led-yellow-+' },
          { from: 'arduino-1-D13', to: 'led-green-+' },
          { from: 'led-red--', to: 'resistor-1-1' },
          { from: 'led-yellow--', to: 'resistor-2-1' },
          { from: 'led-green--', to: 'resistor-3-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'resistor-2-2', to: 'arduino-1-GND' },
          { from: 'resistor-3-2', to: 'arduino-1-GND' }
        ] },
        { id: 'led-red', type: 'led-red', name: 'Red LED', x: baseX + 300, y: baseY, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'led-yellow', type: 'led-yellow', name: 'Yellow LED', x: baseX + 300, y: baseY + 100, color: '#FFEB3B', pins: ['+', '-'], connections: [] },
        { id: 'led-green', type: 'led-green', name: 'Green LED', x: baseX + 300, y: baseY + 200, color: '#4CAF50', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 50, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 150, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-3', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 250, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'nightlight':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['A0', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'ldr-1-1' },
          { from: 'ldr-1-2', to: 'arduino-1-A0' },
          { from: 'arduino-1-A0', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-2-1' },
          { from: 'resistor-2-2', to: 'arduino-1-GND' }
        ] },
        { id: 'ldr-1', type: 'ldr', name: 'Light Sensor', x: baseX + 250, y: baseY, color: '#FFC107', pins: ['1', '2'], connections: [] },
        { id: 'led-1', type: 'led-blue', name: 'Blue LED', x: baseX + 250, y: baseY + 150, color: '#2196F3', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10KΩ', x: baseX + 400, y: baseY + 50, color: '#9E9E9E', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 400, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'alarm':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', 'D8', 'GND'], connections: [
          { from: 'arduino-1-D2', to: 'button-1-1' },
          { from: 'button-1-2', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D8', to: 'buzzer-1-+' },
          { from: 'buzzer-1--', to: 'arduino-1-GND' }
        ] },
        { id: 'button-1', type: 'button', name: 'Push Button', x: baseX + 250, y: baseY, color: '#607D8B', pins: ['1', '2'], connections: [] },
        { id: 'buzzer-1', type: 'buzzer', name: 'Buzzer', x: baseX + 250, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10KΩ', x: baseX + 400, y: baseY + 50, color: '#9E9E9E', pins: ['1', '2'], connections: [] }
      ];
      
    case 'temperature':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'dht11-1-VCC' },
          { from: 'arduino-1-D2', to: 'dht11-1-DATA' },
          { from: 'dht11-1-GND', to: 'arduino-1-GND' },
          { from: 'dht11-1-VCC', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'dht11-1-DATA' }
        ] },
        { id: 'dht11-1', type: 'dht11', name: 'DHT11 Sensor', x: baseX + 300, y: baseY + 50, color: '#FF5722', pins: ['VCC', 'DATA', 'GND'], connections: [] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10KΩ Pull-up', x: baseX + 450, y: baseY + 100, color: '#9E9E9E', pins: ['1', '2'], connections: [] }
      ];
      
    case 'motion':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D7', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'pir-1-VCC' },
          { from: 'pir-1-OUT', to: 'arduino-1-D7' },
          { from: 'pir-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'pir-1', type: 'pir-sensor', name: 'PIR Sensor', x: baseX + 250, y: baseY, color: '#E91E63', pins: ['VCC', 'OUT', 'GND'], connections: [] },
        { id: 'led-1', type: 'led-yellow', name: 'Yellow LED', x: baseX + 250, y: baseY + 150, color: '#FFEB3B', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 400, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'rgb':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D9', 'D10', 'D11', 'GND'], connections: [
          { from: 'arduino-1-D9', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'led-rgb-1-R' },
          { from: 'arduino-1-D10', to: 'resistor-2-1' },
          { from: 'resistor-2-2', to: 'led-rgb-1-G' },
          { from: 'arduino-1-D11', to: 'resistor-3-1' },
          { from: 'resistor-3-2', to: 'led-rgb-1-B' },
          { from: 'led-rgb-1-GND', to: 'arduino-1-GND' }
        ] },
        { id: 'led-rgb-1', type: 'led-rgb', name: 'RGB LED', x: baseX + 300, y: baseY + 50, color: '#9C27B0', pins: ['R', 'G', 'B', 'GND'], connections: [], state: { active: false, value: 0, r: 0, g: 0, b: 0 } },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 100, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-3', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'counter':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', 'D13', 'GND'], connections: [
          { from: 'arduino-1-D2', to: 'button-1-1' },
          { from: 'button-1-2', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-2-1' },
          { from: 'resistor-2-2', to: 'arduino-1-GND' }
        ] },
        { id: 'button-1', type: 'button', name: 'Push Button', x: baseX + 250, y: baseY, color: '#607D8B', pins: ['1', '2'], connections: [] },
        { id: 'led-1', type: 'led-green', name: 'Green LED', x: baseX + 250, y: baseY + 150, color: '#4CAF50', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10KΩ', x: baseX + 400, y: baseY + 50, color: '#9E9E9E', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 400, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'distance':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D9', 'D10', 'D8', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'ultrasonic-1-VCC' },
          { from: 'arduino-1-D9', to: 'ultrasonic-1-TRIG' },
          { from: 'arduino-1-D10', to: 'ultrasonic-1-ECHO' },
          { from: 'ultrasonic-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D8', to: 'buzzer-1-+' },
          { from: 'buzzer-1--', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'ultrasonic-1', type: 'ultrasonic', name: 'HC-SR04', x: baseX + 300, y: baseY, color: '#4CAF50', pins: ['VCC', 'TRIG', 'ECHO', 'GND'], connections: [] },
        { id: 'buzzer-1', type: 'buzzer', name: 'Buzzer', x: baseX + 300, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [] },
        { id: 'led-1', type: 'led-red', name: 'Red LED', x: baseX + 300, y: baseY + 250, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 300, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    case 'fan':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['A0', 'D6', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'pot-1-VCC' },
          { from: 'pot-1-WIPER', to: 'arduino-1-A0' },
          { from: 'pot-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D6', to: 'motor-1-+' },
          { from: 'motor-1--', to: 'battery-1--' },
          { from: 'battery-1-+', to: 'arduino-1-GND' }
        ] },
        { id: 'pot-1', type: 'potentiometer', name: 'Potentiometer', x: baseX + 250, y: baseY, color: '#FF9800', pins: ['VCC', 'WIPER', 'GND'], connections: [] },
        { id: 'motor-1', type: 'dc-motor', name: 'DC Motor', x: baseX + 250, y: baseY + 150, color: '#673AB7', pins: ['+', '-'], connections: [] },
        { id: 'battery-1', type: 'battery', name: '9V Battery', x: baseX + 400, y: baseY + 100, color: '#424242', pins: ['+', '-'], connections: [] }
      ];

    // MID-LEVEL PROJECTS
    
    case 'smartLighting':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['A0', 'D7', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'ldr-1-1' },
          { from: 'ldr-1-2', to: 'arduino-1-A0' },
          { from: 'arduino-1-A0', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-5V', to: 'pir-1-VCC' },
          { from: 'pir-1-OUT', to: 'arduino-1-D7' },
          { from: 'pir-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-2-1' },
          { from: 'resistor-2-2', to: 'arduino-1-GND' }
        ] },
        { id: 'ldr-1', type: 'ldr', name: 'LDR Sensor', x: baseX + 250, y: baseY, color: '#FFC107', pins: ['1', '2'], connections: [] },
        { id: 'pir-1', type: 'pir-sensor', name: 'PIR Sensor', x: baseX + 400, y: baseY, color: '#E91E63', pins: ['VCC', 'OUT', 'GND'], connections: [] },
        { id: 'led-1', type: 'led-blue', name: 'Smart LED', x: baseX + 300, y: baseY + 150, color: '#2196F3', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-10k', name: '10KΩ', x: baseX + 250, y: baseY + 50, color: '#9E9E9E', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 300, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];

    case 'parkingSensor':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 100, color: '#00979D', pins: ['D9', 'D10', 'D8', 'D11', 'D12', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'ultrasonic-1-VCC' },
          { from: 'arduino-1-D9', to: 'ultrasonic-1-TRIG' },
          { from: 'arduino-1-D10', to: 'ultrasonic-1-ECHO' },
          { from: 'ultrasonic-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D8', to: 'buzzer-1-+' },
          { from: 'buzzer-1--', to: 'arduino-1-GND' },
          { from: 'arduino-1-D11', to: 'led-red-+' },
          { from: 'led-red--', to: 'resistor-1-1' },
          { from: 'arduino-1-D12', to: 'led-yellow-+' },
          { from: 'led-yellow--', to: 'resistor-2-1' },
          { from: 'arduino-1-D13', to: 'led-green-+' },
          { from: 'led-green--', to: 'resistor-3-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' },
          { from: 'resistor-2-2', to: 'arduino-1-GND' },
          { from: 'resistor-3-2', to: 'arduino-1-GND' }
        ] },
        { id: 'ultrasonic-1', type: 'ultrasonic', name: 'HC-SR04', x: baseX + 300, y: baseY, color: '#4CAF50', pins: ['VCC', 'TRIG', 'ECHO', 'GND'], connections: [] },
        { id: 'buzzer-1', type: 'buzzer', name: 'Buzzer', x: baseX + 300, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [] },
        { id: 'led-red', type: 'led-red', name: 'Red LED', x: baseX + 300, y: baseY + 250, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'led-yellow', type: 'led-yellow', name: 'Yellow LED', x: baseX + 400, y: baseY + 250, color: '#FFEB3B', pins: ['+', '-'], connections: [] },
        { id: 'led-green', type: 'led-green', name: 'Green LED', x: baseX + 500, y: baseY + 250, color: '#4CAF50', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 300, y: baseY + 300, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-2', type: 'resistor-220', name: '220Ω', x: baseX + 400, y: baseY + 300, color: '#FF5722', pins: ['1', '2'], connections: [] },
        { id: 'resistor-3', type: 'resistor-220', name: '220Ω', x: baseX + 500, y: baseY + 300, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];

    case 'thermostat':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', 'D6', 'D7', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'dht11-1-VCC' },
          { from: 'arduino-1-D2', to: 'dht11-1-DATA' },
          { from: 'dht11-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D6', to: 'motor-1-+' },
          { from: 'motor-1--', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'dht11-1', type: 'dht11', name: 'DHT11 Temp', x: baseX + 300, y: baseY, color: '#FF5722', pins: ['VCC', 'DATA', 'GND'], connections: [] },
        { id: 'motor-1', type: 'dc-motor', name: 'Cooling Fan', x: baseX + 300, y: baseY + 150, color: '#673AB7', pins: ['+', '-'], connections: [] },
        { id: 'led-1', type: 'led-blue', name: 'Status LED', x: baseX + 450, y: baseY + 100, color: '#2196F3', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 150, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];

    case 'securitySystem':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', 'D3', 'D7', 'D8', 'D13', '5V', 'GND'], connections: [
          { from: 'arduino-1-5V', to: 'pir-1-VCC' },
          { from: 'pir-1-OUT', to: 'arduino-1-D7' },
          { from: 'pir-1-GND', to: 'arduino-1-GND' },
          { from: 'arduino-1-D2', to: 'button-1-1' },
          { from: 'button-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D8', to: 'buzzer-1-+' },
          { from: 'buzzer-1--', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'pir-1', type: 'pir-sensor', name: 'Motion Sensor', x: baseX + 250, y: baseY, color: '#E91E63', pins: ['VCC', 'OUT', 'GND'], connections: [] },
        { id: 'button-1', type: 'button', name: 'Arm/Disarm', x: baseX + 400, y: baseY, color: '#607D8B', pins: ['1', '2'], connections: [] },
        { id: 'buzzer-1', type: 'buzzer', name: 'Alarm', x: baseX + 300, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [] },
        { id: 'led-1', type: 'led-red', name: 'Status LED', x: baseX + 450, y: baseY + 150, color: '#F44336', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];

    case 'musicPlayer':
      return [
        { id: 'arduino-1', type: 'arduino', name: 'Arduino Uno', x: baseX, y: baseY + 50, color: '#00979D', pins: ['D2', 'D3', 'D8', 'D13', 'GND'], connections: [
          { from: 'arduino-1-D2', to: 'button-1-1' },
          { from: 'button-1-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D3', to: 'button-2-1' },
          { from: 'button-2-2', to: 'arduino-1-GND' },
          { from: 'arduino-1-D8', to: 'buzzer-1-+' },
          { from: 'buzzer-1--', to: 'arduino-1-GND' },
          { from: 'arduino-1-D13', to: 'led-1-+' },
          { from: 'led-1--', to: 'resistor-1-1' },
          { from: 'resistor-1-2', to: 'arduino-1-GND' }
        ] },
        { id: 'button-1', type: 'button', name: 'Play/Pause', x: baseX + 250, y: baseY, color: '#607D8B', pins: ['1', '2'], connections: [] },
        { id: 'button-2', type: 'button', name: 'Next Song', x: baseX + 400, y: baseY, color: '#607D8B', pins: ['1', '2'], connections: [] },
        { id: 'buzzer-1', type: 'buzzer', name: 'Speaker', x: baseX + 300, y: baseY + 150, color: '#E91E63', pins: ['+', '-'], connections: [] },
        { id: 'led-1', type: 'led-blue', name: 'Playing LED', x: baseX + 450, y: baseY + 150, color: '#2196F3', pins: ['+', '-'], connections: [] },
        { id: 'resistor-1', type: 'resistor-220', name: '220Ω', x: baseX + 450, y: baseY + 200, color: '#FF5722', pins: ['1', '2'], connections: [] }
      ];
      
    default:
      return [];
  }
};
