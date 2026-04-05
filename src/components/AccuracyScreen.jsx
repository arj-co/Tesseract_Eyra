import React, { useState, useEffect, useRef } from 'react';

const SAMPLES_NEEDED = 80;
const WARMUP_MS = 1500; // discard early samples while the smoothing filter settles

/**
 * Calculates accuracy percentage using the same algorithm as the WebGazer website.
 * For each gaze sample, it computes the Euclidean distance from the target point,
 * then converts to a percentage where 0% = half-window-height away and 100% = exact hit.
 */
function calculatePrecision(xSamples, ySamples, targetX, targetY) {
  const windowHeight = window.innerHeight;
  const halfWindowHeight = windowHeight / 2;
  let totalPrecision = 0;

  for (let i = 0; i < xSamples.length; i++) {
    const xDiff = targetX - xSamples[i];
    const yDiff = targetY - ySamples[i];
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    let precision = 0;
    if (distance <= halfWindowHeight && distance > -1) {
      precision = 100 - (distance / halfWindowHeight) * 100;
    } else if (distance > halfWindowHeight) {
      precision = 0;
    } else {
      precision = 100;
    }
    totalPrecision += precision;
  }

  return Math.round(totalPrecision / xSamples.length);
}

export default function AccuracyScreen({ gazeRef, onRecalibrate, onContinue }) {
  // phase: 'instruction' | 'warming' | 'collecting' | 'result'
  const [phase, setPhase] = useState('instruction');
  const [samplesCollected, setSamplesCollected] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const xSamplesRef = useRef([]);
  const ySamplesRef = useRef([]);
  const collectionRef = useRef(null);
  const targetRef = useRef(null);

  // Start with a warm-up delay so the smoothing filter can settle
  const startCollection = () => {
    xSamplesRef.current = [];
    ySamplesRef.current = [];
    setSamplesCollected(0);
    setPhase('warming');
  };

  // Warm-up: wait WARMUP_MS then transition to collecting
  useEffect(() => {
    if (phase !== 'warming') return;
    const t = setTimeout(() => setPhase('collecting'), WARMUP_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'collecting') return;

    let count = 0;
    const interval = setInterval(() => {
      const gaze = gazeRef.current;
      if (gaze && (gaze.x !== 0 || gaze.y !== 0)) {
        xSamplesRef.current.push(gaze.x);
        ySamplesRef.current.push(gaze.y);
        count++;
        setSamplesCollected(count);

        if (count >= SAMPLES_NEEDED) {
          clearInterval(interval);
          const targetX = window.innerWidth / 2;
          const targetY = window.innerHeight / 2;
          const result = calculatePrecision(
            xSamplesRef.current,
            ySamplesRef.current,
            targetX,
            targetY
          );
          setAccuracy(result);
          setPhase('result');
        }
      }
    }, 50); // 20 samples/sec, collect 80 in ~4 seconds

    collectionRef.current = interval;
    return () => clearInterval(interval);
  }, [phase, gazeRef]);

  const getAccuracyColor = (acc) => {
    if (acc >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', ring: 'text-emerald-500', label: 'Excellent' };
    if (acc >= 65) return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', ring: 'text-amber-500', label: 'Good' };
    if (acc >= 45) return { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', ring: 'text-orange-500', label: 'Fair' };
    return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', ring: 'text-red-500', label: 'Needs Improvement' };
  };

  // --- INSTRUCTION PHASE ---
  if (phase === 'instruction') {
    return (
      <div className="fixed inset-0 z-40 bg-[#0f0f12]/95 backdrop-blur-xl flex flex-col items-center justify-center font-sans">
        <div className="text-center max-w-lg px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-medicalBlue/20 border border-medicalBlue/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-medicalBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-serif text-white mb-3">Accuracy Measurement</h2>
          <p className="text-gray-400 text-lg mb-2">
            Let's check how accurate your calibration is.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            A pulsing dot will appear in the center of the screen. 
            Stare directly at it for a few seconds while we collect gaze data.
          </p>
          
          <button
            onClick={startCollection}
            className="px-8 py-3 bg-medicalBlue text-white rounded-full font-medium shadow-lg shadow-medicalBlue/30 hover:bg-vividBlue hover:shadow-vividBlue/40 transition-all duration-300 text-base"
          >
            Start Measurement
          </button>
        </div>
      </div>
    );
  }

  // --- WARMING PHASE ---
  if (phase === 'warming') {
    return (
      <div className="fixed inset-0 z-40 bg-[#0f0f12]/95 backdrop-blur-xl flex flex-col items-center justify-center font-sans">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border-2 border-medicalBlue/40 animate-ping" />
          <div className="absolute w-16 h-16 rounded-full border border-medicalBlue/60 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-medicalBlue shadow-[0_0_20px_rgba(15,110,86,0.6),0_0_60px_rgba(15,110,86,0.3)]" />
        </div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <div className="text-amber-400 text-sm mb-1 tracking-wide uppercase animate-pulse">
            Settling… keep looking at the dot
          </div>
          <div className="text-gray-600 text-xs mt-2">Stabilising gaze filter…</div>
        </div>
      </div>
    );
  }

  // --- COLLECTING PHASE ---
  if (phase === 'collecting') {
    const progress = (samplesCollected / SAMPLES_NEEDED) * 100;
    return (
      <div className="fixed inset-0 z-40 bg-[#0f0f12]/95 backdrop-blur-xl flex flex-col items-center justify-center font-sans">
        {/* Center target dot */}
        <div ref={targetRef} className="relative flex items-center justify-center">
          {/* Outer ring pulse */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-medicalBlue/40 animate-ping" />
          <div className="absolute w-16 h-16 rounded-full border border-medicalBlue/60 animate-pulse" />
          {/* Core dot */}
          <div className="w-6 h-6 rounded-full bg-medicalBlue shadow-[0_0_20px_rgba(15,110,86,0.6),0_0_60px_rgba(15,110,86,0.3)]" />
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <div className="text-gray-400 text-sm mb-3 tracking-wide uppercase">
            Collecting samples… look at the dot
          </div>
          <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-medicalBlue to-vividBlue rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-gray-500 text-xs mt-2">
            {samplesCollected} / {SAMPLES_NEEDED} samples
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT PHASE ---
  const colors = getAccuracyColor(accuracy);
  return (
    <div className="fixed inset-0 z-40 bg-[#0f0f12]/95 backdrop-blur-xl flex flex-col items-center justify-center font-sans">
      <div className="text-center max-w-md px-6">
        {/* Accuracy Ring */}
        <div className="relative w-44 h-44 mx-auto mb-8">
          {/* Background ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              className={colors.ring}
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - accuracy / 100)}`}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tabular-nums ${colors.text}`}>
              {accuracy}
            </span>
            <span className="text-gray-500 text-xs tracking-widest uppercase mt-1">percent</span>
          </div>
        </div>

        {/* Label */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${colors.bg} border ${colors.border} mb-3`}>
          <span className={`w-2 h-2 rounded-full ${colors.ring.replace('text-', 'bg-')}`} />
          <span className={`text-sm font-medium ${colors.text}`}>{colors.label} Accuracy</span>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          {accuracy >= 70
            ? 'Your calibration is working great! You can proceed to the AAC board.'
            : accuracy >= 50
            ? 'Decent accuracy. You may want to recalibrate for better results.'
            : 'Consider recalibrating. Click each dot carefully while looking directly at it.'}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRecalibrate}
            className="px-6 py-2.5 bg-white/5 text-gray-300 border border-white/10 rounded-full font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm"
          >
            Recalibrate
          </button>
          <button
            onClick={onContinue}
            className="px-8 py-2.5 bg-medicalBlue text-white rounded-full font-medium shadow-lg shadow-medicalBlue/30 hover:bg-vividBlue hover:shadow-vividBlue/40 transition-all duration-300 text-sm"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
