'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight CSS+Canvas brain "pulse" — no Three.js dependency yet.
 * Renders a glowing sphere with orbiting particles. Mobile-throttled to 30 fps.
 *
 * Future v2.2: swap implementation to Three.js sphere shader keeping the same prop API.
 */
type Props = {
  agentsActive: number;
  alertMode?: 'idle' | 'chat' | 'alert' | 'revenue';
  size?: number; // px
};

export function BrainSphere({ agentsActive, alertMode = 'idle', size = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const fps = isMobile ? 30 : 60;
    const frameDelay = 1000 / fps;
    let lastFrame = 0;

    const colorMap = {
      idle: 'rgba(34, 211, 238, 0.4)',     // cyan
      chat: 'rgba(255, 215, 0, 0.55)',     // gold
      alert: 'rgba(239, 68, 68, 0.65)',     // red
      revenue: 'rgba(16, 185, 129, 0.55)',  // emerald
    };
    const baseColor = colorMap[alertMode];

    const particleCount = Math.min(Math.max(agentsActive, 4), 32);
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      radius: size * 0.42,
      speed: 0.002 + Math.random() * 0.003,
    }));

    const draw = (t: number) => {
      if (t - lastFrame < frameDelay) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = t;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const pulse = 1 + Math.sin(t / 600) * 0.05;

      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, size * 0.45 * pulse);
      grad.addColorStop(0, baseColor.replace('0.4', '0.95').replace('0.55', '0.95').replace('0.65', '0.95'));
      grad.addColorStop(0.6, baseColor);
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.45 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Particles
      for (const p of particles) {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [agentsActive, alertMode, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="rounded-full"
        style={{ width: size, height: size }}
        aria-label="Brain pulse visualization"
      />
      <div className="mt-3 text-center">
        <p className="text-xs uppercase tracking-widest text-white/60">Brain pulse</p>
        <p className="text-sm font-medium text-white/90">
          {agentsActive} agents active · mode: {alertMode}
        </p>
      </div>
    </div>
  );
}
