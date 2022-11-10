import { Component, ComponentProps, createSignal } from "solid-js";
import Button from "~/Button";
import Modal from "~/Modal";
import TextInput from "~/TextInput";

type TProps = Omit<ComponentProps<typeof Modal>, "children" | "id" | "title"> & {
    onSave: (email: string, password: string) => void;
};

const LoginModal: Component<TProps> = (props) => {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const save = () => {
        props.onSave(email(), password());
    };
    return (
        <Modal id="login" title="Login" {...props}>
            <TextInput label="Email" required value={email()} setValue={setEmail} />
            <TextInput label="Password" type="password" required value={password()} setValue={setPassword} />
            <div class="modal-action">
                <Button primary onClick={save}>
                    Login
                </Button>
            </div>
        </Modal>
    );
};
export default LoginModal;
