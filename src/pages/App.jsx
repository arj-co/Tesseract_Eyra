import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopBar from '../components/TopBar';
import StatusBar from '../components/StatusBar';
import ZoneCard from '../components/ZoneCard';
import ActionButton from '../components/ActionButton';
import CalibrationScreen from '../components/CalibrationScreen';
import AccuracyScreen from '../components/AccuracyScreen';
import DwellRing from '../components/DwellRing';
import { useDwell } from '../hooks/useDwell';
import { expandToSentence } from '../services/gemini';

/* ── Zone definitions ── */
const ZONES = {
  TL: { label: 'A – F', letters: 'ABCDEF' },
  TR: { label: 'G – M', letters: 'GHIJKLM' },
  BL: { label: 'N – T', letters: 'NOPQRST' },
  BR: { label: 'U – Z', letters: 'UVWXYZ' },
};

const ZONE_DWELL_MS = 600;
const LETTER_DWELL_MS = 1000;

const ZONE_LETTER_COLORS = {
  TL: 'hover:bg-blue-50 hover:text-blue-900 hover:border-blue-400',
  TR: 'hover:bg-violet-50 hover:text-violet-900 hover:border-violet-400',
  BL: 'hover:bg-teal-50 hover:text-teal-900 hover:border-teal-400',
  BR: 'hover:bg-amber-50 hover:text-amber-900 hover:border-amber-400',
};

const ZONE_BADGE = {
  TL: 'bg-blue-700 text-white',
  TR: 'bg-violet-700 text-white',
  BL: 'bg-teal-700 text-white',
  BR: 'bg-amber-600 text-white',
};

/* ── Helpers ── */
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (_) {}
}

function GazeDot({ gazeRef }) {
  const dotRef = useRef(null);
  useEffect(() => {
    let id;
    const tick = () => {
      if (dotRef.current && gazeRef.current) {
        dotRef.current.style.left = `${gazeRef.current.x}px`;
        dotRef.current.style.top = `${gazeRef.current.y}px`;
      }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [gazeRef]);
  return (
    <div
      ref={dotRef}
      className="fixed w-6 h-6 border-2 border-white rounded-full bg-medicalBlue/40 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-lg"
    />
  );
}

/* ════════════════════════════════════════════════ */
export default function App() {
  /* ── state ── */
  const [wordBuffer, setWordBuffer] = useState('');
  const [predictedSentence, setPredictedSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationPhase, setCalibrationPhase] = useState('calibrating');
  const [webcamStatus, setWebcamStatus] = useState('idle');

  const [viewMode, setViewMode] = useState('overview');   // 'overview' | 'zoomed'
  const [zoomedZone, setZoomedZone] = useState(null);     // 'TL' | 'TR' | 'BL' | 'BR'
  const [highlightedQuadrant, setHighlightedQuadrant] = useState(null);
  const [progressMap, setProgressMap] = useState({});

  const gazeRef = useRef({ x: 0, y: 0 });
  const lastValidGazeRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const llmTimerRef = useRef(null);
  const lastRequestIdRef = useRef(0);

  /* ── LLM trigger ── */
  const triggerLLM = useCallback((buffer, immediate = false) => {
    clearTimeout(llmTimerRef.current);
    const trimmed = buffer.trim();
    if (trimmed.length < 2) return;
    const reqId = ++lastRequestIdRef.current;
    const words = trimmed.split(/\s+/).filter(w => w.length > 0).length;
    const run = async () => {
      setIsLoading(true);
      const sentence = await expandToSentence(trimmed);
      if (reqId === lastRequestIdRef.current) {
        if (sentence) setPredictedSentence(sentence);
        setIsLoading(false);
      }
    };
    if (immediate || words >= 3) run();
    else llmTimerRef.current = setTimeout(run, 2000);
  }, []);

  /* ── Quadrant detection (overview mode) ── */
  useEffect(() => {
    if (!isCalibrated || viewMode !== 'overview') return;
    let animId;
    let dwellQ = null;
    let dwellStart = null;

    const check = () => {
      const g = gazeRef.current;
      if (!g || (g.x === 0 && g.y === 0)) {
        animId = requestAnimationFrame(check);
        return;
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const q = (g.x < cx ? (g.y < cy ? 'TL' : 'BL') : (g.y < cy ? 'TR' : 'BR'));

      if (q !== dwellQ) {
        dwellQ = q;
        dwellStart = Date.now();
        setHighlightedQuadrant(q);
      } else if (Date.now() - dwellStart >= ZONE_DWELL_MS) {
        setViewMode('zoomed');
        setZoomedZone(q);
        setHighlightedQuadrant(null);
        setProgressMap({});
        playClickSound();
        return;
      }
      animId = requestAnimationFrame(check);
    };

    const t = setTimeout(() => { animId = requestAnimationFrame(check); }, 300);
    return () => { clearTimeout(t); if (animId) cancelAnimationFrame(animId); };
  }, [isCalibrated, viewMode]);

  /* ── Dwell handling (zoomed mode) ── */
  const handleDwell = useCallback((hit) => {
    if (!isCalibrated || viewMode !== 'zoomed') return;

    if (hit.startsWith('letter-')) {
      const letter = hit.split('-')[1];
      setWordBuffer(prev => { const n = prev + letter; triggerLLM(n); return n; });
      playClickSound();
      setViewMode('overview');
      setZoomedZone(null);
      setProgressMap({});
    } else if (hit === 'action-SPACE') {
      setWordBuffer(prev => { triggerLLM(prev, true); return prev + ' '; });
      playClickSound();
    } else if (hit === 'action-BACKSPACE') {
      setWordBuffer(prev => prev.slice(0, -1));
      playClickSound();
    } else if (hit === 'action-BACK') {
      setViewMode('overview');
      setZoomedZone(null);
      setProgressMap({});
      playClickSound();
    }
  }, [isCalibrated, viewMode, triggerLLM]);

  const handleProgress = useCallback((hit, progress) => {
    if (!isCalibrated || viewMode !== 'zoomed') return;
    setProgressMap(prev => {
      const cur = prev[hit] || 0;
      if (progress === 0 && !prev[hit]) return prev;
      if (progress === 0 || Math.abs(cur - progress) > 2) return { ...prev, [hit]: progress };
      return prev;
    });
  }, [isCalibrated, viewMode]);

  useDwell(gazeRef, LETTER_DWELL_MS, handleDwell, handleProgress, viewMode === 'zoomed' && isCalibrated);

  /* ── WebGazer init ── */
  useEffect(() => {
    if (webcamStatus !== 'ready') {
      setIsCalibrated(false);
      setCalibrationPhase('calibrating');
    }
  }, [webcamStatus]);

  useEffect(() => {
    if (isCalibrated && window.webgazer) {
      if (typeof window.webgazer.removeMouseEventListeners === 'function') window.webgazer.removeMouseEventListeners();
      if (window.webgazer.isReady()) window.webgazer.resume();
    }
  }, [isCalibrated]);

  useEffect(() => {
    let wg = null;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      #webgazerVideoFeed,#webgazerVideoCanvas,#webgazerFaceOverlay,#webgazerGazeDot{
        position:fixed!important;bottom:60px!important;left:16px!important;
        top:auto!important;right:auto!important;width:160px!important;height:120px!important;
        border-radius:8px!important;z-index:50!important;pointer-events:none!important;
      }
      #webgazerFaceFeedbackBox,#webgazerGazeDot{display:none!important;pointer-events:none!important;}
      canvas{pointer-events:none!important;}
      @keyframes zoomIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes fillProgress{from{width:0%}to{width:100%}}
    `;
    document.head.appendChild(styleEl);

    const interval = setInterval(() => {
      if (!window.webgazer) return;
      clearInterval(interval);
      wg = window.webgazer;
      setWebcamStatus('camera');

      wg.setRegression('ridge')
        .setTracker('TFFacemesh')
        .applyKalmanFilter(true)
        .saveDataAcrossSessions(false)
        .setGazeListener((data) => {
          if (data) {
            const curX = Math.max(0, Math.min(window.innerWidth, data.x));
            const curY = Math.max(0, Math.min(window.innerHeight, data.y));
            const lx = lastValidGazeRef.current.x;
            const ly = lastValidGazeRef.current.y;
            const dist = Math.hypot(curX - lx, curY - ly);
            const sf = dist > 150 ? 0.3 : 0.8;
            const sx = lx + (curX - lx) * sf;
            const sy = ly + (curY - ly) * sf;
            lastValidGazeRef.current = { x: sx, y: sy };
            gazeRef.current = { x: sx, y: sy };
          }
        });

      const mt = setTimeout(() => setWebcamStatus('model'), 1200);
      wg.begin()
        .then(() => {
          clearTimeout(mt);
          setWebcamStatus('model');
          const rc = setInterval(() => {
            if (wg.isReady()) { setWebcamStatus('ready'); clearInterval(rc); }
          }, 500);
          setTimeout(() => clearInterval(rc), 30000);
        })
        .catch(err => { clearTimeout(mt); console.error('WebGazer failed:', err); setWebcamStatus('idle'); });

      wg.showVideoPreview(true);
      wg.showPredictionPoints(false);
      if (typeof wg.showFaceOverlay === 'function') wg.showFaceOverlay(true);
      if (typeof wg.showFaceFeedbackBox === 'function') wg.showFaceFeedbackBox(false);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(llmTimerRef.current);
      if (wg) wg.end();
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  /* ── Render: overview mode ── */
  const renderOverview = () => (
    <div className="flex-1 p-4 md:p-6 flex items-stretch" style={{ animation: 'fadeIn 250ms ease-out' }}>
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 md:gap-6">
        {['TL', 'TR', 'BL', 'BR'].map(z => (
          <ZoneCard key={z} label={ZONES[z].label} zone={z} isHighlighted={highlightedQuadrant === z} dwellDuration={ZONE_DWELL_MS}>
            <div className="grid grid-cols-3 gap-2 w-full opacity-50">
              {ZONES[z].letters.split('').map(ch => (
                <div key={ch} className="min-h-[36px] font-bold text-lg text-slate-500 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
                  {ch}
                </div>
              ))}
            </div>
          </ZoneCard>
        ))}
      </div>
    </div>
  );

  /* ── Render: zoomed mode ── */
  const renderZoomed = () => {
    const zone = ZONES[zoomedZone];
    const letters = zone.letters.split('');
    const colorCls = ZONE_LETTER_COLORS[zoomedZone];
    const badgeCls = ZONE_BADGE[zoomedZone];
    const cols = letters.length <= 6 ? 3 : 4;

    return (
      <div className="flex-1 flex flex-col p-3 md:p-5 gap-3" style={{ animation: 'zoomIn 280ms ease-out' }}>
        {/* Zone badge */}
        <div className="flex items-center justify-center shrink-0">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm ${badgeCls}`}>
            {zone.label}
          </span>
        </div>

        {/* Letter grid */}
        <div className={`flex-1 grid gap-3 auto-rows-fr`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {letters.map((ch, i) => {
            const id = `letter-${ch}`;
            const dw = progressMap[id] > 0;
            // Center the last row if it doesn't fill all columns
            const remaining = letters.length - i;
            const rowStart = i % cols === 0;
            const lastRowCount = letters.length % cols;
            const isLastRow = i >= letters.length - (lastRowCount || cols);
            const needsOffset = isLastRow && lastRowCount > 0 && rowStart;
            const colStart = needsOffset ? Math.floor((cols - lastRowCount) / 2) + 1 : undefined;

            return (
              <div
                key={ch}
                data-dwell={id}
                className={`flex items-center justify-center rounded-2xl font-bold transition-all duration-200 cursor-pointer select-none ${
                  dw
                    ? 'bg-medicalBlue text-white shadow-lg scale-[1.03]'
                    : `bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] ${colorCls}`
                }`}
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                  ...(colStart ? { gridColumnStart: colStart } : {}),
                }}
              >
                <DwellRing active={dw} progress={progressMap[id] || 0}>
                  <span className="w-full h-full flex items-center justify-center">{ch}</span>
                </DwellRing>
              </div>
            );
          })}
        </div>

        {/* Action row */}
        <div className="grid grid-cols-3 gap-3 shrink-0" style={{ height: 'clamp(56px, 10vh, 96px)' }}>
          <ActionButton id="action-BACK" label="← BACK" type="back"
            isDwelling={progressMap['action-BACK'] > 0} dwellProgress={progressMap['action-BACK'] || 0} />
          <ActionButton id="action-SPACE" label="SPACE" type="space"
            isDwelling={progressMap['action-SPACE'] > 0} dwellProgress={progressMap['action-SPACE'] || 0} />
          <ActionButton id="action-BACKSPACE" label="⌫" type="backspace"
            isDwelling={progressMap['action-BACKSPACE'] > 0} dwellProgress={progressMap['action-BACKSPACE'] || 0} />
        </div>
      </div>
    );
  };

  /* ── Main render ── */
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-bgAlternate font-sans text-textPrimary">
      <TopBar wordBuffer={wordBuffer} predictedSentence={predictedSentence} isLoading={isLoading} />

      {webcamStatus === 'ready' && !isCalibrated && calibrationPhase === 'calibrating' && (
        <CalibrationScreen onComplete={() => setCalibrationPhase('measuring')} />
      )}
      {webcamStatus === 'ready' && calibrationPhase === 'measuring' && (
        <AccuracyScreen
          gazeRef={gazeRef}
          onRecalibrate={() => { if (window.webgazer) window.webgazer.clearData(); setCalibrationPhase('calibrating'); }}
          onContinue={() => { setCalibrationPhase('done'); setIsCalibrated(true); }}
        />
      )}

      {viewMode === 'overview' ? renderOverview() : renderZoomed()}

      <StatusBar webcamStatus={webcamStatus} />
      {isCalibrated && <GazeDot gazeRef={gazeRef} />}
    </div>
  );
}
