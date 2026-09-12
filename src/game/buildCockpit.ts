import * as THREE from "three";
import type { Mats } from "./materials";

export type CockpitVM = {
  group: THREE.Group;
  pfd: HTMLCanvasElement;
  nd: HTMLCanvasElement;
  pfdTex: THREE.CanvasTexture;
  ndTex: THREE.CanvasTexture;
};

/** Unused — approach is a clear camera, no cockpit plate. */
export function buildCockpitViewmodel(_mats: Mats): CockpitVM {
  const group = new THREE.Group();
  const pfd = document.createElement("canvas");
  const nd = document.createElement("canvas");
  return {
    group,
    pfd,
    nd,
    pfdTex: new THREE.CanvasTexture(pfd),
    ndTex: new THREE.CanvasTexture(nd),
  };
}

export function drawPfd(_canvas: HTMLCanvasElement, _d: Record<string, number>) {}
export function drawNd(_canvas: HTMLCanvasElement, _d: Record<string, unknown>) {}
