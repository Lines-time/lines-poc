import { createMemo, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { Component, ComponentProps } from "solid-js";
import type { LucideProps } from "lucide-solid";
type TProps = Omit<ComponentProps<"button">, "disabled"> & {
    primary?: boolean;
    submit?: boolean;
    icon?: Component<LucideProps>;
    loading?: boolean;
    error?: boolean;
    disabled?: boolean;
};

const Button: Component<TProps> = (props) => {
    const primary = createMemo(() => props.primary ?? false);
    const submit = createMemo(() => props.submit ?? false);
    const error = createMemo(() => props.error ?? false);

    const classes = createMemo(() => ({
        btn: true,
        "btn-primary": primary() && !error(),
        "btn-ghost": !(primary() || error()),
        "btn-error": !primary() && error(),
        "gap-2": props.icon !== undefined,
        "btn-square": props.icon && !props.children,
        loading: props.loading,
        "btn-disabled": props.disabled,
    }));

    return (
        <button type={submit() ? "submit" : "button"} classList={classes()} {...props}>
            <Show when={props.icon}>
                <Dynamic component={props.icon} size={20} />
            </Show>
            {props.children}
        </button>
    );
};

export default Button;
