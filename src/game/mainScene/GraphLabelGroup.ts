import { Container, Text } from "pixi.js";
import { COLORS } from "../../shared/constants/colors";
import { PANEL_PADDING } from "./constants";
import fitTextToHeight from "../../shared/components/pixijs/Text/fitTextToHeight";

export class GraphLabelGroup extends Container {
  readonly countText = new Text({
    text: "C O U N T",
    style: {
      fontFamily: "sans-serif",
      fill: COLORS.dark,
    },
  });

  readonly timeText = new Text({
    text: "T I M E",
    style: {
      fontFamily: "sans-serif",
      fill: COLORS.dark,
    },
  });

  constructor() {
    super();

    this.countText.anchor.set(0.5);
    this.countText.rotation = -Math.PI / 2;
    this.countText.scale.y = 0.8;
    this.addChild(this.countText);

    this.timeText.anchor.set(0.5);
    this.timeText.scale.y = 0.8;
    this.addChild(this.timeText);

    this.update();
  }

  update() {
    const topLeftPosition = globalThis.App.game!.topLeftPosition;
    const worldSize = globalThis.App.game!.worldSize;

    fitTextToHeight(this.countText, PANEL_PADDING * 0.7);
    this.countText.position.set(
      topLeftPosition.x + PANEL_PADDING / 2,
      topLeftPosition.y + worldSize.y / 2
    );

    fitTextToHeight(this.timeText, PANEL_PADDING * 0.7);
    this.timeText.position.set(
      topLeftPosition.x + worldSize.x / 2,
      topLeftPosition.y + worldSize.y - PANEL_PADDING / 2
    );
  }
}
