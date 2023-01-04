import { Accessor, JSX, Show } from "solid-js";

import type { TParentComponent } from "../types";

type TProps = {
    label?: JSX.Element;
    altLabels?: JSX.Element[];
    class?: string;
    error?: Accessor<string | boolean>;
};

const FormControl: TParentComponent<TProps> = (props) => {
    const { label, altLabels = [], error } = props;
    return (
        <div class={`form-control w-full max-w-xs ${props.class}`}>
            <Show when={label || altLabels.length > 0}>
                <label class="label">
                    <Show when={label}>
                        <span class="label-text">{label}</span>
                    </Show>
                    <Show when={altLabels.length > 0}>
                        <span class="label-text-alt">{altLabels[0]}</span>
                    </Show>
                </label>
            </Show>
            {props.children}
            <Show when={altLabels.length > 1 || error}>
                <label class="label">
                    <Show when={altLabels.length > 1}>
                        <span class="label-text-alt">{altLabels[1]}</span>
                    </Show>
                    <Show when={error}>
                        <span class="label-text-alt text-error">{error}</span>
                    </Show>
                </label>
            </Show>
        </div>
    );
};
export default FormControl;
