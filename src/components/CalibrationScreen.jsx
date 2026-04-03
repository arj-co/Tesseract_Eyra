import React, { useState } from 'react';

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

const CLICKS_REQUIRED = 5;

export default function CalibrationScreen({ onComplete }) {
  const [clickCounts, setClickCounts] = useState({});
  const [completedPoints, setCompletedPoints] = useState(new Set());

  const handlePointClick = (e, id) => {
    // Explicitly record the CENTER of the calibration target for precise WebGazer mapping
    if (window.webgazer) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      window.webgazer.recordScreenPosition(centerX, centerY, 'click');
    }

    const current = (clickCounts[id] || 0) + 1;
    setClickCounts(prev => ({ ...prev, [id]: current }));

    if (current >= CLICKS_REQUIRED) {
      setCompletedPoints(prev => {
        const next = new Set(prev).add(id);
        if (next.size === CALIBRATION_POINTS.length) {
          // Add a small delay to let the user see the final dot change state
          setTimeout(() => onComplete(), 500); 
        }
        return next;
      });
    }
  };

  const handleResetData = () => {
    if (window.webgazer) {
      window.webgazer.clearData();
      setClickCounts({});
      setCompletedPoints(new Set());
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-bgAlternate/95 backdrop-blur-sm flex flex-col items-center justify-center font-sans">
      <div className="absolute top-10 text-center pointer-events-none px-4">
        <h2 className="text-3xl font-serif text-deepNavy mb-2">Eye Tracking Calibration</h2>
        <p className="text-textMuted text-lg max-w-xl mx-auto">
          Please look directly at each pulsing dot and click it {CLICKS_REQUIRED} times to calibrate the eye tracker.
        </p>
      </div>

      <div className="absolute right-10 top-10 z-50">
        <button 
          onClick={handleResetData}
          className="px-4 py-2 bg-white text-medicalBlue border border-medicalBlue/20 rounded-full shadow-sm hover:bg-medicalBlue/5 transition-colors font-medium text-sm"
        >
          Reset Calibration
        </button>
      </div>

      <div className="absolute right-10 bottom-10 z-50">
        <button 
          onClick={() => onComplete()}
          className="px-6 py-2 bg-textPrimary text-white rounded-full font-medium shadow-md hover:bg-deepNavy transition-colors text-sm"
        >
          Skip / Done
        </button>
      </div>

      <div className="relative w-full h-full max-w-7xl max-h-[800px]">
        {CALIBRATION_POINTS.map((pt) => {
          const isCompleted = completedPoints.has(pt.id);
          const clicks = clickCounts[pt.id] || 0;
          
          return (
            <button
              key={pt.id}
              className={`absolute flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'w-10 h-10 bg-softGreen scale-90 opacity-40 pointer-events-none rounded-full' 
                  : 'w-12 h-12 bg-medicalBlue hover:bg-vividBlue hover:scale-110 shadow-xl animate-pulse-glow cursor-pointer rounded-full'
              }`}
              style={{
                top: pt.top,
                bottom: pt.bottom,
                left: pt.left,
                right: pt.right,
                transform: pt.transform,
              }}
              onClick={(e) => handlePointClick(e, pt.id)}
            >
              {!isCompleted && clicks > 0 && (
                <span className="text-white font-bold text-sm">{CLICKS_REQUIRED - clicks}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
