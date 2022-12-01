import { createMemo, JSX, ParentComponent } from "solid-js";

type TProps = {
    label: JSX.Element;
    alignment?: "end" | "start";
    location?: "top" | "bottom" | "left" | "right";
    hover?: boolean;
    labelClass?: string;
};

const Dropdown: ParentComponent<TProps> = (props) => {
    const { label, alignment = "start", location = "bottom", hover, children, labelClass = "btn" } = props;
    const classes = createMemo(() => ({
        "dropdown-end": alignment === "end",
        "dropdown-top": location === "top",
        "dropdown-bottom": location === "bottom",
        "dropdown-left": location === "left",
        "dropdown-right": location === "right",
        "dropdown-hover": hover,
    }));
    return (
        <div class="dropdown" classList={classes()}>
            <label tabindex="0" class={`${labelClass}`}>
                {label}
            </label>
            <ul tabIndex={0} class="dropdown-content p-2 shadow bg-base-300 rounded-xl w-64 menu menu-compact">
                {children}
            </ul>
        </div>
    );
};
export default Dropdown;
