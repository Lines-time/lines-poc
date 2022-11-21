import dayjs from "dayjs";
import { batch, Component, ComponentProps, createEffect, createResource, createSignal, For, untrack } from "solid-js";
import Button from "~/Button";
import Datetime from "~/Datetime";
import FormControl from "~/FormControl";
import Modal from "~/Modal";

import servers from "../../store/servers";

import type { TWorkUnit } from "lines-types";

type TProps = Omit<ComponentProps<typeof Modal>, "title" | "children"> & {
    onSave?: () => void;
    presetData?: () => Partial<TWorkUnit>;
};

const WorkUnitModal: Component<TProps> = (props) => {
    const [projectId, setProjectId] = createSignal<string | null>(props.presetData?.().project ?? null);
    const [categoryId, setCategoryId] = createSignal<string | null>(props.presetData?.().category ?? null);
    const [description, setDescription] = createSignal(props.presetData?.().description ?? "");
    const [start, setStart] = createSignal(dayjs(props.presetData?.().start ?? undefined).toDate());
    const [end, setEnd] = createSignal(dayjs(props.presetData?.().end ?? undefined).toDate());
    const [projects, projectsResource] = createResource(async () => await servers.currentServer()?.project?.getAll());
    const [categories, categoriesResource] = createResource(
        () => [projects(), projectId()],
        async () => {
            if (projectId()) {
                return await servers
                    .currentServer()
                    ?.category?.getForProject(
                        projects()?.find((p) => p!.id === projectId())?.id ?? projects()?.[0]?.id ?? ""
                    );
            }
        }
    );

    createEffect(() => {
        props.open;
        const data = props.presetData?.();
        untrack(() => {
            batch(() => {
                setProjectId(data?.project ?? null);
                setCategoryId(data?.category ?? null);
                setDescription(data?.description ?? "");
                setStart(dayjs(data?.start ?? undefined).toDate());
                setEnd(dayjs(data?.end ?? undefined).toDate());
            });
        });
    });

    const formSubmit = async (event: Event) => {
        event.preventDefault();
        const _projectId = projectId();
        const _categoryId = categoryId();
        if (_projectId && _categoryId) {
            await servers.currentServer()?.workUnit?.createOne({
                project: _projectId,
                category: _categoryId,
                start: start().toISOString(),
                end: end().toISOString(),
                description: description(),
            });
            props.onSave?.();
            props.onClose();
        }
    };

    return (
        <Modal {...props} title="Track your time">
            <form onSubmit={formSubmit}>
                <div class="flex flex-row gap-2">
                    <div>
                        <FormControl label="Project">
                            <select
                                class="select select-bordered"
                                value={projectId() ?? "null"}
                                onChange={(e) => setProjectId(e.currentTarget.value)}
                            >
                                <option value="null" disabled>
                                    Select one
                                </option>
                                <For each={projects()}>
                                    {(project) => <option value={project?.id}>{project?.title}</option>}
                                </For>
                            </select>
                        </FormControl>
                        <FormControl label="Service">
                            <select
                                class="select select-bordered"
                                value={categoryId() ?? "null"}
                                onChange={(e) => setCategoryId(e.currentTarget.value)}
                            >
                                <option value="null" disabled>
                                    Select one
                                </option>
                                <For each={categories()}>
                                    {(category) => <option value={category?.id}>{category?.name}</option>}
                                </For>
                            </select>
                        </FormControl>
                    </div>
                    <FormControl label="Description">
                        <textarea
                            class="textarea textarea-bordered h-full"
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        />
                    </FormControl>
                </div>
                <div class="flex flex-row gap-2">
                    <FormControl label="Start">
                        <Datetime time location="top" value={start()} onChange={setStart} />
                    </FormControl>
                    <FormControl label="End">
                        <Datetime time location="top" align="end" value={end()} onChange={setEnd} />
                    </FormControl>
                </div>
                <div class="modal-action">
                    <Button primary submit>
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
export default WorkUnitModal;
