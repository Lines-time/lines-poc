import dayjs from "dayjs";
import { createMemo, createResource } from "solid-js";

import timeBudgetStore from "../../store/timeBudgetStore";
import workUnitStore from "../../store/workUnitStore";
import { formatDuration } from "../../utils/utils";

import type { Component } from "solid-js";

import type { TProject } from "lines-types";
type TProps = {
    project: TProject;
};

const DashboardProjectItem: Component<TProps> = (props) => {
    const [timebudgets] = createResource(
        async () => await timeBudgetStore.getForProject(props.project.id),
    );
    const [projectWorkUnits] = createResource(
        async () => await workUnitStore.getForProject(props.project.id),
    );

    const projectBudgetUsed = createMemo(() =>
        dayjs.duration(
            projectWorkUnits()?.reduce((total, wu) => total + dayjs(wu.end).diff(wu.start), 0) ?? 0,
        ),
    );
    const projectBudgetTotal = createMemo(() =>
        dayjs.duration(
            timebudgets()?.reduce(
                (total, tb) =>
                    total +
                    dayjs
                        .duration({
                            hours: tb.budget_hours,
                            minutes: tb.budget_minutes,
                        })
                        .asMilliseconds(),
                0,
            ) ?? 0,
        ),
    );

    return (
        <div class="p-2 px-3 flex flex-row justify-between">
            <span class="font-bold tracking-wide">{props.project.title}</span>
            <span>
                <span class="opacity-70">Timebudget used: </span>
                <span
                    classList={{
                        "text-error":
                            projectBudgetUsed().asMilliseconds() >
                            projectBudgetTotal().asMilliseconds(),
                        "text-success":
                            projectBudgetUsed().asMilliseconds() <=
                            projectBudgetTotal().asMilliseconds(),
                    }}
                >
                    {formatDuration(projectBudgetUsed())}h/
                    {formatDuration(projectBudgetTotal())}h
                </span>
            </span>
        </div>
    );
};
export default DashboardProjectItem;
