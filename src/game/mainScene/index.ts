import { Container, Ticker } from "pixi.js";

export class MainScene extends Container {
  constructor() {
    super();

    this.onUpdate = this.onUpdate.bind(this);
  }

  private onUpdate(_ticker: Ticker): void {}

  update(ticker: Ticker): void {
    this.onUpdate(ticker);
  }
}
