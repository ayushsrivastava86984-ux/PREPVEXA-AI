import React, { useEffect, useRef } from 'react';

interface Floating3DDecorProps {
  className?: string;
  variant?: 'hero' | 'minimal' | 'neural' | 'dashboard';
  reducedMotion?: boolean;
}

interface Shape3D {
  type: 'cube' | 'octahedron' | 'orb' | 'ring';
  x: number;
  y: number;
  z: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  color: string;
  glow: string;
  isWhiteHighlight?: boolean;
}

export const Floating3DDecor: React.FC<Floating3DDecorProps> = ({
  className = '',
  variant = 'hero',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 3 : variant === 'minimal' ? 4 : 7;

    const shapes: Shape3D[] = [];
    const colors = [
      { color: 'rgba(255, 255, 255, 0.85)', glow: 'rgba(255, 255, 255, 0.4)', isWhite: true },
      { color: 'rgba(236, 72, 153, 0.75)', glow: 'rgba(236, 72, 153, 0.35)', isWhite: false },
      { color: 'rgba(244, 114, 182, 0.7)', glow: 'rgba(244, 114, 182, 0.3)', isWhite: false },
      { color: 'rgba(251, 191, 36, 0.65)', glow: 'rgba(251, 191, 36, 0.25)', isWhite: false },
      { color: 'rgba(52, 211, 153, 0.65)', glow: 'rgba(52, 211, 153, 0.25)', isWhite: false },
    ];

    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      shapes.push({
        type: i % 3 === 0 ? 'octahedron' : i % 3 === 1 ? 'cube' : 'ring',
        x: (Math.random() - 0.5) * (width * 0.85),
        y: (Math.random() - 0.5) * (height * 0.75),
        z: Math.random() * 200 - 100,
        size: isMobile ? 18 + Math.random() * 14 : 24 + Math.random() * 22,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        rotSpeedZ: (Math.random() - 0.5) * 0.006,
        color: c.color,
        glow: c.glow,
        isWhiteHighlight: c.isWhite,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      shapes.forEach((s) => {
        if (!reducedMotion) {
          s.rotX += s.rotSpeedX;
          s.rotY += s.rotSpeedY;
          s.rotZ += s.rotSpeedZ;
        }

        const fov = 350;
        const scale = fov / (fov + s.z);
        const px = cx + s.x * scale;
        const py = cy + s.y * scale;
        const currentSize = s.size * scale;

        ctx.save();
        ctx.translate(px, py);
        ctx.shadowColor = s.glow;
        ctx.shadowBlur = s.isWhiteHighlight ? 12 : 8;

        if (s.type === 'octahedron') {
          // Render glass wireframe octahedron
          const cos = Math.cos(s.rotY);
          const sin = Math.sin(s.rotY);
          const top = -currentSize * 1.3;
          const bottom = currentSize * 1.3;
          const r = currentSize * 0.9;

          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.isWhiteHighlight ? 1.4 : 1.0;

          // Connect top vertex to base
          ctx.beginPath();
          ctx.moveTo(0, top);
          ctx.lineTo(r * cos, 0);
          ctx.lineTo(0, bottom);
          ctx.lineTo(-r * cos, 0);
          ctx.closePath();
          ctx.stroke();

          // Connect cross ring
          ctx.beginPath();
          ctx.ellipse(0, 0, r * Math.abs(cos), r * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();

          // White center specular glint
          if (s.isWhiteHighlight) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 2.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (s.type === 'ring') {
          // 3D Orbital Gyro Ring
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, currentSize * 1.2, currentSize * 0.45, s.rotZ, 0, Math.PI * 2);
          ctx.stroke();

          // Small satellite bead
          const beadAngle = s.rotY * 2;
          const bx = Math.cos(beadAngle) * currentSize * 1.2;
          const by = Math.sin(beadAngle) * currentSize * 0.45;
          ctx.fillStyle = s.isWhiteHighlight ? '#ffffff' : s.color;
          ctx.beginPath();
          ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Futuristic Hexagonal Prism
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3 + s.rotX;
            const hx = Math.cos(angle) * currentSize;
            const hy = Math.sin(angle) * currentSize;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner white depth accent
          ctx.fillStyle = s.isWhiteHighlight ? 'rgba(255, 255, 255, 0.12)' : 'rgba(236, 72, 153, 0.05)';
          ctx.fill();
        }

        ctx.restore();
      });

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full select-none ${className}`}
      aria-hidden="true"
    />
  );
};
