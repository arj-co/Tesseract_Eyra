import React, { useState, useEffect } from 'react';

const mascotStyles = `
  @keyframes mascotFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes mascotBlink {
    0%, 96%, 100% { transform: scaleY(1); }
    98% { transform: scaleY(0.1); }
  }
  @keyframes leafSparkle {
    0% { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
    50% { opacity: 1; transform: translateY(-15px) scale(1.2) rotate(15deg); }
    100% { opacity: 0; transform: translateY(-30px) scale(1) rotate(30deg); }
  }
  @keyframes leafSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
`;

export default function Mascot() {
  const [state, setState] = useState('idle'); // idle, dwell, success, error, loading
  const [mousePos, setMousePos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth : 0, y: typeof window !== 'undefined' ? window.innerHeight : 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let timeout;
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        setState('dwell');
      } else {
        if (state !== 'success' && state !== 'loading' && state !== 'error') {
          setState('idle');
        }
      }
    };
    const handleClick = (e) => {
      if (e.target.closest('a, button')) {
        setState('success');
        clearTimeout(timeout);
        timeout = setTimeout(() => setState('idle'), 2500);
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    // Optional debug/demo hook
    window.__setMascotState = (s) => setState(s);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      clearTimeout(timeout);
    };
  }, [state]);

  const centerX = typeof window !== 'undefined' ? window.innerWidth - 64 : 1000;
  const centerY = typeof window !== 'undefined' ? window.innerHeight - 64 : 1000;
  const dx = mousePos.x - centerX;
  const dy = mousePos.y - centerY;

  // Tracking limits
  const eyeDx = state === 'idle' || state === 'dwell' || state === 'success' 
    ? Math.max(-5, Math.min(2, dx * 0.005)) 
    : 0;
  const eyeDy = state === 'idle' || state === 'dwell' || state === 'success' 
    ? Math.max(-3, Math.min(3, dy * 0.006)) 
    : 0;
  
  // Head rotation
  let headRot = state === 'idle' || state === 'dwell' ? Math.max(-6, Math.min(6, dx * 0.01)) : 0;
  if (state === 'error') headRot = 15; // Confused tilt

  // Base transforms per state
  let baseTranslateY = 0;
  let baseScale = 1;
  let glowOpacity = 0;
  
  if (state === 'dwell') {
    baseTranslateY = 4; // leans forward/down slightly
    glowOpacity = 0.8;
    headRot += 2; 
  } else if (state === 'success') {
    baseTranslateY = -8; // small happy bounce
    baseScale = 1.02;
    glowOpacity = 0.4;
  } else if (state === 'loading') {
    baseTranslateY = -2;
  } else if (state === 'error') {
    baseTranslateY = 2;
  }

  return (
    <>
      <style>{mascotStyles}</style>
      <div style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 80,
        height: 80,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glow behind */}
        <div style={{
          position: 'absolute',
          width: 50, height: 50,
          background: 'rgba(168, 230, 207, 0.5)',
          borderRadius: '50%',
          filter: 'blur(15px)',
          opacity: glowOpacity,
          transition: 'opacity 600ms cubic-bezier(.25,.46,.45,.94)',
        }} />

        <div style={{
          width: '100%', height: '100%',
          position: 'relative',
          pointerEvents: 'auto',
          animation: state === 'idle' ? 'mascotFloat 4s ease-in-out infinite' : (state === 'error' ? 'wobble 2s ease-in-out infinite' : 'none'),
          transform: `translateY(${baseTranslateY}px) scale(${baseScale})`,
          transition: 'transform 600ms cubic-bezier(.25,.46,.45,.94)',
        }}>
          {/* Success Particles */}
          {state === 'success' && (
            <>
              <div style={{ position: 'absolute', top: -5, left: 10, animation: 'leafSparkle 1.2s ease-out forwards', color: '#34A853', fontSize: 14 }}>✦</div>
              <div style={{ position: 'absolute', top: -10, left: 40, animation: 'leafSparkle 1.4s ease-out forwards 0.1s', color: '#A8E6CF', fontSize: 10 }}>✦</div>
              <div style={{ position: 'absolute', top: -2, left: 60, animation: 'leafSparkle 1.1s ease-out forwards 0.2s', color: '#34A853', fontSize: 16 }}>✦</div>
            </>
          )}

          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A8E6CF" />
                <stop offset="100%" stopColor="#87D4B6" />
              </linearGradient>
            </defs>

            <g style={{
              transform: `rotate(${headRot}deg)`,
              transformOrigin: '50px 70px',
              transition: 'transform 600ms cubic-bezier(.25,.46,.45,.94)'
            }}>
              {/* Back Leaf / Ahoge */}
              <path d="M 50 25 Q 56 8 66 18 Q 58 28 50 25" fill="#34A853" 
                style={{
                  transformOrigin: '50px 25px',
                  animation: state === 'loading' ? 'leafSpin 1.5s linear infinite' : 'none',
                  transition: 'transform 600ms ease'
                }} 
              />

              {/* Main Body (Soft rounded droplet/capsule) */}
              <rect x="25" y="25" width="50" height="60" rx="25" fill="url(#mascotBody)" />
              
              {/* Soft Belly / Face Area */}
              <rect x="30" y="42" width="40" height="35" rx="17.5" fill="#E8F5E9" opacity="0.95" />

              {/* Eyes & Mouth Container to group movements */}
              <g style={{
                transform: `translate(${eyeDx}px, ${eyeDy}px)`,
                transition: 'transform 300ms ease-out'
              }}>
                {/* Eyes Blink Wrap */}
                <g style={{
                  transformOrigin: '50px 52px',
                  animation: state === 'idle' || state === 'dwell' ? 'mascotBlink 4s infinite' : 'none',
                }}>
                  {state === 'error' ? (
                    // Confused/Dead eyes
                    <>
                      <path d="M 38 48 L 44 54 M 44 48 L 38 54" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="58" cy="51" r="3.5" fill="#1C1917" />
                    </>
                  ) : state === 'success' ? (
                    // Happy eyes
                    <>
                      <path d="M 38 52 Q 41 48 44 52" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 56 52 Q 59 48 62 52" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  ) : state === 'loading' ? (
                    // Thinking eyes
                    <>
                      <circle cx="41" cy="51" r="3.5" fill="#1C1917" />
                      <circle cx="59" cy="51" r="3.5" fill="#1C1917" />
                      <path d="M 38 45 Q 41 43 44 45" fill="none" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M 56 45 Q 59 43 62 45" fill="none" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    // Regular eyes
                    <>
                      <circle cx="41" cy="51" r="3.5" fill="#1C1917" />
                      <circle cx="59" cy="51" r="3.5" fill="#1C1917" />
                      {/* Pupils */}
                      <circle cx="42" cy="50" r="1.2" fill="#FFF" />
                      <circle cx="60" cy="50" r="1.2" fill="#FFF" />
                    </>
                  )}
                </g>

                {/* Mouth */}
                <path 
                  d={
                    state === 'success' ? "M 42 60 Q 50 67 58 60" : 
                    state === 'error' ? "M 46 62 Q 50 59 54 62" : 
                    state === 'dwell' ? "M 47 61 Q 50 61 53 61" :
                    state === 'loading' ? "M 46 61 Q 48 62 50 61 T 54 61" :
                    "M 47 60 Q 50 63 53 60"
                  } 
                  fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" 
                  style={{ transition: 'all 300ms ease' }}
                />
              </g>

              {/* Arms (Optional subtle indicator) */}
              <path d="M 25 55 Q 18 60 25 65" fill="none" stroke="#87D4B6" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              <path d="M 75 55 Q 82 60 75 65" fill="none" stroke="#87D4B6" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
