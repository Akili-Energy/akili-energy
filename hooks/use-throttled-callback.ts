import throttle from "lodash.throttle";
import { useRef, useEffect, useMemo, type DependencyList } from "react";

/**
 * Hook that executes a callback when the component unmounts.
 *
 * @param callback Function to be called on component unmount
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUnmount = (callback: (...args: Array<any>) => any) => {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(
    () => () => {
      ref.current();
    },
    []
  );
};

interface ThrottleSettings {
  leading?: boolean | undefined;
  trailing?: boolean | undefined;
}

const defaultOptions: ThrottleSettings = {
  leading: false,
  trailing: true,
};

/**
 * A hook that returns a throttled callback function.
 *
 * @param fn The function to throttle
 * @param wait The time in ms to wait before calling the function
 * @param dependencies The dependencies to watch for changes
 * @param options The throttle options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottledCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait = 250,
  dependencies: DependencyList = [],
  options: ThrottleSettings = defaultOptions
): {
  (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
  flush: () => void;
} {
  const handler = useMemo(
    () => throttle<T>(fn, wait, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );

  useUnmount(() => {
    handler.cancel();
  });

  return handler;
}

export default useThrottledCallback;
