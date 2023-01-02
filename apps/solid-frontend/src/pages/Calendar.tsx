import dayjs from "dayjs";
import { Component, createMemo, createResource, createSignal } from "solid-js";
import Navbar from "~/Navbar";
import CalendarMonth from "~/specialized/CalendarMonth";

import servers from "../store/servers";
import { parseTimeStringDuration } from "../utils/utils";

const Calendar: Component = () => {
    const [now, setNow] = createSignal(dayjs());
    const start = createMemo(() => now().date(1));
    const end = createMemo(() => now().date(now().daysInMonth()));

    const [targetTime] = createResource(
        () => now(),
        async () =>
            (await servers
                .currentServer()
                ?.dailyWorkTimeTarget.getForDateRange(start().toDate(), end().toDate())) ?? []
    );
    const [freeDays] = createResource(
        () => now(),
        async () =>
            await servers.currentServer()?.freeDay.getForDateRange(start().toDate(), end().toDate())
    );
    const [vacations] = createResource(
        () => now(),
        async () =>
            await servers
                .currentServer()
                ?.vacation.getForDateRangeAndUser(start().toDate(), end().toDate())
    );

    const events = createMemo(() => {
        return (
            targetTime()
                ?.filter((tt) => {
                    return !(
                        vacations()?.some((v) =>
                            dayjs(tt!.date).isBetween(v!.start, v!.end, "day", "[]")
                        ) ||
                        freeDays()?.some((fd) =>
                            dayjs(tt!.date).isBetween(fd!.date, fd!.date, "day", "[]")
                        )
                    );
                })
                .map((tt) => ({
                    start: tt!.date,
                    end: tt!.date,
                    render: () => (
                        <div>{parseTimeStringDuration(tt?.duration).format("H:mm[h]")}</div>
                    ),
                })) ?? []
        ).concat(
            freeDays()?.map((fd) => ({
                start: fd!.date,
                end: fd!.date,
                render: () => <div class="border-2 border-secondary-focus bg-secondary rounded px-1 text-secondary-content">{fd?.description}</div>,
            })) ?? [],
            vacations()?.map((v) => ({
                start: v!.start,
                end: v!.end,
                render: () => (
                    <div class="border-2 border-primary-focus rounded bg-primary text-primary-content px-1">
                        {v!.description}
                    </div>
                ),
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
