import { Container } from "pixi.js";
import type { GetModuloIdRowsData } from "../../shared/components/database/parquet/queries/get_modulo_id_rows/type";
import { normalizeCountPoints } from "./countGraph/data";
import { CountGraphHeader } from "./countGraph/header";
import { CountGraphPlot } from "./countGraph/plot";

export class CountGraph extends Container {
  readonly header = new CountGraphHeader();
  readonly plot = new CountGraphPlot();

  constructor() {
    super();
    this.addChild(this.header, this.plot);
  }

  setData(rows: GetModuloIdRowsData[] | null): void {
    if (!rows) {
      this.header.setStatus("Could not load message data.");
      this.plot.clear();
      return;
    }

    const points = normalizeCountPoints(rows);

    if (points.length === 0) {
      this.header.setStatus("No numeric count data is available.");
      this.plot.clear();
      return;
    }

    this.header.setStatus(`${points.length} sampled points`);
    this.plot.draw(points);
  }
}
