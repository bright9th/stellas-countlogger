import testGetMessages from "./testGetMessages";
import { CountGraph } from "./countGraph";
import { CContainer } from "../../shared/components/pixijs/Container";

export class MainScene extends CContainer {
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
}
