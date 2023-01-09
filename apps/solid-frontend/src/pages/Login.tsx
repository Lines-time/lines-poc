import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import Button from "~/Button";
import TextInput from "~/TextInput";

import authStore from "../store/authStore";

const Login: Component = () => {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const navigate = useNavigate();
    const login = async (e: Event) => {
        e.preventDefault();
        await authStore.login?.(email(), password());
        window.location.href = "/";
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
