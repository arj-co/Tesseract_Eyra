import React from 'react';

export default function TopBar({ wordBuffer, predictedSentence, isLoading }) {
  return (
    <div className="relative h-20 bg-bgAlternate flex items-center justify-between px-8 shadow-sm shrink-0">
      {/* Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #0F6E56, #1D9E75, #279B48)' }}></div>

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
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
        <div className="bg-white px-6 py-2 rounded-xl border border-gray-100 max-w-sm min-h-[44px] flex items-center shadow-sm">
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
