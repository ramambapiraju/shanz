import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Zap, Atom, Cpu, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Avatar {
  id: string;
  name: string;
  icon: any;
  color: string;
  specialty: string;
  description: string;
}

const AVATARS: Avatar[] = [
  {
    id: "quantum-warrior",
    name: "Quantum Warrior",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    specialty: "Speed & Agility",
    description: "Master of superposition and quick problem solving"
  },
  {
    id: "entanglement-master",
    name: "Entanglement Master",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    specialty: "Teamwork & Connection",
    description: "Expert in quantum entanglement and collaborative challenges"
  },
  {
    id: "circuit-architect",
    name: "Circuit Architect",
    icon: Cpu,
    color: "from-blue-500 to-cyan-500",
    specialty: "Strategy & Design",
    description: "Builds complex quantum circuits with precision"
  },
  {
    id: "qubit-explorer",
    name: "Qubit Explorer",
    icon: Atom,
    color: "from-green-500 to-emerald-500",
    specialty: "Exploration & Discovery",
    description: "Discovers hidden quantum properties and shortcuts"
  }
];

interface Props {
  onStart: (playerName: string, avatar: Avatar) => void;
}

export const AvatarSelection = ({ onStart }: Props) => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [playerName, setPlayerName] = useState("");

  const handleStart = () => {
    if (!playerName.trim()) {
      toast.error("Enter your player name!");
      return;
    }
    if (!selectedAvatar) {
      toast.error("Select your avatar!");
      return;
    }
    
    toast.success(`Welcome to the Quantum Universe, ${playerName}!`, {
      description: `You chose ${selectedAvatar.name}`
    });
    onStart(playerName, selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            QUANTUM BATTLE ROYALE
          </h1>
          <p className="text-xl text-purple-200">
            Choose your avatar and enter the quantum universe. Survive by mastering quantum mechanics!
          </p>
        </div>

        {/* Player Name Input */}
        <Card className="p-6 bg-slate-900/50 backdrop-blur-lg border-purple-500/30">
          <div className="flex items-center gap-4">
            <User className="h-6 w-6 text-purple-400" />
            <div className="flex-1">
              <Input
                placeholder="Enter your player name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-lg bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400"
                maxLength={20}
              />
            </div>
          </div>
        </Card>

        {/* Avatar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AVATARS.map((avatar) => {
            const Icon = avatar.icon;
            const isSelected = selectedAvatar?.id === avatar.id;
            
            return (
              <Card
                key={avatar.id}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  isSelected 
                    ? 'border-4 border-purple-400 shadow-2xl shadow-purple-500/50 bg-slate-800' 
                    : 'border-slate-700 bg-slate-900/50 hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <div className="space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{avatar.name}</h3>
                    <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {avatar.specialty}
                    </Badge>
                    <p className="text-sm text-slate-400">{avatar.description}</p>
                  </div>

                  {isSelected && (
                    <div className="flex items-center justify-center gap-2 text-purple-400 animate-pulse">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-semibold">SELECTED</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={!playerName || !selectedAvatar}
            className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            <Zap className="mr-2 h-6 w-6" />
            ENTER QUANTUM UNIVERSE
          </Button>
        </div>

        {/* Info Bar */}
        <Card className="p-4 bg-slate-900/50 backdrop-blur-lg border-purple-500/30">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Atom className="h-4 w-4 text-purple-400" />
              <span>Learn Quantum Mechanics</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>Master Qiskit & Hardware</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>Solve Challenges to Survive</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>Become Quantum Champion</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
