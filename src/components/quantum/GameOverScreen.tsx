import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Skull, RotateCcw, Home } from "lucide-react";

interface Props {
  playerName: string;
  score: number;
  survived: boolean;
  onRestart: () => void;
  onExit: () => void;
}

export const GameOverScreen = ({ playerName, score, survived, onRestart, onExit }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-12 bg-slate-900/90 backdrop-blur-lg border-purple-500/50 text-center space-y-8 animate-fade-in">
        {survived ? (
          <>
            <div className="space-y-4">
              <Trophy className="h-24 w-24 mx-auto text-yellow-500 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                QUANTUM CHAMPION!
              </h1>
              <p className="text-xl text-purple-200">
                Congratulations, {playerName}! You survived Shan Z World and mastered quantum computing!
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <Skull className="h-24 w-24 mx-auto text-red-500" />
              <h1 className="text-5xl font-bold text-red-500">
                ELIMINATED
              </h1>
              <p className="text-xl text-slate-300">
                Better luck next time, {playerName}. Keep learning and try again!
              </p>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="text-sm text-slate-400 mb-2">Final Score</div>
            <div className="text-6xl font-bold text-white">{score}</div>
          </div>

          {survived && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="text-purple-300 font-semibold">Status</div>
                <div className="text-white text-lg">Quantum Master</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4">
                <div className="text-yellow-300 font-semibold">Rank</div>
                <div className="text-white text-lg">Champion</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4">
                <div className="text-green-300 font-semibold">Achievement</div>
                <div className="text-white text-lg">Complete</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={onRestart}
            className="px-8 bg-purple-600 hover:bg-purple-500"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onExit}
            className="px-8"
          >
            <Home className="mr-2 h-5 w-5" />
            Exit Game
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            {survived 
              ? "You've proven your mastery! Share your achievement and challenge your friends!" 
              : "Every failure is a step towards quantum mastery. Study the concepts and return stronger!"}
          </p>
        </div>
      </Card>
    </div>
  );
};
