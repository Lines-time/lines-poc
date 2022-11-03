import { Component, JSX } from "solid-js";

type TParentProps<P = {}> = P & { children?: JSX.Element };
type TParentComponent<P = {}> = Component<TParentProps<P>>;
