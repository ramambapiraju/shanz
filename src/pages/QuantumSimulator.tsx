import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarSelection } from "@/components/quantum/AvatarSelection";
import { QuantumGameWorld } from "@/components/quantum/QuantumGameWorld";
import { GameOverScreen } from "@/components/quantum/GameOverScreen";
import { QuantumCanvas } from "@/components/quantum/QuantumCanvas";
import { QuantumCircuit } from "@/components/quantum/QuantumCircuit";
import { QuantumTutorial } from "@/components/quantum/QuantumTutorial";
import { QuantumChallenges } from "@/components/quantum/QuantumChallenges";
import { Sparkles, Zap, Network, Award, Gamepad2 } from "lucide-react";
import { toast } from "sonner";

type GameState = "menu" | "avatar-select" | "playing" | "game-over";

interface PlayerData {
  name: string;
  avatar: {
    id: string;
    name: string;
    icon: any;
    color: string;
    specialty: string;
  };
  score: number;
  survived: boolean;
}

const QuantumSimulator = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>("menu");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeTab, setActiveTab] = useState("playground");

  const handleStartGame = () => {
    setGameState("avatar-select");
  };

  const handleAvatarSelected = (playerName: string, avatar: any) => {
    setPlayerData({
      name: playerName,
      avatar,
      score: 0,
      survived: false
    });
    setGameState("playing");
  };

  const handleGameOver = (finalScore: number, survived: boolean) => {
    setPlayerData(prev => prev ? { ...prev, score: finalScore, survived } : null);
    setGameState("game-over");
  };

  const handleRestart = () => {
    setGameState("avatar-select");
  };

  const handleExit = () => {
    setGameState("menu");
    setPlayerData(null);
  };

  const handleLevelComplete = (points: number) => {
    setScore(prev => prev + points);
    setLevel(prev => prev + 1);
    toast.success(`Level Complete! +${points} points`, {
      description: `You're now at Level ${level + 1}!`,
    });
  };

  // Game Mode - Battle Royale Style
  if (gameState === "avatar-select") {
    return <AvatarSelection onStart={handleAvatarSelected} />;
  }

  if (gameState === "playing" && playerData) {
    return (
      <QuantumGameWorld
        playerName={playerData.name}
        avatar={playerData.avatar}
        onGameOver={handleGameOver}
      />
    );
  }

  if (gameState === "game-over" && playerData) {
    return (
      <GameOverScreen
        playerName={playerData.name}
        score={playerData.score}
        survived={playerData.survived}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    );
  }

  // Menu Mode - Learning Playground
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">World's First Quantum Gaming Experience</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Quantum Computing Playground
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose your adventure: Jump into battle royale mode or explore the quantum universe at your own pace!
          </p>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Card 
              className="p-8 cursor-pointer hover:scale-105 transition-all bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 hover:border-purple-500"
              onClick={handleStartGame}
            >
              <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-2xl font-bold mb-2">Battle Royale Mode</h3>
              <p className="text-muted-foreground mb-4">
                Enter as an avatar, survive quantum challenges, and compete to become the champion!
              </p>
              <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-500">
                START GAME
              </Button>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-2xl font-bold mb-2">Learning Playground</h3>
              <p className="text-muted-foreground mb-4">
                Explore quantum concepts freely without pressure. Perfect for beginners!
              </p>
              <Button size="lg" variant="outline" className="w-full">
                EXPLORE (Below)
              </Button>
            </Card>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <Card className="px-6 py-3 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
              </div>
            </Card>
            
            <Card className="px-6 py-3 bg-secondary/5 border-secondary/20">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-secondary">{level}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Learning Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="playground" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Playground
            </TabsTrigger>
            <TabsTrigger value="circuit" className="gap-2">
              <Network className="h-4 w-4" />
              Circuit Lab
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="gap-2">
              <Zap className="h-4 w-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Award className="h-4 w-4" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Quantum Universe</h2>
              <p className="text-muted-foreground mb-6">
                Drag qubits, create superpositions, and watch particles entangle in real-time.
                The quantum world is yours to explore!
              </p>
              <QuantumCanvas />
            </Card>
          </TabsContent>

          <TabsContent value="circuit" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Build Quantum Circuits</h2>
              <p className="text-muted-foreground mb-6">
                Design your own quantum circuits by dragging gates onto qubits.
                See the results visualized instantly!
              </p>
              <QuantumCircuit onComplete={(points) => handleLevelComplete(points)} />
            </Card>
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-4">
            <QuantumTutorial />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <QuantumChallenges 
              currentLevel={level} 
              onComplete={(points) => handleLevelComplete(points)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuantumSimulator;
