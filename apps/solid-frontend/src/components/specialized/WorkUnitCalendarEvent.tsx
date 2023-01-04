import type { TWorkUnit } from "lines-types";
import type { Component } from "solid-js";

type TProps = {
    workUnit: TWorkUnit;
};

const WorkUnitCalendarEvent: Component<TProps> = (props) => {
    return (
        <div class="w-full h-full bg-primary text-primary-content border-2 rounded border-primary-focus">
            <p>{props.workUnit.description}</p>
        </div>
    );
};
export default WorkUnitCalendarEvent;
