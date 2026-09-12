// @ts-nocheck
import { startEngine } from "./engine.js";
import { mountUI } from "./ui.js";
import "./style.css";

export function boot(host) {
  if (!host) return () => {};
  host.classList.add("sim-root");
  mountUI(host);
  let disposeEngine = () => {};
  startEngine(host).then((d) => {
    disposeEngine = d;
  });
  return () => disposeEngine();
}
