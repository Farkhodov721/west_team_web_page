"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Detection = {
  id: string;
  variant: "car" | "truck" | "pedestrian";
  color: string;
  label: string;
  left: string[];
  top: string[];
  rotate?: number[];
  opacity?: number[];
  times?: number[];
  duration: number;
  delay: number;
  repeatDelay?: number;
};

const DETECTIONS: Detection[] = [
  {
    id: "car-aligned",
    variant: "car",
    color: "var(--status-green)",
    label: "car · 0.94 · aligned",
    left: ["-8%", "108%"],
    top: ["46%", "46%"],
    rotate: [0, 0],
    duration: 8,
    delay: 0,
  },
  {
    id: "car-wrong-way",
    variant: "car",
    color: "var(--status-red)",
    label: "car · wrong way",
    left: ["108%", "-8%"],
    top: ["58%", "58%"],
    rotate: [180, 180],
    duration: 9,
    delay: 3.5,
  },
  {
    id: "truck-turning",
    variant: "truck",
    color: "var(--status-orange)",
    label: "truck · turning",
    left: ["68%", "68%", "68%", "88%", "108%"],
    top: ["-10%", "20%", "44%", "58%", "58%"],
    rotate: [90, 90, 90, 0, 0],
    opacity: [0, 1, 1, 1, 0],
    times: [0, 0.32, 0.48, 0.6, 1],
    duration: 11,
    delay: 1.2,
  },
  {
    id: "pedestrian-crossing",
    variant: "pedestrian",
    color: "var(--status-cyan)",
    label: "person · crossing",
    left: ["58%", "84%"],
    top: ["39%", "39%"],
    duration: 3.5,
    delay: 1,
    repeatDelay: 3,
  },
  {
    id: "pedestrian-jaywalking",
    variant: "pedestrian",
    color: "var(--status-red)",
    label: "person · jaywalking",
    left: ["58%", "84%"],
    top: ["50%", "50%"],
    duration: 3,
    delay: 6,
    repeatDelay: 8,
  },
];

function CarIcon({ color, variant }: { color: string; variant: "car" | "truck" }) {
  if (variant === "truck") {
    return (
      <svg
        viewBox="0 0 30 12"
        className="h-3 w-7"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      >
        <path
          d="M2,2 L25,2 L28,4.5 L28,7.5 L25,10 L2,10 L1,7.5 L1,4.5 Z"
          fill="#171c26"
          stroke={color}
          strokeWidth="1"
        />
        <line x1="9" y1="2" x2="9" y2="10" stroke={color} strokeOpacity="0.4" strokeWidth="0.6" />
        <rect x="3" y="3.5" width="4" height="5" rx="0.8" fill="rgba(180,220,255,0.3)" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 12"
      className="h-3 w-6"
      style={{ filter: `drop-shadow(0 0 3px ${color})` }}
    >
      <path
        d="M2,3 L17,3 L22,5.2 L22,6.8 L17,9 L2,9 L1,7 L1,5 Z"
        fill="#171c26"
        stroke={color}
        strokeWidth="1"
      />
      <rect x="12.5" y="4" width="4" height="4" rx="1" fill="rgba(180,220,255,0.3)" />
    </svg>
  );
}

function DetectionBox({ d }: { d: Detection }) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      initial={{ left: d.left[0], top: d.top[0], opacity: 0 }}
      animate={{
        left: d.left,
        top: d.top,
        opacity: d.opacity ?? [0, 1, 1, 0],
      }}
      transition={{
        duration: d.duration,
        delay: d.delay,
        repeat: Infinity,
        repeatDelay: d.repeatDelay ?? 0,
        ease: "linear",
        times: d.times,
      }}
    >
      <div className="relative">
        {d.variant === "pedestrian" ? (
          <div
            className="h-2.5 w-2.5 rounded-full border-2 bg-black/30"
            style={{ borderColor: d.color, boxShadow: `0 0 5px ${d.color}` }}
          />
        ) : (
          <motion.div
            animate={d.rotate ? { rotate: d.rotate } : undefined}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              repeatDelay: d.repeatDelay ?? 0,
              ease: "linear",
              times: d.times,
            }}
          >
            <CarIcon color={d.color} variant={d.variant} />
          </motion.div>
        )}
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-tight"
          style={{ color: d.color }}
        >
          {d.label}
        </span>
      </div>
    </motion.div>
  );
}

function TrafficLight({
  left,
  top,
  active,
}: {
  left: string;
  top: string;
  active: "red" | "orange" | "green";
}) {
  const order = ["red", "orange", "green"] as const;
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[2px] rounded-sm bg-black/60 p-1"
      style={{ left, top }}
    >
      {order.map((c) => {
        const isActive = c === active;
        const color = `var(--status-${c})`;
        return (
          <motion.span
            key={c}
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: isActive ? [1, 0.55, 1] : 0.15 }}
            transition={isActive ? { duration: 2.4, repeat: Infinity } : undefined}
          />
        );
      })}
    </div>
  );
}

function CenterlineSegment({
  orientation,
  cross,
  start,
  length,
}: {
  orientation: "h" | "v";
  cross: string;
  start: string;
  length: string;
}) {
  if (orientation === "h") {
    return (
      <div
        className="absolute flex flex-col gap-[1.5px]"
        style={{ top: cross, left: start, width: length, transform: "translateY(-50%)" }}
      >
        <div className="h-[1px] w-full bg-white/70" />
        <div className="h-[1px] w-full bg-white/70" />
      </div>
    );
  }
  return (
    <div
      className="absolute flex gap-[1.5px]"
      style={{ left: cross, top: start, height: length, transform: "translateX(-50%)" }}
    >
      <div className="h-full w-[1px] bg-white/70" />
      <div className="h-full w-[1px] bg-white/70" />
    </div>
  );
}

function useClock() {
  const [time, setTime] = useState("00:00:00");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function DetectionScene() {
  const time = useClock();

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border bg-[#0a0d14]">
      {/* road surface */}
      <div className="absolute inset-x-0 top-[44%] h-[22%] bg-[#161a24]" />
      <div className="absolute inset-y-0 left-[64.5%] w-[13%] bg-[#161a24]" />

      {/* solid centerlines dividing opposing traffic — gapped through the box */}
      <CenterlineSegment orientation="h" cross="55%" start="0%" length="64.5%" />
      <CenterlineSegment orientation="h" cross="55%" start="77.5%" length="22.5%" />
      <CenterlineSegment orientation="v" cross="71%" start="0%" length="44%" />
      <CenterlineSegment orientation="v" cross="71%" start="66%" length="34%" />

      {/* crosswalk — compact strip just before the box */}
      <div className="absolute" style={{ left: "64.5%", top: "35%", height: "8%", width: "13%" }}>
        {[8, 26, 44, 62, 80].map((offset) => (
          <div
            key={offset}
            className="absolute top-0 h-full bg-white/45"
            style={{ left: `${offset}%`, width: "12%" }}
          />
        ))}
      </div>

      {/* stop line — before the crosswalk, thicker solid bar */}
      <div
        className="absolute bg-white/85"
        style={{ left: "64.5%", top: "31%", width: "13%", height: "1.3%" }}
      />

      {/* traffic lights on all 4 approaches — N/S share a phase, E/W share the other */}
      <TrafficLight left="60%" top="39%" active="green" />
      <TrafficLight left="82%" top="39%" active="red" />
      <TrafficLight left="60%" top="69%" active="red" />
      <TrafficLight left="82%" top="69%" active="green" />

      {DETECTIONS.map((d) => (
        <DetectionBox key={d.id} d={d} />
      ))}

      {/* HUD chrome */}
      <div className="viewfinder-corner viewfinder-corner--tl" />
      <div className="viewfinder-corner viewfinder-corner--tr" />
      <div className="viewfinder-corner viewfinder-corner--bl" />
      <div className="viewfinder-corner viewfinder-corner--br" />

      <div className="absolute left-4 top-3 flex items-center gap-1.5 font-mono text-[10px] text-status-red">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-status-red"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        REC
      </div>
      <div className="absolute right-4 top-3 font-mono text-[10px] text-status-gray">
        CAM_04 · {time}
      </div>
    </div>
  );
}
