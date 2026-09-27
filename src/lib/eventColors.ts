export const EVENT_CLASSES = [
  "accident",
  "near_miss",
  "red_light",
  "wrong_way",
  "illegal_u_turn",
  "stopped_vehicle",
  "jaywalking",
  "failure_to_yield",
  "illegal_turn",
  "solid_line_crossing",
  "stop_line",
  "congestion",
  "road_obstacle",
  "fire_smoke",
] as const;

export type EventClass = (typeof EVENT_CLASSES)[number];

// Severity/category-based mapping onto the site's status palette:
// red = severe/dangerous, orange = rule violation, gray = passive/environmental,
// cyan = pedestrian-related. Kept in one place so /eda and /results stay consistent.
export const EVENT_COLORS: Record<EventClass, string> = {
  accident: "var(--status-red)",
  near_miss: "var(--status-orange)",
  red_light: "var(--status-red)",
  wrong_way: "var(--status-red)",
  illegal_u_turn: "var(--status-orange)",
  stopped_vehicle: "var(--status-gray)",
  jaywalking: "var(--status-cyan)",
  failure_to_yield: "var(--status-orange)",
  illegal_turn: "var(--status-orange)",
  solid_line_crossing: "var(--status-gray)",
  stop_line: "var(--status-orange)",
  congestion: "var(--status-gray)",
  road_obstacle: "var(--status-gray)",
  fire_smoke: "var(--status-red)",
};
