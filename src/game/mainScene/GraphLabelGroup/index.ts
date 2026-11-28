import { Container, Text } from "pixi.js";
import { COLORS } from "../../../shared/constants/colors";
import { PANEL_PADDING } from "../constants";
import fitTextToHeight from "../../../shared/components/pixijs/Text/fitTextToHeight";
import { TimeDetailGroup } from "./TimeDetailGroup";
import { DETAIL_BOX_ANIMATION_MS, TIME_DETAIL_GROUP_GAP } from "./constants";
import { Animator } from "../../../shared/Animator";
import { MathUtils } from "../../../shared/MathUtils";
import { Easing } from "../../../shared/MathUtils/Easing";

export class GraphLabelGroup extends Container {
  readonly #countText = new Text({
    text: "C O U N T",
    style: {
      fontFamily: "sans-serif",
      fill: COLORS.dark,
    },
  });
  readonly #timeText = new Text({
    text: "T I M E",
    style: {
      fontFamily: "sans-serif",
      fill: COLORS.dark,
    },
  });
  readonly #timeDetailGroup = new TimeDetailGroup();

  readonly #timeTextPositionAnimator = new Animator();
  readonly #timeDetailPositionAnimator = new Animator();
  readonly #timeDetailScaleAnimator = new Animator();

  constructor() {
    super();

    this.#countText.anchor.set(0.5);
    this.#countText.rotation = -Math.PI / 2;
    this.#countText.scale.y = 0.8;
    this.addChild(this.#countText);

    this.#timeText.anchor.set(0.5);
    this.#timeText.scale.y = 0.8;
    this.addChild(this.#timeText, this.#timeDetailGroup);

    this.#initAnimation();
    this.update();

    setInterval(
      () => this.setTimeDetailText("A".repeat(Math.round(Math.random() * 10))),
      500
    );
  }

  #initAnimation() {
    const topLeftPosition = globalThis.App.game!.topLeftPosition;
    const worldSize = globalThis.App.game!.worldSize;
    const timeGroupCentreX = topLeftPosition.x + worldSize.x / 2;
    const timeGroupCentreY =
      topLeftPosition.y + worldSize.y - PANEL_PADDING / 2;

    this.#timeTextPositionAnimator.setFunc((startValue, targetValue, t) => {
      const current = MathUtils.lerp(startValue, targetValue, Easing.out(t));
      this.#timeText.position.set(current, timeGroupCentreY);
      return current;
    });
    this.#timeTextPositionAnimator.setStartValue(timeGroupCentreX);

    this.#timeDetailPositionAnimator.setFunc((startValue, targetValue, t) => {
      const current = MathUtils.lerp(startValue, targetValue, Easing.out(t));
      this.#timeDetailGroup.position.set(current, timeGroupCentreY);
      return current;
    });

    this.#timeDetailScaleAnimator.setFunc((startValue, targetValue, t) => {
      const current = MathUtils.lerp(startValue, targetValue, Easing.out(t));
      this.#timeDetailGroup.scale.set(current, 1);
      return current;
    });
    this.#timeDetailScaleAnimator.setStartValue(0);
  }

  update() {
    const topLeftPosition = globalThis.App.game!.topLeftPosition;
    const worldSize = globalThis.App.game!.worldSize;

    // countText
    fitTextToHeight(this.#countText, PANEL_PADDING * 0.7);
    this.#countText.position.set(
      topLeftPosition.x + PANEL_PADDING / 2,
      topLeftPosition.y + worldSize.y / 2
    );

    const timeGroupCentreX = topLeftPosition.x + worldSize.x / 2;

    // timeText & timeDetailGroup
    fitTextToHeight(this.#timeText, PANEL_PADDING * 0.7);
    this.#timeDetailGroup.update();
    // set start value when running update() for the first time
    // start folded (showTimeDetail = false)
    if (this.#timeDetailPositionAnimator.currentValue === null)
      this.#timeDetailPositionAnimator.setStartValue(
        timeGroupCentreX + this.#timeText.width / 2
      );

    if (this.#timeDetailGroup.showTimeDetail) {
      const timeGroupSplitX =
        (this.#timeText.width - this.#timeDetailGroup.detailStaticWidth) / 2;
      this.#timeTextPositionAnimator.animate(
        timeGroupCentreX +
          timeGroupSplitX -
          (this.#timeText.width + TIME_DETAIL_GROUP_GAP) / 2,
        DETAIL_BOX_ANIMATION_MS
      );
      this.#timeDetailPositionAnimator.animate(
        timeGroupCentreX +
          timeGroupSplitX +
          (this.#timeDetailGroup.detailStaticWidth + TIME_DETAIL_GROUP_GAP) / 2,
        DETAIL_BOX_ANIMATION_MS
      );
    } else {
      this.#timeTextPositionAnimator.animate(
        timeGroupCentreX,
        DETAIL_BOX_ANIMATION_MS
      );
      this.#timeDetailPositionAnimator.animate(
        timeGroupCentreX + this.#timeText.width / 2,
        DETAIL_BOX_ANIMATION_MS
      );
    }
    this.#timeDetailScaleAnimator.animate(
      this.#timeDetailGroup.showTimeDetail ? 1 : 0,
      DETAIL_BOX_ANIMATION_MS
    );
  }

  setTimeDetailText(content: string | null) {
    this.#timeDetailGroup.setText(content);
    this.update();
  }
}
