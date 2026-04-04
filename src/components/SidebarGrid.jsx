"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const SECTIONS = 8; // number of ticks — tune to match your page sections

function Tick({ index, progress }) {
  const total = SECTIONS;
  const start = index / total;
  const mid   = start + 0.5 / total;
  const end   = (index + 1) / total;

  // Raw transforms from scroll progress
  const rawWidth = useTransform(
    progress,
    [start, mid, end],
    [14, 26, 14]
  );
  const rawOpacity = useTransform(
    progress,
    [start, mid, end],
    [0, 1, 0]
  );
  const rawBg = useTransform(
    progress,
    [start, mid, end],
    ["#b9b4ac", "#2e7d4f", "#b9b4ac"]
  );

  // Spring-smooth the width for a springy feel
  const width = useSpring(rawWidth, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{
        width,
        opacity: rawOpacity,
        backgroundColor: rawBg,
        height: 3,
        borderRadius: 999,
        minWidth: 14,
      }}
    />
  );
}

export default function SidebarGrid() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Faint vertical guide line */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(0,0,0,0.08)",
          borderRadius: 999,
        }}
      />

      {/* Ticks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        {Array.from({ length: SECTIONS }).map((_, i) => (
          <Tick key={i} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}
