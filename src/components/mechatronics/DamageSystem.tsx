import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Flame, Battery, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export interface ComponentDamage {
  id: string;
  name: string;
  health: number; // 0-100
  temperature: number; // Celsius
  voltage: number;
  status: 'normal' | 'warning' | 'critical' | 'destroyed';
  warnings: string[];
}

interface DamageSystemProps {
  damages: ComponentDamage[];
}

export const DamageSystem: React.FC<DamageSystemProps> = ({ damages }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-orange-500';
      case 'destroyed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal': return <Badge className="bg-green-500">Normal</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'critical': return <Badge className="bg-orange-500">Critical</Badge>;
      case 'destroyed': return <Badge className="bg-red-500">Destroyed</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };
  
  const criticalCount = damages.filter(d => d.status === 'critical' || d.status === 'destroyed').length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Component Health
          {criticalCount > 0 && (
            <Badge className="bg-red-500 ml-auto">{criticalCount} Critical</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {damages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No components to monitor</p>
        ) : (
          damages.map((damage) => (
            <div key={damage.id} className="space-y-2 p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{damage.name}</span>
                {getStatusBadge(damage.status)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Health</span>
                  <span className={getStatusColor(damage.status)}>{damage.health.toFixed(0)}%</span>
                </div>
                <Progress 
                  value={damage.health} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Flame className={`h-3 w-3 ${damage.temperature > 80 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <span>{damage.temperature.toFixed(0)}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className={`h-3 w-3 ${damage.voltage < 10 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <span>{damage.voltage.toFixed(1)}V</span>
                </div>
              </div>
              
              {damage.warnings.length > 0 && (
                <div className="space-y-1 mt-2">
                  {damage.warnings.map((warning, i) => (
                    <div key={i} className="flex items-start gap-1 text-xs text-yellow-500">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Damage calculation utilities
export const calculateMotorDamage = (
  rpm: number,
  temperature: number,
  voltage: number,
  currentHealth: number,
  deltaTime: number
): { health: number; temperature: number; status: ComponentDamage['status']; warnings: string[] } => {
  let health = currentHealth;
  let temp = temperature;
  const warnings: string[] = [];
  
  // Heat buildup from high RPM
  if (rpm > 7000) {
    temp += (rpm - 7000) * 0.0001 * deltaTime;
  }
  
  // Heat damage
  if (temp > 85) {
    health -= (temp - 85) * 0.01 * deltaTime;
    warnings.push('Overheating! Reduce throttle');
  }
  
  // Voltage damage (overvoltage or undervoltage)
  if (voltage > 12.6) {
    health -= (voltage - 12.6) * 0.5 * deltaTime;
    warnings.push('Overvoltage detected');
  } else if (voltage < 9.0) {
    health -= (9.0 - voltage) * 0.2 * deltaTime;
    warnings.push('Low voltage');
  }
  
  // Natural cooling
  temp = Math.max(25, temp - 0.5 * deltaTime);
  
  // Determine status
  let status: ComponentDamage['status'] = 'normal';
  if (health <= 0) status = 'destroyed';
  else if (health < 30) status = 'critical';
  else if (health < 60 || temp > 80) status = 'warning';
  
  return { 
    health: Math.max(0, Math.min(100, health)), 
    temperature: temp,
    status,
    warnings 
  };
};

export const calculateBatteryDamage = (
  currentDraw: number,
  voltage: number,
  currentHealth: number,
  deltaTime: number
): { health: number; voltage: number; status: ComponentDamage['status']; warnings: string[] } => {
  let health = currentHealth;
  let volt = voltage;
  const warnings: string[] = [];
  
  // High current draw damage
  if (currentDraw > 30) {
    health -= (currentDraw - 30) * 0.005 * deltaTime;
    warnings.push('Excessive current draw');
  }
  
  // Deep discharge damage
  if (volt < 9.0) {
    health -= (9.0 - volt) * 2 * deltaTime;
    warnings.push('Critical: Deep discharge!');
  }
  
  // Voltage sag under load
  volt = Math.max(9.0, volt - currentDraw * 0.001 * deltaTime);
  
  let status: ComponentDamage['status'] = 'normal';
  if (health <= 0 || volt < 9.0) status = 'destroyed';
  else if (health < 30 || volt < 9.5) status = 'critical';
  else if (health < 60 || volt < 10.5) status = 'warning';
  
  return { 
    health: Math.max(0, Math.min(100, health)),
    voltage: volt,
    status,
    warnings 
  };
};

export const calculateCrashDamage = (
  impactVelocity: number,
  currentHealth: number
): { health: number; status: ComponentDamage['status']; warnings: string[] } => {
  let health = currentHealth;
  const warnings: string[] = [];
  
  if (impactVelocity > 2) {
    const damage = (impactVelocity - 2) * 15;
    health -= damage;
    if (damage > 50) {
      warnings.push('Severe impact damage!');
    } else if (damage > 20) {
      warnings.push('Hard landing - check components');
    } else {
      warnings.push('Minor impact');
    }
  }
  
  let status: ComponentDamage['status'] = 'normal';
  if (health <= 0) status = 'destroyed';
  else if (health < 30) status = 'critical';
  else if (health < 60) status = 'warning';
  
  return { health: Math.max(0, health), status, warnings };
};
