import dayjs from "dayjs";
import { createMemo, createResource, Suspense } from "solid-js";

import categoryStore from "../../store/categoryStore";
import projectStore from "../../store/projectStore";
import Loading from "../Loading";

import type { Component } from "solid-js";

import type { TWorkUnit } from "lines-types";
type TProps = {
    unit: TWorkUnit;
    onClick?: (event: Event) => void;
    active?: boolean;
};

const WorkUnit: Component<TProps> = (props) => {
    const [project] = createResource(async () => await projectStore.getById(props.unit.project));
    const [category] = createResource(async () => await categoryStore.getById(props.unit.category));
    const start = createMemo(() => dayjs(props.unit?.start));
    const end = createMemo(() => dayjs(props.unit?.end));
    const duration = createMemo(() =>
        dayjs().hour(0).minute(0).second(0).millisecond(end().diff(start())),
    );
    return (
        <div
            class="grid grid-cols-[max-content_1fr_1fr] p-2 gap-2 border-base-100 border-2 rounded-lg transition-colors"
            classList={{
                "cursor-pointer": !!props.onClick,
                "bg-base-300": !props.active,
                "bg-base-200": props.active,
                "hover:bg-base-200": !!props.onClick,
            }}
            onClick={props.onClick}
        >
            <div class="flex flex-col">
                <span>{start().format("HH:mm")}</span>
                <span class="text-xs text-center">{duration().format("HH:mm")}</span>
                <span>{end().format("HH:mm")}</span>
            </div>
            <div class="flex flex-col pl-2 border-base-100 border-l-2">
                <Suspense fallback={<Loading />}>
                    <span>
                        <b>{project.latest?.title}</b>
                        {` - ${category.latest?.name}`}
                    </span>
                </Suspense>
                <p>{props.unit?.description}</p>
            </div>
        </div>
    );
};
export default WorkUnit;
