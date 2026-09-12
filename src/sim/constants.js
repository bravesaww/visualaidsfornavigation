// @ts-nocheck
export const RWY = {
  length: 2440,
  width: 45,
  heading09: 90,
  stopway: 60,
  clearway: 300,
};

export const TAXI = {
  width: 23,
  parallelZ: 95,
  linkXs: [-720, -240, 240, 720],
  linkNames: ["E", "D", "C", "B"],
};

export const DEFAULT_MARKINGS = {
  centerline: true,
  threshold: true,
  aiming: true,
  tdz: true,
  sides: true,
  numbers: true,
  taxiLines: true,
  hold: true,
  signs: true,
  areas: true,
};

export const DEFAULT_LIGHTS = {
  edge: true,
  threshold: true,
  end: true,
  centerline: true,
  tdz: true,
  als: true,
  papi: true,
  taxi: true,
  stopbar: true,
  rabbit: true,
};

export const PAPI_OPTIONS = [
  { id: "auto", label: "Auto", hint: "Follows aircraft path" },
  { id: "high", label: "4 white", hint: "Well above path" },
  { id: "slightHigh", label: "3W / 1R", hint: "Slightly high" },
  { id: "onPath", label: "2W / 2R", hint: "On 3° path" },
  { id: "slightLow", label: "1W / 3R", hint: "Slightly low" },
  { id: "low", label: "4 red", hint: "Well below path" },
];

export const MARKING_INFO = {
  centerline: { label: "Centre-line", dim: "White · 30 m × 0.90 m, 20 m gap" },
  threshold: { label: "Threshold", dim: "White · 12 bars, 30 m × 1.80 m" },
  aiming: { label: "Aiming point", dim: "White · 60 m × 10 m at 400 m" },
  tdz: { label: "Touchdown zone", dim: "White · 22.5 m × 3 m, 150 m spacing" },
  sides: { label: "Side stripes", dim: "White · 0.90 m wide" },
  numbers: { label: "09 / 27", dim: "White · 9 m high designation" },
  taxiLines: { label: "Taxiway centre-line", dim: "Yellow · 0.30 m" },
  hold: { label: "Holding points", dim: "Yellow pattern A · CAT III" },
  signs: { label: "Info / location signs", dim: "Yellow/black · red mandatory" },
  areas: { label: "Clearway / stopway / ASDA", dim: "SWY 60 m · CWY 300 m · ASDA 2500 m" },
};

export const LIGHT_INFO = {
  edge: { label: "Edge", dim: "White · 60 m spacing" },
  threshold: { label: "Threshold", dim: "Green · wing bar" },
  end: { label: "Runway end", dim: "Red" },
  centerline: { label: "Centre-line", dim: "White → alt. → red (last 300 m)" },
  tdz: { label: "TDZ CAT III", dim: "White · 30 m, first 900 m" },
  als: { label: "ALS CAT III", dim: "White · 900 m with crossbars" },
  papi: { label: "PAPI", dim: "Red / white · 4 units, left of 09" },
  taxi: { label: "Taxiway edge", dim: "Blue · 60 m" },
  stopbar: { label: "Stop bars", dim: "Red · CAT III hold" },
  rabbit: { label: "Sequenced flashers", dim: "White · 60 m, approach" },
};

export const MODES = [
  {
    id: "walk",
    title: "Walk",
    kicker: "On the strip",
    body: "First-person on the runway. WASD to walk, click to look.",
    keys: "WASD · Shift sprint · click look",
  },
  {
    id: "approach",
    title: "Approach",
    kicker: "On the glideslope",
    body: "Fly the ILS CAT III to runway 09 from 2 NM through flare, rollout and taxi.",
    keys: "Drag look · speed in settings",
  },
  {
    id: "noclip",
    title: "Noclip",
    kicker: "Free camera",
    body: "Unconstrained fly-through. Inspect lighting and markings from any angle.",
    keys: "WASD · Q/E up/down · Shift boost",
  },
  {
    id: "tower",
    title: "Tower",
    kicker: "Visual cab",
    body: "Seated in the control room watching arrivals and departures.",
    keys: "Look · WASD lean · Space binoculars",
  },
];
