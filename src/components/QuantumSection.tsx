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
            <span className="text-sm font-medium text-primary">Jumanji-Style Quantum Adventure</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              QUANTUM CLASH
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Drop from a jet into the quantum realm with just 3 lives! Face epic quantum challenges, 
            unlock powerful weapons, and survive to master quantum computing like never before.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Enter the Quantum Realm</h3>
              <p className="text-muted-foreground leading-relaxed">
                Board a military jet, leap with your parachute, and drop into a stunning quantum universe. 
                Choose your avatar and face the ultimate survival challenge with just 3 lives!
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Tackle real quantum challenges on Qiskit, quantum hardware, quantum mechanics, and heat transfer 
                to earn powerful weapons and survive against the odds.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Survive & Conquer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each correct answer unlocks unique quantum weapons like the Superposition Blaster or Hadamard Hammer. 
                Wrong answers cost you precious health points.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Three lives. One quantum universe. Can you master quantum computing while fighting for survival?
                It's learning through adventure, not lectures!
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
