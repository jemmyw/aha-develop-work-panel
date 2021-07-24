import { useEffect } from "react";
import { v4 } from "uuid";

const reactiveRegister = window.require("javascripts/reactive_register");
export function useReactiveRegister(
  patterns: string[],
  callback: (change: any, ownPageChanges: any, ownComponentChanges: any) => void) {
  useEffect(() => {
    const id = v4();
    reactiveRegister.register(id, patterns, callback);

    return () => {
      reactiveRegister.deregister(id);
    };
  }, [patterns, callback]);
}
