import { createMemo, Show } from "solid-js";

import type { JSX } from "solid-js";

import type { TParentComponent } from "../types";

type TProps = {
    label?: JSX.Element;
    altLabels?: JSX.Element[];
    class?: string;
    error?: string | boolean;
    inline?: boolean;
};

const FormControl: TParentComponent<TProps> = (props) => {
    const altLabels = createMemo(() => props.altLabels ?? []);
    return (
        <>
            <Show when={!props.inline}>
                <div class={`form-control w-full max-w-xs ${props.class}`}>
                    <Show when={props.label || altLabels().length > 0}>
                        <label class="label">
                            <Show when={props.label}>
                                <span class="label-text">{props.label}</span>
                            </Show>
                            <Show when={altLabels().length > 0}>
                                <span class="label-text-alt">{altLabels()[0]}</span>
                            </Show>
                        </label>
                    </Show>
                    {props.children}
                    <Show when={altLabels().length > 1 || props.error}>
                        <label class="label">
                            <Show when={altLabels().length > 1}>
                                <span class="label-text-alt">{altLabels()[1]}</span>
                            </Show>
                            <Show when={props.error}>
                                <span class="label-text-alt text-error">{props.error}</span>
                            </Show>
                        </label>
                    </Show>
                </div>
            </Show>
            <Show when={props.inline}>
                <div class={`form-control w-full max-w-xs ${props.class}`}>
                    <label class="label cursor-pointer">
                        <Show when={props.label}>
                            <span class="label-text">{props.label}</span>
                        </Show>
                        {props.children}
                    </label>
                </div>
            </Show>
        </>
    );
};
export default FormControl;
