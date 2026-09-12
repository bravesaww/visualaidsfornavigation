import * as THREE from "three";

function canvasTex(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeat = 8,
) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  paint(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function n2(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

export function makeAsphalt() {
  return canvasTex(512, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const v = 38 + n2(x * 0.08, y * 0.08) * 18 + n2(x * 0.4, y * 0.4) * 10;
        const i = (y * s + x) * 4;
        img.data[i] = v;
        img.data[i + 1] = v + 1;
        img.data[i + 2] = v + 2;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, 14);
}

export function makeGrass() {
  return canvasTex(512, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const g = 52 + n2(x * 0.07, y * 0.07) * 28 + n2(x * 0.3, y * 0.5) * 12;
        const i = (y * s + x) * 4;
        img.data[i] = g * 0.45;
        img.data[i + 1] = g;
        img.data[i + 2] = g * 0.38;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, 40);
}

export function makeConcrete() {
  return canvasTex(512, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const v = 118 + n2(x * 0.05, y * 0.05) * 22;
        const i = (y * s + x) * 4;
        img.data[i] = v;
        img.data[i + 1] = v + 2;
        img.data[i + 2] = v + 3;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, 6);
}

export function makeSky() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#6aa4d4");
  g.addColorStop(0.45, "#9ec4e0");
  g.addColorStop(0.72, "#c5d6e4");
  g.addColorStop(1, "#dfe6ea");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.LinearFilter;
  return t;
}

export function makeNightSky() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#02040a");
  g.addColorStop(0.55, "#0a1020");
  g.addColorStop(1, "#141820");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
