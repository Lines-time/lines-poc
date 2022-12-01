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
                                value="value"
                                description="Description"
                                figure={<div class="radial-progress" style="--value:70;"></div>}
                            ></Stat>
                            <Stat
                                title="This month"
                                value="value"
                                description="Description"
                                figure={<div class="radial-progress" style="--value:70;"></div>}
                            ></Stat>
                        </div>
                    </div>
                </main>
            </Suspense>
        </div>
    );
};
export default Overview;
