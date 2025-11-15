import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Atom, GitBranch, Link2, Sparkles, Zap, Shield } from "lucide-react";

export const QuantumTutorial = () => {
  const tutorials = [
    {
      icon: Atom,
      title: "What is a Qubit?",
      color: "text-blue-500",
      content: "A qubit is the basic unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in multiple states at once through superposition. Imagine a coin spinning in the air — it's both heads and tails until it lands!"
    },
    {
      icon: GitBranch,
      title: "Superposition: Being Everywhere at Once",
      color: "text-purple-500",
      content: "Superposition allows a qubit to be in a combination of |0⟩ and |1⟩ states simultaneously. This is like having your character explore multiple paths in a video game at the same time! The Hadamard gate (H) is the most common way to create superposition."
    },
    {
      icon: Link2,
      title: "Entanglement: Spooky Action",
      color: "text-yellow-500",
      content: "When qubits become entangled, they're mysteriously connected — measuring one instantly affects the other, no matter how far apart they are! Einstein called this 'spooky action at a distance.' It's like having telepathically linked dice that always show the same number."
    },
    {
      icon: Sparkles,
      title: "Quantum Gates: The Building Blocks",
      color: "text-green-500",
      content: "Quantum gates manipulate qubits just like logic gates in classical computers. But quantum gates can create superposition and entanglement! Common gates include: H (Hadamard), X (flip), Z (phase), and CNOT (controlled NOT)."
    },
    {
      icon: Zap,
      title: "Measurement: Collapsing Reality",
      color: "text-red-500",
      content: "When we measure a qubit, its superposition collapses into a definite state (|0⟩ or |1⟩). This is like finally landing the spinning coin — it has to pick one side. The probability of each outcome depends on the qubit's quantum state before measurement."
    },
    {
      icon: Shield,
      title: "Error Correction: Fighting Decoherence",
      color: "text-orange-500",
      content: "Qubits are fragile! They lose their quantum properties through a process called decoherence. Quantum error correction uses multiple qubits to protect information — like having backup saves in a game. This is one of the biggest challenges in quantum computing!"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
        <h2 className="text-2xl font-bold mb-2">Welcome to Quantum Wonderland! 🌟</h2>
        <p className="text-muted-foreground">
          Dive into the weird and wonderful world of quantum computing. These concepts might seem strange at first,
          but they're the key to understanding one of the most powerful technologies ever created. Let's make the impossible, intuitive!
        </p>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {tutorials.map((tutorial, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <tutorial.icon className={`h-6 w-6 ${tutorial.color}`} />
                <span className="text-lg font-semibold">{tutorial.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-muted/30">
              <p className="text-muted-foreground leading-relaxed">{tutorial.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
        <h3 className="text-xl font-bold mb-3">🎮 Learning Through Play</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Experiment:</strong> Try different gates and see what happens!</p>
          <p>• <strong>Fail safely:</strong> Mistakes are how we learn — there's always a reset button</p>
          <p>• <strong>Build intuition:</strong> Visual feedback helps you understand quantum behavior</p>
          <p>• <strong>Challenge yourself:</strong> Complete missions to level up your quantum skills</p>
        </div>
      </Card>
    </div>
  );
};
