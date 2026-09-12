import * as THREE from "three";
import type { Mats } from "./materials";

function tree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x4a3424, roughness: 0.9 }),
  );
  trunk.position.y = 1.1;
  const leaf = new THREE.Mesh(
    new THREE.ConeGeometry(1.35, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x3d6a3a, roughness: 0.85 }),
  );
  leaf.position.y = 3.3;
  const leaf2 = new THREE.Mesh(
    new THREE.ConeGeometry(1.05, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x4c7c44, roughness: 0.85 }),
  );
  leaf2.position.y = 4.5;
  g.add(trunk, leaf, leaf2);
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.castShadow = true;
  });
  return g;
}

function building(w: number, h: number, d: number, color: number, mats: Mats) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.08,
      map: mats.concrete.map,
    }),
  );
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  const floors = Math.max(2, Math.floor(h / 3.2));
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xc9d6e2,
    emissive: 0x8899aa,
    emissiveIntensity: 0.35,
    roughness: 0.25,
  });
  for (let f = 0; f < floors; f++) {
    for (let s = -1; s <= 1; s += 2) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.9, 0.08), winMat);
      win.position.set(0, 1.4 + f * 3.1, s * (d / 2 + 0.02));
      g.add(win);
    }
  }
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.4, 0.25, d + 0.4),
    new THREE.MeshStandardMaterial({ color: 0x4a5058, roughness: 0.6 }),
  );
  roof.position.y = h + 0.1;
  g.add(roof);
  return g;
}

export function buildTown(mats: Mats) {
  const root = new THREE.Group();
  root.name = "town";

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x3a3e44,
    roughness: 0.9,
    map: mats.asphalt.map,
  });
  const addRoad = (x: number, z: number, w: number, d: number) => {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
    r.rotation.x = -Math.PI / 2;
    r.position.set(x, 0.06, z);
    r.receiveShadow = true;
    root.add(r);
  };

  const clusters: { cx: number; cz: number }[] = [
    { cx: 180, cz: 520 },
    { cx: -420, cz: 560 },
    { cx: 520, cz: -480 },
    { cx: -280, cz: -540 },
  ];

  const pal = [0xb8c0c8, 0xc4b8a8, 0x9aa4ae, 0xd0c8bc, 0x8e96a0];
  let seed = 7;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  clusters.forEach((c) => {
    addRoad(c.cx, c.cz, 220, 14);
    addRoad(c.cx, c.cz, 14, 180);
    for (let i = 0; i < 10; i++) {
      const w = 8 + rng() * 14;
      const d = 8 + rng() * 12;
      const h = 8 + rng() * 22;
      const b = building(w, h, d, pal[i % pal.length], mats);
      const side = i % 2 === 0 ? 1 : -1;
      b.position.set(c.cx + (rng() - 0.5) * 160, 0, c.cz + side * (28 + rng() * 50));
      root.add(b);
    }
    for (let i = 0; i < 16; i++) {
      const t = tree();
      t.position.set(c.cx + (rng() - 0.5) * 210, 0, c.cz + (rng() - 0.5) * 180);
      t.scale.setScalar(0.8 + rng() * 0.7);
      root.add(t);
    }
  });

  return root;
}
