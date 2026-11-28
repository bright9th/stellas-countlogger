import { MathUtils } from ".";

export class Easing {
  static out(value: number): number {
    value = MathUtils.clamp(value, 0, 1);
    return 1 - Math.pow(1 - value, 2);
  }

  static in(value: number): number {
    value = MathUtils.clamp(value, 0, 1);
    return Math.pow(value, 2);
  }

  static inOut(value: number): number {
    value = MathUtils.clamp(value, 0, 1);
    return value < 0.5
      ? 2 * Math.pow(value, 2)
      : 1 - 2 * Math.pow(1 - value, 2);
  }
}
