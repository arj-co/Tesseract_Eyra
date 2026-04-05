import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Mascot from '../components/Mascot';
import FeatureSequence from '../components/FeatureSequence';
import SidebarGrid from '../components/SidebarGrid';
import { motion, animate } from 'framer-motion';
import patientsImg from '../../assets/patients.png';

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
  cream: 'rgb(227, 222, 192)', // Updated richer creamy olive tone
  card: '#FAF8F4',
  ink: '#1C1917',
  inkSoft: '#525252',
  teal: '#2E7D4F',
  tealMid: '#1D9E75',
  tealLight: '#E3DEC0', // Aligned with new creamy palette
  sdg3: '#2E7D4F',
  sdg10: '#c43d6b',
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'DM Sans', sans-serif",
};

const fadeUpKeyframes = `
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
  @keyframes scrollPulse {
    0%   { transform: scaleY(0) translateY(0); transform-origin: top; }
    50%  { transform: scaleY(1) translateY(0); transform-origin: top; }
    100% { transform: scaleY(1) translateY(100%); transform-origin: top; }
  }
`;

/* ─── Caregiver + Patient Image ─── */
const StoryIllustration = () => (
  <img
    src={patientsImg}
    alt="Caregiver and patient"
    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
  />
);

const FlowerSeparator = () => (
  <div 
    className="relative w-full flex items-center justify-between overflow-hidden" 
    style={{ background: 'transparent', minHeight: '180px', marginTop: '-40px', marginBottom: '-40px' }}
  >
    {/* Left Flower: Flipped horizontally and rotated -8deg */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 0.6, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: '320px',
        height: '240px',
        backgroundImage: 'url(/vendor/flowers.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        transform: 'scaleX(-1) rotate(-8deg)',
        filter: 'saturate(0.8)',
        maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
      }}
    />
    
    {/* Right Flower: Normal orientation rotated +8deg */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 0.6, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: '320px',
        height: '240px',
        backgroundImage: 'url(/vendor/flowers.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        transform: 'rotate(8deg)',
        filter: 'saturate(0.8)',
        maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
      }}
    />
  </div>
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

/* ─── Spoiler Reveal Components ─── */

function SpoilerLine({ children, accent = false, delay = 0, duration = 0.8, yOffset = 20 }) {
  return (
    <span className="relative inline-block overflow-hidden pb-1">
      <motion.span
        initial={{ opacity: 0, y: yOffset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ 
          delay: delay + 0.05, 
          duration: duration,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
      <motion.span
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{
          delay: delay,
          duration: duration,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="absolute inset-0 origin-right pointer-events-none"
        style={{
          backgroundColor: accent ? T.teal : T.cream,
          zIndex: 10
        }}
      >
        {!accent && (
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: T.teal }}
          />
        )}
      </motion.span>
    </span>
  );
}

function HeroStatement() {
  const lines = [
    { text: "ALS doesn't remove",       accent: false },
    { text: 'intelligence.',              accent: false },
    { text: 'It removes the interface.', accent: false },
    { text: 'Silence makes people look', accent: false },
    { text: 'like liabilities —',         accent: false },
  ];

  return (
    <div
      style={{ fontFamily: T.serif, color: T.ink }}
      className="space-y-4 text-[clamp(32px,5vw,64px)] leading-[1.05] text-left"
    >
      {lines.map(({ text, accent }, i) => (
        <div key={i}>
          <SpoilerLine delay={i * 0.12} accent={accent}>{text}</SpoilerLine>
        </div>
      ))}
      <div>
        <SpoilerLine delay={lines.length * 0.12} accent>
          until you give them a <span style={{ color: T.teal }}>voice.</span>
        </SpoilerLine>
      </div>
    </div>
  );
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        opacity: 0.3
      }}
    />
  )
}


function LandingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* 1. Base Editorial Surface */}
      <div className="absolute inset-0" style={{ background: T.cream }} />

      {/* 2. Depth Layers (Behind Image Only) */}
      <div className="absolute inset-0 opacity-30">
        {/* Faint Technical Grid */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `radial-gradient(${T.teal} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.15
          }} 
        />
        
        {/* Subtle Green Gradient Blob */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${T.teal} 0%, transparent 70%)`,
            filter: 'blur(100px)',
          }}
        />

        {/* Soft Translucent Circle */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-teal-900/5 opacity-40"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        />
      </div>

      {/* 3. Paper Grain Overlay / Noise */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 10,
          opacity: 0.04,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
        opacity: 0,
        animation: 'fadeInScroll 0.8s ease 1.2s forwards',
      }}
    >
      <style>{`@keyframes fadeInScroll { to { opacity: 0.4; } }`}</style>
      <div style={{
        width: '1px',
        height: '40px',
        backgroundColor: T.ink,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '50%',
            backgroundColor: T.teal,
            willChange: 'transform',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

function GazeBeam() {
  return (
    <div 
      className="absolute left-0 right-0 pointer-events-none overflow-hidden"
      style={{
        height: '120px',
        top: '40%',
        background: `linear-gradient(
          90deg,
          transparent,
          rgba(46,125,79,0.02),
          transparent
        )`,
        filter: 'blur(40px)',
        opacity: 0.3,
        zIndex: 6
      }}
    />
  );
}

function SDGCard({ title, color, link, children }) {
  return (
    <div className="w-full h-[540px] mb-8 md:mb-0">
      <div
        onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        className="relative w-full h-full cursor-pointer group rounded-[40px] border-2 bg-white overflow-hidden shadow-sm"
        style={{
          borderColor: color,
          background: '#f6f3ee',
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.04)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.01)';
          e.currentTarget.style.boxShadow = '0 40px 80px -12px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.04)';
        }}
      >
        <GridBackground />

        <div className="relative h-full flex flex-col justify-between p-12">
          {/* Subtle accent blob */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ background: color }}
          />

          <div className="space-y-8">
            <div
              className="text-6xl font-serif select-none"
              style={{ color, fontFamily: T.serif, letterSpacing: '-0.02em' }}
            >
              {title}
            </div>

            <div
              className="text-zinc-800 leading-relaxed text-lg font-light"
              style={{ fontFamily: T.sans }}
            >
              {children}
            </div>
          </div>

          <div
            className="inline-flex items-center gap-3 transition-transform group-hover:translate-x-1"
            style={{ color, fontFamily: T.sans }}
          >
            <div className="w-8 h-[1.5px]" style={{ background: color, opacity: 0.4 }} />
            <div className="text-sm tracking-[0.25em] uppercase font-bold">
              View UN Goal ↗
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



/* ─── Count-up number hook ─── */
function useCountUp(target, duration = 1.6, delay = 0, inView = false) {
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [inView]);

  return display;
}

/* ─── Individual stat card ─── */
function StatCard({ target, prefix = '', suffix = '', label, delay = 0, fontSize = '3.5rem', inView }) {
  const count = useCountUp(target, 1.6, delay, inView);

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '2rem 2.5rem', cursor: 'default',
        position: 'relative', flex: 1,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: T.serif,
          fontSize,
          lineHeight: 1,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          color: T.teal,
        }}
      >
        {prefix}{target === 500000 ? count.toLocaleString('en-IN') : count}{suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: '0.88rem',
          color: T.inkSoft,
          fontWeight: 300,
          textAlign: 'center',
          maxWidth: 160,
          lineHeight: 1.4,
          fontFamily: T.sans,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(6px)',
          transition: `opacity 0.5s ease ${delay + 0.2}s, transform 0.5s ease ${delay + 0.2}s`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Animated vertical divider ─── */
function RevealDivider({ delay = 0, inView }) {
  return (
    <div
      className="md-divider"
      style={{
        width: 1,
        height: '40%',
        background: 'rgba(0,0,0,0.08)',
        alignSelf: 'center',
        flexShrink: 0,
        display: 'none',
        transform: inView ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'bottom',
        transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    />
  );
}

/* ─── Metric Band ─── */
function MetricBand() {
  const ref = useRef(null);
  const [inView, setInView] = React.useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { target: 500000, prefix: '', suffix: '+', label: 'People living with ALS worldwide', delay: 0.0, fontSize: '3.5rem' },
    { target: 90, prefix: '', suffix: '%', label: 'Lose the ability to speak over time', delay: 0.2, fontSize: '4rem' },
    { target: 0, prefix: '₹', suffix: '', label: 'Hardware required to use Eyra', delay: 0.4, fontSize: '3.5rem' },
  ];

  return (
    <section ref={ref} style={{ padding: '4rem 1.5rem', background: T.cream }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>

        {/* Elevated strip */}
        <div style={{
          background: '#F7F4EF',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Subtle grid inside */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            opacity: 0.6,
            borderRadius: 20,
          }} />

          {/* Subtle static accent */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(46,125,79,0.03) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 0,
            }}
          />

          {/* Stats row */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            position: 'relative', zIndex: 1,
          }}
            className="metric-row"
          >
            <StatCard {...stats[0]} inView={inView} />
            <RevealDivider delay={0.15} inView={inView} />
            <StatCard {...stats[1]} inView={inView} />
            <RevealDivider delay={0.35} inView={inView} />
            <StatCard {...stats[2]} inView={inView} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-divider { display: block !important; }
          .metric-row { flex-direction: row !important; }
        }
        @media (max-width: 767px) {
          .metric-row { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════
   MAIN LANDING COMPONENT
══════════════════════════════════════ */
export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };



  return (
    <div style={{ fontFamily: T.sans, background: T.cream, color: T.ink, lineHeight: 1.6 }}>
      <FontLoader />
      <style>{fadeUpKeyframes}</style>
      <SidebarGrid />
      
      {/* Navbar floats over the full-screen hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Navbar />
      </div>

      {/* ── HERO — full viewport ── */}
      <section 
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          background: T.cream,
          overflow: 'hidden',
          padding: '0 5vw',
        }}
      >
        <LandingBackground />

        {/* 1. Background "EYRA" Text (Behind Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 'min(36vw, 520px)',
              color: T.ink,
              letterSpacing: '-0.02em',
              filter: 'blur(3px)',
              lineHeight: 1,
            }}
          >
            EYRA
          </div>
        </motion.div>

        {/* 2. Patient Illustration (Centered) */}
        <div style={{
          position: 'absolute',
          right: '5vw',
          top: '52%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          width: 'min(920px, 62vw)',
          perspective: '1200px',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ willChange: 'opacity, transform' }}
          >
            <div style={{ position: 'relative' }}>
              {/* Ambient Shadow */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '15%',
                right: '15%',
                height: '40px',
                background: 'rgba(0,0,0,0.18)',
                filter: 'blur(60px)',
                borderRadius: '50%',
                zIndex: -1
              }} />
              {/* Radial Halo */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180%',
                height: '180%',
                background: `radial-gradient(circle, ${T.teal} 0%, transparent 70%)`,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: -2
              }} />
              
              <img 
                src={patientsImg} 
                alt="Human connection" 
                style={{ 
                  width: '100%', 
                  display: 'block', 
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))',
                  borderRadius: '32px'
                }} 
              />
            </div>
          </motion.div>
        </div>

        {/* 3. Left Text Content */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto pointer-events-none">
          <div style={{ maxWidth: 460 }} className="pointer-events-auto">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.06 } }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                }}
              >
                <SectionLabel>Assistive Communication Technology</SectionLabel>
              </motion.div>

              <div style={{ marginBottom: 24 }}>
                {[
                  { text: "A voice for", y: 18 },
                  { text: "every", y: 18 },
                  { text: "human", y: 18, underline: true }
                ].map((line, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.h1
                      variants={{
                        hidden: { opacity: 0, y: line.y },
                        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
                      }}
                      style={{
                        fontFamily: T.serif,
                        fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: T.ink,
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      {line.text}
                      {line.underline && (
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: T.teal,
                            opacity: 0.6,
                            originX: 0
                          }}
                        />
                      )}
                    </motion.h1>
                  </div>
                ))}
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                style={{
                  fontSize: '1.05rem', 
                  color: T.inkSoft, 
                  fontWeight: 300,
                  lineHeight: 1.8, 
                  marginBottom: 28, 
                  maxWidth: 400,
                }}
              >
                Eyra is a browser-based communication tool for people living with ALS — no hardware, no installation.
                Just a webcam and your eyes.
              </motion.p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <Link to="/app" 
                    className="group"
                    style={{
                      background: T.ink, color: 'white', padding: '0.9rem 2.4rem',
                      borderRadius: 100, fontFamily: T.sans, fontSize: '0.95rem',
                      fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s ease',
                      display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    Launch Eyra
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link to="/demo" 
                    style={{
                      background: 'rgba(251,191,36,0.1)', border: `1.5px solid rgba(251,191,36,0.5)`, color: '#854d0e',
                      padding: '0.85rem 2.2rem', borderRadius: 100, fontFamily: T.sans,
                      fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
                      transition: 'all 0.2s ease', display: 'inline-block',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.background = 'rgba(251,191,36,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(251,191,36,0.1)';
                    }}
                  >
                    Try Demo Board
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <Link to="/how-it-works" 
                    style={{
                      background: 'rgba(28,25,23,0.03)', border: `1.5px solid rgba(28,25,23,0.2)`, color: T.ink,
                      padding: '0.85rem 2.2rem', borderRadius: 100, fontFamily: T.sans,
                      fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none',
                      transition: 'all 0.2s ease', display: 'inline-block',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.background = 'rgba(28,25,23,0.06)';
                      e.currentTarget.style.borderColor = `rgba(28,25,23,0.4)`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(28,25,23,0.03)';
                      e.currentTarget.style.borderColor = `rgba(28,25,23,0.2)`;
                    }}
                  >
                    See How It Works
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ── STATS STRIP ── */}
      <MetricBand />

      {/* ── BOTANICAL DIVIDER ── */}
      <FlowerSeparator />


      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-16 md:px-10 md:py-24 w-full" style={{ background: T.cream }}>
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="text-center mb-10 md:mb-14 flex flex-col items-center">
            <SectionLabel>The process</SectionLabel>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
              Three steps to speaking again
            </h2>
            <p style={{ color: T.inkSoft, fontSize: '1rem', fontWeight: 300, maxWidth: 440, margin: '0 auto' }}>
              No complex setup. No dedicated hardware. Just eyes meeting the screen.
            </p>
          </div>

          <FeatureSequence />

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/how-it-works" style={{
              color: T.teal, fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none',
              borderBottom: `2px solid rgba(15,110,86,0.25)`, paddingBottom: 2, fontFamily: T.sans,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = T.teal}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'rgba(15,110,86,0.25)'}
            >Learn more about the technology →</Link>
          </div>
        </div>
      </section>


      {/* ── SDG IMPACT ── */}
      <section className="px-6 py-24 md:px-10 md:py-32 w-full" style={{ background: T.cream }}>
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="mb-20 md:mb-24 flex flex-col items-start">
            <SectionLabel>Our global commitment</SectionLabel>
            <div className="mt-8">
              <HeroStatement />
            </div>
            <p style={{ color: T.inkSoft, fontSize: '1.2rem', fontWeight: 300, maxWidth: 540, margin: '2.5rem 0 0' }}>
              Eyra is aligned with the United Nations Sustainable Development Goals — not as a label, but as a design principle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mt-8">
            <SDGCard
              title="SDG 3"
              color="#2e7d4f"
              link="https://sdgs.un.org/goals/goal3"
            >
              Restores communication for people with ALS using only eye movement.
              This reduces isolation, supports mental well-being, and enables participation in care decisions.
              The result is improved quality of life and more dignified, patient-centered care.
            </SDGCard>

            <SDGCard
              title="SDG 10"
              color="#c43d6b"
              link="https://sdgs.un.org/goals/goal10"
            >
              Eyra replaces expensive AAC devices with software that works on existing computers.
              This removes financial and infrastructure constraints, enabling more people to communicate independently.
              The result is broader, more equitable access to assistive technology.
            </SDGCard>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="px-6 py-16 md:px-10 md:py-24 w-full" style={{ background: T.cream }}>
        <div className="max-w-[1280px] mx-auto w-full">

          {/* Human story header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
            <div className="flex flex-col items-start">
              <SectionLabel>Who we serve</SectionLabel>
              <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
                For patients, families, and clinicians
              </h2>
              <blockquote style={{
                fontFamily: T.serif, fontSize: '1.1rem', lineHeight: 1.6,
                color: T.inkSoft, fontStyle: 'italic',
                borderLeft: `2px solid ${T.teal}`, paddingLeft: '1.2rem',
                margin: '1rem 0',
              }}>
                "ALS is like a lit candle: it melts your nerves and leaves your body a pile of wax. By the end, your soul, perfectly awake, is imprisoned inside a limp husk... the man frozen inside his own flesh."
              </blockquote>
              <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.35)', marginBottom: '1rem' }}>
                — Mitch Albom, Author of 'Tuesdays with Morrie'
              </p>
              <p style={{ fontSize: '0.92rem', color: T.inkSoft, fontWeight: 300, lineHeight: 1.75, maxWidth: 420 }}>
                Over 500,000 people globally live with ALS. Many lose speech within months of diagnosis.
                The silence isn't just physical — it's the loss of self.
              </p>
            </div>
            <div className="h-[320px] md:h-[520px] w-full" style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
              <StoryIllustration />
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
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
              <motion.div
                key={c.title}
                variants={fadeUp}
                  className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-black/5 flex flex-col h-full shadow-sm"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontFamily: T.serif, fontSize: '1.15rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.88rem', color: T.inkSoft, lineHeight: 1.65, flexGrow: 1 }}>{c.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 md:px-10 md:py-24 w-full flex flex-col items-center justify-center text-center" style={{ background: T.teal, color: 'white' }}>
        <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">
          <SectionLabel light>Get started</SectionLabel>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Give someone their voice back
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 300, maxWidth: 460, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Whether you're a patient, a family member, or a hospital — we'd love to talk about how Eyra can help.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/app" style={{
              background: 'white', color: T.teal, border: 'none',
              padding: '1rem 2.8rem', borderRadius: 100, fontFamily: T.sans,
              fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Launch Eyra — it's free</Link>

            <Link to="/demo" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
              padding: '1rem 2.8rem', borderRadius: 100, fontFamily: T.sans,
              fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >View shortcuts demo</Link>
          </div>
        </div>
      </section>

      <Footer />
      <Mascot />
    </div>
  );
}
