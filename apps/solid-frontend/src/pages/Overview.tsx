import dayjs from "dayjs";
import { Component, createMemo, createResource, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import Stat from "~/Stat";

import servers from "../store/servers";
import { parseTimeString, scale } from "../utils/utils";


const createData = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const [data_value, data_resource] = createResource(
        async () => await servers.currentServer()?.workUnit.getForDateRangeAndUser(start.toDate(), end.toDate())
    );
    const [target_value, target_resource] = createResource(
        async () => await servers.currentServer()?.dailyWorkTimeTarget.getForDateRange(start.toDate(), end.toDate())
    );
    const workedTime = createMemo(() => data_value.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0));
    const targetTime = createMemo(() =>
        target_value.latest?.reduce(
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
    const targetReached = createMemo(() => !dayjs(workedTime()).isBefore(targetTime()));
    const diff = createMemo(() => Math.abs(dayjs(workedTime()).diff(targetTime())));
    return {
        workedTime,
        targetTime,
        targetReached,
        diff,
    };
};

const Overview: Component = () => {
    const today = createData(dayjs(), dayjs());
    const week = createData(dayjs().weekday(1), dayjs().weekday(7));
    const month = createData(dayjs().date(1), dayjs().date(dayjs().daysInMonth()));
    
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
                                value={dayjs.duration(today.workedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !today.targetReached(),
                                            "text-success": today.targetReached(),
                                        }}
                                    >
                                        {!today.targetReached() ? "-" : "+"}
                                        {dayjs.duration(today.diff()).format("H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(
                                                today.workedTime() ?? 0,
                                                today.targetTime() ?? 0,
                                                0,
                                                100,
                                                0
                                            ),
                                        }}
                                    >
                                        {dayjs.duration(today.workedTime() ?? 0).format("H:mm[h]")}
                                    </div>
                                }
                            ></Stat>
                            <Stat
                                title="This week"
                                value={dayjs.duration(week.workedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !week.targetReached(),
                                            "text-success": week.targetReached(),
                                        }}
                                    >
                                        {!week.targetReached() ? "-" : "+"}
                                        {dayjs.duration(week.diff()).format("D[d], H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(
                                                week.workedTime() ?? 0,
                                                week.targetTime() ?? 0,
                                                0,
                                                100,
                                                0
                                            ),
                                        }}
                                    >
                                        {dayjs.duration(week.workedTime() ?? 0).format("H:mm[h]")}
                                    </div>
                                }
                            ></Stat>
                            <Stat
                                title="This month"
                                value={dayjs.duration(month.workedTime() ?? 0).format("H:mm[h]")}
                                description={
                                    <span
                                        classList={{
                                            "text-error": !month.targetReached(),
                                            "text-success": month.targetReached(),
                                        }}
                                    >
                                        {!month.targetReached() ? "-" : "+"}
                                        {dayjs.duration(month.diff()).format("D[d], H:mm[h]")}
                                    </span>
                                }
                                figure={
                                    <div
                                        class="radial-progress"
                                        style={{
                                            "--value": scale(month.workedTime() ?? 0, month.targetTime() ?? 0, 0, 100, 0),
                                        }}
                                    >
                                        {dayjs.duration(month.workedTime() ?? 0).format("H:mm[h]")}
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
