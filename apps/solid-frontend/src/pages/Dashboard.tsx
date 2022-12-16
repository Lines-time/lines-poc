import dayjs from "dayjs";
import { Component, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import DashboardStat from "~/specialized/DashboardStat";

const Dashboard: Component = () => {
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Dashboard" />
            <Suspense fallback={<Loading />}>
                <main class="p-6">
                    <h2 class="text-xl font-bold col-span-3">Your Activity</h2>
                    <div class="grid grid-cols-3 pt-4">
                        <div class="stats max-lg:stats-vertical col-span-3 bg-base-200 border-2 border-base-100">
                            <DashboardStat start={dayjs()} end={dayjs()} title="Today" />
                            <DashboardStat start={dayjs().weekday(1)} end={dayjs().weekday(7)} title="This week" />
                            <DashboardStat
                                start={dayjs().date(1)}
                                end={dayjs().date(dayjs().daysInMonth())}
                                title="This month"
                            />
                        </div>
                    </div>
                </main>
            </Suspense>
        </div>
    );
};
export default Dashboard;
