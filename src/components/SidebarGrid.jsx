"use client";

import { useEffect, useRef } from "react";

const SECTIONS = 8;

export default function SidebarGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      const ticks = el.querySelectorAll(".sidebar-tick");
      ticks.forEach((tick, i) => {
        const start = i / SECTIONS;
        const mid   = start + 0.5 / SECTIONS;
        const end   = (i + 1) / SECTIONS;

        let opacity, width;
        if (progress <= start) {
          opacity = 0; width = 14;
        } else if (progress <= mid) {
          const t = (progress - start) / (mid - start);
          opacity = t; width = 14 + t * 12;
        } else if (progress <= end) {
          const t = (progress - mid) / (end - mid);
          opacity = 1 - t; width = 26 - t * 12;
        } else {
          opacity = 0; width = 14;
        }

        tick.style.opacity = opacity;
        tick.style.width   = width + "px";
        tick.style.backgroundColor = opacity > 0.5 ? "#2e7d4f" : "#b9b4ac";
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
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
          <div
            key={i}
            className="sidebar-tick"
            style={{
              width: 14,
              height: 3,
              borderRadius: 999,
              minWidth: 14,
              backgroundColor: "#b9b4ac",
              opacity: 0,
              willChange: "opacity, width",
            }}
          />
        ))}
      </div>
    </div>
  );
}
