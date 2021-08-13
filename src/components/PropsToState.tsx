import React, { useEffect, useState } from "react";
import {
  MutableSnapshot,
  RecoilRoot,
  RecoilState,
  Snapshot,
  useRecoilCallback,
} from "recoil";

const propsToState = (
  snapshot: Snapshot,
  set: (
    recoilVal: RecoilState<any>,
    valOrUpdater: ((currVal: any) => any) | any
  ) => void,
  props: object
) => {
  for (let node of snapshot.getNodes_UNSTABLE()) {
    if (
      props.hasOwnProperty(node.key) &&
      (snapshot.getInfo_UNSTABLE(node).type === "atom" ||
        snapshot.getInfo_UNSTABLE(node).type === undefined)
    ) {
      const atomNode = node as RecoilState<any>;
      // @ts-ignore
      set(atomNode, props[atomNode.key]);
    }
  }
};

/**
 * Transfer arbitary props to recoil state atoms with the name keys
 */
export function PropsToStateTransfer<P extends { children?: JSX.Element }>(
  props: P
) {
  // Keys is set once, you can't add a new key later on
  const [keys, _] = useState<string[]>(
    Object.keys(props).filter((k) => k !== "children")
  );
  const [initialSet, setInitialSet] = useState(false);
  // @ts-ignore
  const values = keys.map((k) => props[k]);

  const setState = useRecoilCallback(
    ({ set, snapshot }) =>
      (props: Omit<P, "children">) => {
        propsToState(snapshot, set, props);
        setInitialSet(true);
      }
  );

  useEffect(() => {
    // @ts-ignore
    setState(keys.reduce((acc, k) => ({ ...acc, [k]: props[k] }), {} as any));
  }, values);

  if (!initialSet) return null;

  const children = props.children || null;
  return <>{children}</>;
}

export function PropsToState<P extends { children?: JSX.Element }>(props: P) {
  const initializeState = (props: object) => (snapshot: MutableSnapshot) => {
    propsToState(snapshot, snapshot.set, props);
  };

  return (
    <RecoilRoot initializeState={initializeState(props)}>
      <PropsToStateTransfer {...props} />
    </RecoilRoot>
  );
}
