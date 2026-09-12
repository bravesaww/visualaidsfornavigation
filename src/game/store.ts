import { create } from "zustand";
import {
  DEFAULT_LIGHTS,
  DEFAULT_MARKINGS,
  type Binocs,
  type LightLevel,
  type Mode,
  type PapiMode,
  type TrafficMode,
  type Weather,
} from "./constants";

export type Hud = {
  dist: string;
  alt: string;
  ias: string;
  gs: string;
  phase: string;
  heading: string;
};

type Store = {
  started: boolean;
  mode: Mode;
  weather: Weather;
  night: boolean;
  moveSpeed: number;
  lookSens: number;
  appSpeedKt: number;
  glideslope: number;
  fov: number;
  traffic: TrafficMode;
  walkAxis: { x: number; y: number };
  restartToken: number;
  markings: typeof DEFAULT_MARKINGS;
  lights: typeof DEFAULT_LIGHTS;
  lightLevel: LightLevel;
  papiMode: PapiMode;
  binocs: Binocs;
  hud: Hud;
  panel: boolean;
  set: (p: Partial<Store>) => void;
};

export const useSim = create<Store>((set) => ({
  started: false,
  mode: "walk",
  weather: "clear",
  night: false,
  moveSpeed: 1,
  lookSens: 1,
  appSpeedKt: 138,
  glideslope: 3,
  fov: 60,
  traffic: "off",
  walkAxis: { x: 0, y: 0 },
  restartToken: 0,
  markings: { ...DEFAULT_MARKINGS },
  lights: { ...DEFAULT_LIGHTS },
  lightLevel: 2,
  papiMode: "onPath",
  binocs: 1,
  hud: {
    dist: "—",
    alt: "—",
    ias: "—",
    gs: "3.0°",
    phase: "STANDBY",
    heading: "090",
  },
  panel: false,
  set: (p) => set(p),
}));
