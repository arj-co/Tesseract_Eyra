import React from 'react';

export default function DwellRing({ active, progress, children }) {
  // Use progress to calculate glow intensity and border opacity
  const glowIntensity = (progress / 100) * 15;
  const borderOpacity = 0.2 + (progress / 100) * 0.8;
  const glowColor = `rgba(15, 110, 86, ${progress / 100})`;

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full rounded-xl transition-all duration-75 ${
        active ? 'z-20 scale-[1.02]' : ''
      }`}
      style={active ? {
        boxShadow: `0 0 ${glowIntensity}px ${glowIntensity / 2}px ${glowColor}`,
        borderColor: `rgba(15, 110, 86, ${borderOpacity})`,
        borderWidth: '2px',
        borderStyle: 'solid',
      } : {}}
    >
      {children}
    </div>
  );
}
