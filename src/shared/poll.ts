interface PollOptions {
  intervalMs: number;
  maxAttempts?: number;
  signal?: AbortSignal;
}

export default async function <T>(
  fn: () => Promise<T> | T,
  validate: (result: T) => boolean,
  options: PollOptions
): Promise<T> {
  const { intervalMs, maxAttempts = Infinity, signal } = options;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (signal?.aborted) {
      throw new DOMException("Polling aborted", "AbortError");
    }

    attempts++;
    const result = await fn();

    if (validate(result)) {
      return result;
    }

    if (attempts >= maxAttempts) {
      throw new Error(`Polling exceeded maximum attempts (${maxAttempts})`);
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, intervalMs);
      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new DOMException("Polling aborted", "AbortError"));
        },
        { once: true }
      );
    });
  }

  throw new Error("Polling failed unexpectedly");
}
