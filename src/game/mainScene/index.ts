import { Container, Ticker } from "pixi.js";
import testGetMessages from "./testGetMessages";
import { CountGraph } from "./countGraph";

export class MainScene extends Container {
  #graph = new CountGraph();

  constructor() {
    super();

    this.addChild(this.#graph);
    void this.#loadData();
    this.onUpdate = this.onUpdate.bind(this);
  }

  async #loadData(): Promise<void> {
    const rows = await testGetMessages();
    this.#graph.setData(rows);
  }

  private onUpdate(): void {}

  update(ticker: Ticker): void {
    void ticker;
    this.onUpdate();
  }
}
