import React, { useEffect, useRef, useState } from 'react';

interface AIOrbProps {
  size?: number;
  interactive?: boolean;
  className?: string;
  reducedMotion?: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulsePhase: number;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  size = 460,
  interactive = true,
  className = '',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Particle sphere population
    const particleCount = reducedMotion ? 40 : 90;
    const sphereRadius = size * 0.36;
    const particles: Particle3D[] = [];

    // Distinctive PREPVEXA AI colors: Crisp White highlights, Soft Pink/Rose, Emerald Green, Warm Yellow
    const palette = [
      { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.85)' }, // Pure White highlight
      { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.65)' }, // Soft Rose/Pink
      { color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },  // Vibrant Pink
      { color: '#34d399', glow: 'rgba(52, 211, 153, 0.55)' },  // Emerald Green
      { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)' },   // Warm Yellow
    ];

    // Distribute particles across sphere using Fibonacci lattice
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < particleCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const r = sphereRadius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const colorData = palette[i % palette.length];
      particles.push({
        x,
        y,
        z,
        baseRadius: Math.random() * 2.2 + 1.8,
        color: colorData.color,
        glowColor: colorData.glow,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const centerX = size / 2;
      const centerY = size / 2;

      // Mouse inertia interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (!reducedMotion) {
        rotY += 0.007 + mouseRef.current.x * 0.015;
        rotX += 0.004 + mouseRef.current.y * 0.015;
      }

      // Draw central energetic core gradient
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        sphereRadius * 0.85
      );
      coreGrad.addColorStop(0, 'rgba(236, 72, 153, 0.28)');
      coreGrad.addColorStop(0.3, 'rgba(244, 114, 182, 0.15)');
      coreGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.05)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Transform particles in 3D
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected = particles.map((p) => {
        // Y-axis rotation
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // X-axis rotation
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const fov = 420;
        const scale = fov / (fov + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        p.pulsePhase += p.pulseSpeed;
        const currentRadius = p.baseRadius * (1 + 0.25 * Math.sin(p.pulsePhase)) * scale;

        return {
          px,
          py,
          scale,
          z: z2,
          radius: Math.max(currentRadius, 0.8),
          color: p.color,
          glowColor: p.glowColor,
        };
      });

      // Sort by depth so back particles draw first
      projected.sort((a, b) => a.z - b.z);

      // Draw neural connections (synapses)
      const maxConnectDist = 65;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * Math.min(p1.scale, p2.scale) * 0.45;
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes with luminous glow
      projected.forEach((p) => {
        const alpha = Math.max(0.2, (p.scale - 0.5) * 1.5);
        ctx.save();
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10 * p.scale;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright specular point
        if (p.scale > 0.9) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.px - p.radius * 0.3, p.py - p.radius * 0.3, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      setIsHovered(false);
    };

    const container = containerRef.current;
    if (container && interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', () => setIsHovered(true));
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container && interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [size, interactive, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Soft Glow ring */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none ${
          isHovered ? 'opacity-80' : 'opacity-40'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.08) 45%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Orbit Rings with White Specular Edge */}
      <div
        className={`absolute rounded-full border border-white/20 pointer-events-none transition-transform duration-1000 ${
          reducedMotion ? '' : 'animate-[spin_36s_linear_infinite]'
        }`}
        style={{ width: size * 0.82, height: size * 0.82 }}
      />
      <div
        className={`absolute rounded-full border border-pink-500/25 pointer-events-none transition-transform duration-1000 ${
          reducedMotion ? '' : 'animate-[spin_28s_linear_infinite_reverse]'
        }`}
        style={{ width: size * 0.72, height: size * 0.72 }}
      />
      <div
        className={`absolute rounded-full border border-white/10 pointer-events-none transition-transform duration-1000 ${
          reducedMotion ? '' : 'animate-[spin_48s_linear_infinite]'
        }`}
        style={{ width: size * 0.94, height: size * 0.94 }}
      />

      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="relative z-10 cursor-pointer"
      />
    </div>
  );
};
