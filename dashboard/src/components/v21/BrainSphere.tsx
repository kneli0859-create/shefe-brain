'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles, Environment } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export type BrainMode = 'idle' | 'chat' | 'alert' | 'revenue';

type Props = {
  agentsActive: number;
  mode?: BrainMode;
  /** "hero" = full-bleed, fills container. "compact" = legacy fixed-size mode. */
  variant?: 'hero' | 'compact';
  size?: number; // px (compact mode only)
};

const MODE_COLORS: Record<
  BrainMode,
  { core: string; halo: string; glow: string; accent: string }
> = {
  idle: { core: '#00D9FF', halo: '#0EA5E9', glow: '#00D9FF', accent: '#67E8F9' },
  chat: { core: '#FFD700', halo: '#F59E0B', glow: '#FFD700', accent: '#FFE45A' },
  alert: { core: '#FF3366', halo: '#DC2626', glow: '#FF3366', accent: '#FB7185' },
  revenue: { core: '#10F299', halo: '#10B981', glow: '#10F299', accent: '#6EE7B7' },
};

function Sphere({ mode, intensity }: { mode: BrainMode; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<{ distort: number; speed: number }>(null);
  const { mouse, viewport } = useThree();
  const colors = MODE_COLORS[mode];
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Mouse/touch follow — gentle lerp toward pointer position
    const tx = mouse.y * 0.35;
    const ty = mouse.x * 0.35;
    targetRotation.current.x += (tx - targetRotation.current.x) * 0.04;
    targetRotation.current.y += (ty - targetRotation.current.y) * 0.04;
    meshRef.current.rotation.x = targetRotation.current.x + t * 0.08;
    meshRef.current.rotation.y = targetRotation.current.y + t * 0.12;

    // Pulse driven by activity
    const pulse = 1 + Math.sin(t * 1.6) * 0.05 * (0.5 + intensity * 0.5);
    meshRef.current.scale.setScalar(1.55 * pulse);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 192, 192]} />
        <MeshDistortMaterial
          color={colors.core}
          emissive={colors.glow}
          emissiveIntensity={0.45 + intensity * 0.35}
          roughness={0.12}
          metalness={0.78}
          distort={0.42 + intensity * 0.18}
          speed={1.6 + intensity * 1.2}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ color, scale, speed, axis }: { color: string; scale: number; speed: number; axis: 'z' | 'x' | 'y' }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    if (axis === 'z') ref.current.rotation.z = state.clock.elapsedTime * speed;
    if (axis === 'x') ref.current.rotation.x = state.clock.elapsedTime * speed;
    if (axis === 'y') ref.current.rotation.y = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <torusGeometry args={[1, 0.004, 16, 256]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
}

function OrbitingParticles({ count, color, accent }: { count: number; color: string; accent: string }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 2.1 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(accent);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const mix = Math.random();
      const c = c1.clone().lerp(c2, mix);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [count, color, accent]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = state.clock.elapsedTime * 0.022;
    ref.current.rotation.z = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.042} transparent opacity={0.95} sizeAttenuation vertexColors />
    </points>
  );
}

export function BrainSphere({
  agentsActive,
  mode = 'idle',
  variant = 'compact',
  size = 300,
}: Props) {
  const intensity = Math.min(agentsActive / 20, 1);
  const colors = MODE_COLORS[mode];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Hero variant uses larger particle count
  const particleCount = variant === 'hero'
    ? (isMobile ? 260 : 540)
    : Math.min(Math.max(agentsActive * 12, 80), isMobile ? 180 : 380);
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  const containerStyle: React.CSSProperties =
    variant === 'hero'
      ? { width: '100%', height: '100%' }
      : { width: size, height: size };

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={containerStyle}
      aria-label="Brain pulse visualization"
    >
      <div className="relative h-full w-full">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 5], fov: variant === 'hero' ? 38 : 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop="always"
          style={{ pointerEvents: 'auto' }}
        >
          <ambientLight intensity={0.45} />
          <pointLight position={[5, 5, 5]} intensity={1.4} color={colors.core} />
          <pointLight position={[-5, -3, 4]} intensity={1.0} color={colors.halo} />
          <pointLight position={[0, 6, -3]} intensity={0.8} color={colors.accent} />
          <pointLight position={[3, -4, -2]} intensity={0.6} color={colors.glow} />

          <Sphere mode={mode} intensity={intensity} />

          <OrbitRing color={colors.halo} scale={2.6} speed={0.08} axis="z" />
          <OrbitRing color={colors.accent} scale={2.95} speed={-0.05} axis="x" />
          <OrbitRing color={colors.core} scale={3.25} speed={0.03} axis="y" />

          <OrbitingParticles count={particleCount} color={colors.core} accent={colors.accent} />
          <Sparkles
            count={isMobile ? 80 : 160}
            scale={variant === 'hero' ? 8 : 5}
            size={2.4}
            speed={0.6}
            color={colors.core}
          />

          <Environment preset="city" />
        </Canvas>

        {/* Outer glow halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow}33 0%, ${colors.glow}10 35%, transparent 70%)`,
            filter: 'blur(50px)',
            zIndex: -1,
          }}
        />

        {/* Subtle ring overlay for premium feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[14%] rounded-full"
          style={{
            border: `1px solid ${colors.glow}22`,
            boxShadow: `inset 0 0 60px ${colors.glow}18`,
          }}
        />
      </div>
    </div>
  );
}
