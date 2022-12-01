import { Component, ComponentProps, createSignal } from "solid-js";
import Button from "~/Button";
import Modal from "~/Modal";
import TextInput from "~/TextInput";

type TProps = Omit<ComponentProps<typeof Modal>, "children" | "title"> & {
    onSave: (email: string, password: string) => void;
};

const LoginModal: Component<TProps> = (props) => {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const save = (event: Event) => {
        event.preventDefault();
        props.onSave(email(), password());
    };
    return (
        <Modal title="Login" onClose={props.onClose} open={props.open}>
            <form onSubmit={save}>
                <TextInput label="Email" required value={email()} setValue={setEmail} />
                <TextInput label="Password" type="password" required value={password()} setValue={setPassword} />
                <div class="modal-action">
                    <Button primary submit>
                        Login
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
export default LoginModal;
