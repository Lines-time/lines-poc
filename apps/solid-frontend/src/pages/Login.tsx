import { LogIn } from "lucide-solid";
import { Component, createSignal } from "solid-js";
import Button from "~/Button";
import TextInput from "~/TextInput";

import { useDirectus } from "../hooks/useDirectus";

const Login: Component = () => {
    const directus = useDirectus();
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        directus.auth.login({
            email: email(),
            password: password(),
        });
    };

    return (
        <div class="flex flex-col items-center w-full h-screen justify-center overflow-hidden gap-2">
            <span class="prose">
                <h1>Login</h1>
            </span>
            <form onSubmit={handleSubmit} class="flex flex-col items-center gap-2">
                <TextInput required value={email()} setValue={setEmail} label="Email" placeholder="Your email" />
                <TextInput
                    required
                    type="password"
                    value={password()}
                    setValue={setPassword}
                    label="Password"
                    placeholder="Your password"
                />
                <Button submit primary icon={LogIn}>
                    Login
                </Button>
            </form>
        </div>
    );
};
export default Login;
