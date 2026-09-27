"use client";

import { motion } from "framer-motion";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RevealSection from "@/components/eda/RevealSection";
import ClipMedia from "@/components/results/ClipMedia";
import TimelineStrip, { type TimelineEvent } from "@/components/results/TimelineStrip";
import { EVENT_CLASSES, EVENT_COLORS } from "@/lib/eventColors";

// TODO: once visualize_trails.py (or equivalent) produces small annotated
// clips, drop them at public/results/<file> — ClipMedia will pick them up
// automatically and stop showing the placeholder panel. Until then, duration
// and events below are illustrative placeholder data, not real pipeline output.
const CLIPS: {
  file: string;
  videoSrc: string;
  duration: number;
  caption: string;
  events: TimelineEvent[];
}[] = [
  {
    file: "clip_01.mp4",
    videoSrc: "/results/clip_01_annotated.mp4",
    duration: 45,
    caption:
      "4-way signalized intersection, elevated angle — a stopped vehicle blocks the box during the red phase, then a pedestrian crosses early.",
    events: [
      { cls: "jaywalking", start: 5, end: 8 },
      { cls: "red_light", start: 12, end: 15 },
      { cls: "stopped_vehicle", start: 20, end: 33 },
    ],
  },
  {
    file: "clip_02.mp4",
    videoSrc: "/results/clip_02_annotated.mp4",
    duration: 62,
    caption:
      "T-junction with a marked crosswalk — includes a near-miss between a turning car and a crossing pedestrian.",
    events: [
      { cls: "jaywalking", start: 10, end: 13 },
      { cls: "near_miss", start: 30, end: 32 },
      { cls: "failure_to_yield", start: 45, end: 48 },
    ],
  },
  {
    file: "clip_03.mp4",
    videoSrc: "/results/clip_03_annotated.mp4",
    duration: 38,
    caption:
      "Roundabout approach, overhead angle — an illegal turn against the roundabout flow, followed by brief congestion.",
    events: [
      { cls: "illegal_turn", start: 8, end: 12 },
      { cls: "congestion", start: 15, end: 30 },
    ],
  },
  {
    file: "clip_04.mp4",
    videoSrc: "/results/clip_04_annotated.mp4",
    duration: 55,
    caption:
      "Straight road segment with a pedestrian crossing, side-mounted camera — a jaywalker outside the marked zone, plus a solid-line lane change.",
    events: [
      { cls: "jaywalking", start: 20, end: 24 },
      { cls: "solid_line_crossing", start: 35, end: 37 },
      { cls: "stop_line", start: 40, end: 41 },
    ],
  },
];

// TODO: replace with a real per-frame risk trace from the Part B causal loop
// for this clip, once it's been run.
const RISK_TRACE = Array.from({ length: 63 }, (_, t) => {
  const base = 0.05 + 0.03 * Math.sin(t / 6);
  const spike = Math.exp(-Math.pow(t - 31, 2) / 8) * 0.75;
  return { t, risk: Math.max(0, Math.min(1, base + spike)) };
});

// TODO: these are illustrative categories, not confirmed findings. Replace
// each with a real example: which clip, what timestamp range, and a one-line
// description of what the rule module got wrong (attach a screenshot if you
// have one).
const LIMITATIONS = [
  {
    title: "Whole-clip false positives",
    description:
      "TODO: name a clip where a rule module fires for the entire duration instead of a bounded segment (e.g. congestion never resolving), and note the likely cause (missing hysteresis, bad threshold).",
  },
  {
    title: "Lane geometry gaps at open intersections",
    description:
      "TODO: name a clip where hand-drawn lane polygons don't cover part of the junction (e.g. a wide roundabout or an unmarked shoulder), causing missed or misattributed events there.",
  },
  {
    title: "Traffic-light misclassification under glare",
    description:
      "TODO: note a clip/timestamp where HSV thresholding misreads the light color (backlight, motion blur, or a green-tinted red at dusk) and what that caused downstream (a missed or false red_light event).",
  },
];

function RiskTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 font-mono text-xs">
      <div className="text-muted-foreground">t = {label}s</div>
      <div className="text-status-cyan">risk = {payload[0].value.toFixed(2)}</div>
    </div>
  );
}

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ResultsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <span className="font-mono text-xs uppercase tracking-wide text-status-orange">
          Results
        </span>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          What the pipeline sees, on the sample clips.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Concrete output on the 4 sample videos — including where it
          doesn&apos;t work yet.
        </p>
        <div className="mt-2 flex items-start gap-2 rounded-md border border-status-orange/30 bg-status-orange/5 px-4 py-3">
          <Badge
            variant="outline"
            className="h-auto shrink-0 border-status-orange/50 px-2 py-0.5 font-mono text-[0.65rem] text-status-orange"
          >
            placeholder data
          </Badge>
          <p className="text-xs leading-relaxed text-muted-foreground">
            No annotated output videos or prediction files exist in the repo
            yet, so the clips below show a placeholder panel and the
            timelines/risk trace use illustrative, clearly-marked sample
            data. Drop real annotated clips into{" "}
            <code className="font-mono">public/results/</code> and they will
            render automatically.
          </p>
        </div>
      </motion.div>

      {/* 1. Per-video results */}
      <motion.div
        variants={cardContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-8 lg:grid-cols-2"
      >
        {CLIPS.map((clip) => (
          <motion.div key={clip.file} variants={cardItem}>
            <Card className="flex h-full flex-col gap-4 border border-border/70 bg-card/60 p-0 shadow-none">
              <ClipMedia videoSrc={clip.videoSrc} clip={clip.file} />
              <CardContent className="flex flex-col gap-3 pb-4">
                <CardTitle className="font-mono text-sm">{clip.file}</CardTitle>
                <TimelineStrip duration={clip.duration} events={clip.events} />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {clip.caption}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Separator />

      {/* 2. Risk score example */}
      <RevealSection className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold">
          Accident-risk score over time
        </h2>
        <p className="text-sm text-muted-foreground">
          Risk score for <span className="font-mono">clip_02.mp4</span>,
          computed frame-by-frame from time-to-collision and braking signals
          — with no lookahead: each point only ever sees frames up to that
          moment.
        </p>
        <Card className="border border-border/70 bg-card/60 shadow-none">
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RISK_TRACE} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={32}
                    label={{ value: "seconds", position: "insideBottom", offset: -4, fill: "var(--muted-foreground)", fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<RiskTooltip />} cursor={{ stroke: "var(--status-cyan)", strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="var(--status-cyan)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <p className="font-mono text-[11px] leading-relaxed text-status-orange/80">
          &gt; placeholder data — TODO: replace with a real per-frame risk
          trace from the Part B causal loop once it has been run on this
          clip.
        </p>
      </RevealSection>

      <Separator />

      {/* 3. Known limitations */}
      <RevealSection className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold">Known limitations</h2>
          <p className="text-sm text-muted-foreground">
            Where the current pipeline is noisy or wrong — worth stating
            plainly rather than glossing over.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {LIMITATIONS.map((item) => (
            <Card
              key={item.title}
              className="border border-dashed border-border/70 bg-card/40 shadow-none"
            >
              <CardHeader>
                <CardTitle className="text-sm">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-1 text-xs leading-relaxed text-status-orange/80">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </RevealSection>

      <Separator />

      {/* 4. Legend */}
      <RevealSection className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold">How to read this</h2>
        <div className="flex flex-wrap gap-2">
          {EVENT_CLASSES.map((cls) => (
            <Badge
              key={cls}
              variant="outline"
              className="h-auto gap-1.5 border-border/70 px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: EVENT_COLORS[cls] }}
              />
              {cls}
            </Badge>
          ))}
        </div>
      </RevealSection>
    </div>
  );
}
