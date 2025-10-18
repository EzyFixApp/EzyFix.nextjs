'use client';

import type * as THREE from 'three';
import { Sphere } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';

// Simple Earth without texture - works reliably on all platforms
function SimpleEarth() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate the Earth
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <meshStandardMaterial
        color="#3D7CE0"
        roughness={0.6}
        metalness={0.2}
        emissive="#1E40AF"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

// Fallback during loading
function Fallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <meshStandardMaterial
        color="#60A5FA"
        roughness={0.7}
        metalness={0.1}
      />
    </Sphere>
  );
}

export default function RotatingEarthSimple() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 -z-20 flex h-full w-full items-center justify-center opacity-80">
        <div className="size-64 animate-pulse rounded-full bg-blue-200" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-20 h-full w-full opacity-80">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#60A5FA" />
        <Suspense fallback={<Fallback />}>
          <SimpleEarth />
        </Suspense>
      </Canvas>
    </div>
  );
}
