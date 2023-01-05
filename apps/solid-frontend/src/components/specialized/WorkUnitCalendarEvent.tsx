import dayjs from "dayjs";
import { Component, createResource } from "solid-js";

import categoryStore from "../../store/categoryStore";
import projectStore from "../../store/projectStore";

import type { TWorkUnit } from "lines-types";
type TProps = {
    workUnit: TWorkUnit;
};

const WorkUnitCalendarEvent: Component<TProps> = (props) => {
    const [project] = createResource(
        async () => await projectStore.getById(props.workUnit.project)
    );
    const [category] = createResource(
        async () => await categoryStore.getById(props.workUnit.category)
    );
    return (
        <div class="w-full h-full bg-primary text-primary-content border-2 rounded border-primary-focus">
            <p class="p-1 px-2">
                {project()?.title}: {category()?.name}
                <br />
                {dayjs(props.workUnit.start).format("H:mm")}-
                {dayjs(props.workUnit.end).format("H:mm")}
            </p>
            <hr class="border-primary-focus border-t-2" />
            <label class="text-xs px-2">Description:</label>
            <p class="px-2">{props.workUnit.description}</p>
        </div>
    );
};
export default WorkUnitCalendarEvent;
