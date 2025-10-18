'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import RotatingEarth with no SSR
const RotatingEarth = dynamic(() => import('./RotatingEarth'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-20 flex h-full w-full items-center justify-center opacity-80">
      <div className="size-64 animate-pulse rounded-full bg-gradient-to-br from-blue-200 to-blue-400" />
    </div>
  ),
});

export default function RotatingEarthWrapper() {
  return (
    <Suspense
      fallback={(
        <div className="absolute inset-0 -z-20 flex h-full w-full items-center justify-center opacity-80">
          <div className="size-64 animate-pulse rounded-full bg-gradient-to-br from-blue-200 to-blue-400" />
        </div>
      )}
    >
      <RotatingEarth />
    </Suspense>
  );
}
