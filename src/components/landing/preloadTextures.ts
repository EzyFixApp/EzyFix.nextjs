import { useTexture } from '@react-three/drei';

// Preload textures on app initialization
export function preloadEarthTexture() {
  if (typeof window !== 'undefined') {
    try {
      // Preload the earth texture
      useTexture.preload('/assets/images/earth-texture.jpg');
    } catch (error) {
      console.error('Failed to preload earth texture:', error);
    }
  }
}
