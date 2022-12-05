import dayjs from "dayjs";
import { batch, Component, createEffect, createResource, createSignal, For, untrack } from "solid-js";
import Button from "~/Button";
import Datetime from "~/Datetime";
import FormControl from "~/FormControl";

import servers from "../../store/servers";

import type { TWorkUnit } from "lines-types";

type TProps = {
    onClose: () => void;
    onSave?: () => void;
    presetData?: Partial<TWorkUnit>;
};

const WorkUnitForm: Component<TProps> = (props) => {
    const [projectId, setProjectId] = createSignal<string | null>(props.presetData?.project ?? null);
    const [categoryId, setCategoryId] = createSignal<string | null>(props.presetData?.category ?? null);
    const [description, setDescription] = createSignal(props.presetData?.description ?? "");
    const [start, setStart] = createSignal(dayjs(props.presetData?.start ?? undefined).toDate());
    const [end, setEnd] = createSignal(dayjs(props.presetData?.end ?? undefined).toDate());
    const [loading, setLoading] = createSignal(false);
    const [projects, projectsResource] = createResource(async () => await servers.currentServer()?.project?.getAll());
    const [categories, categoriesResource] = createResource(projectId, async () => {
        if (projectId()) {
            return await servers.currentServer()?.category?.getForProject(projectId() ?? projects()?.[0]?.id ?? "");
        }
    });

    createEffect(() => {
        const data = props.presetData;
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
            setLoading(true);
            if (!props.presetData?.id) {
                await servers.currentServer()?.workUnit?.createOne({
                    project: _projectId,
                    category: _categoryId,
                    start: dayjs(start()).second(0).toDate().toISOString(),
                    end: dayjs(end()).second(0).toDate().toISOString(),
                    description: description(),
                });
            } else {
                await servers.currentServer()?.workUnit?.updateOne(props.presetData.id, {
                    project: _projectId,
                    category: _categoryId,
                    start: dayjs(start()).second(0).toDate().toISOString(),
                    end: dayjs(end()).second(0).toDate().toISOString(),
                    description: description(),
                });
            }
            setLoading(false);
            props.onSave?.();
            props.onClose();
        }
    };

    return (
        <form onSubmit={formSubmit} class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
                <FormControl label="Start">
                    <Datetime time location="top" value={start()} onChange={setStart} />
                </FormControl>
                <FormControl label="End">
                    <Datetime time location="top" align="end" value={end()} onChange={setEnd} />
                </FormControl>
            </div>
            <div class="flex flex-row gap-2">
                <FormControl label="Project">
                    <select
                        class="select select-bordered bg-base-300"
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
                        class="select select-bordered bg-base-300"
                        value={categoryId() ?? "null"}
                        disabled={!projectId()}
                        onChange={(e) => setCategoryId(e.currentTarget.value)}
                    >
                        <option value="null" disabled>
                            {!projectId() ? "Select project first" : "Select one"}
                        </option>
                        <For each={categories()}>
                            {(category) => <option value={category?.id}>{category?.name}</option>}
                        </For>
                    </select>
                </FormControl>
            </div>
            <FormControl label="Description" class="max-w-full">
                <textarea
                    class="textarea textarea-bordered h-full bg-base-300"
                    value={description()}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                />
            </FormControl>
            <div class="flex flex-row justify-end">
                <Button primary submit loading={loading()}>
                    Save
                </Button>
            </div>
        </form>
    );
};
export default WorkUnitForm;