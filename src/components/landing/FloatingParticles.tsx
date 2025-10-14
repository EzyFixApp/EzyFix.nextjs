'use client';

export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {/* Floating circles/particles */}
      <div className="absolute top-[20%] left-[10%] size-32 animate-pulse rounded-full bg-white/10 blur-2xl" />
      <div className="absolute top-[30%] right-[15%] size-24 animate-pulse rounded-full bg-white/15 blur-xl delay-100" />
      <div className="absolute bottom-[25%] left-[20%] size-40 animate-pulse rounded-full bg-white/10 blur-3xl delay-300" />
      <div className="absolute right-[25%] bottom-[35%] size-28 animate-pulse rounded-full bg-white/12 blur-2xl delay-500" />

      <div
        className="absolute top-1/3 left-1/4 size-64 animate-spin rounded-full opacity-20 blur-3xl lg:size-96"
        style={{
          animationDuration: '25s',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(96, 156, 239, 0.2) 50%, transparent 100%)',
        }}
      />

      <div
        className="absolute top-1/2 right-1/3 size-72 animate-spin rounded-full opacity-15 blur-3xl lg:size-96"
        style={{
          animationDuration: '30s',
          animationDirection: 'reverse',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(61, 124, 224, 0.15) 50%, transparent 100%)',
        }}
      />

      {/* Small dots pattern */}
      <div className="absolute inset-0 opacity-30">
        {[...Array.from({ length: 15 })].map((_, i) => (
          <div
            key={i}
            className="absolute size-2 animate-pulse rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
