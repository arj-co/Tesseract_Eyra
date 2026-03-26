import React, { useEffect, useRef } from 'react';

export default function TopBar({ wordBuffer, predictedSentence, isLoading }) {
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!pupilRef.current) return;
      const eye = pupilRef.current.parentElement.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;
      
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(4, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
      
      const maxDist = 3.5;
      const x = Math.cos(angle) * Math.min(distance, maxDist);
      const y = Math.sin(angle) * Math.min(distance, maxDist);
      
      pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-20 bg-white flex items-center justify-between px-8 shadow-sm shrink-0">
      {/* Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)' }}></div>

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-medicalBlue opacity-80 animate-blink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <circle ref={pupilRef} cx="12" cy="12" r="3" fill="currentColor" stroke="none" className="transition-transform duration-75 ease-out pointer-events-none" />
        </svg>
        <span className="font-serif font-bold text-3xl text-deepNavy tracking-tight">Eyra</span>
      </div>

      {/* Center: Word Buffer */}
      <div className="flex-1 flex justify-center">
        {wordBuffer.length > 0 ? (
          <div className="text-4xl font-mono tracking-widest font-bold text-textPrimary flex items-center">
            {wordBuffer}<span className="animate-pulse opacity-50 font-sans text-medicalBlue">_</span>
          </div>
        ) : (
          <div className="text-2xl font-mono tracking-widest font-bold animate-shimmer flex items-center">
            Start gazing...
          </div>
        )}
      </div>

      {/* Right: LLM Predicton */}
      <div className="flex-1 flex justify-end">
        <div className="bg-bgAlternate px-6 py-2 rounded-xl border border-gray-100 max-w-sm min-h-[44px] flex items-center shadow-sm">
          {isLoading ? (
            <span className="italic text-xl text-textMuted animate-pulse">
              Expanding...
            </span>
          ) : predictedSentence ? (
            <span className="italic text-xl text-textPrimary font-sans">
              "{predictedSentence}"
            </span>
          ) : (
            <span className="text-gray-400 italic text-lg">
              Sentence will appear here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
