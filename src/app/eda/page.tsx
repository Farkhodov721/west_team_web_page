"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RevealSection from "@/components/eda/RevealSection";
import PlaceholderNote from "@/components/eda/PlaceholderNote";
import { EVENT_COLORS, type EventClass } from "@/lib/eventColors";

const STATUS_COLORS = [
  "var(--status-cyan)",
  "var(--status-green)",
  "var(--status-orange)",
  "var(--status-red)",
  "var(--status-gray)",
];

// TODO: replace with a real samples/ directory listing (name, duration via
// ffprobe/cv2, resolution, fps) once sample footage is checked into the repo.
const SAMPLE_CLIPS = [
  {
    file: "clip_01.mp4",
    resolution: "1920x1080",
    fps: 30,
    duration: "45s",
    note: "4-way signalized intersection, elevated camera angle",
  },
  {
    file: "clip_02.mp4",
    resolution: "1280x720",
    fps: 25,
    duration: "62s",
    note: "T-junction with marked crosswalk, roadside camera",
  },
  {
    file: "clip_03.mp4",
    resolution: "1920x1080",
    fps: 30,
    duration: "38s",
    note: "Roundabout approach, overhead angle",
  },
  {
    file: "clip_04.mp4",
    resolution: "1280x720",
    fps: 24,
    duration: "55s",
    note: "Straight road segment with pedestrian crossing, side-mounted camera",
  },
];

// TODO: replace with real YOLO detection counts aggregated across samples/.
const OBJECT_COUNTS = [
  { cls: "car", count: 1240 },
  { cls: "pedestrian", count: 380 },
  { cls: "motorcycle", count: 210 },
  { cls: "truck", count: 95 },
  { cls: "bus", count: 40 },
];

// TODO: replace with real counts from examples/*.json / predictions_samples.json
// once rule-evaluation output exists for the sample set.
const EVENT_COUNTS = [
  { cls: "congestion", count: 320 },
  { cls: "jaywalking", count: 145 },
  { cls: "stopped_vehicle", count: 130 },
  { cls: "solid_line_crossing", count: 90 },
  { cls: "illegal_turn", count: 75 },
  { cls: "stop_line", count: 60 },
  { cls: "red_light", count: 55 },
  { cls: "wrong_way", count: 40 },
  { cls: "failure_to_yield", count: 35 },
  { cls: "near_miss", count: 20 },
  { cls: "illegal_u_turn", count: 15 },
  { cls: "road_obstacle", count: 10 },
  { cls: "accident", count: 3 },
  { cls: "fire_smoke", count: 1 },
].sort((a, b) => b.count - a.count);

// TODO: replace with real ByteTrack output stats (avg track length, tracks/video).
const TRACK_STATS = [
  { label: "avg track length", value: "4.2s", sub: "≈ 126 frames @ 30fps" },
  { label: "tracks per video", value: "38", sub: "average across 4 clips" },
  { label: "total tracks", value: "152", sub: "across sample set" },
  { label: "longest track", value: "18.6s", sub: "single vehicle, clip_03" },
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 font-mono text-xs">
      <div className="text-muted-foreground">{label}</div>
      <div className="text-foreground">{payload[0].value}</div>
    </div>
  );
}

export default function EdaPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <span className="font-mono text-xs uppercase tracking-wide text-status-orange">
          Exploratory data analysis
        </span>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          What the sample footage looks like.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          A first look at the sample clips and the pipeline&apos;s expected
          output shape, before the full detection and rule-evaluation runs
          are in.
        </p>
        <div className="mt-2 flex items-start gap-2 rounded-md border border-status-orange/30 bg-status-orange/5 px-4 py-3">
          <Badge
            variant="outline"
            className="h-auto shrink-0 border-status-orange/50 px-2 py-0.5 font-mono text-[0.65rem] text-status-orange"
          >
            sample data
          </Badge>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The pipeline hasn&apos;t been run on real footage yet, so every
            chart below uses clearly-labeled placeholder numbers that
            illustrate the intended shape of the output. Real numbers will
            replace these once <code className="font-mono">samples/</code>,{" "}
            <code className="font-mono">examples/*.json</code>, and{" "}
            <code className="font-mono">predictions_samples.json</code> exist
            in the repo.
          </p>
        </div>
      </motion.div>

      {/* 1. Dataset overview */}
      <RevealSection className="flex flex-col gap-6">
        <h2 className="font-heading text-xl font-semibold">Dataset overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_CLIPS.map((clip) => (
            <Card key={clip.file} className="border border-border/70 bg-card/60 shadow-none">
              <CardHeader>
                <CardTitle className="font-mono text-sm">{clip.file}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pt-1 text-xs text-muted-foreground">
                <span>{clip.resolution} · {clip.fps}fps · {clip.duration}</span>
                <span className="mt-1 text-foreground/80">{clip.note}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <PlaceholderNote>
          TODO: replace with a real samples/ directory listing (name, duration
          via ffprobe/cv2, resolution, fps).
        </PlaceholderNote>
      </RevealSection>

      <Separator />

      {/* 2. Object detection stats */}
      <RevealSection className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold">
          Object detection stats
        </h2>
        <p className="text-sm text-muted-foreground">
          Detected object counts by class across the sample set.
        </p>
        <Card className="border border-border/70 bg-card/60 shadow-none">
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OBJECT_COUNTS} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="cls"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {OBJECT_COUNTS.map((entry, i) => (
                      <Cell key={entry.cls} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <PlaceholderNote>
          TODO: replace with real YOLO detection counts aggregated across
          samples/.
        </PlaceholderNote>
      </RevealSection>

      <Separator />

      {/* 3. Event class distribution */}
      <RevealSection className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold">
          Event class distribution
        </h2>
        <p className="text-sm text-muted-foreground">
          Event counts across all 14 official classes — class imbalance is
          expected: common events like congestion vastly outnumber rare ones
          like accidents.
        </p>
        <Card className="border border-border/70 bg-card/60 shadow-none">
          <CardContent className="pt-4">
            <div className="h-[420px] w-full min-w-[420px] overflow-x-auto sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={EVENT_COUNTS}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="cls"
                    type="category"
                    width={140}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                  <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                    {EVENT_COUNTS.map((entry) => (
                      <Cell key={entry.cls} fill={EVENT_COLORS[entry.cls as EventClass]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <PlaceholderNote>
          TODO: replace with real counts from examples/*.json /
          predictions_samples.json once rule-evaluation output exists for the
          sample set.
        </PlaceholderNote>
      </RevealSection>

      <Separator />

      {/* 4. Track quality */}
      <RevealSection className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold">Track quality</h2>
        <p className="text-sm text-muted-foreground">
          How long and how many tracks ByteTrack produces per video.
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
          {TRACK_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 bg-background px-5 py-6">
              <span className="font-heading text-2xl font-semibold text-status-green">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="font-mono text-[10px] text-status-gray">{stat.sub}</span>
            </div>
          ))}
        </div>
        <PlaceholderNote>
          TODO: replace with real ByteTrack output stats (avg track length,
          tracks/video) once tracking is run on sample footage.
        </PlaceholderNote>
      </RevealSection>
    </div>
  );
}
