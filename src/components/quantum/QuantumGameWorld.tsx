import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Sphere, Text, Box, Ring, KeyboardControls } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Trophy, AlertCircle, ChevronRight, Clock, Activity } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

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
  type: "quiz" | "circuit" | "combat" | "collect";
  title: string;
  description: string;
  question?: string;
  options?: string[];
  correct?: number;
  points: number;
  zone: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    topic: "Quantum Mechanics",
    type: "combat",
    title: "Superposition Strike",
    description: "Apply Hadamard gate to defeat quantum enemies!",
    points: 150,
    zone: "Mechanics Arena",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    id: 2,
    topic: "Qiskit",
    type: "circuit",
    title: "Circuit Builder",
    description: "Build a working quantum circuit in 60 seconds!",
    points: 200,
    zone: "Qiskit Lab",
    difficulty: "medium",
    timeLimit: 60
  },
  {
    id: 3,
    topic: "Quantum Hardware",
    type: "quiz",
    title: "Hardware Knowledge",
    description: "Answer quantum hardware questions correctly!",
    question: "What temperature do quantum computers operate at?",
    options: [
      "Room temperature",
      "0°C",
      "Near absolute zero (~-273°C)",
      "100°C"
    ],
    correct: 2,
    points: 150,
    zone: "Hardware Sector",
    difficulty: "medium",
    timeLimit: 20
  },
  {
    id: 4,
    topic: "Entanglement",
    type: "combat",
    title: "Entanglement Battle",
    description: "Create entangled pairs to neutralize threats!",
    points: 250,
    zone: "Entanglement Field",
    difficulty: "hard",
    timeLimit: 45
  },
  {
    id: 5,
    topic: "Quantum Resources",
    type: "collect",
    title: "Qubit Collection",
    description: "Collect quantum resources before time runs out!",
    points: 100,
    zone: "Resource Zone",
    difficulty: "easy",
    timeLimit: 40
  },
  {
    id: 6,
    topic: "Heat Transfer",
    type: "quiz",
    title: "Cooling Crisis",
    description: "Solve heat transfer problems to survive!",
    question: "Why do quantum computers need extreme cooling?",
    options: [
      "To make them faster",
      "To prevent decoherence and maintain quantum states",
      "To save energy",
      "To make them smaller"
    ],
    correct: 1,
    points: 200,
    zone: "Thermal Zone",
    difficulty: "hard",
    timeLimit: 25
  }
];

const FPVPlayer = ({ 
  color, 
  onPositionChange 
}: { 
  color: string;
  onPositionChange: (pos: THREE.Vector3, rot: THREE.Euler) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const keys = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current || !cameraRef.current) return;

    // Movement
    direction.current.set(0, 0, 0);
    
    if (keys.forward) direction.current.z -= 1;
    if (keys.backward) direction.current.z += 1;
    if (keys.left) direction.current.x -= 1;
    if (keys.right) direction.current.x += 1;

    if (direction.current.length() > 0) {
      direction.current.normalize();
      direction.current.applyEuler(groupRef.current.rotation);
      
      velocity.current.lerp(direction.current.multiplyScalar(5), 0.1);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.1);
    }

    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta));
    groupRef.current.position.y = 1.5; // Keep at ground level

    // Camera follows player
    cameraRef.current.position.copy(groupRef.current.position);
    cameraRef.current.position.y += 0.6; // Eye height
    
    onPositionChange(groupRef.current.position, groupRef.current.rotation);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} near={0.1} far={1000} />
      <group ref={groupRef} position={[0, 1.5, 0]} />
    </>
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
  const [lives, setLives] = useState(3);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [weapons, setWeapons] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [safeZoneRadius, setSafeZoneRadius] = useState(30);
  const [challengeTimer, setChallengeTimer] = useState<number | null>(null);
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [playerRotation, setPlayerRotation] = useState(new THREE.Euler(0, 0, 0));

  // Safe zone shrinks over time (battle royale mechanic)
  useEffect(() => {
    const shrinkInterval = setInterval(() => {
      setSafeZoneRadius(prev => Math.max(10, prev - 0.5));
    }, 5000);

    return () => clearInterval(shrinkInterval);
  }, []);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
      // Environmental damage if outside safe zone
      const playerDistance = Math.sqrt(
        playerPosition.x * playerPosition.x + 
        playerPosition.z * playerPosition.z
      );
      if (playerDistance > safeZoneRadius) {
        setHealth(prev => Math.max(0, prev - 2));
        toast.error("Outside safe zone! Taking damage!");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [safeZoneRadius, playerPosition]);

  // Challenge timer
  useEffect(() => {
    if (challengeTimer !== null && challengeTimer > 0) {
      const timer = setTimeout(() => {
        setChallengeTimer(prev => prev ? prev - 1 : 0);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (challengeTimer === 0) {
      handleChallengeFailed();
    }
  }, [challengeTimer]);

  useEffect(() => {
    if (health <= 0) {
      if (lives > 1) {
        setLives(prev => prev - 1);
        setHealth(100);
        toast.error(`Life Lost! ${lives - 1} lives remaining`, {
          description: "You respawned with full health!"
        });
      } else {
        toast.error("💀 Eliminated! You ran out of lives.");
        onGameOver(score, false);
      }
    }
    if (challengesCompleted >= CHALLENGES.length) {
      toast.success("🏆 SHAN Z WORLD CHAMPION!", {
        description: "You conquered the quantum universe!"
      });
      onGameOver(score, true);
    }
  }, [health, lives, challengesCompleted, score, onGameOver]);

  const handleOrbClick = (challengeIndex: number) => {
    if (currentChallenge) return; // Don't allow multiple challenges at once
    if (challengeIndex < challengesCompleted) {
      toast.info("Challenge already completed!");
      return;
    }
    
    const challenge = CHALLENGES[challengeIndex];
    const angle = (challengeIndex / CHALLENGES.length) * Math.PI * 2;
    const radius = 8;
    const orbX = Math.cos(angle) * radius;
    const orbZ = Math.sin(angle) * radius;
    const distance = Math.sqrt(
      Math.pow(playerPosition.x - orbX, 2) + 
      Math.pow(playerPosition.z - orbZ, 2)
    );
    
    if (distance > 3) {
      toast.error("Too far! Move closer to the challenge orb.");
      return;
    }
    
    setCurrentChallenge(challenge);
    setChallengeTimer(challenge.timeLimit);
    toast.info(`${challenge.title} - ${challenge.timeLimit}s`, {
      description: challenge.description
    });
  };

  const handleChallengeFailed = () => {
    if (!currentChallenge) return;
    
    const damage = currentChallenge.difficulty === "hard" ? 30 : 
                   currentChallenge.difficulty === "medium" ? 20 : 15;
    
    setHealth(prev => Math.max(0, prev - damage));
    toast.error("Challenge failed! Taking damage!", {
      description: `-${damage} HP`
    });
    
    setCurrentChallenge(null);
    setChallengeTimer(null);
  };

  const handleChallengeSuccess = () => {
    if (!currentChallenge) return;

    const bonusPoints = Math.floor(currentChallenge.points * (challengeTimer || 0) / currentChallenge.timeLimit);
    const totalPoints = currentChallenge.points + bonusPoints;
    
    setScore(prev => prev + totalPoints);
    setChallengesCompleted(prev => prev + 1);
    
    // Random weapon/power-up rewards
    const weaponRewards = [
      "Superposition Blaster",
      "Entanglement Shield",
      "Quantum Teleporter",
      "Hadamard Hammer",
      "Pauli Sword",
      "CNOT Crossbow",
      "Measurement Mirror",
      "Phase Shift Pistol",
      "Toffoli Torpedo"
    ];
    
    const newWeapon = weaponRewards[Math.floor(Math.random() * weaponRewards.length)];
    setWeapons(prev => [...prev, newWeapon]);
    
    toast.success(`${currentChallenge.title} Complete! 🎯`, {
      description: `+${totalPoints} points | 🎁 ${newWeapon}`
    });
    
    setCurrentChallenge(null);
    setChallengeTimer(null);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentChallenge || currentChallenge.type !== "quiz") return;

    if (selectedIndex === currentChallenge.correct) {
      handleChallengeSuccess();
    } else {
      handleChallengeFailed();
    }
  };

  const handleCombatAction = (action: "hadamard" | "entangle" | "measure") => {
    // Simulate combat success based on action
    const success = Math.random() > 0.3; // 70% success rate
    if (success) {
      handleChallengeSuccess();
    } else {
      toast.error("Attack missed!");
      handleChallengeFailed();
    }
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
                
                {/* Lives Display */}
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                          i < lives
                            ? "bg-red-500 border-red-400 text-white"
                            : "bg-slate-700 border-slate-600 text-slate-500"
                        }`}
                      >
                        {i < lives ? "♥" : "✗"}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Health Bar */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-slate-400">Health</span>
                    <span className="text-xs font-mono text-white ml-auto">{health}%</span>
                  </div>
                  <Progress value={health} className="h-2" />
                </div>
                
                {/* Weapons Display */}
                {weapons.length > 0 && (
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-xs text-slate-400">Arsenal</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {weapons.slice(-2).map((weapon, i) => (
                        <div
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        >
                          {weapon.split(' ')[0]}
                        </div>
                      ))}
                      {weapons.length > 2 && (
                        <div className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                          +{weapons.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

            {/* Objective & Safe Zone */}
            <Card className="p-4 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
              <div className="text-sm space-y-2">
                <div>
                  <div className="text-slate-400 mb-1">Mission:</div>
                  <div className="text-white font-semibold">Complete challenges & survive!</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Safe Zone:</span>
                  <span className={`font-mono ${safeZoneRadius < 15 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                    {Math.round(safeZoneRadius)}m
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 3D Game World */}
      <div className="h-screen pt-32">
        <Canvas>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[0, 20, 0]} intensity={0.8} color="#ec4899" />

          {/* FPV Player */}
          <FPVPlayer 
            color={avatar.color.split(' ')[1]} 
            onPositionChange={(pos, rot) => {
              setPlayerPosition(pos);
              setPlayerRotation(rot);
            }}
          />

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

          {/* Safe Zone Ring */}
          <Ring 
            args={[safeZoneRadius, safeZoneRadius + 1, 64]} 
            position={[0, 0.1, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial 
              color={safeZoneRadius < 15 ? "#ef4444" : "#10b981"} 
              transparent 
              opacity={0.5} 
              side={THREE.DoubleSide}
            />
          </Ring>

          {/* Ground */}
          <Box args={[80, 0.5, 80]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#1e1b4b" />
          </Box>
          
          <gridHelper args={[80, 80, "#6366f1", "#312e81"]} />
        </Canvas>
        
        {/* Controls Info */}
        <div className="fixed bottom-4 left-4 z-10">
          <Card className="p-3 bg-slate-900/80 backdrop-blur-lg border-purple-500/30">
            <div className="text-xs text-slate-300 space-y-1">
              <div><span className="font-bold">WASD</span> - Move</div>
              <div><span className="font-bold">Mouse</span> - Look Around</div>
              <div><span className="font-bold">Click Orb</span> - Start Challenge</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Challenge Modal */}
      {currentChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl p-8 bg-slate-900 border-purple-500/50 relative">
            {/* Timer Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-slate-800 rounded-t-lg overflow-hidden">
              <div 
                className={`h-full transition-all ${challengeTimer && challengeTimer < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                style={{ width: `${((challengeTimer || 0) / currentChallenge.timeLimit) * 100}%` }}
              />
            </div>

            <div className="space-y-6 mt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${
                      currentChallenge.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                      currentChallenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {currentChallenge.difficulty.toUpperCase()}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      {currentChallenge.topic}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentChallenge.title}
                  </h2>
                  <p className="text-slate-300">{currentChallenge.description}</p>
                </div>
                <div className="text-right">
                  <Clock className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <div className={`text-3xl font-mono font-bold ${challengeTimer && challengeTimer < 10 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`}>
                    {challengeTimer}s
                  </div>
                </div>
              </div>

              {currentChallenge.type === "quiz" && currentChallenge.options && (
                <div className="space-y-3">
                  <p className="text-xl text-white font-semibold">{currentChallenge.question}</p>
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
              )}

              {currentChallenge.type === "combat" && (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                    <p className="text-lg text-slate-300 mb-4">Choose your quantum attack!</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => handleCombatAction("hadamard")}
                      className="p-6 h-auto flex-col gap-2 bg-purple-600 hover:bg-purple-500"
                    >
                      <Zap className="h-8 w-8" />
                      <span>Hadamard Strike</span>
                    </Button>
                    <Button
                      onClick={() => handleCombatAction("entangle")}
                      className="p-6 h-auto flex-col gap-2 bg-pink-600 hover:bg-pink-500"
                    >
                      <Trophy className="h-8 w-8" />
                      <span>Entangle</span>
                    </Button>
                    <Button
                      onClick={() => handleCombatAction("measure")}
                      className="p-6 h-auto flex-col gap-2 bg-blue-600 hover:bg-blue-500"
                    >
                      <AlertCircle className="h-8 w-8" />
                      <span>Measure</span>
                    </Button>
                  </div>
                </div>
              )}

              {currentChallenge.type === "collect" && (
                <div className="text-center space-y-4">
                  <p className="text-lg text-slate-300">Collecting quantum resources...</p>
                  <Button
                    onClick={handleChallengeSuccess}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-500"
                  >
                    Complete Collection
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-700">
                <span>Reward: {currentChallenge.points} points + time bonus</span>
                <span>Fail: -{currentChallenge.difficulty === 'hard' ? 30 : currentChallenge.difficulty === 'medium' ? 20 : 15} HP/Shield</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
