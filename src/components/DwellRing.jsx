import React from 'react';

export default function DwellRing({ active, progress, children }) {
  // Circle geometry — use a fixed viewBox so the math is deterministic
  const size = 100;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2; // 48
  const circumference = 2 * Math.PI * radius; // ≈ 301.6
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center w-full h-full rounded-xl transition-all ${
      active ? 'bg-[#E8F0FE] ring-2 ring-medicalBlue scale-[1.05] z-20 shadow-md' : ''
    }`}>
      {children}
      {active && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="none"
        >
          {/* Track (faint background ring) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1A73E8"
            strokeWidth={strokeWidth}
            className="opacity-15"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1A73E8"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="opacity-90 transition-[stroke-dashoffset] duration-75 ease-linear"
          />
        </svg>
      )}
    </div>
  );
}
