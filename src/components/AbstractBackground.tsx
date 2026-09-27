"use client";

import { motion } from "framer-motion";

const TRACKS = [
  { top: "12%", color: "var(--status-cyan)", duration: 16, delay: 0 },
  { top: "28%", color: "var(--status-green)", duration: 22, delay: 3 },
  { top: "46%", color: "var(--status-gray)", duration: 19, delay: 6 },
  { top: "64%", color: "var(--status-orange)", duration: 25, delay: 1.5 },
  { top: "80%", color: "var(--status-red)", duration: 20, delay: 8 },
];

export default function AbstractBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-scanlines" />

      {TRACKS.map((track, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            top: track.top,
            backgroundColor: track.color,
            boxShadow: `0 0 10px ${track.color}`,
          }}
          initial={{ left: "-4%", opacity: 0 }}
          animate={{ left: "104%", opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: track.duration,
            delay: track.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-x-0 h-px bg-status-cyan/25"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, transparent 30%, var(--background) 92%)",
        }}
      />
    </div>
  );
}
