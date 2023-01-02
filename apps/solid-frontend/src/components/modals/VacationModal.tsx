import dayjs from "dayjs";
import { Component, ComponentProps, createSignal } from "solid-js";
import Button from "~/Button";
import Datetime from "~/Datetime";
import FormControl from "~/FormControl";
import Modal from "~/Modal";

import servers from "../../store/servers";

type TProps = Pick<ComponentProps<typeof Modal>, "open" | "onClose"> & {};

const VacationModal: Component<TProps> = (props) => {
    const [start, setStart] = createSignal(dayjs().toDate());
    const [end, setEnd] = createSignal(dayjs().toDate());
    const [description, setDescription] = createSignal("");

    const save = async (event: Event) => {
        event.preventDefault();
        await servers
            .currentServer()
            ?.vacation.submitVacationRequest(start(), end(), description());
        props.onClose();
    };

    return (
        <Modal open={props.open} onClose={props.onClose} title="Vacation">
            <form onSubmit={save} class="w-full">
                <FormControl label="Start">
                    <Datetime date value={start()} onChange={setStart} />
                </FormControl>
                <FormControl label="End">
                    <Datetime date value={end()} onChange={setEnd} />
                </FormControl>
                <FormControl label="Description">
                    <textarea
                        class="textarea textarea-bordered h-40 bg-base-200"
                        value={description()}
                        onInput={(e) => setDescription(e.currentTarget.value)}
                    />
                </FormControl>
                <div class="modal-action">
                    <Button submit primary>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
export default VacationModal;
