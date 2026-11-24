import { Application, Container } from "pixi.js";
import { COLORS } from "../shared/constants/colors";
import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import type { CContainer } from "../shared/components/pixijs/Container";

export class Game {
  #initialized: boolean = false;
  #app: Application;
  get app() {
    return this.#app;
  }
  #container!: Container; // for resizing
  get container() {
    return this.#container;
  }

  #currentScene!: CContainer; // TODO make scene manager

  constructor() {
    this.#app = new Application();
  }

  async init(): Promise<void> {
    if (this.#initialized) return;

    await this.#app.init({
      resizeTo: window,
      background: COLORS.background,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.#container = new Container();
    this.#app.stage.addChild(this.#container);

    const loadingScene = (this.#currentScene = new LoadingScene());
    this.#container.addChild(loadingScene);

    this.#app.ticker.maxFPS = 60;
    this.#app.ticker.add(loadingScene.update, loadingScene);

    this.#initialized = true;
  }

  start(): void {
    this.#container.removeChild(this.#currentScene);
    this.#app.ticker.remove(this.#currentScene.update, this.#currentScene); // TODO make custom class extends Container

    const mainScene = (this.#currentScene = new MainScene());
    this.#container.addChild(mainScene);

    this.setBackgroundColor(COLORS.foreground);

    this.#app.ticker.add(mainScene.update, mainScene);
  }

  setBackgroundColor(value: number | "default"): void {
    this.#app.renderer.background.color =
      value === "default" ? COLORS.background : value;
  }
}
