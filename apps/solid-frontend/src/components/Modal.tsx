import { X } from "lucide-solid";
import { ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";

interface IProps {
    id: string;
    open: boolean;
    title: string;
    onClose: () => void;
}

const Modal: ParentComponent<IProps> = (props) => {
    const toggle = (value: boolean) => {
        if (props.open && !value) props.onClose();
    };
    return (
        <Portal mount={document.getElementsByTagName("body")[0]}>
            <input
                type="checkbox"
                id={props.id}
                checked={props.open}
                onInput={(e) => toggle(e.currentTarget.checked)}
                class="modal-toggle"
            />
            <Show when={props.open}>
                <div class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <label for={props.id} class="btn btn-sm btn-circle absolute right-2 top-2">
                            <X />
                        </label>
                        <h3>{props.title}</h3>
                        {props.children}
                    </div>
                </div>
            </Show>
        </Portal>
    );
};
export default Modal;
