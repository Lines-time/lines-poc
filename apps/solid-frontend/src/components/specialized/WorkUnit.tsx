import dayjs from "dayjs";
import { Component, createMemo, createResource, Suspense } from "solid-js";

import categoryStore from "../../store/categoryStore";
import projectStore from "../../store/projectStore";
import Loading from "../Loading";

import type { TWorkUnit } from "lines-types";
type TProps = {
    unit: TWorkUnit;
    onClick?: (event: Event) => void;
    active?: boolean;
};

const WorkUnit: Component<TProps> = (props) => {
    const { unit } = props;
    const [project, projectResource] = createResource(
        async () => await projectStore.getById(unit.project)
    );
    const [category, categoryResource] = createResource(
        async () => await categoryStore.getById(unit.category)
    );
    const start = createMemo(() => dayjs(unit?.start));
    const end = createMemo(() => dayjs(unit?.end));
    const duration = createMemo(() =>
        dayjs().hour(0).minute(0).second(0).millisecond(end().diff(start()))
    );
    return (
        // rome-ignore lint/a11y/useKeyWithClickEvents:
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
                        <b>{project()?.title}</b>
                        {` - ${category()?.name}`}
                    </span>
                </Suspense>
                <p>{unit?.description}</p>
            </div>
        </div>
    );
};
export default WorkUnit;
