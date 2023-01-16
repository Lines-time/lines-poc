import dayjs from "dayjs";
import { Component, createMemo, createResource, For, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import DashboardProjectItem from "~/specialized/DashboardProjectItem";
import DashboardStat from "~/specialized/DashboardStat";
import WorkTimeTarget from "~/specialized/WorkTimeTarget";
import Stat from "~/Stat";

import projectStore from "../store/projectStore";
import vacationStore from "../store/vacationStore";
import workTimeTargetBlockStore from "../store/workTimeTargetBlockStore";

const Dashboard: Component = () => {
    const [currentWorkTimeTargets] = createResource(
        async () => await workTimeTargetBlockStore.getCurrent(),
    );
    const [usersProjects] = createResource(
        async () => await projectStore.getForUser(),
    );
    const [vacationBudgets] = createResource(
        async () => await vacationStore.getCurrentBudgetForUser(),
    );
    const [vacations] = createResource(vacationBudgets, async () => {
        return (
            await Promise.all(
                vacationBudgets()?.map(
                    async (budget) =>
                        (
                            await vacationStore.getForDateRangeAndUser(
                                budget.start_date,
                                budget.end_date,
                            )
                        )?.map((v) =>
                            Object.assign(v, {
                                budget,
                            }),
                        ) ?? [],
                ) ?? [],
            )
        ).flat();
    });
    const usedVacationDays = createMemo(
        () =>
            vacations()?.reduce(
                (sum, v) =>
                    v?.approved
                        ? sum +
                          Math.round(
                              dayjs
                                  .min(dayjs(v?.end), dayjs(v?.budget.end_date))
                                  .endOf("day")
                                  .diff(
                                      dayjs
                                          .max(
                                              dayjs(v?.start),
                                              dayjs(v?.budget.start_date),
                                          )
                                          .startOf("day"),
                                  ) /
                                  1000 /
                                  60 /
                                  60 /
                                  24,
                          )
                        : sum,
                0,
            ) ?? 0,
    );
    const vacationBudget = createMemo(
        () => vacationBudgets()?.reduce((sum, vb) => sum + vb.days, 0) ?? 0,
    );
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Dashboard" />
            <Suspense fallback={<Loading />}>
                <main class="p-6 max-sm:p-3">
                    <h2 class="text-xl font-bold col-span-3">Your Activity</h2>
                    <div class="grid grid-cols-3 pt-4 gap-2">
                        <div class="col-span-3">
                            <h3 class="text-lg">Worked time:</h3>
                            <div class="stats rounded-lg max-xl:stats-vertical w-full bg-base-200 border-2 border-base-100 grid grid-cols-3">
                                <DashboardStat
                                    start={dayjs()}
                                    end={dayjs()}
                                    title="Today"
                                />
                                <DashboardStat
                                    start={dayjs().isoWeekday(1)}
                                    end={dayjs().isoWeekday(7)}
                                    title="This week"
                                />
                                <DashboardStat
                                    start={dayjs().date(1)}
                                    end={dayjs().date(dayjs().daysInMonth())}
                                    title="This month"
                                />
                            </div>
                        </div>
                        <For each={currentWorkTimeTargets()}>
                            {(tt) => (
                                <div class="max-xl:col-span-2 max-sm:col-span-3">
                                    <h3 class="text-lg">Work time targets:</h3>
                                    <WorkTimeTarget id={tt.id} />
                                </div>
                            )}
                        </For>
                        <div class="max-xl:col-span-2 max-sm:col-span-3">
                            <h3 class="text-lg">Vacation:</h3>
                            <div class="bg-base-200 border-base-100 border-2 rounded-lg grid grid-cols-2">
                                <Stat
                                    title="Vacation days"
                                    description="Used/Available"
                                    value={`${usedVacationDays()}/${vacationBudget()}`}
                                />
                            </div>
                        </div>
                        <div class="">
                            <h3 class="text-lg">Your Projects:</h3>
                            <div class="bg-base-200 border-base-100 border-2 rounded-lg">
                                <For each={usersProjects()}>
                                    {(project) => (
                                        <DashboardProjectItem
                                            project={project}
                                        />
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                </main>
            </Suspense>
        </div>
    );
};
export default Dashboard;
