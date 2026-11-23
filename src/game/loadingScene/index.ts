import { Container, Graphics, Ticker } from "pixi.js";
import { COLORS } from "../../shared/constants/colors";

export class LoadingScene extends Container {
  #player: Graphics;

  constructor() {
    super();

    this.#player = new Graphics()
      .rect(-25, -25, 50, 50)
      .fill(COLORS.foreground);

    this.#player.position.set(640, 360);

    this.addChild(this.#player);

    this.onUpdate = this.onUpdate.bind(this);
  }

  private onUpdate(ticker: Ticker): void {
    this.#player.rotation += 0.02 * ticker.deltaTime;
  }

  update(ticker: Ticker): void {
    this.onUpdate(ticker);
  }
}
