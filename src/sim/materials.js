// @ts-nocheck
import * as THREE from "three";
import { makeAsphalt, makeConcrete, makeNightSky, makeSky } from "./textures.js";

function prep(tex, rx, ry) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(rx, ry);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export async function loadMaps() {
  return {
    asphalt: makeAsphalt(),
    ground: makeConcrete(),
    cockpit: makeConcrete(),
    metal: makeConcrete(),
    concrete: makeConcrete(),
    glare: makeConcrete(),
    leather: makeAsphalt(),
  };
}

export function createMaterials(maps) {
  return {
    asphalt: new THREE.MeshStandardMaterial({
      map: prep(maps.asphalt.clone(), 18, 4),
      roughness: 0.9,
      metalness: 0.05,
      color: 0xc4c8ce,
    }),
    concrete: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 8, 8),
      roughness: 0.84,
      metalness: 0.05,
      color: 0xd5dae0,
    }),
    taxi: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 14, 3),
      roughness: 0.88,
      metalness: 0.04,
      color: 0xc8ced4,
    }),
    ground: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 36, 24),
      roughness: 0.92,
      metalness: 0.02,
      color: 0xc5ccd2,
    }),
    strip: new THREE.MeshStandardMaterial({
      map: prep(maps.asphalt.clone(), 12, 4),
      roughness: 0.95,
      color: 0x7a8088,
    }),
    stopway: new THREE.MeshStandardMaterial({
      map: prep(maps.asphalt.clone(), 4, 2),
      roughness: 0.9,
      color: 0xa8a070,
    }),
    clearway: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 6, 4),
      roughness: 0.95,
      color: 0x9aa3aa,
      transparent: true,
      opacity: 0.55,
    }),
    white: new THREE.MeshStandardMaterial({
      color: 0xf4f6f8,
      roughness: 0.4,
      metalness: 0.08,
      emissive: 0x222428,
      emissiveIntensity: 0.18,
    }),
    yellow: new THREE.MeshStandardMaterial({
      color: 0xdfc04a,
      roughness: 0.45,
      emissive: 0x3a3008,
      emissiveIntensity: 0.22,
    }),
    redMark: new THREE.MeshStandardMaterial({
      color: 0xc45a4a,
      roughness: 0.5,
      emissive: 0x401008,
      emissiveIntensity: 0.2,
    }),
    tower: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 2, 6),
      roughness: 0.5,
      metalness: 0.14,
      color: 0xb4bcc4,
    }),
    towerDark: new THREE.MeshStandardMaterial({
      map: prep(maps.concrete.clone(), 2, 2),
      color: 0x5c646e,
      roughness: 0.55,
      metalness: 0.2,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xcfe4f2,
      transparent: true,
      opacity: 0.09,
      roughness: 0.04,
      metalness: 0.05,
      depthWrite: false,
    }),
    cockpitDark: new THREE.MeshStandardMaterial({
      map: prep(maps.cockpit.clone(), 2, 2),
      color: 0x1a1d22,
      roughness: 0.52,
      metalness: 0.14,
    }),
    cockpitPanel: new THREE.MeshStandardMaterial({
      map: prep(maps.cockpit.clone(), 2, 1),
      color: 0x2a2e34,
      roughness: 0.38,
      metalness: 0.2,
    }),
    leather: new THREE.MeshStandardMaterial({
      map: prep(maps.leather.clone(), 2, 2),
      color: 0x8a6a52,
      roughness: 0.78,
    }),
    metal: new THREE.MeshStandardMaterial({
      map: prep(maps.metal.clone(), 2, 2),
      color: 0x9aa2aa,
      roughness: 0.28,
      metalness: 0.78,
    }),
    btn: new THREE.MeshStandardMaterial({
      color: 0x2a333c,
      emissive: 0x1a3a4c,
      emissiveIntensity: 0.7,
      roughness: 0.4,
    }),
    fuselage: new THREE.MeshStandardMaterial({
      map: prep(maps.metal.clone(), 4, 1),
      color: 0xe8edf1,
      roughness: 0.24,
      metalness: 0.46,
    }),
    fuseDark: new THREE.MeshStandardMaterial({
      map: prep(maps.metal.clone(), 2, 1),
      color: 0x3a424c,
      roughness: 0.38,
      metalness: 0.5,
    }),
    livery: new THREE.MeshStandardMaterial({ color: 0x1e5a86, roughness: 0.32, metalness: 0.28 }),
    window: new THREE.MeshStandardMaterial({
      color: 0x0c141c,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x1a2838,
      emissiveIntensity: 0.35,
    }),
    skyDay: makeSky(),
    skyNight: makeNightSky(),
  };
}

