import { Container, Ticker } from "pixi.js";

export class CContainer extends Container {
  constructor() {
    super();
    this.onUpdate = this.onUpdate.bind(this);
  }

  protected onUpdate(ticker: Ticker): void {
    void ticker;
  }
  update(ticker: Ticker): void {
    this.onUpdate(ticker);
  }
}
