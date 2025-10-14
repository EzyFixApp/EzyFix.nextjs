'use client';

export default function RotatingEarth() {
  return (
    <div className="absolute inset-0 -z-20 flex items-center justify-center overflow-hidden">
      {/* Large rotating gradient sphere */}
      <div className="relative h-[500px] w-[500px] animate-spin lg:h-[600px] lg:w-[600px]" style={{ animationDuration: '30s' }}>
        {/* Main sphere with enhanced gradient */}
        <div
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: `
              radial-gradient(circle at 35% 35%, 
                rgba(96, 156, 239, 0.9) 0%, 
                rgba(79, 139, 232, 0.8) 20%,
                rgba(61, 124, 224, 0.7) 40%,
                rgba(45, 108, 192, 0.6) 60%,
                rgba(29, 92, 160, 0.5) 80%,
                rgba(20, 70, 130, 0.3) 100%
              )
            `,
            boxShadow: `
              0 0 80px rgba(96, 156, 239, 0.6),
              0 0 120px rgba(61, 124, 224, 0.4),
              inset 0 0 80px rgba(61, 124, 224, 0.4)
            `,
          }}
        />

        {/* Continents pattern */}
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 40% 30%, rgba(34, 139, 34, 0.4) 0%, transparent 20%),
              radial-gradient(ellipse at 60% 50%, rgba(34, 139, 34, 0.3) 0%, transparent 15%),
              radial-gradient(ellipse at 30% 70%, rgba(34, 139, 34, 0.35) 0%, transparent 18%),
              radial-gradient(ellipse at 70% 40%, rgba(34, 139, 34, 0.3) 0%, transparent 12%),
              radial-gradient(ellipse at 50% 80%, rgba(34, 139, 34, 0.25) 0%, transparent 15%)
            `,
          }}
        />

        {/* Grid lines for latitude/longitude */}
        <div
          className="absolute inset-0 rounded-full opacity-25"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(255, 255, 255, 0.15) 1px,
                transparent 2px,
                transparent 40px
              ),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(255, 255, 255, 0.15) 1px,
                transparent 2px,
                transparent 40px
              )
            `,
          }}
        />

        {/* Highlight spot (sun reflection) */}
        <div
          className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full opacity-60 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
          }}
        />

        {/* Outer glow */}
        <div
          className="absolute inset-0 animate-pulse rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(96, 156, 239, 0.4) 0%, transparent 65%)',
            transform: 'scale(1.1)',
          }}
        />
      </div>
    </div>
  );
}
