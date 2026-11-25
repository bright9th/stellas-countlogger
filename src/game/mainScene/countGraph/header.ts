import { Container, Text } from "pixi.js";
import { COLORS } from "../../../shared/constants/colors";

export class CountGraphHeader extends Container {
  readonly title = new Text({
    text: "Message count over time",
    style: {
      fontFamily: "sans-serif",
      fontSize: 22,
      fontWeight: "bold",
      fill: COLORS.dark,
    },
  });

  readonly status = new Text({
    text: "Loading...",
    style: {
      fontFamily: "sans-serif",
      fontSize: 16,
      fill: COLORS.dark,
    },
  });

  constructor() {
    super();
    this.title.position.set(80, 24);
    this.status.position.set(80, 58);
    this.addChild(this.title, this.status);
  }

  setStatus(status: string): void {
    this.status.text = status;
  }
}
