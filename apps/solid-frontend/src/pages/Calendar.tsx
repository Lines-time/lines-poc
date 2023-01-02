import { useSearchParams } from "@solidjs/router";
import dayjs from "dayjs";
import {
    Component,
    createEffect,
    createMemo,
    createResource,
    createSignal,
    onMount,
} from "solid-js";
import Dropdown from "~/Dropdown";
import Navbar from "~/Navbar";
import CalendarMonth from "~/specialized/CalendarMonth";

import servers from "../store/servers";
import { parseTimeStringDuration } from "../utils/utils";

const Calendar: Component = () => {
    const [now, setNow] = createSignal(dayjs());
    const start = createMemo(() => now().date(1));
    const end = createMemo(() => now().date(now().daysInMonth()));
    const [searchParams, setSearchParams] = useSearchParams();

    onMount(() => {
        if (searchParams.d === undefined) {
            setSearchParams({
                d: now().format("YYYY-MM-DD"),
            });
        } else {
            setNow(dayjs(searchParams.d));
        }
    });

    createEffect(() => {
        setSearchParams({
            d: now().format("YYYY-MM-DD"),
        });
    });

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
                render: () => (
                    <div class="border-2 border-secondary-focus bg-secondary rounded px-1 text-secondary-content">
                        {fd?.description}
                    </div>
                ),
            })) ?? [],
            vacations()?.map((v) => ({
                start: v!.start,
                end: v!.end,
                render: () => (
                    <Dropdown
                        class="w-full"
                        labelClass="w-full cursor-pointer"
                        label={
                            <div
                                class="border-2 rounded px-1"
                                classList={{
                                    "border-primary-focus": v!.approved,
                                    "bg-primary": v!.approved,
                                    "text-primary-content": v!.approved,
                                    // if not approved
                                    "border-error": !v!.approved,
                                    "bg-error": !v!.approved,
                                    "text-error-content": !v!.approved,
                                }}
                            >
                                {v!.description}
                            </div>
                        }
                    >
                        <h3>{v!.description}</h3>
                        {!v!.approved ? (
                            <div class="text-error">This vacation has not yet been approved</div>
                        ) : (
                            <div class="text-success">This vacation has been approved</div>
                        )}
                        <p>Start: {dayjs(v!.start).format("LL")}</p>
                        <p>End: {dayjs(v!.end).format("LL")}</p>
                    </Dropdown>
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
