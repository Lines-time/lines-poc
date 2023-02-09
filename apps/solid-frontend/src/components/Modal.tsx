import { X } from "lucide-solid";
import { Show } from "solid-js";
import { Portal } from "solid-js/web";

import Button from "./Button";

import type { ParentComponent } from "solid-js";
interface IProps {
    open: boolean;
    title: string;
    onClose: () => void;
}

const Modal: ParentComponent<IProps> = (props) => {
    const toggle = (value: boolean) => {
        if (!value) props.onClose();
    };
    return (
        <Portal mount={document.getElementsByTagName("body")[0]}>
            <input type="checkbox" checked={props.open} class="modal-toggle" />
            <Show when={props.open}>
                <div class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box bg-base-200 !rounded-xl">
                        <Button
                            onClick={() => toggle(false)}
                            class="btn-sm btn-circle absolute right-2 top-2"
                        >
                            <X />
                        </Button>
                        <h3>{props.title}</h3>
                        {props.children}
                    </div>
                </div>
            </Show>
        </Portal>
    );
};
export default Modal;
