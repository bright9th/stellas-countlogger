type AnimatorFunction = (
  startValue: number,
  targetValue: number,
  t: number
) => number; // return currentValue

export class Animator {
  #frameId: number | null = null;
  #startTime: number | null = null;
  get hasAnimation() {
    return this.#startTime !== null;
  }
  #currentTime: number | null = null;
  get currentTimeMs() {
    return this.#currentTime;
  }
  #pauseTime: number | null = null;
  get paused() {
    return this.#pauseTime !== null;
  }
  get animating() {
    return this.hasAnimation && !this.paused;
  }
  #duration: number | null = null;
  get durationMs() {
    return this.#duration;
  }
  get progress() {
    return this.#currentTime !== null && this.#duration !== null
      ? Math.min(this.#currentTime / this.#duration, 1)
      : null;
  }

  #startValue: number | null = null;
  get startValue() {
    return this.#startValue;
  }
  #currentValue: number | null = null;
  get currentValue() {
    return this.#currentValue;
  }
  #targetValue: number | null = null;
  get targetValue() {
    return this.#targetValue;
  }
  #func: AnimatorFunction | null = null;

  setFunc(func: AnimatorFunction) {
    if (this.hasAnimation)
      throw new Error(
        "Animation session currently exists. Cannot set new function."
      );
    this.#func = func;
  }
  setStartValue(value: number) {
    if (this.hasAnimation)
      throw new Error(
        "Animation session currently exists. Cannot set new start value."
      );
    this.#startValue = value;
    this.#currentValue = value;
  }

  #cancelFrame() {
    if (this.#frameId !== null) {
      cancelAnimationFrame(this.#frameId);
      this.#frameId = null;
    }
  }
  #clearSession() {
    this.#cancelFrame();

    this.#startTime = null;
    this.#pauseTime = null;
    this.#currentTime = null;
    this.#duration = null;
    this.#targetValue = null;
  }

  #update(timestamp: number) {
    if (!this.hasAnimation || this.paused) return;

    const elapsed = timestamp - this.#startTime!;
    this.#currentTime = Math.min(elapsed, this.#duration!);
    const t = Math.min(this.#currentTime / this.#duration!, 1);

    this.#currentValue = this.#func!(this.#startValue!, this.#targetValue!, t);

    if (t >= 1) {
      this.#clearSession();
      return;
    }
    this.#frameId = requestAnimationFrame((time) => this.#update(time));
  }

  animate(toValue: number, durationMs: number) {
    if (!this.#func)
      throw new Error("Currently no function set to execute. Cannot animate.");
    if (this.#currentValue === null)
      throw new Error("Currently no start value set. Cannot animate.");
    if (!Number.isFinite(toValue))
      throw new Error("Target value must be a finite number.");
    if (!Number.isFinite(durationMs) || durationMs <= 0)
      throw new Error("Duration must be a positive finite number.");

    this.#cancelFrame();

    this.#startValue = this.#currentValue;
    this.#targetValue = toValue;
    this.#duration = durationMs;
    this.#currentTime = 0;
    this.#pauseTime = null;

    this.#startTime = performance.now();

    this.#func(this.#startValue!, this.#targetValue!, 0);
    this.#frameId = requestAnimationFrame((time) => this.#update(time));
  }

  pause() {
    if (!this.hasAnimation || this.paused) return;

    this.#pauseTime = performance.now();

    this.#cancelFrame();
  }

  continue() {
    if (!this.hasAnimation || !this.paused) return;

    const now = performance.now();
    // shift the start time to exclude the paused interval
    this.#startTime! += now - this.#pauseTime!;
    this.#pauseTime = null;

    this.#frameId = requestAnimationFrame((time) => this.#update(time));
  }

  terminate() {
    if (!this.hasAnimation) return;

    this.#clearSession();
  }

  finish() {
    if (!this.hasAnimation) return;

    // complete the animation, including when paused
    this.#currentTime = this.#duration!;
    this.#currentValue = this.#targetValue!;

    this.#func!(this.#startValue!, this.#targetValue!, 1);

    this.#clearSession();
  }

  reset() {
    if (this.hasAnimation)
      throw new Error("Cannot reset while there is ongoing animation.");

    this.#clearSession();

    this.#startValue = null;
    this.#currentValue = null;
    this.#func = null;
  }
}
