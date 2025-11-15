import { useState } from "react";
import { AvatarSelection } from "@/components/quantum/AvatarSelection";
import { AircraftDrop } from "@/components/quantum/AircraftDrop";
import { QuantumGameWorld } from "@/components/quantum/QuantumGameWorld";
import { GameOverScreen } from "@/components/quantum/GameOverScreen";

type GameState = "avatar-select" | "aircraft-drop" | "playing" | "game-over";

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
  const [gameState, setGameState] = useState<GameState>("avatar-select");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  const handleAvatarSelected = (playerName: string, avatar: any) => {
    setPlayerData({
      name: playerName,
      avatar,
      score: 0,
      survived: false
    });
    setGameState("aircraft-drop");
  };

  const handleLanded = () => {
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
    setGameState("avatar-select");
    setPlayerData(null);
  };
  if (gameState === "avatar-select") {
    return <AvatarSelection onStart={handleAvatarSelected} />;
  }

  if (gameState === "aircraft-drop" && playerData) {
    return (
      <AircraftDrop
        playerName={playerData.name}
        onLanded={handleLanded}
      />
    );
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

  return null;
};

export default QuantumSimulator;
