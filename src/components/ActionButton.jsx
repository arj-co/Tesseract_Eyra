import React from 'react';
import DwellRing from './DwellRing';

export default function ActionButton({ label, type, id, isDwelling, dwellProgress }) {
  let style = '';
  let icon = null;

  if (type === 'space') {
    style = 'bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50';
  } else if (type === 'back') {
    style = 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-slate-400';
    icon = (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    );
  } else if (type === 'backspace') {
    style = 'bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700';
    icon = (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
      </svg>
    );
  } else if (type === 'speak') {
    style = 'bg-[#0F6E56] text-white hover:bg-[#0B5240] shadow-[0_4px_14px_rgba(15,110,86,0.4)] border border-[#0B5240]';
    icon = (
      <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  }

  return (
    <div
      data-dwell={id}
      className={`w-full h-full rounded-xl font-bold text-center transition-all cursor-pointer select-none bg-white border border-slate-200 shadow-sm ${style}`}
    >
      <DwellRing active={isDwelling} progress={dwellProgress}>
        <div className="w-full h-full flex items-center justify-center gap-2 text-lg md:text-xl px-3">
          {icon}
          {label}
        </div>
      </DwellRing>
    </div>
  );
}
