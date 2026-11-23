import { Container, Graphics, Text } from "pixi.js";
import type { GetModuloIdRowsData } from "../../shared/components/database/parquet/queries/get_modulo_id_rows/type";
import { COLORS } from "../../shared/constants/colors";

type CountPoint = {
  count: number;
  timestamp: number;
};

export class CountGraph extends Container {
  #graphics = new Graphics();
  #labels = new Container();
  #title = new Text({
    text: "Message count over time",
    style: {
      fontFamily: "sans-serif",
      fontSize: 22,
      fontWeight: "bold",
      fill: COLORS.dark,
    },
  });
  #status = new Text({
    text: "Loading...",
    style: {
      fontFamily: "sans-serif",
      fontSize: 16,
      fill: COLORS.dark,
    },
  });

  constructor() {
    super();
    this.#title.position.set(80, 24);
    this.#status.position.set(80, 58);
    this.addChild(this.#title, this.#status, this.#graphics, this.#labels);
  }

  setData(rows: GetModuloIdRowsData[] | null): void {
    if (!rows) {
      this.#status.text = "Could not load message data.";
      this.#graphics.clear();
      return;
    }

    const points = rows
      .map((row): CountPoint | null => {
        const count = Number(row.content);
        if (!Number.isFinite(count)) return null;
        const timestamp = this.#toNumber(row.timestamp);
        if (timestamp === null) return null;
        return {
          count,
          timestamp: timestamp * 1000,
        };
      })
      .filter((point): point is CountPoint => point !== null)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (points.length === 0) {
      this.#status.text = "No numeric count data is available.";
      this.#graphics.clear();
      return;
    }

    this.#status.text = `${points.length} sampled points`;
    this.#draw(points);
  }

  #draw(points: CountPoint[]): void {
    this.#graphics.clear();
    this.#labels.removeChildren();

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
    const countMax = this.#niceMaximum(maximumCount);

    for (let tick = 0; tick <= 6; tick += 1) {
      const ratio = tick / 6;
      const y = bottom - height * ratio;
      const value = countMax * ratio;

      this.#graphics
        .moveTo(left, y)
        .lineTo(right, y)
        .stroke({ width: 1, color: COLORS.soft, alpha: 0.7 });
      this.#addText(this.#formatCount(value), left - 12, y - 8, "right");
    }

    for (let tick = 0; tick <= 6; tick += 1) {
      const ratio = tick / 6;
      const x = left + width * ratio;
      const timestamp = minimumTime + timeSpan * ratio;

      this.#graphics
        .moveTo(x, top)
        .lineTo(x, bottom)
        .stroke({ width: 1, color: COLORS.soft, alpha: 0.35 });
      this.#addText(
        this.#formatDate(timestamp, timeSpan),
        x,
        bottom + 18,
        "center"
      );
    }

    this.#graphics
      .moveTo(left, top)
      .lineTo(left, bottom)
      .lineTo(right, bottom)
      .stroke({ width: 2, color: COLORS.dark, alpha: 1 });

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const x = left + ((point.timestamp - minimumTime) / timeSpan) * width;
      const y = bottom - (point.count / countMax) * height;

      if (index === 0) {
        this.#graphics.moveTo(x, y);
      } else {
        this.#graphics.lineTo(x, y);
      }
    }
    this.#graphics.stroke({ width: 3, color: COLORS.secondary, alpha: 1 });

    for (const point of points) {
      const x = left + ((point.timestamp - minimumTime) / timeSpan) * width;
      const y = bottom - (point.count / countMax) * height;
      this.#graphics.circle(x, y, 4).fill(COLORS.accent);
      this.#graphics.circle(x, y, 2).fill(COLORS.foreground);
    }

    this.#addText("Count", 18, top - 26, "left");
    this.#addText("Date", right - 2, bottom + 52, "right");
  }

  #addText(
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
    this.#labels.addChild(label);
  }

  #toNumber(value: unknown): number | null {
    if (typeof value === "bigint") {
      return Number(value);
    }
    if (typeof value === "number" || typeof value === "string") {
      const converted = Number(value);
      return Number.isFinite(converted) ? converted : null;
    }
    return null;
  }

  #niceMaximum(value: number): number {
    if (!Number.isFinite(value) || value <= 0) return 1;
    const exponent = 10 ** Math.floor(Math.log10(value));
    const fraction = value / exponent;
    const niceFraction =
      fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return niceFraction * exponent;
  }

  #formatCount(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  #formatDate(timestamp: number, span: number): string {
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) return "";
    if (span < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (span < 365 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString([], { year: "numeric", month: "short" });
  }
}
