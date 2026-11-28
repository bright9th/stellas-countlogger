import { Container, Graphics, Text } from "pixi.js";
import { COLORS } from "../../../shared/constants/colors";
import { PANEL_PADDING } from "../constants";
import fitTextToHeight from "../../../shared/components/pixijs/Text/fitTextToHeight";
import {
  DETAIL_BOX_PAD,
  DETAIL_BOX_STROKE_WIDTH,
  DETAIL_BOX_HEIGHT,
  DETAIL_BOX_ANIMATION_MS,
} from "./constants";
import { MathUtils } from "../../../shared/MathUtils";
import { Easing } from "../../../shared/MathUtils/Easing";
import { Animator } from "../../../shared/Animator";

export class TimeDetailGroup extends Container {
  readonly #box = new Graphics();
  readonly #textMask = new Graphics();
  readonly #timeDetailText = new Text({
    text: "Detail",
    style: {
      fontFamily: "sans-serif",
      fill: COLORS.dark,
    },
  });

  #showTimeDetail = true;
  get showTimeDetail() {
    return this.#showTimeDetail;
  }

  #detailStaticWidth = 1;
  get detailStaticWidth() {
    return this.#detailStaticWidth;
  }

  readonly #widthAnimator = new Animator();

  constructor() {
    super();

    this.#timeDetailText.anchor.set(0.5);
    this.#timeDetailText.mask = this.#textMask;
    this.addChild(this.#timeDetailText, this.#textMask, this.#box);

    this.#widthAnimator.setFunc((startValue, targetValue, t) => {
      const current = MathUtils.lerp(startValue, targetValue, Easing.out(t));
      this.#drawBox(current);
      this.#drawMask(current);
      return current;
    });
    this.#widthAnimator.setStartValue(0);

    this.update();
  }

  update() {
    if (!this.#showTimeDetail) {
      this.#animate(null);
      return;
    }
    fitTextToHeight(this.#timeDetailText, PANEL_PADDING * 0.6);
    this.#detailStaticWidth = this.#timeDetailText.width + DETAIL_BOX_PAD * 2;
    this.#animate(this.#detailStaticWidth);
  }
  #animate(width: number | null) {
    if (!width) width = 0;
    this.#widthAnimator.animate(width, DETAIL_BOX_ANIMATION_MS);
  }
  #drawBox(width: number) {
    this.#box
      .clear()
      .moveTo(-width / 2, DETAIL_BOX_HEIGHT / 2)
      .lineTo(-width / 2, -DETAIL_BOX_HEIGHT / 2)
      .moveTo(width / 2, DETAIL_BOX_HEIGHT / 2)
      .lineTo(width / 2, -DETAIL_BOX_HEIGHT / 2)
      .stroke({ width: DETAIL_BOX_STROKE_WIDTH, color: COLORS.dark });
  }
  #drawMask(width: number) {
    this.#textMask
      .clear()
      .rect(-width / 2, -DETAIL_BOX_HEIGHT / 2, width, DETAIL_BOX_HEIGHT)
      .fill();
  }

  setText(content: string | null) {
    this.#showTimeDetail = !!content;
    if (!content) return;
    this.#timeDetailText.text = content;
  }
}
