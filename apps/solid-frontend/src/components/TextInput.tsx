import FormControl from "./FormControl";

import type { Component, ComponentProps } from "solid-js";

type TProps = Omit<ComponentProps<typeof FormControl>, "children"> & {
    placeholder?: string;
    value: string;
    required?: boolean;
    type?: "text" | "password";
    setValue: (value: string) => void;
};

const TextInput: Component<TProps> = (props) => {
    const { placeholder, setValue, value, type = "text", required = false, ...formControlProps } = props;
    return (
        <FormControl {...formControlProps}>
            <input
                class="input input-bordered w-full max-w-xs bg-transparent"
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onInput={(e) => setValue(e.currentTarget.value)}
            />
        </FormControl>
    );
};
export default TextInput;
