import React from 'react';

export default function TopBar({ wordBuffer, predictedSentence, isLoading, letterCount = 0, maxLetters = 5 }) {
  const pct = Math.min(100, (letterCount / maxLetters) * 100);

  return (
    <div className="relative h-16 bg-bgAlternate flex items-center justify-between px-6 shadow-sm shrink-0">
      {/* Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #0F6E56, #1D9E75, #279B48)' }} />

      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="font-serif font-bold text-3xl text-deepNavy tracking-tight">Eyra</span>
      </div>

      {/* Center: Word Buffer + progress */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {wordBuffer.length > 0 ? (
          <div className="text-3xl font-mono tracking-widest font-bold text-textPrimary flex items-center">
            {wordBuffer}<span className="animate-pulse opacity-50 font-sans text-medicalBlue">_</span>
          </div>
        ) : (
          <div className="text-xl font-mono tracking-widest font-bold animate-shimmer flex items-center">
            Start gazing...
          </div>
        )}

        {/* Word-count progress bar */}
        {wordBuffer.length > 0 && (
          <div className="flex items-center gap-2 mt-0.5">
            <div style={{ width: 120, height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 4,
                  background: pct >= 100 ? '#e55' : 'linear-gradient(90deg, #1D9E75, #279B48)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>
              {letterCount}/{maxLetters} letters
            </span>
          </div>
        )}
      </div>

      {/* Right: LLM Prediction */}
      <div className="flex-1 flex justify-end">
        <div className="bg-white px-6 py-2 rounded-xl border border-gray-100 max-w-sm min-h-[44px] flex items-center shadow-sm">
          {isLoading ? (
            <span className="italic text-xl text-textMuted animate-pulse">Expanding...</span>
          ) : predictedSentence ? (
            <span className="italic text-xl text-textPrimary font-sans">"{predictedSentence}"</span>
          ) : (
            <span className="text-gray-400 italic text-lg">Sentence will appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
}
