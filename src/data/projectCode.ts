// Microcontroller code templates for each project

export const PROJECT_CODE: Record<string, string> = {
  // 5-in-1 Educational Robot Projects
  basic_car: `/*
 * Basic Car - Simple 2-Motor Robot
 * Perfect for beginners learning motor control
 * 
 * Hardware:
 * - Arduino Uno
 * - 2x DC Motors
 * - 4x Wheels
 * - L298N Motor Driver / ESC
 * - LiPo Battery
 */

// Motor pin definitions
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11

#define SPEED 200  // Motor speed (0-255)

void setup() {
  Serial.begin(9600);
  
  // Initialize motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  Serial.println("Basic Car Ready!");
}

void loop() {
  // Move forward for 2 seconds
  moveForward();
  delay(2000);
  
  // Turn right for 1 second
  turnRight();
  delay(1000);
  
  // Move forward for 2 seconds
  moveForward();
  delay(2000);
  
  // Turn left for 1 second
  turnLeft();
  delay(1000);
}

void moveForward() {
  Serial.println("Moving Forward");
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void turnRight() {
  Serial.println("Turning Right");
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  
  digitalWrite(MOTOR_RIGHT_DIR1, LOW);
  digitalWrite(MOTOR_RIGHT_DIR2, HIGH);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void turnLeft() {
  Serial.println("Turning Left");
  digitalWrite(MOTOR_LEFT_DIR1, LOW);
  digitalWrite(MOTOR_LEFT_DIR2, HIGH);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}`,

  buddy_bot: `/*
 * Buddy Bot - Hand Following Robot
 * Follows objects/hands using proximity sensor
 * 
 * Hardware:
 * - Arduino Uno
 * - 2x DC Motors
 * - HC-SR04 Ultrasonic Sensor
 * - L298N Motor Driver
 * - LiPo Battery
 */

// Motor pins
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11

// Sensor pins
#define TRIG_PIN 12
#define ECHO_PIN 13

#define TARGET_DISTANCE 20  // Ideal following distance (cm)
#define TOLERANCE 5         // Distance tolerance
#define SPEED 180

void setup() {
  Serial.begin(9600);
  
  // Motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  // Sensor pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  Serial.println("Buddy Bot - Following Mode Active!");
}

void loop() {
  float distance = getDistance();
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance > TARGET_DISTANCE + TOLERANCE) {
    // Object too far - move forward
    moveForward();
    Serial.println("Following...");
  } else if (distance < TARGET_DISTANCE - TOLERANCE && distance > 5) {
    // Object too close - move backward
    moveBackward();
    Serial.println("Too close, backing up...");
  } else {
    // Just right - stop
    stopMotors();
    Serial.println("Perfect distance!");
  }
  
  delay(100);
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;
  
  return distance;
}

void moveForward() {
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void moveBackward() {
  digitalWrite(MOTOR_LEFT_DIR1, LOW);
  digitalWrite(MOTOR_LEFT_DIR2, HIGH);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  digitalWrite(MOTOR_RIGHT_DIR1, LOW);
  digitalWrite(MOTOR_RIGHT_DIR2, HIGH);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT_PWM, 0);
  analogWrite(MOTOR_RIGHT_PWM, 0);
}`,

  backoff_bot: `/*
 * Back Off Bot - IR Sensor Obstacle Avoidance
 * Reverses when IR sensor detects obstacle ahead
 * 
 * Hardware:
 * - Arduino Uno
 * - 2x DC Motors (775)
 * - 4x Wheels (100mm)
 * - IR Obstacle Sensor
 * - L298N Motor Driver / ESC
 * - LiPo Battery
 * 
 * Circuit Connections:
 * IR Sensor:
 *   - VCC -> 5V
 *   - GND -> GND
 *   - OUT -> Digital Pin 8
 * 
 * Motor Driver (L298N):
 *   - IN1 (Left Motor) -> Pin 6
 *   - IN2 (Left Motor) -> Pin 7
 *   - ENA (Left PWM) -> Pin 5
 *   - IN3 (Right Motor) -> Pin 10
 *   - IN4 (Right Motor) -> Pin 11
 *   - ENB (Right PWM) -> Pin 9
 *   - 12V -> Battery+
 *   - GND -> Battery-
 *   - 5V -> Arduino 5V (if jumper removed)
 */

// Motor pin definitions
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11

// IR Sensor pin
#define IR_SENSOR 8

#define SPEED 200  // Motor speed (0-255)
#define REVERSE_TIME 800  // Time to reverse (ms)

void setup() {
  Serial.begin(9600);
  
  // Initialize motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  // Initialize IR sensor pin
  pinMode(IR_SENSOR, INPUT);
  
  Serial.println("Back Off Bot - IR Obstacle Detection Active!");
  Serial.println("Car will reverse when obstacle detected");
}

void loop() {
  // Read IR sensor (LOW = obstacle detected, HIGH = clear)
  int obstacleDetected = digitalRead(IR_SENSOR);
  
  if (obstacleDetected == LOW) {
    // Obstacle detected within range (typically 2-30cm)
    Serial.println("⚠️  OBSTACLE DETECTED! Reversing...");
    
    // Stop first
    stopMotors();
    delay(200);
    
    // Move backward
    moveBackward();
    delay(REVERSE_TIME);
    
    // Stop again
    stopMotors();
    delay(300);
    
    Serial.println("✓ Safe distance reached");
  } else {
    // No obstacle - move forward slowly
    Serial.println("→ Path clear - Moving forward");
    moveForward();
  }
  
  delay(100);  // Small delay for stability
}

void moveForward() {
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void moveBackward() {
  digitalWrite(MOTOR_LEFT_DIR1, LOW);
  digitalWrite(MOTOR_LEFT_DIR2, HIGH);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  
  digitalWrite(MOTOR_RIGHT_DIR1, LOW);
  digitalWrite(MOTOR_RIGHT_DIR2, HIGH);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT_PWM, 0);
  analogWrite(MOTOR_RIGHT_PWM, 0);
}`,

  traffic_bot: `/*
 * Traffic Bot - Auto-Stop Robot
 * Stops automatically when detecting obstacles
 * 
 * Hardware:
 * - Arduino Uno
 * - 2x DC Motors
 * - HC-SR04 Ultrasonic Sensor
 * - L298N Motor Driver
 * - LiPo Battery
 */

// Motor pins
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11

// Sensor pins
#define TRIG_PIN 12
#define ECHO_PIN 13

#define STOP_DISTANCE 15  // Stop distance in cm
#define SPEED 200

void setup() {
  Serial.begin(9600);
  
  // Motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  // Sensor pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  Serial.println("Traffic Bot - Auto-Stop Active!");
}

void loop() {
  float distance = getDistance();
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance > STOP_DISTANCE) {
    // Clear ahead - move forward
    moveForward();
    Serial.println("Moving - Clear ahead");
  } else {
    // Obstacle detected - STOP!
    stopMotors();
    Serial.println("STOP - Obstacle detected!");
  }
  
  delay(100);
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void moveForward() {
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, SPEED);
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, SPEED);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT_PWM, 0);
  analogWrite(MOTOR_RIGHT_PWM, 0);
}`,

  line_follower: `/*
 * Line Follower Robot
 * Autonomously follows a black line on white surface
 * 
 * Hardware:
 * - Arduino Uno
 * - 2x DC Motors
 * - 3x IR Line Sensors (Left, Center, Right)
 * - L298N Motor Driver
 * - LiPo Battery
 */

// Motor pins
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11

// Line sensor pins (IR sensors)
#define SENSOR_LEFT A0
#define SENSOR_CENTER A1
#define SENSOR_RIGHT A2

#define BASE_SPEED 180
#define TURN_SPEED 150

void setup() {
  Serial.begin(9600);
  
  // Motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  // Sensor pins
  pinMode(SENSOR_LEFT, INPUT);
  pinMode(SENSOR_CENTER, INPUT);
  pinMode(SENSOR_RIGHT, INPUT);
  
  Serial.println("Line Follower Active!");
}

void loop() {
  // Read sensors (HIGH = white, LOW = black line)
  int left = digitalRead(SENSOR_LEFT);
  int center = digitalRead(SENSOR_CENTER);
  int right = digitalRead(SENSOR_RIGHT);
  
  Serial.print("L:"); Serial.print(left);
  Serial.print(" C:"); Serial.print(center);
  Serial.print(" R:"); Serial.println(right);
  
  // Line following logic
  if (center == LOW) {
    // On line - go straight
    moveForward(BASE_SPEED, BASE_SPEED);
    Serial.println("Straight");
  } else if (left == LOW) {
    // Line on left - turn left
    moveForward(TURN_SPEED, BASE_SPEED);
    Serial.println("Turn Left");
  } else if (right == LOW) {
    // Line on right - turn right
    moveForward(BASE_SPEED, TURN_SPEED);
    Serial.println("Turn Right");
  } else {
    // Lost line - stop
    stopMotors();
    Serial.println("Line lost!");
  }
  
  delay(50);
}

void moveForward(int leftSpeed, int rightSpeed) {
  digitalWrite(MOTOR_LEFT_DIR1, HIGH);
  digitalWrite(MOTOR_LEFT_DIR2, LOW);
  analogWrite(MOTOR_LEFT_PWM, leftSpeed);
  digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
  digitalWrite(MOTOR_RIGHT_DIR2, LOW);
  analogWrite(MOTOR_RIGHT_PWM, rightSpeed);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT_PWM, 0);
  analogWrite(MOTOR_RIGHT_PWM, 0);
}`,

  rc_car_basic: `/*
 * RC Car Basic - Arduino Control Code
 * 2-wheel drive with servo steering
 * 
 * Hardware:
 * - Arduino Uno/Nano
 * - 2x DC Motors (rear wheels)
 * - 1x Servo Motor (steering)
 * - 1x L298N Motor Driver / ESC
 * - 1x LiPo Battery 11.1V 3S
 * - RC Receiver (PWM)
 */

#include <Servo.h>

// Pin definitions
#define MOTOR_LEFT_PWM 5
#define MOTOR_LEFT_DIR1 6
#define MOTOR_LEFT_DIR2 7
#define MOTOR_RIGHT_PWM 9
#define MOTOR_RIGHT_DIR1 10
#define MOTOR_RIGHT_DIR2 11
#define SERVO_PIN 3
#define RC_THROTTLE_PIN 2
#define RC_STEERING_PIN 4

// Constants
#define SERVO_CENTER 90
#define SERVO_MIN 45
#define SERVO_MAX 135
#define MOTOR_MAX_SPEED 255
#define DEADZONE 10

Servo steeringServo;

int throttleValue = 0;
int steeringValue = SERVO_CENTER;

void setup() {
  Serial.begin(9600);
  
  // Motor pins
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR1, OUTPUT);
  pinMode(MOTOR_LEFT_DIR2, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR1, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR2, OUTPUT);
  
  // RC input pins
  pinMode(RC_THROTTLE_PIN, INPUT);
  pinMode(RC_STEERING_PIN, INPUT);
  
  // Servo setup
  steeringServo.attach(SERVO_PIN);
  steeringServo.write(SERVO_CENTER);
  
  Serial.println("RC Car initialized!");
}

void loop() {
  // Read RC inputs (PWM 1000-2000us)
  int throttlePWM = pulseIn(RC_THROTTLE_PIN, HIGH, 25000);
  int steeringPWM = pulseIn(RC_STEERING_PIN, HIGH, 25000);
  
  // Map PWM to usable values
  throttleValue = map(throttlePWM, 1000, 2000, -255, 255);
  steeringValue = map(steeringPWM, 1000, 2000, SERVO_MIN, SERVO_MAX);
  
  // Apply deadzone
  if (abs(throttleValue) < DEADZONE) {
    throttleValue = 0;
  }
  
  // Control motors
  controlMotors(throttleValue, throttleValue);
  
  // Control steering
  steeringServo.write(steeringValue);
  
  // Debug output
  Serial.print("Throttle: "); Serial.print(throttleValue);
  Serial.print(" | Steering: "); Serial.println(steeringValue);
  
  delay(20);
}

void controlMotors(int leftSpeed, int rightSpeed) {
  // Left motor
  if (leftSpeed > 0) {
    digitalWrite(MOTOR_LEFT_DIR1, HIGH);
    digitalWrite(MOTOR_LEFT_DIR2, LOW);
    analogWrite(MOTOR_LEFT_PWM, constrain(leftSpeed, 0, 255));
  } else if (leftSpeed < 0) {
    digitalWrite(MOTOR_LEFT_DIR1, LOW);
    digitalWrite(MOTOR_LEFT_DIR2, HIGH);
    analogWrite(MOTOR_LEFT_PWM, constrain(abs(leftSpeed), 0, 255));
  } else {
    digitalWrite(MOTOR_LEFT_DIR1, LOW);
    digitalWrite(MOTOR_LEFT_DIR2, LOW);
    analogWrite(MOTOR_LEFT_PWM, 0);
  }
  
  // Right motor
  if (rightSpeed > 0) {
    digitalWrite(MOTOR_RIGHT_DIR1, HIGH);
    digitalWrite(MOTOR_RIGHT_DIR2, LOW);
    analogWrite(MOTOR_RIGHT_PWM, constrain(rightSpeed, 0, 255));
  } else if (rightSpeed < 0) {
    digitalWrite(MOTOR_RIGHT_DIR1, LOW);
    digitalWrite(MOTOR_RIGHT_DIR2, HIGH);
    analogWrite(MOTOR_RIGHT_PWM, constrain(abs(rightSpeed), 0, 255));
  } else {
    digitalWrite(MOTOR_RIGHT_DIR1, LOW);
    digitalWrite(MOTOR_RIGHT_DIR2, LOW);
    analogWrite(MOTOR_RIGHT_PWM, 0);
  }
}`,

  quadcopter_drone: `/*
 * Quadcopter Drone - Flight Controller Code
 * 4-motor drone with IMU stabilization
 * 
 * Hardware:
 * - Arduino Mega/Flight Controller
 * - 4x Brushless DC Motors
 * - 4x ESCs (30A)
 * - 1x MPU6050 IMU Sensor
 * - 1x LiPo Battery 11.1V 3S
 * - RC Receiver (PWM/PPM)
 */

#include <Wire.h>
#include <Servo.h>

// Pin definitions
#define MOTOR_FL_PIN 5  // Front Left
#define MOTOR_FR_PIN 6  // Front Right
#define MOTOR_BL_PIN 9  // Back Left
#define MOTOR_BR_PIN 10 // Back Right
#define RC_THROTTLE_PIN 2
#define RC_ROLL_PIN 3
#define RC_PITCH_PIN 4
#define RC_YAW_PIN 7

// MPU6050 I2C address
#define MPU6050_ADDR 0x68

// PID constants
#define KP_ROLL 1.5
#define KI_ROLL 0.05
#define KD_ROLL 0.8
#define KP_PITCH 1.5
#define KI_PITCH 0.05
#define KD_PITCH 0.8
#define KP_YAW 2.0
#define KI_YAW 0.02
#define KD_YAW 0.5

Servo motorFL, motorFR, motorBL, motorBR;

// IMU data
float accelX, accelY, accelZ;
float gyroX, gyroY, gyroZ;
float roll = 0, pitch = 0, yaw = 0;

// PID variables
float rollError = 0, pitchError = 0, yawError = 0;
float rollErrorSum = 0, pitchErrorSum = 0, yawErrorSum = 0;
float rollErrorLast = 0, pitchErrorLast = 0, yawErrorLast = 0;

// Motor outputs
int throttle = 1000;
int motorFLSpeed, motorFRSpeed, motorBLSpeed, motorBRSpeed;

unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  // Initialize MPU6050
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x6B); // PWR_MGMT_1 register
  Wire.write(0);    // Wake up MPU6050
  Wire.endTransmission(true);
  
  // Configure gyro and accel ranges
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x1B); // GYRO_CONFIG
  Wire.write(0x08); // ±500°/s
  Wire.endTransmission(true);
  
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x1C); // ACCEL_CONFIG
  Wire.write(0x10); // ±8g
  Wire.endTransmission(true);
  
  // Attach ESCs (1000-2000us PWM)
  motorFL.attach(MOTOR_FL_PIN, 1000, 2000);
  motorFR.attach(MOTOR_FR_PIN, 1000, 2000);
  motorBL.attach(MOTOR_BL_PIN, 1000, 2000);
  motorBR.attach(MOTOR_BR_PIN, 1000, 2000);
  
  // Initialize motors to minimum
  motorFL.writeMicroseconds(1000);
  motorFR.writeMicroseconds(1000);
  motorBL.writeMicroseconds(1000);
  motorBR.writeMicroseconds(1000);
  
  // RC input pins
  pinMode(RC_THROTTLE_PIN, INPUT);
  pinMode(RC_ROLL_PIN, INPUT);
  pinMode(RC_PITCH_PIN, INPUT);
  pinMode(RC_YAW_PIN, INPUT);
  
  delay(2000); // Allow ESCs to initialize
  
  Serial.println("Quadcopter initialized!");
  Serial.println("CAUTION: Remove props for testing!");
}

void loop() {
  unsigned long currentTime = millis();
  float dt = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;
  
  // Read IMU
  readIMU();
  
  // Calculate angles (simplified - use complementary filter in production)
  roll = atan2(accelY, accelZ) * 180.0 / PI;
  pitch = atan2(-accelX, sqrt(accelY * accelY + accelZ * accelZ)) * 180.0 / PI;
  
  // Read RC inputs
  int throttleRC = pulseIn(RC_THROTTLE_PIN, HIGH, 25000);
  int rollRC = pulseIn(RC_ROLL_PIN, HIGH, 25000);
  int pitchRC = pulseIn(RC_PITCH_PIN, HIGH, 25000);
  int yawRC = pulseIn(RC_YAW_PIN, HIGH, 25000);
  
  // Map RC inputs
  throttle = constrain(map(throttleRC, 1000, 2000, 1000, 2000), 1000, 2000);
  float rollSetpoint = map(rollRC, 1000, 2000, -30, 30);
  float pitchSetpoint = map(pitchRC, 1000, 2000, -30, 30);
  float yawSetpoint = map(yawRC, 1000, 2000, -180, 180);
  
  // Calculate PID
  rollError = rollSetpoint - roll;
  pitchError = pitchSetpoint - pitch;
  yawError = yawSetpoint - yaw;
  
  rollErrorSum += rollError * dt;
  pitchErrorSum += pitchError * dt;
  yawErrorSum += yawError * dt;
  
  float rollCorrection = KP_ROLL * rollError + KI_ROLL * rollErrorSum + KD_ROLL * (rollError - rollErrorLast) / dt;
  float pitchCorrection = KP_PITCH * pitchError + KI_PITCH * pitchErrorSum + KD_PITCH * (pitchError - pitchErrorLast) / dt;
  float yawCorrection = KP_YAW * yawError + KI_YAW * yawErrorSum + KD_YAW * (yawError - yawErrorLast) / dt;
  
  rollErrorLast = rollError;
  pitchErrorLast = pitchError;
  yawErrorLast = yawError;
  
  // Mix motor outputs
  motorFLSpeed = throttle + pitchCorrection - rollCorrection + yawCorrection;
  motorFRSpeed = throttle + pitchCorrection + rollCorrection - yawCorrection;
  motorBLSpeed = throttle - pitchCorrection - rollCorrection - yawCorrection;
  motorBRSpeed = throttle - pitchCorrection + rollCorrection + yawCorrection;
  
  // Constrain and write
  motorFL.writeMicroseconds(constrain(motorFLSpeed, 1000, 2000));
  motorFR.writeMicroseconds(constrain(motorFRSpeed, 1000, 2000));
  motorBL.writeMicroseconds(constrain(motorBLSpeed, 1000, 2000));
  motorBR.writeMicroseconds(constrain(motorBRSpeed, 1000, 2000));
  
  // Debug
  Serial.print("R:"); Serial.print(roll);
  Serial.print(" P:"); Serial.print(pitch);
  Serial.print(" Y:"); Serial.print(yaw);
  Serial.print(" T:"); Serial.println(throttle);
  
  delay(10);
}

void readIMU() {
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x3B); // ACCEL_XOUT_H
  Wire.endTransmission(false);
  Wire.requestFrom(MPU6050_ADDR, 14, true);
  
  int16_t accelXRaw = Wire.read() << 8 | Wire.read();
  int16_t accelYRaw = Wire.read() << 8 | Wire.read();
  int16_t accelZRaw = Wire.read() << 8 | Wire.read();
  Wire.read(); Wire.read(); // Temperature (skip)
  int16_t gyroXRaw = Wire.read() << 8 | Wire.read();
  int16_t gyroYRaw = Wire.read() << 8 | Wire.read();
  int16_t gyroZRaw = Wire.read() << 8 | Wire.read();
  
  accelX = accelXRaw / 4096.0;
  accelY = accelYRaw / 4096.0;
  accelZ = accelZRaw / 4096.0;
  gyroX = gyroXRaw / 65.5;
  gyroY = gyroYRaw / 65.5;
  gyroZ = gyroZRaw / 65.5;
}`,

  rc_boat: `/*
 * RC Boat - Marine Control Code
 * Single propeller with rudder steering
 * 
 * Hardware:
 * - Arduino Uno/Nano
 * - 1x Brushless DC Motor (rear propeller)
 * - 1x Servo Motor (rudder)
 * - 1x ESC (30A waterproof)
 * - 1x LiPo Battery 11.1V 3S
 * - RC Receiver (PWM)
 */

#include <Servo.h>

// Pin definitions
#define ESC_PIN 5
#define RUDDER_PIN 3
#define RC_THROTTLE_PIN 2
#define RC_STEERING_PIN 4
#define BATTERY_SENSE_PIN A0

// Constants
#define RUDDER_CENTER 90
#define RUDDER_MIN 45
#define RUDDER_MAX 135
#define ESC_MIN 1000
#define ESC_MAX 2000
#define DEADZONE 10
#define BATTERY_WARN_VOLTAGE 10.5 // 3.5V per cell

Servo esc;
Servo rudderServo;

int throttleValue = ESC_MIN;
int rudderValue = RUDDER_CENTER;
float batteryVoltage = 0;

void setup() {
  Serial.begin(9600);
  
  // Attach ESC and rudder
  esc.attach(ESC_PIN, ESC_MIN, ESC_MAX);
  rudderServo.attach(RUDDER_PIN);
  
  // RC input pins
  pinMode(RC_THROTTLE_PIN, INPUT);
  pinMode(RC_STEERING_PIN, INPUT);
  pinMode(BATTERY_SENSE_PIN, INPUT);
  
  // Initialize to safe positions
  esc.writeMicroseconds(ESC_MIN);
  rudderServo.write(RUDDER_CENTER);
  
  delay(2000); // Allow ESC to initialize
  
  Serial.println("RC Boat initialized!");
  Serial.println("Ready for water!");
}

void loop() {
  // Read RC inputs
  int throttlePWM = pulseIn(RC_THROTTLE_PIN, HIGH, 25000);
  int steeringPWM = pulseIn(RC_STEERING_PIN, HIGH, 25000);
  
  // Map PWM to usable values
  throttleValue = map(throttlePWM, 1000, 2000, ESC_MIN, ESC_MAX);
  rudderValue = map(steeringPWM, 1000, 2000, RUDDER_MIN, RUDDER_MAX);
  
  // Apply throttle deadzone
  if (throttleValue < (ESC_MIN + DEADZONE)) {
    throttleValue = ESC_MIN;
  }
  
  // Read battery voltage (voltage divider: 0-16V -> 0-5V)
  int batteryRaw = analogRead(BATTERY_SENSE_PIN);
  batteryVoltage = batteryRaw * (16.0 / 1023.0);
  
  // Battery warning
  if (batteryVoltage < BATTERY_WARN_VOLTAGE && batteryVoltage > 1.0) {
    Serial.println("WARNING: Low battery!");
  }
  
  // Control propeller motor via ESC
  esc.writeMicroseconds(constrain(throttleValue, ESC_MIN, ESC_MAX));
  
  // Control rudder servo
  rudderServo.write(constrain(rudderValue, RUDDER_MIN, RUDDER_MAX));
  
  // Debug output
  Serial.print("Throttle: "); Serial.print(throttleValue);
  Serial.print(" | Rudder: "); Serial.print(rudderValue);
  Serial.print(" | Battery: "); Serial.print(batteryVoltage);
  Serial.println("V");
  
  delay(20);
}`,

  ir_sensor_bot: `// IR Sensor Multi-Function Robot
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
}`,
};

export const getProjectCode = (projectId: string): string => {
  const ALIASES: Record<string, string> = {
    rc_car_4wd: "rc_car_basic",
    racing_quadcopter: "quadcopter_drone",
    rc_speed_boat: "rc_boat",
    mecanum_robot: "rc_car_basic",
  };
  const resolved = ALIASES[projectId] || projectId;
  return PROJECT_CODE[resolved] || `// No code template available for ${projectId}`;
};