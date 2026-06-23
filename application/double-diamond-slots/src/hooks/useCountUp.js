import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up from 0 (or from `from`) to `target` over
 * `duration` ms. Returns the current displayed value. Restarts whenever
 * `target` changes to a new non-zero value with a different `resetKey`.
 */
export function useCountUp(target, duration, resetKey) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!target || target <= 0) {
      setValue(0);
      return;
    }

    startRef.current = null;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, resetKey]);

  return value;
}
