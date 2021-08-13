import { useEffect, useState } from "react";
import { Loadable, RecoilValue, useRecoilValueLoadable } from "recoil";

type CachedLoadableState = Loadable<any>["state"] | "hasCachedValue";

/**
 * Use a recoil loadable that is cached in the component state. If the loadable
 * changes then the cached value will remain until the loadable finished loading
 * the next value, at which point the cached value will change.
 *
 * Usage:
 *
 * ```tsx
 * const MyComponent = () => {
 *   const [value, state] = useRecoilCachedLoadable(AsyncSelector);
 *   if(state === "loading") return <Spinner />
 *
 *   return <div>{value}</div>;
 * }
 * ```
 */
export function useRecoilCachedLoadable<T>(
  recoilValue: RecoilValue<T>,
  initialValue: T
): [T, CachedLoadableState, Loadable<T>] {
  const [cachedData, setCache] = useState<T>(initialValue);
  const loadable = useRecoilValueLoadable<T>(recoilValue);

  useEffect(() => {
    if (loadable.state === "hasValue") {
      setCache(loadable.valueMaybe());
    }
  }, [loadable]);

  let state: CachedLoadableState = loadable.state;

  if (loadable.state === "loading" && cachedData) {
    state = "hasCachedValue";
  }

  return [cachedData, state, loadable];
}
