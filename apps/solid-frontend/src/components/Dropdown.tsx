import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

import type { JSX, ParentComponent } from "solid-js";

type TProps = {
    label: JSX.Element;
    alignment?: "end" | "start";
    location?: "top" | "bottom" | "left" | "right";
    hover?: boolean;
    labelClass?: string;
    class?: string;
    autoLocation?: boolean;
    autoAlignment?: boolean;
};

const Dropdown: ParentComponent<TProps> = (props) => {
    const labelClass = createMemo(() => props.labelClass ?? "btn");
    const autoLocation = createMemo(() => props.autoLocation ?? true);
    const autoAlignment = createMemo(() => props.autoAlignment ?? true);

    let rootRef: HTMLDivElement | undefined;
    let dropdownRef: HTMLDivElement | undefined;
    const [location, setLocation] = createSignal(props.location ?? "bottom");
    const [alignment, setAlignment] = createSignal(props.alignment ?? "start");

    const updateAutoLocation = () => {
        if (autoLocation() && rootRef && dropdownRef) {
            if (
                window.innerHeight - rootRef.getBoundingClientRect().bottom <=
                    dropdownRef.clientHeight &&
                location() !== "top"
            ) {
                setLocation("top");
            }
        }
    };

    const updateAutoAlignment = () => {
        if (autoAlignment() && rootRef && dropdownRef) {
            if (
                window.innerWidth - rootRef.getBoundingClientRect().left <=
                    dropdownRef.clientWidth &&
                alignment() !== "end"
            ) {
                setAlignment("end");
            }
        }
    };

    onMount(() => {
        updateAutoLocation();
        updateAutoAlignment();
        window.addEventListener("resize", updateAutoLocation);
        window.addEventListener("resize", updateAutoAlignment);
    });

    onCleanup(() => {
        window.removeEventListener("resize", updateAutoLocation);
        window.removeEventListener("resize", updateAutoAlignment);
    });

    const classes = createMemo(() => ({
        "dropdown-end": alignment() === "end",
        "dropdown-top": location() === "top",
        "dropdown-bottom": location() === "bottom",
        "dropdown-left": location() === "left",
        "dropdown-right": location() === "right",
        "dropdown-hover": props.hover,
    }));
    return (
        <div ref={rootRef} class={`dropdown ${props.class}`} classList={classes()}>
            <label tabindex="0" class={`${labelClass}`}>
                {props.label}
            </label>
            <div
                ref={dropdownRef}
                tabIndex={0}
                class="dropdown-content p-2 shadow bg-base-300 rounded-xl w-64 menu menu-compact"
            >
                {props.children}
            </div>
        </div>
    );
};
export default Dropdown;
