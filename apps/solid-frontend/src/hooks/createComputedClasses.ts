import { createMemo } from "solid-js";

export const createComputedClasses = (fn: () => { [k: string]: any }) => {
    const _classes = createMemo(fn);
    return createMemo(() =>
        Object.entries(_classes())
            .filter(([k, v]) => v)
            .map(([k, v]) => k)
            .join(" ")
    );
};
