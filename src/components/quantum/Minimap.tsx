import { Card } from "@/components/ui/card";
import * as THREE from 'three';

interface MinimapProps {
  playerPosition: THREE.Vector3;
  safeZoneRadius: number;
  challengePositions: Array<{ x: number; z: number; completed: boolean }>;
  enemyPositions: Array<{ x: number; z: number }>;
}

export const Minimap = ({ 
  playerPosition, 
  safeZoneRadius, 
  challengePositions,
  enemyPositions 
}: MinimapProps) => {
  const mapSize = 120;
  const scale = 1.5;

  const worldToMap = (x: number, z: number) => {
    return {
      x: (x * scale) + mapSize / 2,
      y: (z * scale) + mapSize / 2
    };
  };

  return (
    <div className="fixed bottom-20 right-4 z-10">
      <Card className="p-2 bg-slate-900/90 backdrop-blur-lg border-purple-500/50">
        <svg width={mapSize} height={mapSize} className="rounded">
          {/* Background */}
          <rect width={mapSize} height={mapSize} fill="#0f172a" />
          
          {/* Grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <line
                x1={0}
                y1={(i * mapSize) / 8}
                x2={mapSize}
                y2={(i * mapSize) / 8}
                stroke="#1e293b"
                strokeWidth="0.5"
              />
              <line
                x1={(i * mapSize) / 8}
                y1={0}
                x2={(i * mapSize) / 8}
                y2={mapSize}
                stroke="#1e293b"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Safe Zone */}
          <circle
            cx={mapSize / 2}
            cy={mapSize / 2}
            r={safeZoneRadius * scale}
            fill="none"
            stroke={safeZoneRadius < 15 ? "#ef4444" : "#10b981"}
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Challenge Orbs */}
          {challengePositions.map((pos, i) => {
            const mapPos = worldToMap(pos.x, pos.z);
            return (
              <circle
                key={i}
                cx={mapPos.x}
                cy={mapPos.y}
                r="4"
                fill={pos.completed ? "#10b981" : "#8b5cf6"}
                opacity="0.8"
              />
            );
          })}

          {/* Enemies */}
          {enemyPositions.map((pos, i) => {
            const mapPos = worldToMap(pos.x, pos.z);
            return (
              <rect
                key={i}
                x={mapPos.x - 3}
                y={mapPos.y - 3}
                width="6"
                height="6"
                fill="#ef4444"
                opacity="0.9"
              />
            );
          })}

          {/* Player */}
          <g>
            <circle
              cx={worldToMap(playerPosition.x, playerPosition.z).x}
              cy={worldToMap(playerPosition.x, playerPosition.z).y}
              r="5"
              fill="#3b82f6"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            <circle
              cx={worldToMap(playerPosition.x, playerPosition.z).x}
              cy={worldToMap(playerPosition.x, playerPosition.z).y}
              r="3"
              fill="#ffffff"
            />
          </g>
        </svg>
        
        <div className="text-[10px] text-slate-400 text-center mt-1">
          TACTICAL MAP
        </div>
      </Card>
    </div>
  );
};
