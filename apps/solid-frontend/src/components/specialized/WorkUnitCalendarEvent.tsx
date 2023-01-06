import dayjs from "dayjs";
import { Component, createResource, Show } from "solid-js";

import authStore from "../../store/authStore";
import categoryStore from "../../store/categoryStore";
import projectStore from "../../store/projectStore";

import type { TWorkUnit } from "lines-types";
type TProps = {
    workUnit: TWorkUnit;
    onClick?: (event: Event) => void;
};

const WorkUnitCalendarEvent: Component<TProps> = (props) => {
    const [project, projectResource] = createResource(
        async () => await projectStore.getById(props.workUnit.project)
    );
    const [category] = createResource(
        async () => await categoryStore.getById(props.workUnit.category)
    );
    const [me] = createResource(async () => await authStore.currentUser);
    return (
        <div
            class="w-full h-full border-2 rounded relative overflow-hidden"
            classList={{
                "cursor-pointer": !!props.onClick,
                "bg-primary": !(project.loading || me.loading),
                "bg-base-100": project.loading || me.loading,
            }}
            style={{
                "background-color": me()?.use_project_colors ? project.latest?.color : undefined,
                "border-color": "rgba(0, 0, 0, 0.2)",
                color: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={props.onClick}
        >
            <div id={props.workUnit.id} class="absolute -mt-16" />
            <p class="p-1 px-2">
                {project.latest?.title}: {category.latest?.name}
                <br />
                {dayjs(props.workUnit.start).format("H:mm")}-
                {dayjs(props.workUnit.end).format("H:mm")}
            </p>
            <Show when={props.workUnit.description}>
                <hr
                    class="border-primary-focus border-t-2"
                    style={{
                        "border-color": "rgba(0, 0, 0, 0.2)",
                    }}
                />
                <label class="text-xs px-2">Description:</label>
                <p class="px-2">{props.workUnit.description}</p>
            </Show>
        </div>
    );
};
export default WorkUnitCalendarEvent;
