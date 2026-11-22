import { Application, Container } from "pixi.js";
import { COLORS } from "../shared/constants/colors";

export class Game {
  public app: Application;
  public container!: Container;

  constructor() {
    this.app = new Application();
  }

  public async init(): Promise<void> {
    await this.app.init({
      resizeTo: window,
      background: COLORS.background,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container = new Container();
    this.app.stage.addChild(this.container);

    this.app.ticker.maxFPS = 60;
    // this.app.ticker.add((ticker) => {
    //   this.mainScene.update(ticker);
    // });
  }
}
