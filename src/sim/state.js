// @ts-nocheck
import { DEFAULT_LIGHTS, DEFAULT_MARKINGS } from "./constants.js";

const listeners = new Set();

export const state = {
  started: false,
  mode: "walk",
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
};

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
