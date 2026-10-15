import React from 'react';

/**
 * HeroFallback
 *
 * Lightweight CSS-driven fallback shown when WebGL is unavailable,
 * motion is reduced, or the user is on a low-power device.
 * Features a glowing layered gradient sphere with subtle floating animation.
 */
export function HeroFallback(): React.JSX.Element {
  return (
    <div
      className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden pointer-events-none select-none sm:min-h-[440px] md:min-h-[500px]"
      aria-hidden="true"
    >
      <style>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-14px) scale(1.02);
          }
        }
        @keyframes heroGlowPulse {
          0%, 100% {
            opacity: 0.6;
            filter: blur(48px);
          }
          50% {
            opacity: 0.85;
            filter: blur(60px);
          }
        }
        @keyframes orbitSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-float,
          .animate-hero-glow,
          .animate-orbit-slow {
            animation: none !important;
          }
        }
        .animate-hero-float {
          animation: heroFloat 7s ease-in-out infinite;
        }
        .animate-hero-glow {
          animation: heroGlowPulse 5s ease-in-out infinite;
        }
        .animate-orbit-slow {
          animation: orbitSlow 30s linear infinite;
        }
      `}</style>

      {/* Ambient background blur circles */}
      <div
        className="animate-hero-glow absolute h-64 w-64 rounded-full bg-[#6E56CF]/30 blur-3xl sm:h-80 sm:w-80 md:h-96 md:w-96"
        style={{ transform: 'translate(-15%, -10%)' }}
      />
      <div
        className="animate-hero-glow absolute h-60 w-60 rounded-full bg-[#22D3EE]/25 blur-3xl sm:h-72 sm:w-72 md:h-88 md:w-88"
        style={{ transform: 'translate(20%, 20%)', animationDelay: '-2.5s' }}
      />

      {/* Floating sphere and orbital rings */}
      <div className="animate-hero-float relative flex items-center justify-center">
        {/* Outer orbital decorative ring */}
        <div className="animate-orbit-slow absolute h-72 w-72 rounded-full border border-dashed border-[#22D3EE]/25 sm:h-96 sm:w-96 md:h-[420px] md:w-[420px]" />

        {/* Inner orbital ring with tilt */}
        <div
          className="animate-orbit-slow absolute h-60 w-60 rounded-full border border-[#6E56CF]/30 sm:h-80 sm:w-80 md:h-88 md:w-88"
          style={{ transform: 'rotate(45deg)', animationDirection: 'reverse', animationDuration: '40s' }}
        />

        {/* Core glowing gradient sphere */}
        <div
          className="relative h-44 w-44 rounded-full sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #5eead4 0%, #22D3EE 18%, #6E56CF 55%, #3b1d82 82%, #180936 100%)',
            boxShadow:
              '0 0 50px rgba(34, 211, 238, 0.35), 0 0 100px rgba(110, 86, 207, 0.45), inset -10px -10px 30px rgba(10, 4, 30, 0.8), inset 8px 8px 24px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Internal specular highlight / lens reflection */}
          <div
            className="absolute top-5 left-7 h-12 w-16 rounded-full bg-white/40 blur-sm sm:top-7 sm:left-9 sm:h-16 sm:w-20"
            style={{ transform: 'rotate(-25deg)' }}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroFallback;
