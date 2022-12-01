import dayjs from "dayjs";
import { Component, createMemo, createResource, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import Stat from "~/Stat";

import servers from "../store/servers";
import { parseTimeString, scale } from "../utils/utils";

const Overview: Component = () => {
    const [todayData, todayDataResource] = createResource(
        async () => await servers.currentServer()?.workUnit.getForDayAndUser(dayjs().toDate())
    );
    const [todayTarget, todayTargetResource] = createResource(
        async () => await servers.currentServer()?.dailyWorkTimeTarget.getForDate(dayjs().toDate())
    );

    const [weekData, weekDataResource] = createResource(
        async () =>
            await servers
                .currentServer()
                ?.workUnit.getForDateRangeAndUser(dayjs().weekday(1).toDate(), dayjs().weekday(7).toDate())
    );
    const [weekTargets, weekTargetsResource] = createResource(
        async () =>
            await servers
                .currentServer()
                ?.dailyWorkTimeTarget.getForDateRange(dayjs().weekday(1).toDate(), dayjs().weekday(7).toDate())
    );

    const [monthData, monthDataResource] = createResource(
        async () =>
            await servers
                .currentServer()
                ?.workUnit.getForDateRangeAndUser(
                    dayjs().date(1).toDate(),
                    dayjs().date(dayjs().daysInMonth()).toDate()
                )
    );
    const [monthTarget, monthTargetResource] = createResource(
        async () =>
            await servers
                .currentServer()
                ?.dailyWorkTimeTarget.getForDateRange(
                    dayjs().date(1).toDate(),
                    dayjs().date(dayjs().daysInMonth()).toDate()
                )
    );

    const todayWorkedTime = createMemo(() => todayData.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0));
    const todayTargetTime = createMemo(() =>
        todayTarget.latest?.reduce(
            (a, b) =>
                a +
                dayjs
                    .duration({
                        hours: parseTimeString(b?.duration).hour(),
                        minutes: parseTimeString(b?.duration).minute(),
                    })
                    .asMilliseconds(),
            0
        )
    );
    const todayTargetReached = createMemo(() => !dayjs(todayWorkedTime()).isBefore(todayTargetTime()));
    const todayDiff = createMemo(() => Math.abs(dayjs(todayWorkedTime()).diff(todayTargetTime())));

    const weekWorkedTime = createMemo(() => weekData.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0));
    const weekTargetTime = createMemo(() =>
        weekTargets.latest?.reduce(
            (a, b) =>
                a +
                dayjs
                    .duration({
                        hours: parseTimeString(b?.duration).hour(),
                        minutes: parseTimeString(b?.duration).minute(),
                    })
                    .asMilliseconds(),
            0
        )
    );
    const weekTargetReached = createMemo(() => !dayjs(weekWorkedTime()).isBefore(weekTargetTime()));
    const weekDiff = createMemo(() => Math.abs(dayjs(weekWorkedTime()).diff(weekTargetTime())));

    const monthWorkedTime = createMemo(() => monthData.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0));
    const monthTargetTime = createMemo(() =>
        monthTarget.latest?.reduce(
            (a, b) =>
                a +
                dayjs
                    .duration({
                        hours: parseTimeString(b?.duration).hour(),
                        minutes: parseTimeString(b?.duration).minute(),
                    })
                    .asMilliseconds(),
            0
        )
    );
    const monthTargetReached = createMemo(() => !dayjs(monthWorkedTime()).isBefore(monthTargetTime()));
    const monthDiff = createMemo(() => Math.abs(dayjs(monthWorkedTime()).diff(monthTargetTime())));

    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Overview" />
            <Suspense fallback={<Loading />}>
                <main class="p-6">
                    <h2 class="text-xl font-bold col-span-3">Your Activity</h2>
                    <div class="grid grid-cols-3 pt-4">
                        <div class="stats max-lg:stats-vertical col-span-3 bg-base-200 border-2 border-base-100">
                            <Stat
                                title="Today"
                                value={dayjs.duration(todayWorkedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !todayTargetReached(),
                                            "text-success": todayTargetReached(),
                                        }}
                                    >
                                        {!todayTargetReached() ? "-" : "+"}
                                        {dayjs.duration(todayDiff()).format("H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(todayWorkedTime() ?? 0, todayTargetTime() ?? 0, 0, 100, 0),
                                        }}
                                    >
                                        {dayjs.duration(todayWorkedTime() ?? 0).format("H:mm[h]")}
                                    </div>
                                }
                            ></Stat>
                            <Stat
                                title="This week"
                                value={dayjs.duration(weekWorkedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !weekTargetReached(),
                                            "text-success": weekTargetReached(),
                                        }}
                                    >
                                        {!weekTargetReached() ? "-" : "+"}
                                        {dayjs.duration(weekDiff()).format("H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(weekWorkedTime() ?? 0, weekTargetTime() ?? 0, 0, 100, 0),
                                        }}
                                    >
                                        {dayjs.duration(weekWorkedTime() ?? 0).format("H:mm[h]")}
                                    </div>
                                }
                            ></Stat>
                            <Stat
                                title="This month"
                                value={dayjs.duration(monthWorkedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !monthTargetReached(),
                                            "text-success": monthTargetReached(),
                                        }}
                                    >
                                        {!monthTargetReached() ? "-" : "+"}
                                        {dayjs.duration(monthDiff()).format("D[d], H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(monthWorkedTime() ?? 0, monthTargetTime() ?? 0, 0, 100, 0),
                                        }}
                                    >
                                        {dayjs.duration(monthWorkedTime() ?? 0).format("H:mm[h]")}
                                    </div>
                                }
                            ></Stat>
                        </div>
                    </div>
                </main>
            </Suspense>
        </div>
    );
};
export default Overview;
