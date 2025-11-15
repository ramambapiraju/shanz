import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sphere, Text, Box, Cylinder } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Trophy, AlertCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

interface PlayerAvatar {
  id: string;
  name: string;
  icon: any;
  color: string;
  specialty: string;
}

interface Challenge {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  points: number;
  zone: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    topic: "Quantum Mechanics",
    question: "What is superposition?",
    options: [
      "A qubit being 0 AND 1 at the same time",
      "A qubit being either 0 OR 1",
      "Two qubits connected",
      "Measuring a quantum state"
    ],
    correct: 0,
    points: 100,
    zone: "Mechanics Zone"
  },
  {
    id: 2,
    topic: "Qiskit Basics",
    question: "Which Qiskit class creates a quantum circuit?",
    options: [
      "QuantumGate()",
      "QuantumCircuit()",
      "QuantumRegister()",
      "QuantumSimulator()"
    ],
    correct: 1,
    points: 150,
    zone: "Qiskit Zone"
  },
  {
    id: 3,
    topic: "Quantum Hardware",
    question: "What temperature do quantum computers operate at?",
    options: [
      "Room temperature",
      "0°C",
      "Near absolute zero (~-273°C)",
      "100°C"
    ],
    correct: 2,
    points: 200,
    zone: "Hardware Zone"
  },
  {
    id: 4,
    topic: "Entanglement",
    question: "What happens when you measure one entangled qubit?",
    options: [
      "Nothing changes",
      "The other qubit's state is instantly determined",
      "Both qubits become 0",
      "The entanglement breaks slowly"
    ],
    correct: 1,
    points: 150,
    zone: "Mechanics Zone"
  },
  {
    id: 5,
    topic: "Quantum Heat Transfer",
    question: "Why do quantum computers need extreme cooling?",
    options: [
      "To make them faster",
      "To prevent decoherence and maintain quantum states",
      "To save energy",
      "To make them smaller"
    ],
    correct: 1,
    points: 250,
    zone: "Hardware Zone"
  }
];

const PlayerModel = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <Sphere args={[0.5, 32, 32]} ref={meshRef}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </Sphere>
      <Cylinder args={[0.3, 0.3, 1, 32]} position={[0, -1, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
    </group>
  );
};

const ChallengeOrb = ({ 
  position, 
  color, 
  onClick 
}: { 
  position: [number, number, number]; 
  color: string;
  onClick: () => void;
}) => {
  return (
    <group position={position}>
      <Sphere args={[0.8, 32, 32]} onClick={onClick}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} wireframe />
      </Sphere>
    </group>
  );
};

interface Props {
  playerName: string;
  avatar: PlayerAvatar;
  onGameOver: (score: number, survived: boolean) => void;
}

export const QuantumGameWorld = ({ playerName, avatar, onGameOver }: Props) => {
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (health <= 0) {
      toast.error("Game Over! You ran out of health.");
      onGameOver(score, false);
    }
    if (challengesCompleted >= CHALLENGES.length) {
      toast.success("Victory! You mastered the quantum universe!");
      onGameOver(score, true);
    }
  }, [health, challengesCompleted, score]);

  const handleOrbClick = (challengeIndex: number) => {
    if (challengeIndex < challengesCompleted) {
      toast.info("Challenge already completed!");
      return;
    }
    setCurrentChallenge(CHALLENGES[challengeIndex]);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentChallenge) return;

    if (selectedIndex === currentChallenge.correct) {
      setScore(prev => prev + currentChallenge.points);
      setChallengesCompleted(prev => prev + 1);
      toast.success("Correct! ⚡", {
        description: `+${currentChallenge.points} points!`
      });
    } else {
      setHealth(prev => Math.max(0, prev - 20));
      toast.error("Wrong answer! -20 HP", {
        description: "Study and try again!"
      });
    }
    setCurrentChallenge(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950">
      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Player Info */}
            <Card className="p-4 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Player</span>
                  <Badge className="bg-purple-500/20 text-purple-300">{avatar.specialty}</Badge>
                </div>
                <div className="font-bold text-white text-lg">{playerName}</div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <Progress value={health} className="flex-1" />
                  <span className="text-sm font-mono text-white">{health}%</span>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-4 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                  <div className="text-xl font-bold text-white">{score}</div>
                  <div className="text-xs text-slate-400">Score</div>
                </div>
                <div>
                  <Zap className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                  <div className="text-xl font-bold text-white">{challengesCompleted}/{CHALLENGES.length}</div>
                  <div className="text-xs text-slate-400">Challenges</div>
                </div>
                <div>
                  <AlertCircle className="h-5 w-5 mx-auto text-cyan-500 mb-1" />
                  <div className="text-xl font-bold text-white">{formatTime(gameTime)}</div>
                  <div className="text-xs text-slate-400">Time</div>
                </div>
              </div>
            </Card>

            {/* Objective */}
            <Card className="p-4 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
              <div className="text-sm">
                <div className="text-slate-400 mb-1">Mission Objective:</div>
                <div className="text-white font-semibold">Complete all quantum challenges to survive!</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 3D Game World */}
      <div className="h-screen pt-32">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} />
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
          
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[0, 20, 0]} intensity={0.8} color="#ec4899" />

          {/* Player */}
          <PlayerModel position={[0, 0.5, 0]} color={avatar.color.split(' ')[1]} />

          {/* Challenge Orbs */}
          {CHALLENGES.map((challenge, index) => {
            const angle = (index / CHALLENGES.length) * Math.PI * 2;
            const radius = 8;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const color = index < challengesCompleted ? "#10b981" : "#8b5cf6";
            
            return (
              <group key={challenge.id}>
                <ChallengeOrb
                  position={[x, 2, z]}
                  color={color}
                  onClick={() => handleOrbClick(index)}
                />
                <Text
                  position={[x, 4, z]}
                  fontSize={0.5}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {challenge.zone}
                </Text>
              </group>
            );
          })}

          {/* Ground */}
          <Box args={[40, 0.5, 40]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#1e1b4b" />
          </Box>
          
          <gridHelper args={[40, 40, "#6366f1", "#312e81"]} />
        </Canvas>
      </div>

      {/* Challenge Modal */}
      {currentChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl p-8 bg-slate-900 border-purple-500/50">
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-purple-500/20 text-purple-300">
                  {currentChallenge.topic}
                </Badge>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Challenge #{currentChallenge.id}
                </h2>
                <p className="text-xl text-slate-200">{currentChallenge.question}</p>
              </div>

              <div className="space-y-3">
                {currentChallenge.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    variant="outline"
                    className="w-full p-6 text-left justify-start text-lg hover:bg-purple-500/20 hover:border-purple-500"
                  >
                    <ChevronRight className="mr-2 h-5 w-5" />
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Reward: {currentChallenge.points} points</span>
                <span>Wrong answer: -20 HP</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
