import { Component, JSX } from "solid-js";

type TParentProps<P = {}> = P & { children?: JSX.Element };
type TParentComponent<P = {}> = Component<TParentProps<P>>;

type TCalendarEvent = {
    start: Date;
    end: Date;
    pointerEvents: boolean;
    display: Component;
};
