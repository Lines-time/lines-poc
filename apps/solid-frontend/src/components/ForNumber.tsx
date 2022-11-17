import { Component, ComponentProps, createMemo, For, JSX } from "solid-js";

type TProps = Omit<ComponentProps<typeof For<number, JSX.Element>>, "each"> & {
    each: number;
};

const ForNumber: Component<TProps> = (props) => {
    const list = createMemo(() => {
        let result: number[] = [];
        for (let i = 0; i < props.each; i++) {
            result.push(i);
        }
        return result;
    });
    return <For each={list()}>{props.children}</For>;
};
export default ForNumber;
