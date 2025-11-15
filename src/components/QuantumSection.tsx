import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Atom, Sparkles, Zap, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuantumSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Atom,
      title: "Visual Qubits",
      description: "See quantum states come alive in 3D"
    },
    {
      icon: GitBranch,
      title: "Superposition Play",
      description: "Explore parallel realities interactively"
    },
    {
      icon: Sparkles,
      title: "Entanglement Magic",
      description: "Watch particles connect across space"
    },
    {
      icon: Zap,
      title: "Gamified Learning",
      description: "Level up while mastering quantum physics"
    }
  ];

  return (
    <section id="quantum" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Atom className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">World's First Quantum Gaming Experience</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              QUANTUM SPAN
            </span>
            {" "}Battle Royale
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Not a textbook. Not a lecture. A game — where intuition becomes the teacher.
            Discover quantum mechanics through play, wonder, and visual storytelling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">A Virtual Quantum Universe</h3>
              <p className="text-muted-foreground leading-relaxed">
                Picture floating, shimmering quantum gates in 3D space. Drag a qubit into superposition
                and watch it split into parallel possibilities — visual, playful, mesmerizing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Where entanglement looks like glowing threads connecting distant particles.
                Pull one, and the other responds instantly, defying space and time.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Learn Through Play</h3>
              <p className="text-muted-foreground leading-relaxed">
                Error correction, wavefunctions, and circuit design are discovered through play — not pressure.
                Kids experiment, fail, laugh, retry... and unintentionally learn the hardest concepts on Earth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Complete challenges, level up, and build real quantum algorithms while having fun.
                The future of computing, made intuitive.
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:scale-105 transition-transform">
              <feature.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/quantum-simulator")}
            className="text-lg px-8 py-6 hover-scale"
          >
            <Atom className="mr-2 h-5 w-5" />
            Enter the Quantum Realm
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No prior knowledge needed • Ages 10+ • Free to explore
          </p>
        </div>
      </div>
    </section>
  );
};
