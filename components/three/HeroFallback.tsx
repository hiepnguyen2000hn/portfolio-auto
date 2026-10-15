'use client';

import React from 'react';

export function HeroFallback(): React.JSX.Element {
  return (
    <div
      role="img"
      aria-label="3D visual fallback preview representing an arctic ice crystal sphere"
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      {/* Inline styles for ambient animations */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.02);
          }
        }
        @keyframes heroGlowPulse {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
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
        className="animate-hero-glow absolute h-64 w-64 rounded-full bg-[var(--primary)]/30 blur-3xl sm:h-80 sm:w-80 md:h-96 md:w-96"
        style={{ transform: 'translate(-15%, -10%)' }}
      />
      <div
        className="animate-hero-glow absolute h-60 w-60 rounded-full bg-[var(--accent)]/25 blur-3xl sm:h-72 sm:w-72 md:h-88 md:w-88"
        style={{ transform: 'translate(20%, 20%)', animationDelay: '-2.5s' }}
      />

      {/* Floating sphere and orbital rings */}
      <div className="animate-hero-float relative flex items-center justify-center">
        {/* Outer orbital decorative ring */}
        <div className="animate-orbit-slow absolute h-72 w-72 rounded-full border border-dashed border-[var(--accent)]/30 sm:h-96 sm:w-96 md:h-[420px] md:w-[420px]" />

        {/* Inner orbital ring with tilt */}
        <div
          className="animate-orbit-slow absolute h-60 w-60 rounded-full border border-[var(--primary)]/30 sm:h-80 sm:w-80 md:h-88 md:w-88"
          style={{ transform: 'rotate(45deg)', animationDirection: 'reverse', animationDuration: '40s' }}
        />

        {/* Core glowing frosted arctic aurora crystal sphere with hairline facets */}
        <div
          className="relative h-44 w-44 rounded-full sm:h-56 sm:w-56 md:h-64 md:w-64 backdrop-blur-xl"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #7DF9FF 0%, #38BDF8 25%, #2DD4BF 55%, #0B1420 85%, #060B12 100%)',
            boxShadow:
              '0 0 50px rgba(56, 189, 248, 0.35), 0 0 100px rgba(125, 249, 255, 0.45), inset -10px -10px 30px rgba(6, 11, 18, 0.8), inset 8px 8px 24px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Hairline icosahedron crystal facet outline */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none p-3.5"
            aria-hidden="true"
          >
            <polygon
              points="50,6 88,27 88,73 50,94 12,73 12,27"
              fill="none"
              stroke="rgba(125, 249, 255, 0.45)"
              strokeWidth="0.8"
            />
            <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(125, 249, 255, 0.3)" strokeWidth="0.5" />
            <line x1="12" y1="27" x2="88" y2="73" stroke="rgba(125, 249, 255, 0.25)" strokeWidth="0.5" />
            <line x1="12" y1="73" x2="88" y2="27" stroke="rgba(125, 249, 255, 0.25)" strokeWidth="0.5" />
            <polygon
              points="50,22 75,37 75,63 50,78 25,63 25,37"
              fill="none"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="0.6"
            />
          </svg>

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
