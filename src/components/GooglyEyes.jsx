import React, { useEffect, useRef } from 'react';

export default function GooglyEyes() {
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    function movePupils(e) {
      [
        { eye: leftEyeRef.current, pupil: leftPupilRef.current },
        { eye: rightEyeRef.current, pupil: rightPupilRef.current },
      ].forEach(({ eye, pupil }) => {
        if (!eye || !pupil) return;

        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);

        // Max pupil travel radius in px
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    window.addEventListener('mousemove', movePupils);
    return () => window.removeEventListener('mousemove', movePupils);
  }, []);

  const eyeClass = "relative flex items-center justify-center bg-white border-2 border-[#1C1C1E] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.15)] overflow-hidden w-[22px] h-[22px] transition-all duration-300 group-hover:w-[26px] group-hover:h-[26px]";
  const reflectionClass = "absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-80 pointer-events-none z-10";
  
  const pupilStyle = {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#1C1C1E',
    position: 'absolute',
    transition: 'transform 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <div className="flex gap-1 items-center">
      {/* Left eye */}
      <div ref={leftEyeRef} className={eyeClass}>
        <div className={reflectionClass}></div>
        <div ref={leftPupilRef} style={pupilStyle} />
      </div>

      {/* Right eye */}
      <div ref={rightEyeRef} className={eyeClass}>
        <div className={reflectionClass}></div>
        <div ref={rightPupilRef} style={pupilStyle} />
      </div>
    </div>
  );
}
