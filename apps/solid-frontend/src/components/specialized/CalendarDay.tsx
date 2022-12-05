import "./CalendarDay.css";
import "@fullcalendar/core/vdom";

import { Calendar, CalendarOptions, EventInput } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Component, createEffect, createMemo, createSignal, onMount } from "solid-js";

type TProps = {
    events: EventInput;
};

const CalendarDay: Component<TProps> = (props) => {
    let calendarRef: HTMLDivElement;

    const [calendar, setCalendar] = createSignal<Calendar | undefined>(undefined);

    const calendarOptions = createMemo<CalendarOptions>(() => ({
        plugins: [timeGridPlugin],
        headerToolbar: false,
        initialView: "timeGrid",
        duration: {
            days: 1,
        },
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
    return <div class="calendarDay h-full" ref={(el) => (calendarRef = el)}></div>;
};
export default CalendarDay;
