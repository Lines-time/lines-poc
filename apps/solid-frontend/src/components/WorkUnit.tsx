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
    return (
        <div class="p-2 bg-base-200 rounded-lg">
            <div class="time">
                <span>{dayjs(unit?.start).format("HH:mm")}</span>
                {" - "}
                <span>{dayjs(unit?.end).format("HH:mm")}</span>
            </div>
            <span>{project()?.title}</span>
            <p>{unit?.description}</p>
        </div>
    );
};
export default WorkUnit;
