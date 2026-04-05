import React from 'react';

export default function DwellRing({ active, progress, children }) {
  // Enhanced glow and ring for a premium feel
  const glowIntensity = (progress / 100) * 20;
  const borderOpacity = 0.3 + (progress / 100) * 0.7;
  const shadowOpacity = (progress / 100) * 0.4;
  const ringColor = `rgba(15, 110, 86, ${borderOpacity})`;
  const scale = active ? 1 + (progress / 100) * 0.05 : 1;

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full rounded-2xl transition-all duration-100 ${
        active ? 'z-20 bg-white/40 backdrop-blur-md' : 'bg-white'
      }`}
      style={{
        transform: `scale(${scale})`,
        boxShadow: active 
          ? `0 10px 40px -10px rgba(0,0,0,${shadowOpacity}), 0 0 ${glowIntensity}px ${glowIntensity / 3}px rgba(15, 110, 86, ${progress / 100})` 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        border: `2px solid ${active ? ringColor : 'transparent'}`,
      }}
    >
      {/* Internal progress bar (optional, or just use the border) */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-medicalBlue transition-all duration-75"
        style={{ width: `${progress}%`, opacity: active ? 0.8 : 0 }}
      />
      {children}
    </div>
  );
}
