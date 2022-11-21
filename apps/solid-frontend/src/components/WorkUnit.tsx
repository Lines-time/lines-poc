import dayjs from "dayjs";
import { Component, createMemo, createResource } from "solid-js";

import servers from "../store/servers";

import type { TWorkUnit } from "lines-types";

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
    const start = createMemo(() => dayjs(unit?.start));
    const end = createMemo(() => dayjs(unit?.end));
    const duration = createMemo(() => dayjs().hour(0).minute(0).second(0).millisecond(end().diff(start())));
    return (
        <div class="grid grid-cols-[max-content_1fr_1fr] p-2 gap-2 bg-base-200 rounded-lg">
            <div class="flex flex-col">
                <span>{start().format("HH:mm")}</span>
                <span class="text-xs text-center">{duration().format("HH:mm")}</span>
                <span>{end().format("HH:mm")}</span>
            </div>
            <div class="flex flex-col pl-2 border-solid border-base-300 border-l-2">
                <span>
                    <b>{project()?.title}</b>
                    {` - ${category()?.name}`}
                </span>
                <p>{unit?.description}</p>
            </div>
        </div>
    );
};
export default WorkUnit;
