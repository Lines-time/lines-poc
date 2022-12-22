import "@fullcalendar/core/vdom";

import { Calendar, CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Component, createEffect, createMemo, createSignal, onMount } from "solid-js";

type TProps = {
    events: EventInput;
};

const CalendarMonth: Component<TProps> = (props) => {
    let calendarRef: HTMLDivElement;

    const [calendar, setCalendar] = createSignal<Calendar | undefined>(undefined);

    const calendarOptions = createMemo<CalendarOptions>(() => ({
        plugins: [dayGridPlugin],
        headerToolbar: false,
        initialView: "dayGridMonth",
        events: props.events,
    }));

    createEffect(() => {
        calendarOptions();
        updateCalendar();
    });

    const updateCalendar = () => {
        if (calendar()) {
            calendar()?.pauseRendering();
            calendar()?.resetOptions(calendarOptions());
            calendar()?.resumeRendering();
            calendar()?.render();
        }
    };

    onMount(() => {
        setCalendar(new Calendar(calendarRef, calendarOptions()));
        calendar()?.render();
    });
    return <div class="calendarMonth w-full h-full" ref={(el) => (calendarRef = el)}></div>;
};
export default CalendarMonth;
