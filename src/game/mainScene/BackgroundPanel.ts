import { Graphics } from "pixi.js";
import { COLORS } from "../../shared/constants/colors";
import { PANEL_PADDING } from "./constants";

export class BackgroundPanel extends Graphics {
  draw() {
    this.clear();
    const topLeftPosition = globalThis.App.game!.topLeftPosition;
    const worldSize = globalThis.App.game!.worldSize;
    this.rect(
      topLeftPosition.x + PANEL_PADDING,
      topLeftPosition.y + PANEL_PADDING,
      worldSize.x - PANEL_PADDING * 2,
      worldSize.y - PANEL_PADDING * 2
    );
    this.fill(COLORS.foreground);
    this.stroke({ color: COLORS.dark, width: 2 });
  }
}
