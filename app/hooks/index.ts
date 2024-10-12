import { useEffect, useRef } from "react";

export const useDebounce = (
  fn: (...args: never) => unknown,
  delay: number = 500,
) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = (...args: never) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return debouncedFn;
};
