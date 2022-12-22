import dayjs from "dayjs";
import { Component, createMemo, createResource, createSignal } from "solid-js";
import Navbar from "~/Navbar";
import CalendarMonth from "~/specialized/CalendarMonth";

import servers from "../store/servers";
import { parseTimeString } from "../utils/utils";

const Calendar: Component = () => {
    const [now, setNow] = createSignal(dayjs());
    const start = createMemo(() => now().date(1));
    const end = createMemo(() => now().date(now().daysInMonth()));

    const [targetTime, targetTimeResource] = createResource(
        async () => await servers.currentServer()?.dailyWorkTimeTarget.getForDateRange(start().toDate(), end().toDate()) ?? []
    );
    const [freeDays, freeDaysResource] = createResource(
        async () => await servers.currentServer()?.freeDay.getForDateRange(start().toDate(), end().toDate()) ?? []
    );

    const events = createMemo(() => {
        return (
            targetTime()?.map((tt) => ({
                start: tt!.date,
                end: tt!.date,
                render: () => <div>{parseTimeString(tt?.duration).format("H:mm[h]")}</div>,
            })) ?? []
        ).concat(
            freeDays()?.map((fd) => ({
                start: fd!.date,
                end: fd!.date,
                render: () => <div>{fd?.description}</div>,
            })) ?? []
        );
    });

    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Calendar" />
            <div>
                <CalendarMonth now={now} onUpdateNow={setNow} events={events} />
            </div>
        </div>
    );
};
export default Calendar;
