import dayjs from "dayjs";
import { createMemo } from "solid-js";

import type { Component } from "solid-js";

import type { TCalendarEvent } from "../../../types";

type EventProps = {
    event: TCalendarEvent;
    interval: number;
};

const Event: Component<EventProps> = (props) => {
    const intervalsInHour = createMemo(() => 60 / props.interval);
    const startRow = createMemo(
        () =>
            dayjs(props.event.start).hour() * intervalsInHour() +
            dayjs(props.event.start).minute() / props.interval,
    );
    const endRow = createMemo(
        () =>
            dayjs(props.event.end).hour() * intervalsInHour() +
            dayjs(props.event.end).minute() / props.interval,
    );
    return (
        <div
            class="absolute h-full w-full"
            classList={{
                "pointer-events-none": !props.event.pointerEvents,
            }}
            style={{
                "grid-row-start": startRow() + 1,
                "grid-row-end": `${endRow() + 1}`,
            }}
        >
            <props.event.display />
        </div>
    );
};

export default Event;
