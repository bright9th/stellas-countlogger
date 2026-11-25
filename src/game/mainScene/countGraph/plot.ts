import { Container, Graphics, Text } from "pixi.js";
import { COLORS } from "../../../shared/constants/colors";
import { formatCount, formatDate, niceMaximum } from "./format";
import type { CountPoint } from "./type";

export class CountGraphPlot extends Container {
  readonly graphics = new Graphics();
  readonly labels = new Container();

  constructor() {
    super();
    this.addChild(this.graphics, this.labels);
  }

  clear(): void {
    this.graphics.clear();
    this.labels.removeChildren();
  }

  draw(points: CountPoint[]): void {
    this.clear();

    const left = 100;
    const right = 1220;
    const top = 110;
    const bottom = 650;
    const width = right - left;
    const height = bottom - top;

    const minimumTime = points[0].timestamp;
    const maximumTime = points[points.length - 1].timestamp;
    const timeSpan = Math.max(1, maximumTime - minimumTime);
    const maximumCount = points.reduce(
      (maximum, point) => Math.max(maximum, point.count),
      0
    );
    const countMax = niceMaximum(maximumCount);

    for (let tick = 0; tick <= 6; tick += 1) {
      const ratio = tick / 6;
      const y = bottom - height * ratio;
      const value = countMax * ratio;

      this.graphics
        .moveTo(left, y)
        .lineTo(right, y)
        .stroke({ width: 1, color: COLORS.soft, alpha: 0.7 });
      this.addText(formatCount(value), left - 12, y - 8, "right");
    }

    for (let tick = 0; tick <= 6; tick += 1) {
      const ratio = tick / 6;
      const x = left + width * ratio;
      const timestamp = minimumTime + timeSpan * ratio;

      this.graphics
        .moveTo(x, top)
        .lineTo(x, bottom)
        .stroke({ width: 1, color: COLORS.soft, alpha: 0.35 });
      this.addText(formatDate(timestamp, timeSpan), x, bottom + 18, "center");
    }

    this.graphics
      .moveTo(left, top)
      .lineTo(left, bottom)
      .lineTo(right, bottom)
      .stroke({ width: 2, color: COLORS.dark, alpha: 1 });

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const x = left + ((point.timestamp - minimumTime) / timeSpan) * width;
      const y = bottom - (point.count / countMax) * height;

      if (index === 0) {
        this.graphics.moveTo(x, y);
      } else {
        this.graphics.lineTo(x, y);
      }
    }
    this.graphics.stroke({ width: 3, color: COLORS.secondary, alpha: 1 });

    for (const point of points) {
      const x = left + ((point.timestamp - minimumTime) / timeSpan) * width;
      const y = bottom - (point.count / countMax) * height;
      this.graphics.circle(x, y, 4).fill(COLORS.accent);
      this.graphics.circle(x, y, 2).fill(COLORS.foreground);
    }

    this.addText("Count", 18, top - 26, "left");
    this.addText("Date", right - 2, bottom + 52, "right");
  }

  private addText(
    text: string,
    x: number,
    y: number,
    anchor: "left" | "center" | "right"
  ): void {
    const label = new Text({
      text,
      style: {
        fontFamily: "sans-serif",
        fontSize: 11,
        fill: COLORS.dark,
      },
    });
    label.position.set(x, y);
    if (anchor === "right") label.anchor.set(1, 0);
    if (anchor === "center") label.anchor.set(0.5, 0);
    this.labels.addChild(label);
  }
}
