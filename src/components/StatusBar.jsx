import React from 'react';

export default function StatusBar({ webcamStatus }) {
  const statusConfig = {
    idle:   { dot: 'bg-gray-400',                       label: 'Webcam: Starting...' },
    camera: { dot: 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]', label: 'Webcam: Requesting camera...' },
    model:  { dot: 'bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]',  label: 'Webcam: Loading ML model (~10s)...' },
    ready:  { dot: 'bg-softGreen shadow-[0_0_8px_rgba(52,168,83,0.5)]',                label: 'Webcam: Ready' },
  };
  const { dot, label } = statusConfig[webcamStatus] || statusConfig.idle;

  return (
    <div className="h-10 border-t border-gray-200 flex items-center justify-between px-6 text-sm font-medium text-textMuted shrink-0 shadow-sm bg-white z-10">
      {/* Left: Webcam Status */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${dot}`}></span>
        <span>{label}</span>
      </div>

      {/* Center: Dwell Info */}
      <div className="bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-textPrimary flex items-center gap-2">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-medicalBlue">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Dwell: 0.25s
      </div>

      {/* Right: Version and SDGs */}
      <div className="flex items-center gap-3">
        <span>Eyra v0.1</span>
        <span className="text-gray-300">|</span>
        <div className="flex gap-2">
            <span className="bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded text-xs border border-[#bbf7d0] font-bold tracking-wide">SDG 3</span>
            <span className="bg-[#fce7f3] text-[#9d174d] px-2 py-0.5 rounded text-xs border border-[#fbcfe8] font-bold tracking-wide">SDG 10</span>
        </div>
      </div>
    </div>
  );
}
