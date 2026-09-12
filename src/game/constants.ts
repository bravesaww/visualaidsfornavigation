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
  linkXs: [-720, -240, 240, 720] as const,
  linkNames: ["E", "D", "C", "B"] as const,
};

export type Mode = "walk" | "approach" | "noclip" | "tower";
export type TrafficMode = "off" | "arriving" | "departing";

export type Weather =
  | "clear"
  | "clouds"
  | "heavyClouds"
  | "moonlight"
  | "storm"
  | "drizzle"
  | "rain"
  | "heavyRain";

export const WEATHER_OPTIONS: { id: Weather; label: string }[] = [
  { id: "clear", label: "Clear sky" },
  { id: "clouds", label: "Clouds" },
  { id: "heavyClouds", label: "Heavy clouds" },
  { id: "moonlight", label: "Moonlight" },
  { id: "storm", label: "Storm" },
  { id: "drizzle", label: "Drizzle" },
  { id: "rain", label: "Rain" },
  { id: "heavyRain", label: "Heavy rain" },
];

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

export type LightLevel = 1 | 2 | 3;
export type PapiMode = "auto" | "high" | "slightHigh" | "onPath" | "slightLow" | "low";
export type Binocs = 1 | 2 | 3 | 4 | 5;

export const PAPI_OPTIONS: { id: PapiMode; label: string; hint: string }[] = [
  { id: "auto", label: "Auto", hint: "Follows aircraft path" },
  { id: "high", label: "4 white", hint: "Well above path" },
  { id: "slightHigh", label: "3W / 1R", hint: "Slightly high" },
  { id: "onPath", label: "2W / 2R", hint: "On 3° path" },
  { id: "slightLow", label: "1W / 3R", hint: "Slightly low" },
  { id: "low", label: "4 red", hint: "Well below path" },
];

export const MARKING_INFO: Record<string, { label: string; dim: string }> = {
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

export const LIGHT_INFO: Record<string, { label: string; dim: string }> = {
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
