import dayjs from "dayjs";
import { Component, createSignal } from "solid-js";
import CalendarMonth from "~/specialized/CalendarMonth";

const Month: Component = () => {
    const [now, setNow] = createSignal(dayjs());
    return (
        <div>
            <CalendarMonth now={now} controls={false} />
        </div>
    );
};
export default Month;
