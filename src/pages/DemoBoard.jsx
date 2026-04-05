import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import StatusBar from '../components/StatusBar';
import ZoneCard from '../components/ZoneCard';
import ActionButton from '../components/ActionButton';
import CalibrationScreen from '../components/CalibrationScreen';
import AccuracyScreen from '../components/AccuracyScreen';
import DwellRing from '../components/DwellRing';
import { useDwell } from '../hooks/useDwell';
import { expandToSentence } from '../services/gemini';
import { speak } from '../services/speech';

/* ── Zone definitions (Matching App.jsx) ── */
const ZONES = {
  TL: { label: 'A – F', letters: 'ABCDEF' },
  TR: { label: 'G – M', letters: 'GHIJKLM' },
  BL: { label: 'N – T', letters: 'NOPQRST' },
  BR: { label: 'U – Z', letters: 'UVWXYZ' },
};

const ZONE_DWELL_MS  = 600;
const LETTER_DWELL_MS = 800;
const AUTO_EXPAND_LETTERS = 5; 

/* ── Shortcuts for the Demo Board ── */
const SHORTCUTS = {
  'qu': 'I need my favourite pizza',
  'th': 'Thank you so much!',
  'hw': 'Hi, how are you today?',
  'he': 'Hello there',
  'gd': 'Goodbye',
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

function speakSentence(text) {
  const synth = window.speechSynthesis;
  if (!synth || !text) return;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  synth.speak(utter);
}

/* ── Polished gaze cursor ── */
function GazeDot({ gazeRef }) {
  const dotRef = useRef(null);
  useEffect(() => {
    let id;
    const tick = () => {
      if (dotRef.current && gazeRef.current) {
        dotRef.current.style.left = `${gazeRef.current.x}px`;
        dotRef.current.style.top  = `${gazeRef.current.y}px`;
      }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [gazeRef]);

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'rgba(15, 110, 86, 0.25)',
        border: '2px solid rgba(15, 110, 86, 0.95)',
        boxShadow: '0 0 15px 4px rgba(15,110,86,0.3)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'left 25ms linear, top 25ms linear',
        willChange: 'left, top',
      }}
    />
  );
}

/* ── Session-complete overlay ── */
function SessionOverlay({ sentence, isLoading, onRestart, onSpeakAgain, isShortcut }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5, 30, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 8000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        animation: 'fadeIn 350ms ease-out',
        padding: '2rem',
      }}
    >
      {/* status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={isShortcut ? '#fbbf24' : '#1D9E75'} opacity={isShortcut ? 0.8 : 0.4}/>
          <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" fill={isShortcut ? '#fbbf24' : '#1D9E75'}/>
        </svg>
        <span style={{ color: isShortcut ? '#fbbf24' : '#7ee8c3', fontSize: 13, letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase' }}>
          {isShortcut ? 'Shortcut Expansion' : 'Gemini Expansion'}
        </span>
      </div>

      <div style={{
        maxWidth: 720,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 20,
        padding: '2rem 2.5rem',
        textAlign: 'center',
      }}>
        {isLoading ? (
          <p style={{ color: '#7ee8c3', fontSize: '1.5rem', fontStyle: 'italic', animation: 'fadeIn 400ms infinite alternate' }}>
            Expanding your message…
          </p>
        ) : (
          <p style={{ color: '#ffffff', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 500, lineHeight: 1.45 }}>
            {sentence || '…'}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onSpeakAgain}
          style={{
            background: 'rgba(29, 158, 117, 0.18)', border: '2px solid rgba(29, 158, 117, 0.6)',
            color: '#7ee8c3', borderRadius: 14, padding: '14px 28px', fontSize: '1.05rem', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em'
          }}
        >
          🔊 Speak Again
        </button>

        <button
          onClick={onRestart}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.35)',
            color: '#ffffff', borderRadius: 14, padding: '14px 28px', fontSize: '1.05rem', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em'
          }}
        >
          🔁 Restart Board
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
        Return to board via buttons above
      </p>
    </div>
  );
}

export default function DemoBoard() {
  const [wordBuffer, setWordBuffer]           = useState('');
  const [predictedSentence, setPredictedSentence] = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isShortcutActive, setIsShortcutActive] = useState(false);

  const [isCalibrated, setIsCalibrated]       = useState(false);
  const [calibrationPhase, setCalibrationPhase] = useState('calibrating');
  const [webcamStatus, setWebcamStatus]       = useState('idle');

  const [progressMap, setProgressMap]         = useState({});

  const gazeRef           = useRef({ x: 0, y: 0 });
  const llmTimerRef       = useRef(null);
  const lastRequestIdRef  = useRef(0);

  /* ── Trigger Logic (Shortcuts + Gemini) ── */
  const triggerLLM = useCallback((buffer, immediate = false, onDone) => {
    clearTimeout(llmTimerRef.current);
    const trimmed = buffer.trim().toLowerCase();
    
    // Check shortcuts
    if (SHORTCUTS[trimmed]) {
      const phrase = SHORTCUTS[trimmed];
      setPredictedSentence(phrase);
      speak(phrase);
      setIsShortcutActive(true);
      setIsLoading(false);
      
      if (immediate) {
        setSessionComplete(true);
        setProgressMap({});
      }
      if (onDone) onDone();
      return;
    }

    // Default Gemini logic
    setIsShortcutActive(false);
    if (trimmed.length < 2) return;
    const reqId = ++lastRequestIdRef.current;
    
    const run = async () => {
      setIsLoading(true);
      const sentence = await expandToSentence(trimmed);
      if (reqId === lastRequestIdRef.current) {
        if (sentence) {
          setPredictedSentence(sentence);
          speak(sentence);
        }
        setIsLoading(false);
        if (onDone) onDone();
      }
    };
    
    if (immediate) run();
    else llmTimerRef.current = setTimeout(run, 1500);
  }, []);

  const handleDwell = useCallback((hit) => {
    if (!isCalibrated) return;

    if (hit.startsWith('letter-')) {
      const letter = hit.split('-')[1];
      setWordBuffer(prev => {
        const next = prev + letter;
        const currentTrimmed = next.toLowerCase().trim();
        const letterCount = next.replace(/\s/g, '').length;
        
        // Immediate check for 'qu' shortcut
        if (SHORTCUTS[currentTrimmed]) {
           triggerLLM(next, true);
           return next;
        }

        if (letterCount >= AUTO_EXPAND_LETTERS) {
          setSessionComplete(true);
          triggerLLM(next, true);
          setProgressMap({});
        } else {
          triggerLLM(next, false);
          setProgressMap({});
        }
        return next;
      });
      playClickSound();

    } else if (hit === 'action-SPACE') {
      setWordBuffer(prev => {
        const next = prev + ' ';
        triggerLLM(next, true);
        return next;
      });
      playClickSound();

    } else if (hit === 'action-BACKSPACE') {
      setWordBuffer(prev => prev.slice(0, -1));
      playClickSound();
    }
  }, [isCalibrated, triggerLLM]);

  const handleProgress = useCallback((hit, progress) => {
    if (!isCalibrated) return;
    setProgressMap(prev => {
      const cur = prev[hit] || 0;
      if (progress === 0 && !prev[hit]) return prev;
      if (progress === 0 || Math.abs(cur - progress) > 2) return { ...prev, [hit]: progress };
      return prev;
    });
  }, [isCalibrated]);

  useDwell(gazeRef, LETTER_DWELL_MS, handleDwell, handleProgress, isCalibrated && !sessionComplete);

  const handleRestart = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSessionComplete(false);
    setWordBuffer('');
    setPredictedSentence('');
    setIsLoading(false);
    setProgressMap({});
  }, []);

  /* ── Sync WebGazer State (Matching App.jsx) ── */
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

      const alpha = 0.12; 
      wg.setRegression('ridge')
        .setTracker('TFFacemesh')
        .applyKalmanFilter(true)
        .saveDataAcrossSessions(false)
        .setGazeListener((data) => {
          if (data) {
            const rawX = Math.max(0, Math.min(window.innerWidth,  data.x));
            const rawY = Math.max(0, Math.min(window.innerHeight, data.y));
            const cx = gazeRef.current.x || rawX;
            const cy = gazeRef.current.y || rawY;
            gazeRef.current = {
              x: cx + alpha * (rawX - cx),
              y: cy + alpha * (rawY - cy),
            };
          }
        });

      const mt = setTimeout(() => setWebcamStatus('model'), 1200);
      wg.begin().then(() => {
        clearTimeout(mt);
        setWebcamStatus('model');
        const rc = setInterval(() => {
          if (wg.isReady()) { setWebcamStatus('ready'); clearInterval(rc); }
        }, 500);
        setTimeout(() => clearInterval(rc), 30000);
      }).catch(err => {
        clearTimeout(mt);
        setWebcamStatus('idle');
      });

      wg.showVideoPreview(true);
      wg.showPredictionPoints(false);
      if (typeof wg.showFaceOverlay === 'function') wg.showFaceOverlay(true);
      if (typeof wg.showFaceFeedbackBox === 'function') wg.showFaceFeedbackBox(false);
    }, 500);

    return () => {
      clearInterval(interval);
      if (wg) wg.end();
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#F7F4EF] text-[#1C1917]">
      {/* Demo Header */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Link to="/" className="text-[#0F6E56] hover:text-[#1D9E75] font-bold flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
               Back
            </Link>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <span className="text-[#0F6E56] text-sm font-bold">Demo: Shortcut Board</span>
         </div>
         <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Try: <span className="bg-amber-100 px-1 rounded">QU</span> for "Pizza"
         </div>
      </div>

      <TopBar
        wordBuffer={wordBuffer}
        predictedSentence={predictedSentence}
        isLoading={isLoading}
        letterCount={wordBuffer.replace(/\s/g, '').length}
        maxLetters={AUTO_EXPAND_LETTERS}
      />

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

      {/* Grid */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
          {['TL', 'TR', 'BL', 'BR'].map(z => (
            <ZoneCard key={z} label={ZONES[z].label} zone={z} isHighlighted={false} dwellDuration={ZONE_DWELL_MS}>
              <div className={`grid gap-3 w-full h-full ${ZONES[z].letters.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {ZONES[z].letters.split('').map(ch => {
                  const id = `letter-${ch}`;
                  return (
                    <div key={ch} data-dwell={id} className="flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <DwellRing active={progressMap[id] > 0} progress={progressMap[id] || 0}>
                        <span className="font-bold text-slate-800" style={{ fontSize: '3.5rem' }}>{ch}</span>
                      </DwellRing>
                    </div>
                  );
                })}
              </div>
            </ZoneCard>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 shrink-0 h-24">
          <ActionButton id="action-SPACE" label="SPACE" type="space"
            isDwelling={progressMap['action-SPACE'] > 0} dwellProgress={progressMap['action-SPACE'] || 0} />
          <ActionButton id="action-BACKSPACE" label="⌫" type="backspace"
            isDwelling={progressMap['action-BACKSPACE'] > 0} dwellProgress={progressMap['action-BACKSPACE'] || 0} />
        </div>
      </div>

      <StatusBar webcamStatus={webcamStatus} />
      {isCalibrated && <GazeDot gazeRef={gazeRef} />}

      {sessionComplete && (
        <SessionOverlay
          sentence={predictedSentence}
          isLoading={isLoading}
          isShortcut={isShortcutActive}
          onRestart={handleRestart}
          onSpeakAgain={() => speak(predictedSentence)}
        />
      )}
    </div>
  );
}
