import { Graphics } from "pixi.js";
import { COLORS } from "../../shared/constants/colors";

const PANEL_PADDING = 40; // px

export class BackgroundPanel extends Graphics {
  constructor() {
    super();
    this.onResize = this.onResize.bind(this);
    this.on("added", () => {
      window.addEventListener("resize", this.onResize);
      this.onResize();
    });
    this.on("removed", () => {
      window.removeEventListener("resize", this.onResize);
    });
  }

  onResize() {
    this.#drawPanel();
  }
  #drawPanel() {
    this.clear();
    const topLeftPosition = globalThis.App.game!.topLeftPosition;
    const worldSize = globalThis.App.game!.worldSize;
    this.roundRect(
      topLeftPosition.x + PANEL_PADDING,
      topLeftPosition.y + PANEL_PADDING,
      worldSize.x - PANEL_PADDING * 2,
      worldSize.y - PANEL_PADDING * 2,
      PANEL_PADDING
    );
    this.fill(COLORS.foreground);
  }
}
