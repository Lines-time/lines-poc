import { createSignal } from "solid-js";
import Button from "~/Button";
import TextInput from "~/TextInput";

import authStore from "../store/authStore";

import type { Component } from "solid-js";
const Login: Component = () => {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const login = async (e: Event) => {
        e.preventDefault();
        await authStore.login?.(email(), password());
        window.location.href = "/"; // we want a full reload to update themeing
    };
    return (
        <div class="w-screen h-[90vh] flex flex-col items-center justify-center gap-3">
            <h1 class="text-3xl">Login</h1>
            <form onSubmit={login} class="flex flex-col items-center justify-center gap-3">
                <TextInput label="Email" required value={email()} setValue={setEmail} />
                <TextInput
                    label="Password"
                    type="password"
                    required
                    value={password()}
                    setValue={setPassword}
                />
                <Button primary submit>
                    Login
                </Button>
            </form>
        </div>
    );
};
export default Login;
