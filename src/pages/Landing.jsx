import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Mascot from '../components/Mascot';

/* ─── Google Fonts injected once ─── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Inline styles / tokens ─── */
const T = {
  cream: '#F7F4EF',
  ink: '#1C1917',
  inkSoft: '#44403C',
  teal: '#0F6E56',
  tealMid: '#1D9E75',
  tealLight: '#E1F5EE',
  sdg3: '#279B48',
  sdg10: '#DD1367',
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'DM Sans', sans-serif",
};

const fadeUpKeyframes = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blinkKey {
    0%,100% { background: #E1F5EE; color: #0F6E56; }
    50%      { background: #0F6E56; color: #fff; }
  }
  @keyframes markerDraw {
    from { background-size: 0% 3px; }
    to   { background-size: 100% 3px; }
  }
  @keyframes gazeTrail {
    0%   { opacity: 0; stroke-dashoffset: 60; }
    40%  { opacity: 0.7; }
    100% { opacity: 0; stroke-dashoffset: 0; }
  }
`;

/* ─── Person + Tablet SVG Illustration ─── */
const PersonIllustration = () => {
  const [activeKey, setActiveKey] = useState(0);
  const keys = ['H', 'I', ' ', 'M', 'O', 'M'];
  useEffect(() => {
    const t = setInterval(() => setActiveKey(k => (k + 1) % keys.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <svg viewBox="0 0 480 520" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* BG */}
      <rect width="480" height="520" fill="#C8E6DA" />
      <rect x="0" y="310" width="480" height="210" fill="#A0D4C0" />
      <circle cx="390" cy="70" r="110" fill="#B3DFC1" opacity="0.45" />
      <circle cx="55" cy="430" r="85" fill="#7BBFAB" opacity="0.35" />

      {/* ── Wheelchair ── */}
      <rect x="195" y="308" width="165" height="8" rx="4" fill="#0F6E56" />
      <rect x="215" y="315" width="8" height="95" rx="4" fill="#0F6E56" />
      <rect x="345" y="315" width="8" height="95" rx="4" fill="#0F6E56" />
      <rect x="205" y="398" width="155" height="8" rx="4" fill="#0F6E56" />
      {/* footrests */}
      <rect x="196" y="402" width="10" height="52" rx="3" fill="#0F6E56" />
      <rect x="174" y="450" width="54" height="8" rx="3" fill="#0F6E56" />
      <rect x="352" y="402" width="10" height="52" rx="3" fill="#0F6E56" />
      <rect x="330" y="450" width="54" height="8" rx="3" fill="#0F6E56" />
      {/* wheels */}
      <circle cx="238" cy="432" r="46" fill="none" stroke="#085041" strokeWidth="8" />
      <circle cx="238" cy="432" r="28" fill="none" stroke="#085041" strokeWidth="3" />
      <circle cx="238" cy="432" r="6" fill="#085041" />
      <circle cx="332" cy="432" r="46" fill="none" stroke="#085041" strokeWidth="8" />
      <circle cx="332" cy="432" r="28" fill="none" stroke="#085041" strokeWidth="3" />
      <circle cx="332" cy="432" r="6" fill="#085041" />
      <circle cx="198" cy="452" r="19" fill="none" stroke="#085041" strokeWidth="6" />

      {/* ── Body ── */}
      <rect x="222" y="228" width="82" height="88" rx="16" fill="#F5C4B3" />
      <rect x="219" y="237" width="88" height="83" rx="14" fill="#1D9E75" />
      <rect x="217" y="305" width="98" height="30" rx="8" fill="#2D2926" />
      {/* arms */}
      <rect x="180" y="253" width="50" height="18" rx="9" fill="#1D9E75" />
      <ellipse cx="177" cy="262" rx="11" ry="9" fill="#F5C4B3" />
      <rect x="296" y="253" width="50" height="18" rx="9" fill="#1D9E75" />
      <ellipse cx="348" cy="262" rx="11" ry="9" fill="#F5C4B3" />

      {/* ── Head ── */}
      <ellipse cx="264" cy="192" rx="43" ry="47" fill="#F5C4B3" />
      <path d="M221,182 Q221,145 264,145 Q307,145 307,182" fill="#1C1917" />
      {/* ears */}
      <ellipse cx="221" cy="197" rx="7" ry="11" fill="#F5C4B3" />
      <ellipse cx="307" cy="197" rx="7" ry="11" fill="#F5C4B3" />

      {/* ── Eyes (looking left toward tablet) ── */}
      <ellipse cx="248" cy="194" rx="9" ry="7" fill="white" />
      <ellipse cx="280" cy="194" rx="9" ry="7" fill="white" />
      <circle cx="252" cy="195" r="5" fill="#1C1917" />
      <circle cx="284" cy="195" r="5" fill="#1C1917" />
      <circle cx="254" cy="193" r="1.8" fill="white" />
      <circle cx="286" cy="193" r="1.8" fill="white" />
      {/* brows */}
      <path d="M239,184 Q248,179 257,184" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M271,184 Q280,179 289,184" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* smile */}
      <path d="M251,213 Q264,222 277,213" stroke="#C47858" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* ── Gaze dashed line ── */}
      <line x1="244" y1="198" x2="218" y2="278" stroke="#1D9E75" strokeWidth="1.8" strokeDasharray="5,3" opacity="0.65" />

      {/* ── Tablet ── */}
      <rect x="150" y="265" width="82" height="60" rx="8" fill="#1C1917" />
      <rect x="154" y="269" width="74" height="50" rx="6" fill="#E1F5EE" />
      {/* letter grid 3×2 */}
      {['H','I','L','O','V','E'].map((ch, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 157 + col * 18;
        const y = 272 + row * 14;
        const isActive = ch === keys[activeKey];
        return (
          <g key={ch}>
            <rect x={x} y={y} width="15" height="11" rx="2.5"
              fill={isActive ? '#0F6E56' : 'white'}
              stroke={isActive ? 'none' : '#A0D4C0'}
              strokeWidth="0.5" />
            <text x={x + 7.5} y={y + 8.5} fontSize="6.5" textAnchor="middle"
              fill={isActive ? 'white' : '#0F6E56'}
              fontFamily="DM Sans, sans-serif" fontWeight="500">{ch}</text>
          </g>
        );
      })}
      {/* typed word bar */}
      <rect x="154" y="301" width="74" height="14" rx="3" fill="#279B48" opacity="0.12" />
      <text x="191" y="311" fontSize="6" fill="#0F6E56" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontWeight="500">HI MOM ▌</text>

      {/* ── Status chip ── */}
      <rect x="302" y="148" width="148" height="38" rx="9" fill="white" opacity="0.92" />
      <circle cx="315" cy="167" r="5" fill="#1D9E75" />
      <circle cx="315" cy="167" r="2" fill="white" />
      <text x="323" y="163" fontSize="8.5" fill="#0F6E56" fontFamily="DM Sans, sans-serif" fontWeight="500">Eye-tracking active</text>
      <text x="323" y="177" fontSize="7" fill="#44403C" fontFamily="DM Sans, sans-serif">Accuracy: 98%  ·  Dwell 0.25s</text>
    </svg>
  );
};

/* ─── Caregiver + Patient SVG ─── */
const StoryIllustration = () => (
  <svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block', backgroundColor: '#E3F8F9' }}>
    {/* Light blue blob background */}
    <path d="M 40 220 C -20 100, 100 20, 220 50 C 370 80, 420 200, 360 350 C 280 470, 60 380, 40 220 Z" fill="#9CDFEA" opacity="0.8"/>
    <circle cx="90" cy="120" r="30" fill="#E8FAFC"/>
    <circle cx="340" cy="300" r="18" fill="#E8FAFC"/>
    <circle cx="320" cy="110" r="14" fill="#9CDFEA"/>
    <circle cx="190" cy="270" r="12" fill="#E8FAFC"/>

    {/* Potted Plant */}
    <path d="M 60 400 L 130 400 L 120 330 L 70 330 Z" fill="#D2EBE7"/>
    {/* Leaves */}
    <path d="M 95 330 Q 60 250 95 210 Q 130 250 95 330" fill="#1C5B42"/>
    <path d="M 95 300 Q 50 280 60 230 Q 85 260 95 300" fill="#247854"/>
    <path d="M 95 290 Q 140 270 130 220 Q 105 250 95 290" fill="#247854"/>
    <path d="M 95 260 Q 40 240 50 190 Q 75 220 95 260" fill="#319E6C"/>
    <path d="M 95 250 Q 150 230 140 180 Q 115 210 95 250" fill="#319E6C"/>

    {/* Caregiver */}
    {/* Legs */}
    <path d="M 180 270 L 140 380 L 110 370 L 160 280 Z" fill="#0D47A1"/>
    <path d="M 190 270 L 190 380 L 160 380 L 170 280 Z" fill="#1565C0"/>
    {/* Shoes */}
    <rect x="95" y="365" width="40" height="18" rx="6" fill="#212121" transform="rotate(-25 115 375)"/>
    <rect x="160" y="375" width="40" height="15" rx="6" fill="#212121"/>
    <rect x="160" y="385" width="40" height="4" fill="#FFFFFF"/>
    <rect x="98" y="380" width="35" height="4" fill="#FFFFFF" transform="rotate(-25 115 375)"/>
    {/* Body (White Coat) */}
    <path d="M 160 110 C 160 110 205 115 210 130 L 195 310 L 135 295 C 135 295 150 180 160 110 Z" fill="#FFFFFF"/>
    {/* Arm */}
    <path d="M 180 120 L 205 230 L 190 235 L 165 125 Z" fill="#FFFFFF"/>
    <circle cx="205" cy="235" r="8" fill="#FFAB91"/>
    {/* Face */}
    <path d="M 160 90 C 160 60 185 60 185 90 L 175 115 Z" fill="#FFAB91"/>
    {/* Hair */}
    <path d="M 155 95 C 150 55 185 55 190 70 C 190 70 170 85 165 100 Z" fill="#212121"/>
    <path d="M 155 85 C 140 95 140 105 155 105 Z" fill="#212121"/>

    {/* Wheelchair */}
    {/* Large back wheel */}
    <circle cx="220" cy="330" r="55" fill="none" stroke="#212121" strokeWidth="8"/>
    <circle cx="220" cy="330" r="45" fill="none" stroke="#212121" strokeWidth="2"/>
    {/* Spokes */}
    <line x1="175" y1="330" x2="265" y2="330" stroke="#212121" strokeWidth="2"/>
    <line x1="220" y1="285" x2="220" y2="375" stroke="#212121" strokeWidth="2"/>
    <line x1="188" y1="298" x2="252" y2="362" stroke="#212121" strokeWidth="2"/>
    <line x1="188" y1="362" x2="252" y2="298" stroke="#212121" strokeWidth="2"/>
    <circle cx="220" cy="330" r="6" fill="#212121"/>
    {/* Frame Handle & Back */}
    <path d="M 190 230 L 225 230 C 230 230 235 240 235 245 L 235 330" fill="none" stroke="#424242" strokeWidth="8" strokeLinecap="round"/>
    {/* Bottom frame */}
    <path d="M 220 330 L 290 330 L 290 380 L 305 380" fill="none" stroke="#424242" strokeWidth="8" strokeLinejoin="round"/>
    {/* Seat & Backrest */}
    <rect x="225" y="270" width="55" height="65" fill="#212121" rx="4"/>
    {/* Front wheel */}
    <circle cx="305" cy="390" r="15" fill="none" stroke="#212121" strokeWidth="6"/>
    <line x1="295" y1="390" x2="315" y2="390" stroke="#212121" strokeWidth="2"/>
    <line x1="305" y1="380" x2="305" y2="400" stroke="#212121" strokeWidth="2"/>

    {/* Patient */}
    {/* Legs (Yellow pants) */}
    <path d="M 235 270 L 285 270 C 295 270 295 280 295 290 L 295 365 L 325 365 L 325 385 L 260 385 L 260 295 L 235 295 Z" fill="#FDE047"/>
    {/* Shoes */}
    <path d="M 320 365 C 340 370 345 380 345 385 L 320 385 Z" fill="#FFFFFF"/>
    {/* Body (Blue shirt) */}
    <path d="M 220 190 C 245 180 280 210 275 260 L 260 285 L 210 285 L 200 230 Z" fill="#93C5FD"/>
    {/* Arm */}
    <path d="M 235 210 Q 250 240 275 260 L 290 250 Q 265 230 250 200 Z" fill="#BFDBFE"/>
    <circle cx="288" cy="253" r="8" fill="#FFAB91"/>
    {/* Head */}
    <circle cx="240" cy="180" r="16" fill="#FFAB91"/>
    <path d="M 245 180 C 250 170 255 180 255 185" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
    <path d="M 248 184 Q 252 186 250 188" fill="none" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Hair */}
    <path d="M 220 180 C 210 150 245 145 255 170 C 255 170 260 160 240 155 C 230 155 220 165 220 180 Z" fill="#FFFFFF"/>
    <circle cx="230" cy="188" r="4" fill="#FFFFFF"/>
    <circle cx="225" cy="170" r="4" fill="#FFFFFF"/>

    {/* Icons */}
    {/* Heart Icon Bubble */}
    <circle cx="245" cy="100" r="26" fill="none" stroke="#1C5B42" strokeWidth="1.5" opacity="0.6"/>
    <path d="M 232 95 A 7 7 0 0 1 245 95 A 7 7 0 0 1 258 95 Q 258 108 245 118 Q 232 108 232 95 Z" fill="#319E6C"/>
    {/* Pulse line */}
    <path d="M 225 100 L 235 100 L 238 90 L 246 115 L 252 100 L 265 100" fill="none" stroke="#1C5B42" strokeWidth="1.5" opacity="0.8"/>

    {/* Pills Icon Bubble */}
    <circle cx="330" cy="180" r="22" fill="none" stroke="#1C5B42" strokeWidth="1.5" opacity="0.6"/>
    <g transform="translate(325, 175) rotate(30)">
      <rect x="-8" y="-4" width="16" height="8" rx="4" fill="#FFFFFF"/>
      <rect x="0" y="-4" width="8" height="8" rx="4" fill="#9CDFEA"/>
    </g>
    <g transform="translate(335, 165) rotate(-35)">
      <rect x="-8" y="-4" width="16" height="8" rx="4" fill="#FFFFFF"/>
      <rect x="0" y="-4" width="8" height="8" rx="4" fill="#9CDFEA"/>
    </g>
    <g transform="translate(315, 185) rotate(-15)">
      <rect x="-8" y="-4" width="16" height="8" rx="4" fill="#FFFFFF"/>
      <rect x="0" y="-4" width="8" height="8" rx="4" fill="#9CDFEA"/>
    </g>
  </svg>
);

/* ─── Section label component ─── */
const SectionLabel = ({ children, light }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: light ? '#9FE1CB' : T.teal,
    fontFamily: T.sans, marginBottom: '0.8rem',
  }}>
    <span style={{ display: 'block', width: 20, height: 1, background: light ? '#9FE1CB' : T.teal }} />
    {children}
  </div>
);

/* ══════════════════════════════════════
   MAIN LANDING COMPONENT
══════════════════════════════════════ */
export default function Landing() {
  return (
    <div style={{ fontFamily: T.sans, background: T.cream, color: T.ink, lineHeight: 1.6 }}>
      <FontLoader />
      <style>{fadeUpKeyframes}</style>
      <Navbar />

      {/* ── HERO ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2" style={{
        maxWidth: 1280, margin: '0 auto', padding: '5rem 2.5rem 4rem',
        gap: '4rem', alignItems: 'center',
      }}>
        {/* Left */}
        <div style={{ animation: 'fadeUp 0.7s ease forwards' }}>
          <SectionLabel>Assistive Communication Technology</SectionLabel>

          <h1 style={{
            fontFamily: T.serif, fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '1.4rem',
            color: T.ink,
          }}>
            A voice for every{' '}
            <em style={{
              fontStyle: 'italic', color: T.teal,
              backgroundImage: `linear-gradient(${T.teal}, ${T.teal})`,
              backgroundRepeat: 'no-repeat', backgroundPosition: '0 92%',
              backgroundSize: '100% 3px',
              animation: 'markerDraw 1.2s cubic-bezier(0.25,1,0.5,1) 0.4s both',
              paddingBottom: '0.1em',
            }}>gaze</em>
          </h1>

          <p style={{
            fontSize: '1.05rem', color: T.inkSoft, fontWeight: 300,
            lineHeight: 1.75, marginBottom: '2.2rem', maxWidth: 440,
          }}>
            Eyra is a browser-based communication tool for people living with ALS — no hardware, no installation.
            Just a webcam and your eyes.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.2rem' }}>
            <Link to="/app" style={{
              background: T.ink, color: 'white', padding: '0.88rem 2.2rem',
              borderRadius: 100, fontFamily: T.sans, fontSize: '0.95rem',
              fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s',
              display: 'inline-block',
            }}
              onMouseEnter={e => e.currentTarget.style.background = T.teal}
              onMouseLeave={e => e.currentTarget.style.background = T.ink}
            >Launch Eyra</Link>

            <Link to="/how-it-works" style={{
              background: 'none', border: `1.5px solid ${T.ink}`, color: T.ink,
              padding: '0.85rem 2rem', borderRadius: 100, fontFamily: T.sans,
              fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.2s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = T.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.ink; e.currentTarget.style.color = T.ink; }}
            >See How It Works</Link>
          </div>

          {/* SDG trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { color: T.sdg3, num: '3', label: 'Good Health & Well-being' },
              { color: T.sdg10, num: '10', label: 'Reduced Inequalities' },
            ].map(b => (
              <div key={b.num} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: T.inkSoft, fontWeight: 500 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 5, background: b.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.62rem', fontWeight: 700, fontFamily: T.serif,
                }}>{b.num}</span>
                SDG {b.num} · {b.label}
                {b.num === '3' && <span style={{ width: 1, height: 14, background: 'rgba(28,25,23,0.15)', marginLeft: 4 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right – illustration */}
        <div className="h-[350px] md:h-[520px]" style={{
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(15,110,86,0.18)',
          animation: 'fadeUp 0.8s ease 0.15s both',
        }}>
          <PersonIllustration />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: 'white', borderTop: `1px solid rgba(28,25,23,0.07)`, borderBottom: `1px solid rgba(28,25,23,0.07)`, padding: '4rem 2.5rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8" style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          {[
            { num: '500,000+', label: 'People living with ALS worldwide' },
            { num: '90%',      label: 'Lose the ability to speak over time' },
            { num: '₹0',       label: 'Hardware required to use Eyra' },
          ].map((s, i) => (
            <div key={i} className={`px-4 md:px-8 ${i < 2 ? 'md:border-r border-black/10' : ''}`}>
              <div style={{ fontFamily: T.serif, fontSize: 'clamp(2.4rem,4vw,3.2rem)', color: T.teal, lineHeight: 1, marginBottom: '0.5rem' }}>{s.num}</div>
              <div style={{ fontSize: '1rem', color: T.inkSoft, fontWeight: 300 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '5.5rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel>The process</SectionLabel>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
            Three steps to speaking again
          </h2>
          <p style={{ color: T.inkSoft, fontSize: '1rem', fontWeight: 300, maxWidth: 440, margin: '0 auto' }}>
            No complex setup. No dedicated hardware. Just eyes meeting the screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
          {[
            {
              num: '01', title: 'Calibrate', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="4.5" fill={T.teal} />
                  <circle cx="11" cy="11" r="9" stroke={T.teal} strokeWidth="1.5" fill="none" />
                </svg>
              ),
              body: 'Look at 4 points on screen. A quick one-time setup maps your gaze to your unique eye movements.',
            },
            {
              num: '02', title: 'Type', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="5" width="18" height="13" rx="3" stroke={T.teal} strokeWidth="1.5" fill="none" />
                  <rect x="5" y="8" width="5" height="4" rx="1" fill={T.teal} />
                </svg>
              ),
              body: 'Dwell your gaze on large visual clusters and drill down to select letters precisely — no clicks needed.',
            },
            {
              num: '03', title: 'Speak', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11 L8 15 L17 6" stroke={T.teal} strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              ),
              body: 'Eyra expands abbreviations into full sentences and speaks them aloud — so every thought finds its audience.',
            },
          ].map(s => (
            <div key={s.num} style={{ padding: '2rem', borderRadius: 16, border: `1px solid rgba(28,25,23,0.08)`, background: 'white' }}>
              <div style={{ fontFamily: T.serif, fontSize: '3rem', color: T.tealLight, lineHeight: 1, marginBottom: '1rem' }}>{s.num}</div>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: T.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {s.icon}
              </div>
              <h3 style={{ fontFamily: T.serif, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.9rem', color: T.inkSoft, lineHeight: 1.65 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/how-it-works" style={{
            color: T.teal, fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none',
            borderBottom: `2px solid rgba(15,110,86,0.25)`, paddingBottom: 2, fontFamily: T.sans,
          }}>Learn more about the technology →</Link>
        </div>
      </section>

      {/* ── HUMAN STORY ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2" style={{
        background: T.ink, color: 'white',
        gap: '4rem', alignItems: 'center',
        padding: '5rem 2.5rem',
      }}>
        <div className="lg:col-start-1" style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 'max(0px, calc((100vw - 1280px)/2))' }}>
          <SectionLabel light>The human behind this</SectionLabel>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em', color: 'white', marginBottom: '1.2rem' }}>
            Communication is dignity
          </h2>
          <blockquote style={{
            fontFamily: T.serif, fontSize: '1.25rem', lineHeight: 1.55,
            color: 'rgba(255,255,255,0.82)', fontStyle: 'italic',
            borderLeft: `2px solid ${T.tealMid}`, paddingLeft: '1.2rem',
            margin: '1.5rem 0',
          }}>
            "After my diagnosis, I thought my voice was gone forever. Eyra gave it back to me — one letter at a time."
          </blockquote>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.4rem' }}>
            — Rohan M., ALS patient · using Eyra since 2024
          </p>
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.75, maxWidth: 440 }}>
            Over 500,000 people globally live with ALS. Many lose speech within months of diagnosis.
            The silence isn't just physical — it's the loss of self. We built Eyra because communication
            is not a luxury. It's a human right.
          </p>
        </div>

        <div className="h-[280px] md:h-[420px]" style={{ borderRadius: 20, overflow: 'hidden' }}>
          <StoryIllustration />
        </div>
      </section>

      {/* ── SDG IMPACT ── */}
      <section style={{ background: T.cream, padding: '5.5rem 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionLabel>Our global commitment</SectionLabel>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em' }}>
              Built for the world's most vulnerable
            </h2>
            <p style={{ color: T.inkSoft, fontSize: '1rem', fontWeight: 300, maxWidth: 480, margin: '0.8rem auto 0' }}>
              Eyra is aligned with the United Nations Sustainable Development Goals — not as a label, but as a design principle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
            {/* SDG 3 */}
            <div style={{ borderRadius: 20, padding: '2.5rem', background: '#F0FAF3', border: `1.5px solid #B3DFC1` }}>
              <div style={{
                width: 64, height: 64, borderRadius: 10, background: T.sdg3,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <span style={{ color: 'white', fontFamily: T.serif, fontSize: '1.5rem', lineHeight: 1 }}>3</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.48rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>Good Health<br />& Well-being</span>
              </div>
              <h3 style={{ fontFamily: T.serif, fontSize: '1.4rem', color: '#1A6B30', marginBottom: '0.8rem' }}>Restoring quality of life</h3>
              <p style={{ fontSize: '0.92rem', color: '#2D5A3A', lineHeight: 1.7 }}>
                Losing the ability to communicate directly worsens mental health, accelerates depression, and isolates patients from their own care decisions.
                Eyra is a health intervention — restoring agency and dignity for people living with ALS.
              </p>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ fontFamily: T.serif, fontSize: '2rem', color: T.sdg3, lineHeight: 1 }}>500,000+</div>
                <div style={{ fontSize: '0.78rem', color: '#2D5A3A', marginTop: '0.3rem' }}>people worldwide are living with ALS today</div>
              </div>
            </div>

            {/* SDG 10 */}
            <div style={{ borderRadius: 20, padding: '2.5rem', background: '#FEF0F6', border: `1.5px solid #F5B8D4` }}>
              <div style={{
                width: 64, height: 64, borderRadius: 10, background: T.sdg10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <span style={{ color: 'white', fontFamily: T.serif, fontSize: '1.5rem', lineHeight: 1 }}>10</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.48rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>Reduced<br />Inequalities</span>
              </div>
              <h3 style={{ fontFamily: T.serif, fontSize: '1.4rem', color: '#8B0A3E', marginBottom: '0.8rem' }}>Accessible to all, not just the wealthy</h3>
              <p style={{ fontSize: '0.92rem', color: '#6B1535', lineHeight: 1.7 }}>
                Traditional AAC devices cost ₹6–12 lakh ($8,000–$15,000) — out of reach for most families in India and the Global South.
                Eyra runs on any device with a webcam. Our tiered access model ensures no patient is left without a voice.
              </p>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ fontFamily: T.serif, fontSize: '2rem', color: T.sdg10, lineHeight: 1 }}>90%</div>
                <div style={{ fontSize: '0.78rem', color: '#6B1535', marginTop: '0.3rem' }}>cost reduction vs. traditional AAC devices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ background: 'white', padding: '5.5rem 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionLabel>Who we serve</SectionLabel>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em', marginBottom: '3rem' }}>
            For patients, families, and clinicians
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1.5rem' }}>
            {[
              {
                title: 'Patients',
                body: 'Communicate with your family, doctors, and caregivers — on your own terms, at your own pace, without fatigue or frustration.',
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke={T.teal} strokeWidth="1.5" fill="none" /><path d="M3 18 Q3 13 10 13 Q17 13 17 18" stroke={T.teal} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>,
              },
              {
                title: 'Caregivers & Families',
                body: 'Hear what your loved one wants to say. Reduce guesswork, reduce exhaustion, and rebuild the relationship that ALS tries to fracture.',
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="6.5" cy="7" r="3" stroke={T.teal} strokeWidth="1.5" fill="none" /><circle cx="13.5" cy="7" r="3" stroke={T.teal} strokeWidth="1.5" fill="none" /><path d="M1 17 Q1 13 6.5 13 Q10 13 10 15 Q10 13 13.5 13 Q19 13 19 17" stroke={T.teal} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>,
              },
              {
                title: 'Clinicians & Hospitals',
                body: 'Integrate Eyra into your neurology and palliative care wards. Clinical-grade accuracy. Easy onboarding. No specialist hardware needed.',
                icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="2" width="10" height="3" rx="1" stroke={T.teal} strokeWidth="1.5" fill="none" /><rect x="2" y="4" width="16" height="14" rx="2" stroke={T.teal} strokeWidth="1.5" fill="none" /><path d="M7 11 L9 13 L13 8" stroke={T.teal} strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg>,
              },
            ].map(c => (
              <div key={c.title} style={{ padding: '1.8rem', borderRadius: 16, border: `1px solid rgba(28,25,23,0.08)` }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontFamily: T.serif, fontSize: '1.15rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.88rem', color: T.inkSoft, lineHeight: 1.65 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: T.teal, color: 'white', textAlign: 'center', padding: '5rem 2.5rem' }}>
        <SectionLabel light>Get started</SectionLabel>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Give someone their voice back
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 300, maxWidth: 460, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Whether you're a patient, a family member, or a hospital — we'd love to talk about how Eyra can help.
        </p>
        <Link to="/app" style={{
          background: 'white', color: T.teal, border: 'none',
          padding: '0.9rem 2.4rem', borderRadius: 100, fontFamily: T.sans,
          fontSize: '1rem', fontWeight: 500, textDecoration: 'none', display: 'inline-block',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Launch Eyra — it's free</Link>
      </section>

      <Footer />
      <Mascot />
    </div>
  );
}
