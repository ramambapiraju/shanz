import { useRef, useEffect } from "react";
import { MechatronicsComponent } from "@/pages/MechatronicsSimulator";

interface MechatronicsCanvasProps {
  components: MechatronicsComponent[];
  selectedComponent: MechatronicsComponent | null;
  onSelectComponent: (component: MechatronicsComponent | null) => void;
  onUpdateComponent: (id: string, updates: Partial<MechatronicsComponent>) => void;
  isSimulating: boolean;
}

export const MechatronicsCanvas = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  isSimulating
}: MechatronicsCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(var(--border), 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw components
      components.forEach((component) => {
        const centerX = canvas.width / 2 + component.position.x;
        const centerY = canvas.height / 2 + component.position.y;
        const size = 60;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(component.rotation.z);

        // Draw component based on type
        const isSelected = selectedComponent?.id === component.id;
        ctx.strokeStyle = isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))';
        ctx.fillStyle = isSelected ? 'hsla(var(--primary), 0.2)' : 'hsl(var(--card))';
        ctx.lineWidth = isSelected ? 3 : 2;

        switch (component.type) {
          case 'dc-motor':
            // Draw motor as circle with M
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'hsl(var(--foreground))';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('M', 0, 0);
            if (isSimulating) {
              // Animate rotation
              ctx.strokeStyle = 'hsl(var(--primary))';
              ctx.beginPath();
              ctx.arc(0, 0, size / 3, 0, Math.PI / 4);
              ctx.stroke();
            }
            break;

          case 'encoder':
            // Draw encoder as segmented circle
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(angle) * size / 2, Math.sin(angle) * size / 2);
              ctx.stroke();
            }
            break;

          case 'gear':
            // Draw gear with teeth
            ctx.beginPath();
            const teeth = 12;
            for (let i = 0; i < teeth; i++) {
              const angle1 = (Math.PI * 2 * i) / teeth;
              const angle2 = (Math.PI * 2 * (i + 0.5)) / teeth;
              const r1 = size / 2;
              const r2 = size / 2.5;
              ctx.lineTo(Math.cos(angle1) * r1, Math.sin(angle1) * r1);
              ctx.lineTo(Math.cos(angle2) * r2, Math.sin(angle2) * r2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;

          case 'wheel':
            // Draw wheel
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Draw spokes
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(angle) * size / 2, Math.sin(angle) * size / 2);
              ctx.stroke();
            }
            break;

          case 'linkage':
            // Draw linkage as rectangle
            ctx.fillRect(-size / 4, -size / 2, size / 2, size);
            ctx.strokeRect(-size / 4, -size / 2, size / 2, size);
            ctx.beginPath();
            ctx.arc(0, -size / 2, 5, 0, Math.PI * 2);
            ctx.arc(0, size / 2, 5, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'power-source':
            // Draw power source as battery
            ctx.fillRect(-size / 3, -size / 2.5, size / 1.5, size / 1.25);
            ctx.strokeRect(-size / 3, -size / 2.5, size / 1.5, size / 1.25);
            ctx.fillStyle = 'hsl(var(--destructive))';
            ctx.fillRect(-size / 6, -size / 1.8, size / 3, size / 6);
            ctx.fillStyle = 'hsl(var(--primary))';
            ctx.fillRect(-size / 6, size / 6, size / 3, size / 6);
            break;

          case 'controller':
            // Draw controller as chip
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.strokeRect(-size / 2, -size / 2, size, size);
            ctx.fillStyle = 'hsl(var(--foreground))';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PID', 0, 0);
            break;
        }

        ctx.restore();

        // Draw label
        ctx.fillStyle = 'hsl(var(--foreground))';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(component.type, centerX, centerY + size / 2 + 15);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Handle click events
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let clickedComponent: MechatronicsComponent | null = null;

      components.forEach((component) => {
        const centerX = canvas.width / 2 + component.position.x;
        const centerY = canvas.height / 2 + component.position.y;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        if (distance < 30) {
          clickedComponent = component;
        }
      });

      onSelectComponent(clickedComponent);
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [components, selectedComponent, isSimulating, onSelectComponent]);

  return (
    <div className="w-full h-full bg-background relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground">
        Click components to select • Configure in right panel
      </div>
    </div>
  );
};
