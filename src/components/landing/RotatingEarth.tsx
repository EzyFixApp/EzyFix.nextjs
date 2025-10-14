'use client';

import type * as THREE from 'three';
import { Sphere, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load Earth texture
  const earthTexture = useTexture('/assets/images/earth-texture.jpg');

  // Rotate the Earth
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Rotation speed
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.7}
        metalness={0.1}
      />
    </Sphere>
  );
}

function Fallback() {
  return (
    <Sphere args={[1.6, 64, 64]}>
      <meshStandardMaterial color="#3D7CE0" />
    </Sphere>
  );
}

export default function RotatingEarth() {
  return (
    <div className="absolute inset-0 -z-20 h-full w-full opacity-60">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Suspense fallback={<Fallback />}>
          <Earth />
        </Suspense>
      </Canvas>
    </div>
  );
}
