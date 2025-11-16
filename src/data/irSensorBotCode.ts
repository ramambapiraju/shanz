export const IR_SENSOR_BOT_CODE = `// IR Sensor Multi-Function Robot
// Modes: 1=Obstacle Avoidance, 2=Line Following, 3=Remote Control

// Motor pins
#define LEFT_MOTOR_FWD 5
#define LEFT_MOTOR_BWD 6
#define RIGHT_MOTOR_FWD 9
#define RIGHT_MOTOR_BWD 10

// IR Sensor pins
#define IR_FRONT_CENTER A0
#define IR_FRONT_LEFT A1
#define IR_FRONT_RIGHT A2
#define IR_BOTTOM A3

// Mode selection button
#define MODE_BUTTON 2

int currentMode = 1; // 1=Avoid, 2=Line Follow, 3=RC
int speed = 180;
int obstacleThreshold = 400;
int lineThreshold = 500;

void setup() {
  // Initialize motors
  pinMode(LEFT_MOTOR_FWD, OUTPUT);
  pinMode(LEFT_MOTOR_BWD, OUTPUT);
  pinMode(RIGHT_MOTOR_FWD, OUTPUT);
  pinMode(RIGHT_MOTOR_BWD, OUTPUT);
  
  // Initialize sensors
  pinMode(IR_FRONT_CENTER, INPUT);
  pinMode(IR_FRONT_LEFT, INPUT);
  pinMode(IR_FRONT_RIGHT, INPUT);
  pinMode(IR_BOTTOM, INPUT);
  
  pinMode(MODE_BUTTON, INPUT_PULLUP);
  
  Serial.begin(9600);
  Serial.println("🤖 IR Sensor Bot Initialized");
  Serial.println("Mode 1: Obstacle Avoidance");
  Serial.println("Mode 2: Line Following");
  Serial.println("Mode 3: Remote Control");
  Serial.println("Press button to change mode");
}

void loop() {
  // Check mode button
  if (digitalRead(MODE_BUTTON) == LOW) {
    currentMode++;
    if (currentMode > 3) currentMode = 1;
    Serial.print("Switched to Mode ");
    Serial.println(currentMode);
    stopMotors();
    delay(500);
  }
  
  // Execute current mode
  switch (currentMode) {
    case 1:
      obstacleAvoidanceMode();
      break;
    case 2:
      lineFollowingMode();
      break;
    case 3:
      remoteControlMode();
      break;
  }
  
  delay(50);
}

// Mode 1: Obstacle Avoidance
void obstacleAvoidanceMode() {
  int frontCenter = analogRead(IR_FRONT_CENTER);
  int frontLeft = analogRead(IR_FRONT_LEFT);
  int frontRight = analogRead(IR_FRONT_RIGHT);
  
  Serial.print("Avoid Mode | C:");
  Serial.print(frontCenter);
  Serial.print(" L:");
  Serial.print(frontLeft);
  Serial.print(" R:");
  Serial.println(frontRight);
  
  if (frontCenter > obstacleThreshold) {
    // Obstacle ahead
    Serial.println("⚠️ Obstacle detected! Turning...");
    stopMotors();
    delay(200);
    
    // Turn based on clearer side
    if (frontLeft < frontRight) {
      turnLeft();
    } else {
      turnRight();
    }
    delay(500);
  } else if (frontLeft > obstacleThreshold) {
    Serial.println("⚠️ Left obstacle! Turning right...");
    turnRight();
    delay(300);
  } else if (frontRight > obstacleThreshold) {
    Serial.println("⚠️ Right obstacle! Turning left...");
    turnLeft();
    delay(300);
  } else {
    // Clear path
    Serial.println("✅ Path clear - Moving forward");
    moveForward();
  }
}

// Mode 2: Line Following
void lineFollowingMode() {
  int lineValue = analogRead(IR_BOTTOM);
  
  Serial.print("Line Follow Mode | Sensor: ");
  Serial.println(lineValue);
  
  if (lineValue > lineThreshold) {
    // On dark line
    Serial.println("📍 On line - Moving forward");
    moveForward();
  } else {
    // Off line - search
    Serial.println("❌ Off line - Searching...");
    turnLeft();
    delay(100);
  }
}

// Mode 3: Remote Control
void remoteControlMode() {
  Serial.println("🎮 RC Mode - Waiting for commands");
  
  // Check for serial commands (simulated RC)
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    switch (cmd) {
      case 'F': moveForward(); break;
      case 'B': moveBackward(); break;
      case 'L': turnLeft(); break;
      case 'R': turnRight(); break;
      case 'S': stopMotors(); break;
    }
  }
  
  // For demo, auto-move forward
  moveForward();
  delay(100);
}

// Motor control functions
void moveForward() {
  analogWrite(LEFT_MOTOR_FWD, speed);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, speed);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}

void moveBackward() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, speed);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, speed);
}

void turnLeft() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, speed * 0.6);
  analogWrite(RIGHT_MOTOR_FWD, speed);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}

void turnRight() {
  analogWrite(LEFT_MOTOR_FWD, speed);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, speed * 0.6);
}

void stopMotors() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}`;
