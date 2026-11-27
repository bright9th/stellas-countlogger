import testGetMessages from "./testGetMessages";
import { CountGraph } from "./countGraph";
import { CContainer } from "../../shared/components/pixijs/Container";
import { BackgroundPanel } from "./BackgroundPanel";
import { COLORS } from "../../shared/constants/colors";

export class MainScene extends CContainer {
  #backgroundPanel = new BackgroundPanel();
  #graph = new CountGraph();

  constructor() {
    super();

    this.addChild(this.#backgroundPanel);
    this.addChild(this.#graph);
    void this.#loadData();
    this.onUpdate = this.onUpdate.bind(this);

    globalThis.App.game!.setBackgroundColor(COLORS.background);
  }

  async #loadData(): Promise<void> {
    const rows = await testGetMessages();
    this.#graph.setData(rows);
  }
}
