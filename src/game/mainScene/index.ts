import testGetMessages from "./testGetMessages";
import { CountGraph } from "./countGraph";
import { CContainer } from "../../shared/components/pixijs/Container";
import { BackgroundPanel } from "./BackgroundPanel";
import { COLORS } from "../../shared/constants/colors";
import { GraphLabelGroup } from "./GraphLabelGroup";

export class MainScene extends CContainer {
  #backgroundPanel = new BackgroundPanel();
  #graphLabelGroup = new GraphLabelGroup();
  #graph = new CountGraph();

  constructor() {
    super();

    this.onUpdate = this.onUpdate.bind(this);
    globalThis.App.game!.setBackgroundColor(COLORS.foreground);

    // resize on event
    this.onResize = this.onResize.bind(this);
    this.on("added", () => {
      window.addEventListener("resize", this.onResize);
      this.onResize();
    });
    this.on("removed", () => {
      window.removeEventListener("resize", this.onResize);
    });

    // hierarchy
    this.addChild(this.#backgroundPanel);
    this.addChild(this.#graphLabelGroup);
    this.addChild(this.#graph);
    void this.#loadData();
  }

  onResize() {
    this.#backgroundPanel.draw();
    this.#graphLabelGroup.update();
  }

  async #loadData(): Promise<void> {
    const rows = await testGetMessages();
    this.#graph.setData(rows);
  }
}
