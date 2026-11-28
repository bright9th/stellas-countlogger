export class MathUtils {
  static lerp(a: number, b: number, t: number, clamp: boolean = true): number {
    if (clamp)
      return MathUtils.clamp(a + (b - a) * t, Math.min(a, b), Math.max(a, b));
    return a + (b - a) * t;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
