import { createMemo } from "solid-js";

import type { Component } from "solid-js";

type TProps = {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const Loading: Component<TProps> = (props) => {
    const size = createMemo(() => props.size ?? "md");
    // this needs to be a button, otherwise the loading class doesn't work
    const sizeClass = createMemo(() => ({
        "btn-sm": size() === "sm",
        "btn-xs": size() === "xs",
        "btn-md": size() === "md",
        "btn-lg": size() === "lg",
        "btn-xl": size() === "xl",
    }));
    return <div class="btn btn-ghost loading" classList={sizeClass()} />;
};
export default Loading;
