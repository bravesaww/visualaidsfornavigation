// @ts-nocheck
import { startEngine } from "./engine.js";
import { mountUI } from "./ui.js";

const host = document.getElementById("app");
if (host) {
  host.classList.add("sim-root");
  mountUI(host);
  startEngine(host);
}
