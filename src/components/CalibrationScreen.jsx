import React, { useState, useMemo, useCallback } from 'react';

const CALIBRATION_POINTS = [
  { id: 'pt1', top: '10%', left: '10%' },
  { id: 'pt2', top: '10%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'pt3', top: '10%', right: '10%' },
  { id: 'pt4', top: '50%', left: '10%', transform: 'translateY(-50%)' },
  { id: 'pt5', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  { id: 'pt6', top: '50%', right: '10%', transform: 'translateY(-50%)' },
  { id: 'pt7', bottom: '10%', left: '10%' },
  { id: 'pt8', bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'pt9', bottom: '10%', right: '10%' },
];

const ROUNDS = 5; // Each dot gets clicked 5 times as requested (9 points * 5 clicks = 45 total)

/** Build the full sequence: ROUNDS × 9 dots in fixed spatial order */
function buildSequence() {
  const seq = [];
  for (let r = 0; r < ROUNDS; r++) {
    seq.push(...CALIBRATION_POINTS);
  }
  return seq;
}

export default function CalibrationScreen({ onComplete }) {
  const sequence = useMemo(() => buildSequence(), []);
  const [stepIndex, setStepIndex] = useState(0);

  const totalSteps = sequence.length;
  const currentPoint = sequence[stepIndex];
  const overallProgress = Math.round((stepIndex / totalSteps) * 100);
  const currentRound = Math.floor(stepIndex / CALIBRATION_POINTS.length) + 1;

  // Count how many times each point has been clicked so far
  const pointClickCounts = useMemo(() => {
    const counts = {};
    CALIBRATION_POINTS.forEach(p => { counts[p.id] = 0; });
    for (let i = 0; i < stepIndex; i++) {
      counts[sequence[i].id]++;
    }
    return counts;
  }, [stepIndex, sequence]);

  const handlePointClick = useCallback((e) => {
    // Record where the user's pointer actually was at mousedown — this is the
    // ground truth WebGazer needs, not the computed element centre.
    if (window.webgazer) {
      window.webgazer.recordScreenPosition(e.clientX, e.clientY, 'click');

      // Play a subtle click for feedback
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } catch(_) {}
    }

    const nextIndex = stepIndex + 1;
    if (nextIndex >= totalSteps) {
      // All rounds complete
      setTimeout(() => onComplete(), 400);
    }
    setStepIndex(nextIndex);
  }, [stepIndex, totalSteps, onComplete]);

  const handleResetData = () => {
    if (window.webgazer) {
      window.webgazer.clearData();
    }
    // Rebuild with a fresh shuffle by forcing remount — simplest approach
    // is to just reset index; the sequence is already built
    setStepIndex(0);
  };

  const isDone = stepIndex >= totalSteps;

  return (
    <div className="fixed inset-0 z-40 bg-bgAlternate/95 backdrop-blur-sm flex flex-col items-center justify-center font-sans tracking-tight">
      {/* Header */}
      <div className="absolute top-10 text-center pointer-events-none px-4 flex flex-col items-center">
        <h2 className="text-3xl font-serif text-deepNavy mb-2">High Precision Calibration</h2>
        <p className="text-textMuted text-lg max-w-xl mx-auto mb-4">
          Center your head and look at the pulsing dot. Click precisely on the center.
        </p>
        <div className="px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
          Keep head steady for 80%+ accuracy
        </div>
      </div>

      {/* Progress bar & round indicator */}
      <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-3 text-sm text-textMuted">
          <span>Point {Math.min(currentRound, ROUNDS)} of {ROUNDS}</span>
          <span className="text-xs opacity-40">•</span>
          <span>{stepIndex} / {totalSteps} clicks</span>
        </div>
        <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-medicalBlue to-vividBlue rounded-full transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Reset button */}
      <div className="absolute right-10 top-10 z-50">
        <button 
          onClick={handleResetData}
          className="px-4 py-2 bg-white text-medicalBlue border border-medicalBlue/20 rounded-full shadow-sm hover:bg-medicalBlue/5 transition-colors font-medium text-sm"
        >
          Reset Calibration
        </button>
      </div>

      {/* Skip / Done button */}
      <div className="absolute right-10 bottom-10 z-50">
        <button 
          onClick={() => onComplete()}
          className="px-6 py-2 bg-textPrimary text-white rounded-full font-medium shadow-md hover:bg-deepNavy transition-colors text-sm"
        >
          Skip / Done
        </button>
      </div>

      {/* Minimap showing all 9 positions with fill indicators */}
      <div className="absolute left-10 bottom-10 z-50 pointer-events-none">
        <div className="relative w-28 h-20 bg-white/60 border border-slate-200 rounded-lg shadow-sm p-1">
          {CALIBRATION_POINTS.map((pt) => {
            const clicks = pointClickCounts[pt.id] || 0;
            const opacity = 0.15 + (clicks / ROUNDS) * 0.85;
            const isActive = currentPoint && currentPoint.id === pt.id && !isDone;
            return (
              <div
                key={pt.id}
                className={`absolute w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-medicalBlue scale-150 animate-pulse' : 'bg-medicalBlue'
                }`}
                style={{
                  top: pt.top,
                  bottom: pt.bottom,
                  left: pt.left,
                  right: pt.right,
                  transform: pt.transform || 'none',
                  opacity,
                }}
              />
            );
          })}
        </div>
        <div className="text-[10px] text-textMuted mt-1 text-center">Coverage</div>
      </div>

      {/* Active calibration dot — using original WebGazer colors (Red -> Yellow -> Green) */}
      <div className="relative w-full h-full max-w-7xl max-h-[800px]">
        {!isDone && currentPoint && (() => {
          const clicks = pointClickCounts[currentPoint.id];
          const scale = 1 - (clicks * 0.12); // Shrink slightly as points are collected
          let colorClass = 'bg-red-500 shadow-red-500/40';
          if (clicks >= 4) colorClass = 'bg-emerald-500 shadow-emerald-500/40';
          else if (clicks >= 2) colorClass = 'bg-yellow-500 shadow-yellow-500/40';

          return (
            <button
              key={`${currentPoint.id}-${stepIndex}`}
              className={`absolute flex items-center justify-center w-16 h-16 ${colorClass} hover:scale-105 active:scale-95 shadow-xl cursor-pointer rounded-full transition-all duration-200 border-4 border-white/30`}
              style={{
                top: currentPoint.top,
                bottom: currentPoint.bottom,
                left: currentPoint.left,
                right: currentPoint.right,
                transform: `${currentPoint.transform || ''} scale(${scale})`,
              }}
              onMouseDown={handlePointClick}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              {/* Pulse effect while active */}
              <div className={`absolute inset-[-10px] rounded-full border-2 ${colorClass.replace('bg-', 'border-').split(' ')[0]} opacity-40 animate-ping`} />
            </button>
          );
        })()}
      </div>
    </div>
  );
}
