import dayjs from "dayjs";
import { Component, createMemo, createResource, createSignal } from "solid-js";
import CalendarWeek from "~/specialized/Calendar/CalendarWeek";
import WorkUnitCalendarEvent from "~/specialized/WorkUnitCalendarEvent";

import settingsStore from "../../store/settingsStore";
import workUnitStore from "../../store/workUnitStore";

const Week: Component = () => {
    const [now, setNow] = createSignal(dayjs());

    const [settings] = createResource(async () => await settingsStore.get());
    const trackingInterval = createMemo(() => settings()?.tracking_increment ?? 30);

    const [workUnits] = createResource(
        async () =>
            await workUnitStore.getForDateRangeAndUser(
                now().isoWeekday(1).toDate(),
                now().isoWeekday(7).toDate()
            )
    );

    const events = createMemo(
        () =>
            workUnits()?.map((wu) => ({
                start: dayjs(wu.start).toDate(),
                end: dayjs(wu.end).toDate(),
                display: () => <WorkUnitCalendarEvent workUnit={wu} />,
            })) ?? []
    );
    return (
        <div class="overflow-auto">
            <CalendarWeek now={now} controls={false} interval={trackingInterval} events={events} />
        </div>
    );
};
export default Week;
