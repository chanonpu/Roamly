import { useEffect, useState } from 'react';

/** Returns `value`, but only after it's been stable for `delayMs`.
 *  Used to avoid re-filtering/re-searching on every keystroke. */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
