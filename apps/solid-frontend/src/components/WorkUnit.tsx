import dayjs from "dayjs";
import { Component, createResource } from "solid-js";

import servers from "../store/servers";

import type { TWorkUnit } from "../utils/types";

type TProps = {
    unit: TWorkUnit;
};

const WorkUnit: Component<TProps> = (props) => {
    const { unit } = props;
    const [project, projectResource] = createResource(
        () => servers.currentServer(),
        async () => await servers.currentServer()?.project.getById(unit.project)
    );
    const [category, categoryResource] = createResource(
        () => servers.currentServer(),
        async () => await servers.currentServer()?.category.getById(unit.category)
    );
    return (
        <div class="grid grid-cols-[max-content_1fr_1fr] p-2 gap-2 bg-base-200 rounded-lg">
            <div class="flex flex-col gap-2">
                <span>{dayjs(unit?.start).format("HH:mm")}</span>
                <span>{dayjs(unit?.end).format("HH:mm")}</span>
            </div>
            <div
                class="flex flex-col gap-2 pl-2 border-solid border-base-300"
                classList={{ "border-l-2": !unit?.description, "border-x-2": !!unit?.description }}
            >
                <span>{project()?.title}</span>
                <span>{category()?.name}</span>
            </div>
            <p>{unit?.description}</p>
        </div>
    );
};
export default WorkUnit;
