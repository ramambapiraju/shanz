import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  unlockLevel: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "First Superposition",
    description: "Create a superposition state on a single qubit using the Hadamard gate",
    difficulty: "Easy",
    points: 50,
    unlockLevel: 1
  },
  {
    id: 2,
    title: "Bell State",
    description: "Create an entangled Bell state using H and CNOT gates",
    difficulty: "Medium",
    points: 100,
    unlockLevel: 2
  },
  {
    id: 3,
    title: "Quantum Teleportation",
    description: "Teleport a quantum state using entanglement and classical communication",
    difficulty: "Hard",
    points: 200,
    unlockLevel: 3
  },
  {
    id: 4,
    title: "GHZ State",
    description: "Create a 3-qubit GHZ state (maximally entangled state)",
    difficulty: "Medium",
    points: 150,
    unlockLevel: 2
  },
  {
    id: 5,
    title: "Quantum Fourier Transform",
    description: "Implement a simple quantum Fourier transform circuit",
    difficulty: "Hard",
    points: 250,
    unlockLevel: 4
  },
  {
    id: 6,
    title: "Error Detection",
    description: "Build a 3-qubit bit-flip error detection code",
    difficulty: "Hard",
    points: 300,
    unlockLevel: 5
  }
];

export const QuantumChallenges = ({ 
  currentLevel, 
  onComplete 
}: { 
  currentLevel: number; 
  onComplete: (points: number) => void;
}) => {
  const handleAttempt = (challenge: Challenge) => {
    if (currentLevel < challenge.unlockLevel) {
      toast.error(`Reach level ${challenge.unlockLevel} to unlock this challenge!`);
      return;
    }

    toast.info(`Starting challenge: ${challenge.title}`, {
      description: "Build your circuit in the Circuit Lab!"
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Quantum Challenges</h2>
        </div>
        <p className="text-muted-foreground">
          Test your quantum skills with these increasingly difficult challenges. Complete them to earn points and level up!
        </p>
      </Card>

      <div className="grid gap-4">
        {CHALLENGES.map(challenge => {
          const isLocked = currentLevel < challenge.unlockLevel;
          
          return (
            <Card 
              key={challenge.id} 
              className={`p-6 transition-all ${isLocked ? 'opacity-60' : 'hover:border-primary/50'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{challenge.title}</h3>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {challenge.points} pts
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {challenge.description}
                  </p>

                  {isLocked && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Unlocks at Level {challenge.unlockLevel}</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => handleAttempt(challenge)}
                  disabled={isLocked}
                  className="gap-2"
                >
                  {isLocked ? <Lock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isLocked ? 'Locked' : 'Attempt'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Start with the easier challenges to build your intuition</li>
          <li>• Use the Learn tab to understand the concepts before attempting challenges</li>
          <li>• Experiment in the Playground to test your ideas</li>
          <li>• Don't worry about mistakes — quantum computing is all about experimentation!</li>
        </ul>
      </Card>
    </div>
  );
};
