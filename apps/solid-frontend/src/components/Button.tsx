import { Accessor, Component, ComponentProps, createMemo, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { LucideProps } from "lucide-solid";
type TProps = Omit<ComponentProps<"button">, "disabled"> & {
    primary?: boolean;
    submit?: boolean;
    icon?: Component<LucideProps>;
    loading?: boolean;
    error?: boolean;
    disabled?: Accessor<boolean>;
};

const Button: Component<TProps> = (props) => {
    const {
        primary = false,
        submit = false,
        error = false,
        icon,
        children,
        loading,
        disabled,
        ...buttonProps
    } = props;

    const classes = createMemo(() => ({
        btn: true,
        "btn-primary": primary && !error,
        "btn-ghost": !(primary || error),
        "btn-error": !primary && error,
        "gap-2": icon !== undefined,
        "btn-square": icon && !children,
        loading: loading,
        "btn-disabled": disabled?.(),
    }));

    return (
        <button type={submit ? "submit" : "button"} classList={classes()} {...buttonProps}>
            <Show when={icon}>
                <Dynamic component={icon} size={20} />
            </Show>
            {children}
        </button>
    );
};

export default Button;
