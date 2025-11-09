import { Button } from "@/components/ui/button";
import { Cpu, Code, Zap, Check } from "lucide-react";
import simulatorPreview from "@/assets/simulator-preview.jpg";
import { useNavigate } from "react-router-dom";

export const SimulatorSection = () => {
  const navigate = useNavigate();
  const features = [
    "Design Arduino circuits visually",
    "Test sensors and actuators virtually",
    "Write and debug code in real-time",
    "Simulate mechanical systems",
    "AI-powered project suggestions",
    "Export designs to real hardware"
  ];

  return (
    <section id="simulator" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Beta Launch</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI-Powered Mechatronics Simulator
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Design, code, and test Arduino projects virtually before building them in real life. 
              Our AI-integrated simulator provides a risk-free environment to learn and experiment.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="group bg-secondary hover:bg-secondary/90"
                onClick={() => {
                  navigate("/simulator");
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }}
              >
                Electronics Simulator
                <Code className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
              <div className="flex flex-col gap-2">
                <Button 
                  size="lg" 
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    navigate("/mechatronics-simulator");
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  }}
                >
                  Mechatronics Simulator
                  <Cpu className="ml-2 h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground text-center">Open the 3D simulator</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-slide-in-right">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-border cursor-pointer hover:shadow-3xl transition-shadow"
              onClick={() => navigate("/simulator")}
            >
              <img 
                src={simulatorPreview} 
                alt="AI Mechatronics Simulator Interface" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-semibold flex items-center gap-2 animate-pulse-glow">
                <Cpu className="h-4 w-4" />
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
