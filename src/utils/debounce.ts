export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T & { flush: () => void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const run = () => {
    if (lastArgs) fn(...lastArgs);
    lastArgs = null;
    timer = null;
  };

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, ms);
  }) as T & { flush: () => void; cancel: () => void };

  debounced.flush = () => {
    if (timer) clearTimeout(timer);
    run();
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    lastArgs = null;
    timer = null;
  };

  return debounced;
}
