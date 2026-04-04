import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Mascot from '../components/Mascot';
import FeatureSequence from '../components/FeatureSequence';
import SidebarGrid from '../components/SidebarGrid';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';

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
  cream: '#F5F2EC', // Warm clinical cream
  card: '#FAF8F4',  // Illustration card base
  ink: '#111111',
  inkSoft: '#44403C',
  teal: '#2E7D4F',  // Accent text / SDG3 green
  tealMid: '#1D9E75',
  tealLight: '#E1F5EE',
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
`;

/* ─── Caregiver + Patient Image ─── */
const StoryIllustration = () => (
  <img
    src="/patients.jpeg"
    alt="Caregiver pushing patient in a wheelchair"
    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
  />
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

function GazeBeam() {
  return (
    <div 
      className="absolute left-0 right-0 pointer-events-none overflow-hidden"
      style={{
        height: '120px',
        top: '35%',
        background: `linear-gradient(
          90deg,
          transparent,
          rgba(46,125,79,0.06),
          transparent
        )`,
        filter: 'blur(40px)',
        opacity: 0.6,
        zIndex: 1
      }}
    />
  );
}

function SDGCard({ title, color, link, children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)

  const rotateX = useTransform(mouseYSpring, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseXSpring, [-300, 300], [-10, 10])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const mx = px - rect.width / 2
    const my = py - rect.height / 2

    x.set(mx)
    y.set(my)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="w-full h-[540px] mb-8 md:mb-0" style={{ perspective: "2000px" }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        className="relative w-full h-full cursor-pointer group rounded-[40px] border-2 bg-white overflow-hidden shadow-sm"
        whileHover={{ scale: 1.01 }}
        style={{
          rotateX,
          rotateY,
          borderColor: color,
          background: '#f6f3ee',
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.04)',
          transformStyle: "preserve-3d"
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
      </motion.div>
    </div>
  )
}

/* ─── Hero Illustration with Float + Tilt ─── */
function HeroIllustration({ mouseX, mouseY }) {
  const rotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.42, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[350px] md:h-[520px]"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ delay: 0.9, duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="p-3 group"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          width: '100%',
          height: '100%',
          borderRadius: 32,
          background: `linear-gradient(180deg, #FAF8F4 0%, #F2F6F3 100%)`,
          boxShadow: '0 32px 80px rgba(15,110,86,0.12), inset 0 0 0 1px rgba(255,255,255,0.4)',
        }}
      >
        <div className="w-full h-full rounded-[20px] overflow-hidden">
            <img 
              src="/patients.jpeg" 
              alt="Eyra Hero Caregiver and Patient" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }} 
              className="group-hover:scale-105"
            />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Count-up number hook ─── */
function useCountUp(target, duration = 1.6, delay = 0, inView = false) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const controls = animate(mv, target, {
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '2rem 2.5rem', cursor: 'default',
        position: 'relative', flex: 1,
      }}
    >
      {/* Number */}
      <motion.div
        animate={inView ? { color: T.teal } : { color: T.teal }}
        style={{
          fontFamily: T.serif,
          fontSize,
          lineHeight: 1,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          transition: 'filter 0.3s',
        }}
        whileHover={{ filter: 'brightness(1.2)' }}
      >
        {prefix}{target === 500000 ? count.toLocaleString('en-IN') : count}{suffix}
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: delay + 0.2, ease: 'easeOut' }}
        style={{
          fontSize: '0.88rem',
          color: T.inkSoft,
          fontWeight: 300,
          textAlign: 'center',
          maxWidth: 160,
          lineHeight: 1.4,
          fontFamily: T.sans,
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

/* ─── Animated vertical divider ─── */
function RevealDivider({ delay = 0, inView }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 1,
        height: '40%',
        background: 'rgba(0,0,0,0.08)',
        alignSelf: 'center',
        transformOrigin: 'bottom',
        flexShrink: 0,
        display: 'none',
      }}
      className="md-divider"
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
    <section ref={ref} style={{ padding: '4rem 1.5rem', background: 'white' }}>
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

          {/* Background highlight sweep */}
          <motion.div
            animate={inView ? { x: ['−100%', '200%'] } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 0.5 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(46,125,79,0.04) 50%, transparent 100%)',
              pointerEvents: 'none', zIndex: 0,
              width: '60%',
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const heroRotateX = useTransform(mouseYSpring, [-300, 300], [2, -2]);
  const heroRotateY = useTransform(mouseXSpring, [-300, 300], [-3, 3]);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
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
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: T.cream,
          overflow: 'hidden',
          padding: '0 2.5rem',
        }}
      >
        {/* Background Drift Layer */}
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `
              radial-gradient(900px 500px at 75% 25%, rgba(46,125,79,0.12), transparent 70%),
              radial-gradient(700px 400px at 10% 80%, rgba(0,0,0,0.06), transparent 70%)
            `,
            backgroundSize: '150% 150%',
          }}
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"] 
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <GridBackground />
        <GazeBeam />

        <motion.div 
          animate={{ scale: [1, 1.003, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            rotateX: heroRotateX, 
            rotateY: heroRotateY, 
            perspective: '2000px',
            transformStyle: 'preserve-3d',
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
          }}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10"
        >
          {/* Left */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel>Assistive Communication Technology</SectionLabel>
            </motion.div>

            <div className="relative mb-6">
              {/* Headline Highlight */}
              <div className="absolute -inset-x-8 -inset-y-4 pointer-events-none opacity-50" style={{
                background: `linear-gradient(90deg, rgba(46,125,79,0.08), transparent 60%)`,
                zIndex: -1
              }} />
              
              <h1 style={{
                fontFamily: T.serif, fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
                lineHeight: 1.08, letterSpacing: '-0.02em',
                color: T.ink,
              }}>
                <SpoilerLine yOffset={30} delay={0.05} duration={0.8}>A voice for every </SpoilerLine>
                <div className="inline-block relative ml-2">
                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="inline-block"
                  >
                    <em style={{ fontStyle: 'italic', color: T.teal }}>gaze</em>
                  </motion.div>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      originX: 0,
                      position: 'absolute',
                      bottom: '8px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: T.teal,
                      opacity: 0.6
                    }}
                  />
                </div>
              </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.8 }}
              style={{
                fontSize: '1.05rem', color: T.inkSoft, fontWeight: 300,
                lineHeight: 1.75, marginBottom: '2.2rem', maxWidth: 440,
              }}
            >
              Eyra is a browser-based communication tool for people living with ALS — no hardware, no installation.
              Just a webcam and your eyes.
            </motion.p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.2rem' }}>
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Link to="/app" style={{
                  background: T.ink, color: 'white', padding: '0.88rem 2.2rem',
                  borderRadius: 100, fontFamily: T.sans, fontSize: '0.95rem',
                  fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s',
                  display: 'inline-block',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = T.teal}
                  onMouseLeave={e => e.currentTarget.style.background = T.ink}
                >Launch Eyra</Link>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <Link to="/how-it-works" style={{
                  background: 'none', border: `1.5px solid ${T.ink}`, color: T.ink,
                  padding: '0.85rem 2rem', borderRadius: 100, fontFamily: T.sans,
                  fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none',
                  transition: 'all 0.2s', display: 'inline-block',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = T.teal; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.ink; e.currentTarget.style.color = T.ink; }}
                >See How It Works</Link>
              </motion.div>
            </div>

            {/* SDG trust badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}
            >
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
            </motion.div>
          </div>

          {/* Right – illustration */}
          <HeroIllustration mouseX={mouseXSpring} mouseY={mouseYSpring} />
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 20,
          }}
        >
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkSoft, opacity: 0.45, fontFamily: T.sans }}>scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 1,
              height: 32,
              background: `linear-gradient(to bottom, ${T.teal}, transparent)`,
              opacity: 0.5,
              borderRadius: 999,
            }}
          />
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <MetricBand />

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-16 md:px-10 md:py-24 w-full">
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
      <section className="px-6 py-16 md:px-10 md:py-24 w-full" style={{ background: 'white' }}>
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
            <div className="h-[260px] md:h-[380px] w-full" style={{ borderRadius: 20, overflow: 'hidden' }}>
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
                className="p-8 rounded-2xl bg-white border border-black/5 flex flex-col h-full shadow-sm"
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
          <Link to="/app" style={{
            background: 'white', color: T.teal, border: 'none',
            padding: '1rem 2.8rem', borderRadius: 100, fontFamily: T.sans,
            fontSize: '1.05rem', fontWeight: 500, textDecoration: 'none', display: 'inline-block',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Launch Eyra — it's free</Link>
        </div>
      </section>

      <Footer />
      <Mascot />
    </div>
  );
}
