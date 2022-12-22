import dayjs from "dayjs";
import { Component, createSignal } from "solid-js";
import CalendarWeek from "~/specialized/CalendarWeek";

const Week: Component = () => {
    const [now, setNow] = createSignal(dayjs());
    return (
        <div>
            <CalendarWeek now={now} onUpdateNow={setNow} controls={false} />
        </div>
    );
};
export default Week;
