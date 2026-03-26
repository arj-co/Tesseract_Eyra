import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopBar from '../components/TopBar';
import StatusBar from '../components/StatusBar';
import ZoneCard from '../components/ZoneCard';
import LetterKey from '../components/LetterKey';
import ActionButton from '../components/ActionButton';
import { useDwell } from '../hooks/useDwell';
import { expandToSentence } from '../services/gemini';

function playClickSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}



export default function App() {
  const [activeZone, setActiveZone] = useState(null);
  const [wordBuffer, setWordBuffer] = useState('');
  const [predictedSentence, setPredictedSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 'idle' | 'camera' | 'model' | 'ready'
  const [webcamStatus, setWebcamStatus] = useState('idle');
  const [progressMap, setProgressMap] = useState({});
  
  const gazeRef = useRef({ x: 0, y: 0 });
  const llmTimerRef = useRef(null);

  const triggerLLM = (buffer) => {
    clearTimeout(llmTimerRef.current);
    const trimmed = buffer.trim();
    if (trimmed.length < 2) return;

    const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;

    if (wordCount >= 4) {
      // Trigger immediately for longer inputs
      setIsLoading(true);
      expandToSentence(trimmed).then(sentence => {
        if (sentence) setPredictedSentence(sentence);
        setIsLoading(false);
      });
    } else {
      // Trigger with delay after last input
      llmTimerRef.current = setTimeout(async () => {
        setIsLoading(true);
        const sentence = await expandToSentence(trimmed);
        if (sentence) setPredictedSentence(sentence);
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleDwell = useCallback((hit) => {
    if (hit.startsWith('zone-')) {
      const zone = hit.split('-')[1];
      setActiveZone(zone);
      playClickSound();
    } else if (hit.startsWith('letter-')) {
      const letter = hit.split('-')[1];
      setWordBuffer(prev => {
        const next = prev + letter;
        triggerLLM(next);
        return next;
      });
      setActiveZone(null);
      playClickSound();

    } else if (hit === 'action-SPACE') {
      setWordBuffer(prev => {
        const next = prev + ' ';
        clearTimeout(llmTimerRef.current); // Cancel delayed trigger
        // Trigger immediately on space
        setIsLoading(true);
        expandToSentence(prev).then(sentence => {
          if (sentence) setPredictedSentence(sentence);
          setIsLoading(false);
        });
        return next;
      });
      setActiveZone(null);
      playClickSound();
    } else if (hit === 'action-AUTOFILL') {
      clearTimeout(llmTimerRef.current); // Cancel delayed trigger
      setWordBuffer(prev => {
        if (prev.trim().length >= 1) {
          setIsLoading(true);
          expandToSentence(prev).then(sentence => {
            if (sentence) setPredictedSentence(sentence);
            setIsLoading(false);
          });
        }
        return prev;
      });
      setActiveZone(null);
      playClickSound();
    }
  }, []);

  const handleProgress = useCallback((hit, progress) => {
    setProgressMap(prev => {
      const current = prev[hit] || 0;
      if (progress === 0 && !prev[hit]) return prev;
      if (progress === 0 || Math.abs(current - progress) > 2) {
        return { ...prev, [hit]: progress };
      }
      return prev;
    });
  }, []);

  useDwell(gazeRef, 250, handleDwell, handleProgress);

  useEffect(() => {
    let wg = null;
    
    // Inject global CSS to forcefully lock WebGazer's dynamically generated elements
    // We use !important because WebGazer updates inline styles continuously on requestAnimationFrame
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      #webgazerVideoFeed, #webgazerVideoCanvas, #webgazerFaceOverlay {
        position: fixed !important;
        bottom: 60px !important;
        left: 16px !important;
        top: auto !important;
        right: auto !important;
        width: 160px !important;
        height: 120px !important;
        border-radius: 8px !important;
        z-index: 50 !important;
        pointer-events: none !important;
      }
      #webgazerFaceFeedbackBox {
        display: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    const interval = setInterval(() => {
      if (window.webgazer) {
        clearInterval(interval);
        wg = window.webgazer;
        setWebcamStatus('camera'); // camera found, requesting permission
        
        wg.setRegression('ridge')
          .setTracker('TFFacemesh')
          .setGazeListener((data, timestamp) => {
            if (data) {
              setWebcamStatus('ready');
              gazeRef.current = { x: data.x, y: data.y };
            }
          })
          .begin()
          .then(() => {
            // .begin() resolves when the camera stream is open;
            // model is still loading async — show intermediate state
            setWebcamStatus(prev => prev === 'ready' ? 'ready' : 'model');
          });

        wg.showVideoPreview(true);
        wg.showPredictionPoints(false);
        if (typeof wg.showFaceOverlay === 'function') wg.showFaceOverlay(true);
        if (typeof wg.showFaceFeedbackBox === 'function') wg.showFaceFeedbackBox(false);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(llmTimerRef.current);
      if (wg) wg.end();
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  const renderLetters = (lettersStr, zoneCode) => {
    let focusColor = '';
    if (zoneCode === 'TL') focusColor = 'hover:bg-blue-50 hover:text-blue-900 border-slate-200 hover:border-blue-400';
    else if (zoneCode === 'TR') focusColor = 'hover:bg-violet-50 hover:text-violet-900 border-slate-200 hover:border-violet-400';
    else if (zoneCode === 'BL') focusColor = 'hover:bg-teal-50 hover:text-teal-900 border-slate-200 hover:border-teal-400';
    else if (zoneCode === 'BR') focusColor = 'hover:bg-amber-50 hover:text-amber-900 border-slate-200 hover:border-amber-400';

    return lettersStr.split('').map((char) => {
      const disabled = activeZone !== zoneCode;
      const targetId = `letter-${char}`;
      return (
        <LetterKey 
          key={char} 
          id={targetId}
          letter={char} 
          disabled={disabled}
          isDwelling={progressMap[targetId] > 0} 
          dwellProgress={progressMap[targetId] || 0}
          accentHoverClass={focusColor}
        />
      );
    });
  };

  const getZoneProps = (code) => {
    const id = `zone-${code}`;
    return {
      id,
      isZoneActive: activeZone === code,
      isOtherZoneActive: activeZone !== null && activeZone !== code,
      isDwelling: progressMap[id] > 0,
      dwellProgress: progressMap[id] || 0
    };
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-bgAlternate font-sans text-textPrimary">
      <TopBar wordBuffer={wordBuffer} predictedSentence={predictedSentence} isLoading={isLoading} />

      <div className="flex-1 p-6 md:p-8 flex items-stretch justify-center">
        <div 
          className="w-full max-w-7xl h-full grid gap-8 md:gap-12"
          style={{ 
            gridTemplateColumns: '1fr 120px 1fr', 
            gridTemplateRows: '1fr 120px 1fr' 
          }}
        >
          {/* Top-Left */}
          <div className="col-start-1 row-start-1">
            <ZoneCard label="A – F" {...getZoneProps('TL')}>
              <div className="grid grid-cols-3 gap-3 md:gap-5 w-full">
                {renderLetters('ABCDEF', 'TL')}
              </div>
            </ZoneCard>
          </div>

          {/* Top-Right */}
          <div className="col-start-3 row-start-1">
            <ZoneCard label="G – M" {...getZoneProps('TR')}>
              <div className="grid grid-cols-4 gap-3 md:gap-5 w-full justify-center">
                {renderLetters('GHIJ', 'TR')}
                <div className="col-span-4 flex gap-3 md:gap-5 justify-center">
                  {renderLetters('KLM', 'TR')}
                </div>
              </div>
            </ZoneCard>
          </div>

          {/* Center Actions */}
          <div className="col-start-2 row-start-2 flex flex-col justify-center items-center space-y-4 md:space-y-6">
            <ActionButton 
              id="action-SPACE" 
              label="SPACE" 
              type="space" 
              isDwelling={progressMap['action-SPACE'] > 0} 
              dwellProgress={progressMap['action-SPACE'] || 0} 
            />
            <ActionButton 
              id="action-AUTOFILL" 
              label="AUTOFILL" 
              type="autofill" 
              isDwelling={progressMap['action-AUTOFILL'] > 0} 
              dwellProgress={progressMap['action-AUTOFILL'] || 0} 
            />
          </div>

          {/* Bottom-Left */}
          <div className="col-start-1 row-start-3">
            <ZoneCard label="N – T" {...getZoneProps('BL')}>
              <div className="grid grid-cols-4 gap-3 md:gap-5 w-full justify-center">
                {renderLetters('NOPQ', 'BL')}
                <div className="col-span-4 flex gap-3 md:gap-5 justify-center">
                  {renderLetters('RST', 'BL')}
                </div>
              </div>
            </ZoneCard>
          </div>

          {/* Bottom-Right */}
          <div className="col-start-3 row-start-3">
            <ZoneCard label="U – Z" {...getZoneProps('BR')}>
              <div className="grid grid-cols-3 gap-3 md:gap-5 w-full">
                {renderLetters('UVWXYZ', 'BR')}
              </div>
            </ZoneCard>
          </div>
        </div>
      </div>

      <StatusBar webcamStatus={webcamStatus} />
    </div>
  );
}
