import { Component, For } from "solid-js";
import ForNumber from "~/ForNumber";

import CalendarEvent from "./CalendarEvent";

import type { TCalendarEvent } from "../../../types";
type DayProps = {
    steps: number;
    interval: number;
    events: TCalendarEvent[];
};

const Day: Component<DayProps> = (props) => {
    return (
        <div class="grid h-full w-full border-2 border-base-100 rounded-lg relative">
            <ForNumber each={props.steps}>
                {(step) => <div class="border-b border-dashed border-base-100" />}
            </ForNumber>
            <For each={props.events}>
                {(e) => <CalendarEvent event={e} interval={props.interval} />}
            </For>
        </div>
    );
};

export default Day;
