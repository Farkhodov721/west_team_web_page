import { EVENT_COLORS, type EventClass } from "@/lib/eventColors";

export type TimelineEvent = {
  cls: EventClass;
  start: number;
  end: number;
};

export default function TimelineStrip({
  duration,
  events,
}: {
  duration: number;
  events: TimelineEvent[];
}) {
  const pct = (s: number) => `${(s / duration) * 100}%`;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-8 w-full overflow-visible rounded-sm bg-muted/40">
        {events.map((ev, i) => (
          <div
            key={i}
            className="group absolute top-0 h-full"
            style={{ left: pct(ev.start), width: pct(ev.end - ev.start) }}
          >
            <div
              className="h-full w-full rounded-sm opacity-80 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: EVENT_COLORS[ev.cls] }}
            />
            <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 font-mono text-[10px] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <span style={{ color: EVENT_COLORS[ev.cls] }}>{ev.cls}</span>{" "}
              <span className="text-muted-foreground">
                {ev.start}s–{ev.end}s
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>0s</span>
        <span>{duration}s</span>
      </div>
    </div>
  );
}
