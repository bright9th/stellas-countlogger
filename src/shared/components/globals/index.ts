import type { App } from "../App/class";
import { NewApp } from "../App";

declare global {
  var App: App;
}

async function init() {
  Object.defineProperty(globalThis, "App", {
    value: await NewApp(),
    writable: false,
    configurable: false,
    enumerable: true,
  });
}

export default { init };
