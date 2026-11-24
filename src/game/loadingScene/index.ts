import { Graphics, Ticker } from "pixi.js";
import { COLORS } from "../../shared/constants/colors";
import { CContainer } from "../../shared/components/pixijs/Container";

export class LoadingScene extends CContainer {
  #player: Graphics;

  constructor() {
    super();

    this.#player = new Graphics()
      .rect(-25, -25, 50, 50)
      .fill(COLORS.foreground);

    this.#player.position.set(640, 360);

    this.addChild(this.#player);
  }

  protected override onUpdate(ticker: Ticker): void {
    this.#player.rotation += 0.02 * ticker.deltaTime;
  }
}
