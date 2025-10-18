'use client';

import type * as THREE from 'three';
import { Sphere, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Component, Suspense, useEffect, useRef, useState } from 'react';

// Error Boundary to catch texture loading errors
class TextureErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    // Don't log to avoid Sentry issues
    if (!error.message?.includes('sentry')) {
      console.warn('Texture loading failed, using fallback');
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Earth WITH texture
function EarthWithTexture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/assets/images/earth-texture.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <meshStandardMaterial
        map={texture}
        roughness={0.7}
        metalness={0.1}
      />
    </Sphere>
  );
}

// Earth WITHOUT texture (fallback)
function EarthFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

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

function Fallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate the fallback sphere too
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <meshStandardMaterial
        color="#3D7CE0"
        roughness={0.7}
        metalness={0.1}
      />
    </Sphere>
  );
}

export default function RotatingEarth() {
  const [isMounted, setIsMounted] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Only render on client side to avoid SSR issues
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(mountTimer);
  }, []);

  // Handle WebGL context lost/restored
  useEffect(() => {
    if (!isMounted || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) {
      return;
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost, attempting to restore...');
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.warn('WebGL context restored');
      setContextLost(false);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [isMounted]);

  // Don't render anything on server
  if (!isMounted) {
    return (
      <div className="absolute inset-0 -z-20 flex h-full w-full items-center justify-center opacity-80">
        <div className="size-64 animate-pulse rounded-full bg-blue-200" />
      </div>
    );
  }

  // Show fallback if context is lost
  if (contextLost) {
    return (
      <div className="absolute inset-0 -z-20 flex h-full w-full items-center justify-center opacity-80">
        <div className="size-64 animate-pulse rounded-full bg-gradient-to-br from-blue-300 to-blue-500" />
      </div>
    );
  }

  return (
    <div ref={canvasRef} className="absolute inset-0 -z-20 h-full w-full opacity-80">
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
        <TextureErrorBoundary fallback={<EarthFallback />}>
          <Suspense fallback={<Fallback />}>
            <EarthWithTexture />
          </Suspense>
        </TextureErrorBoundary>
      </Canvas>
    </div>
  );
}
