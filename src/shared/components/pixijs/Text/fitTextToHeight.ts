import type { Text } from "pixi.js";

export default function (
  text: Text,
  availableHeight: number,
  maxFontSize = 100
) {
  const style = text.style;
  style.fontSize = maxFontSize;
  const scale = availableHeight / text.height;
  style.fontSize = maxFontSize * Math.min(1, scale);
}
