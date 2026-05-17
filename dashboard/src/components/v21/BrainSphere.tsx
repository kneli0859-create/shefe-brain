'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Mode = 'idle' | 'chat' | 'alert' | 'revenue';

type Props = {
  agentsActive: number;
  alertMode?: Mode;
  size?: number; // px
};

const MODE_COLORS: Record<Mode, { core: string; halo: string; glow: string }> = {
  idle:    { core: '#22D3EE', halo: '#0EA5E9', glow: '#22D3EE' }, // cyan
  chat:    { core: '#FFD700', halo: '#F59E0B', glow: '#FFD700' }, // gold
  alert:   { core: '#EF4444', halo: '#DC2626', glow: '#EF4444' }, // red
  revenue: { core: '#10B981', halo: '#059669', glow: '#10B981' }, // emerald
};

function Sphere({ mode, intensity }: { mode: Mode; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors = MODE_COLORS[mode];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.22;
    // Subtle scale pulse driven by agent activity
    const pulse = 1 + Math.sin(t * 1.4) * 0.04 * intensity;
    meshRef.current.scale.setScalar(1.4 * pulse);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color={colors.core}
          emissive={colors.glow}
          emissiveIntensity={0.35 + intensity * 0.25}
          roughness={0.18}
          metalness={0.75}
          distort={0.28 + intensity * 0.15}
          speed={1.4 + intensity * 1.0}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ref} scale={2.55}>
      <torusGeometry args={[1, 0.005, 16, 240]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function AgentParticles({ count, color }: { count: number; color: string }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Distribute on a sphere shell
      const r = 2.0 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    ref.current.rotation.x = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

export function BrainSphere({ agentsActive, alertMode = 'idle', size = 300 }: Props) {
  // Intensity 0..1 scaled by active agents (capped at 16)
  const intensity = Math.min(agentsActive / 16, 1);
  const colors = MODE_COLORS[alertMode];
  // More agents → more particles, but throttle on mobile (rough heuristic)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const particleCount = Math.min(Math.max(agentsActive * 12, 60), isMobile ? 180 : 480);
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: size, height: size }}
        aria-label="Brain pulse visualization"
      >
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          frameloop={isMobile ? 'demand' : 'always'}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color={colors.core} />
          <pointLight position={[-4, -2, 3]} intensity={0.6} color={colors.halo} />
          <Sphere mode={alertMode} intensity={intensity} />
          <OrbitRing color={colors.halo} />
          <AgentParticles count={particleCount} color={colors.core} />
          <Sparkles count={80} scale={5} size={2.0} speed={0.5} color={colors.core} />
          <Environment preset="city" />
        </Canvas>

        {/* Soft outer glow via CSS — cheaper than full bloom shader */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow}26 0%, transparent 65%)`,
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-white/55">Brain pulse</p>
        <p className="mt-0.5 text-sm font-medium text-white/90">
          {agentsActive} agents active · mode: {alertMode}
        </p>
      </div>
    </div>
  );
}
