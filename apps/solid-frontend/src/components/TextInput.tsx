import { createMemo } from "solid-js";

import FormControl from "./FormControl";

import type { ComponentProps, Component } from "solid-js";

type TProps = Omit<ComponentProps<typeof FormControl>, "children"> & {
    placeholder?: string;
    value: string;
    required?: boolean;
    type?: "text" | "password";
    setValue: (value: string) => void;
};

const TextInput: Component<TProps> = (props) => {
    const _type = createMemo(() => props.type ?? "text");
    const required = createMemo(() => props.required ?? false);
    return (
        <FormControl {...props}>
            <input
                class="input input-bordered w-full max-w-xs bg-transparent"
                type={_type()}
                required={required()}
                placeholder={props.placeholder}
                value={props.value}
                onInput={(e) => props.setValue(e.currentTarget.value)}
            />
        </FormControl>
    );
};
export default TextInput;
