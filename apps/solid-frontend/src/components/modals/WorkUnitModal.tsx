import { Component, ComponentProps, createResource, createSignal, For } from "solid-js";
import Button from "~/Button";
import FormControl from "~/FormControl";
import Modal from "~/Modal";

import servers from "../../store/servers";

type TProps = Omit<ComponentProps<typeof Modal>, "title" | "children"> & {};

const WorkUnitModal: Component<TProps> = (props) => {
    const [description, setDescription] = createSignal("");
    const [projects, projectsResource] = createResource(async () => await servers.currentServer()?.project?.getAll());
    const [categories, categoriesResource] = createResource(
        () => projects(),
        async () => await servers.currentServer()?.category?.getForProject(projects()?.[0]?.id ?? "")
    );

    const formSubmit = (event: Event) => {
        event.preventDefault();
    };

    return (
        <Modal {...props} title="Track your time">
            <form onSubmit={formSubmit}>
                <FormControl label="Project">
                    <select class="select select-bordered">
                        <For each={projects()}>
                            {(project) => <option value={project?.id}>{project?.title}</option>}
                        </For>
                    </select>
                </FormControl>
                <FormControl label="Project">
                    <select class="select select-bordered">
                        <For each={categories()}>
                            {(category) => <option value={category?.id}>{category?.name}</option>}
                        </For>
                    </select>
                </FormControl>
                <FormControl label="Description">
                    <textarea
                        class="textarea textarea-bordered"
                        value={description()}
                        onInput={(e) => setDescription(e.currentTarget.value)}
                    />
                </FormControl>
                <div class="modal-action">
                    <Button submit>Save</Button>
                </div>
            </form>
        </Modal>
    );
};
export default WorkUnitModal;
