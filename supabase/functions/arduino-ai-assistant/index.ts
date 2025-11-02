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
      systemPrompt = `You are an expert Arduino and mechatronics assistant. Provide 3-5 creative project suggestions based on the user's interests. 
      For each suggestion, include:
      - Project title
      - Brief description
      - Required components
      - Difficulty level (Beginner/Intermediate/Advanced)
      - Learning objectives
      Keep suggestions practical and educational.`;
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
      - Use simple language for beginners
      - Provide analogies when helpful
      - Break down complex concepts
      - Include practical examples`;
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