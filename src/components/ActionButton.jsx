import React from 'react';
import DwellRing from './DwellRing';

export default function ActionButton({ label, type, id, isDwelling, dwellProgress }) {
  const isSpeak = type === 'speak';
  
  return (
    <div 
      data-dwell={id}
      className={`w-full rounded-lg font-bold text-center transition-all cursor-pointer ${
        isSpeak 
          ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_4px_14px_rgba(37,99,235,0.4)] border border-[#1d4ed8] hover:border-[#1e40af] animate-pulse-glow hover:scale-[1.02]' 
          : type === 'autofill'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-[0_4px_12px_rgba(79,70,229,0.3)] border-0 hover:scale-[1.01]'
            : 'bg-white border border-slate-200 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5'
      }`}
    >
      <DwellRing active={isDwelling} progress={dwellProgress}>
        <div className={`w-full flex items-center justify-center gap-3 ${isSpeak ? 'py-4 md:py-8 text-2xl tracking-wide' : 'py-4 px-6 text-xl'}`}>
          {isSpeak && (
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
          {label}
        </div>
      </DwellRing>
    </div>
  );
}
