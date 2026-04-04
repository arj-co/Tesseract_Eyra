import React from 'react';
import { motion } from 'framer-motion';

// Design Tokens (reused from Landing context)
const T = {
  cream: '#eae7e2',
  ink: '#111111',
  inkSoft: '#44403C',
  teal: '#1f6f54',
  tealLight: '#E1F5EE',
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'DM Sans', sans-serif",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12, // Stagger cards 0.12s apart
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1], // cubic-bezier(0.22,1,0.36,1)
      staggerChildren: 0.06, // Inner elements stagger 0.06s apart
    },
  },
};

const numberVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 0.2,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const descriptionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      delay: 0.1 // Delayed reveal for paragraph text
    }
  }
};

const FeatureCard = ({ number, icon, title, description }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="relative p-8 rounded-3xl bg-white border border-black/[0.03] flex flex-col h-full group overflow-hidden"
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        cursor: 'default'
      }}
    >
      {/* Subtle Background Accent - fades in behind the card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        variants={{
          visible: { 
            opacity: 0.03, 
            scale: 1,
            transition: { delay: 0.4, duration: 1 } 
          }
        }}
        className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-teal-900 pointer-events-none blur-3xl"
        style={{ backgroundColor: T.teal }}
      />

      {/* Step Number */}
      <motion.div 
        variants={numberVariants}
        className="select-none pointer-events-none"
        style={{ 
          fontFamily: T.serif, 
          fontSize: '4.5rem', 
          color: T.teal, 
          lineHeight: 1,
          left: '1.5rem',
          top: '1rem',
          position: 'absolute',
          zIndex: 0
        }}
      >
        {number}
      </motion.div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-start h-full">
        {/* Icon Container */}
        <motion.div 
          variants={iconVariants}
          whileHover={{ 
            rotate: 2.5, 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 14, 
            background: T.tealLight, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1.5rem',
            marginTop: '2rem'
          }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <motion.h3 
          variants={titleVariants}
          style={{ 
            fontFamily: T.serif, 
            fontSize: '1.35rem', 
            color: T.ink,
            marginBottom: '0.8rem',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p 
          variants={descriptionVariants}
          style={{ 
            fontSize: '0.92rem', 
            color: T.inkSoft, 
            lineHeight: 1.65, 
            fontWeight: 400,
            flexGrow: 1 
          }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function FeatureSequence() {
  const steps = [
    {
      number: '01',
      title: 'Calibrate',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        </svg>
      ),
      description: 'A 30-second alignment process that maps your specific eye geometry to screen coordinates with clinical precision.',
    },
    {
      number: '02',
      title: 'Compose',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
      ),
      description: 'Navigate our specialized keyboard by dwelling your gaze. Intelligent clusters reduce eye fatigue while increasing typing speed.',
    },
    {
      number: '03',
      title: 'Communicate',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8" />
          <path d="M8 13h6" />
        </svg>
      ),
      description: 'Convert words into voice instantly. Use pre-set phrases or custom input to speak naturally to those around you.',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-25%" }}
    >
      {steps.map((step, idx) => (
        <FeatureCard 
          key={idx}
          number={step.number}
          icon={step.icon}
          title={step.title}
          description={step.description}
        />
      ))}
    </motion.div>
  );
}
