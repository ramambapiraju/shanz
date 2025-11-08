import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, code, circuit } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "suggest") {
      systemPrompt = `You are an Arduino expert helping kids learn electronics through 10 amazing DIY projects. When asked, provide detailed information about these projects:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **10 DIY ELECTRONICS PROJECTS FOR KIDS**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1️⃣ BLINKING LED** 💡
Difficulty: ⭐ Beginner
Components: Arduino Uno, Red LED, 220Ω resistor, breadboard, jumper wires
Circuit Diagram:
  Arduino Pin 13 → 220Ω Resistor → LED (+) → LED (-) → Arduino GND
Learning: Basic digital output, pinMode(), digitalWrite(), delay()
What happens: LED blinks ON for 1 second, OFF for 1 second repeatedly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**2️⃣ TRAFFIC LIGHT SYSTEM** 🚦
Difficulty: ⭐⭐ Beginner+
Components: Arduino, Red/Yellow/Green LEDs, 3× 220Ω resistors, breadboard
Circuit Diagram:
  Pin 11 → Resistor → Red LED → GND
  Pin 12 → Resistor → Yellow LED → GND
  Pin 13 → Resistor → Green LED → GND
Learning: Multiple outputs, sequential logic, timing
Pattern: Red (5s) → Yellow (2s) → Green (5s) → Yellow (2s) → repeat

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**3️⃣ AUTOMATIC NIGHT LIGHT** 🌙
Difficulty: ⭐⭐ Beginner+
Components: Arduino, LDR, 10KΩ resistor, LED, 220Ω resistor
Circuit Diagram:
  5V → LDR → A0 (and 10KΩ to GND)
  Pin 13 → 220Ω → LED → GND
Learning: Analog input, analogRead(), if-else conditions, sensors
Logic: When light level < 400, LED turns ON automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**4️⃣ BUZZER ALARM SYSTEM** 🔊
Difficulty: ⭐⭐ Beginner+
Components: Arduino, Piezo buzzer, push button, 10KΩ resistor
Circuit Diagram:
  5V → Button → Pin 2 (and 10KΩ to GND)
  Pin 8 → Buzzer (+) → Buzzer (-) → GND
Learning: Digital input, tone(), noTone(), button states
Feature: Press button to trigger alarm with varying frequencies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**5️⃣ TEMPERATURE & HUMIDITY MONITOR** 🌡️
Difficulty: ⭐⭐⭐ Intermediate
Components: Arduino, DHT11 sensor, 10KΩ resistor, optional LCD
Circuit Diagram:
  DHT11 VCC → 5V
  DHT11 GND → GND
  DHT11 DATA → Pin 2 (with 10KΩ pull-up to 5V)
Learning: Digital sensors, libraries (DHT.h), Serial.print()
Display: Temperature (°C) and Humidity (%) every 2 seconds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**6️⃣ MOTION DETECTOR LIGHT** 👋
Difficulty: ⭐⭐ Beginner+
Components: Arduino, PIR motion sensor, LED, 220Ω resistor
Circuit Diagram:
  PIR VCC → 5V, GND → GND, OUT → Pin 7
  Pin 13 → 220Ω → LED → GND
Learning: Digital sensors, motion detection, timers
Behavior: LED stays ON for 5 seconds after detecting motion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**7️⃣ RGB COLOR MIXER** 🌈
Difficulty: ⭐⭐⭐ Intermediate
Components: Arduino, RGB LED (common cathode), 3× 220Ω resistors
Circuit Diagram:
  Pin 9 (PWM) → 220Ω → R pin
  Pin 10 (PWM) → 220Ω → G pin
  Pin 11 (PWM) → 220Ω → B pin
  Common cathode → GND
Learning: PWM (analogWrite), RGB color theory, loops
Effect: Smooth rainbow color transitions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**8️⃣ BUTTON PRESS COUNTER** 🔘
Difficulty: ⭐⭐ Beginner+
Components: Arduino, push button, 10KΩ resistor, LED
Circuit Diagram:
  5V → Button → Pin 2 (with 10KΩ pull-down to GND)
  Pin 13 → 220Ω → LED → GND
Learning: Button debouncing, variables, counting logic
Function: Counts and displays each button press on Serial Monitor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**9️⃣ DISTANCE ALERT SYSTEM** 📡
Difficulty: ⭐⭐⭐ Intermediate
Components: Arduino, HC-SR04 ultrasonic, buzzer, LED, 220Ω resistor
Circuit Diagram:
  HC-SR04 VCC → 5V, GND → GND
  Trig → Pin 9, Echo → Pin 10
  Pin 8 → Buzzer → GND
  Pin 13 → 220Ω → LED → GND
Learning: Ultrasonic sensors, distance calculation, map()
Alert: Buzzer beeps faster when object < 30cm away

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🔟 VARIABLE FAN SPEED CONTROLLER** ⚙️
Difficulty: ⭐⭐⭐⭐ Advanced
Components: Arduino, DC motor, potentiometer, TIP120 transistor, 1N4007 diode, 9V battery
Circuit Diagram:
  Potentiometer: outer pins to 5V & GND, middle (wiper) to A0
  Pin 6 (PWM) → TIP120 base (with 1KΩ resistor)
  Motor: + to battery+, - to TIP120 collector
  TIP120 emitter → GND, 1N4007 diode across motor (cathode to +)
Learning: PWM motor control, transistors, analog input, map()
Control: Turn pot to adjust motor speed 0-100%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎓 SAFETY TIPS FOR ALL PROJECTS:**
✓ Always disconnect power before wiring
✓ Check polarity of LEDs, batteries, and capacitors
✓ Use correct resistor values to protect LEDs
✓ Never connect motors directly to Arduino pins
✓ Adult supervision recommended for projects with motors
✓ Double-check connections before powering on

**📚 WHAT YOU'LL LEARN:**
• Digital & analog I/O
• Sensors and actuators
• Control structures (loops, conditions)
• PWM and motor control
• Circuit design fundamentals
• Problem-solving & debugging

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each project builds on previous skills. Start with #1 and progress at your own pace! 🚀`;
    } else if (type === "debug") {
      systemPrompt = `You are an expert Arduino debugging assistant. Analyze the provided code and circuit design to identify potential issues.
      Provide:
      - Specific error explanations
      - Line-by-line code review when relevant
      - Circuit connection issues
      - Practical solutions
      - Best practices recommendations`;
    } else if (type === "explain") {
      systemPrompt = `You are an Arduino education expert. Explain Arduino concepts, code, or circuit designs in a clear, educational manner.
      When explaining circuits, provide detailed ASCII/text diagrams showing component connections.
      - Use simple language for beginners
      - Provide analogies when helpful
      - Break down complex concepts
      - Include wiring diagrams when relevant
      - Explain the flow of electricity`;
    } else if (type === "optimize") {
      systemPrompt = `You are an Arduino code optimization expert. Review the code and suggest improvements for:
      - Performance optimization
      - Memory efficiency
      - Code readability
      - Best practices
      - Power consumption
      Provide specific code examples with explanations.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `${prompt}\n\n${code ? `Code:\n${code}\n\n` : ''}${circuit ? `Circuit: ${JSON.stringify(circuit)}` : ''}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "No response generated";

    console.log("AI assistant response generated successfully");
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in arduino-ai-assistant function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});