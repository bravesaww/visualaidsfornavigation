import * as THREE from "three";
import { buildAirliner } from "./buildAirliner";
import { RWY, TAXI, type TrafficMode } from "./constants";
import type { Mats } from "./materials";

export type Traffic = {
  group: THREE.Group;
  ac: THREE.Group;
  t: number;
};

export function buildTraffic(mats: Mats): Traffic {
  const group = new THREE.Group();
  const ac = buildAirliner(mats, 1.08);
  ac.visible = false;
  group.add(ac);
  return { group, ac, t: 0 };
}

export function updateTraffic(tr: Traffic, dt: number, mode: TrafficMode) {
  const half = RWY.length / 2;
  if (mode === "off") {
    tr.ac.visible = false;
    return;
  }
  tr.ac.visible = true;
  tr.t += dt * (mode === "arriving" ? 0.022 : 0.03);
  if (tr.t > 1.05) tr.t = 0;
  const u = tr.t;
  const taxiZ = TAXI.parallelZ;
  const landX = -half + RWY.length * 0.75;

  if (mode === "arriving") {
    if (u < 0.42) {
      const p = u / 0.42;
      const dist = 5200 * (1 - p);
      const gs = 3 * (Math.PI / 180);
      tr.ac.position.set(-half - dist, Math.max(4.3, dist * Math.tan(gs) + 8), 0);
      tr.ac.rotation.set(-0.05, Math.PI, 0);
    } else if (u < 0.5) {
      const p = (u - 0.42) / 0.08;
      tr.ac.position.set(-half + p * 120, 4.3 + (1 - p) * 8, 0);
      tr.ac.rotation.set(0.02, Math.PI, 0);
    } else if (u < 0.72) {
      const p = (u - 0.5) / 0.22;
      tr.ac.position.set(-half + 120 + p * (landX + half - 120), 4.3, 0);
      tr.ac.rotation.set(0, Math.PI, 0);
    } else if (u < 0.84) {
      const p = (u - 0.72) / 0.12;
      const yaw = Math.PI + p * (Math.PI / 2);
      tr.ac.position.set(landX, 4.3, p * taxiZ);
      tr.ac.rotation.set(0, yaw, 0);
    } else {
      const p = (u - 0.84) / 0.21;
      tr.ac.position.set(landX + p * 380, 4.3, taxiZ);
      tr.ac.rotation.set(0, Math.PI * 1.5, 0);
    }
  } else {
    if (u < 0.18) {
      tr.ac.position.set(-half + 90, 4.3, 0);
      tr.ac.rotation.set(0, Math.PI, 0);
    } else if (u < 0.48) {
      const p = (u - 0.18) / 0.3;
      tr.ac.position.set(-half + 90 + p * (half + 220), 4.3 + p * p * 180, 0);
      tr.ac.rotation.set(-0.12 * p, Math.PI, 0);
    } else {
      const p = (u - 0.48) / 0.57;
      tr.ac.position.set(half + 220 + p * 4200, 184 + p * 400, 0);
      tr.ac.rotation.set(-0.08, Math.PI, 0);
    }
  }
}
