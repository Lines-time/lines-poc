import dayjs from "dayjs";
import { Component, createResource, For, Show, Suspense } from "solid-js";
import ForNumber from "~/ForNumber";
import Loading from "~/Loading";

import dailyWorkTimeTargetStore from "../../store/dailyWorkTimeTargetStore";
import workTimeTargetBlockStore from "../../store/workTimeTargetBlockStore";
import { parseTimeString, parseTimeStringDuration, scale } from "../../utils/utils";

import type { TDailyWorkTimeTarget } from "lines-types";
type TProps = {
    id: string;
};

const WorkTimeTarget: Component<TProps> = (props) => {
    const [workTimeTarget, workTimeTargetResource] = createResource(
        async () => await workTimeTargetBlockStore.getById(props.id),
    );
    const [dailyWorkTimeTargets, dailyWorkTimeTargetsResource] = createResource(
        () => workTimeTarget.latest,
        async () => {
            const result = workTimeTarget.latest?.DailyWorkTimeTargets.map(
                async (id) => await dailyWorkTimeTargetStore.getById(id),
            );
            const awaited = result ? await Promise.all(result) : [];
            awaited.sort((a, b) => a!.dayOfWeek - b!.dayOfWeek);
            return awaited;
        },
    );

    return (
        <div class="flex flex-col gap-1">
            <Suspense fallback={<Loading />}>
                <div class="bg-base-200 border-2 border-base-100 rounded-lg p-2 pt-0.5">
                    <div class="mb-2">
                        {dayjs(workTimeTarget.latest?.start).format("dddd, DD.MM.YYYY")}
                        {" - "}
                        {workTimeTarget.latest?.end
                            ? `${dayjs(workTimeTarget.latest?.end).format("dddd, DD.MM.YYYY")}`
                            : "today"}
                    </div>
                    <div class="grid grid-cols-7 gap-1 h-64">
                        <Show when={dailyWorkTimeTargets.latest}>
                            <ForNumber each={7}>
                                {(day) =>
                                    dailyWorkTimeTargets.latest && (
                                        <Daily day={day} dailies={dailyWorkTimeTargets.latest} />
                                    )
                                }
                            </ForNumber>
                        </Show>
                    </div>
                </div>
            </Suspense>
        </div>
    );
};
export default WorkTimeTarget;

const Daily: Component<{ day: number; dailies: (TDailyWorkTimeTarget | undefined | null)[] }> = (
    props,
) => {
    const day = props.day + 1;
    const daily = props.dailies.filter((d) => d?.dayOfWeek === day);

    const duration = (
        d: (TDailyWorkTimeTarget | undefined | null)[] | TDailyWorkTimeTarget | undefined | null,
    ) => {
        if (Array.isArray(d))
            return d.reduce((a, b) => a + parseTimeStringDuration(b?.duration).asMinutes(), 0);
        return parseTimeStringDuration(d?.duration).asMinutes();
    };

    const longestDay = Math.max(
        ...([0, 1, 2, 3, 4, 5, 6, 7].map((day) =>
            duration(props.dailies.filter((d) => d?.dayOfWeek === day)),
        ) ?? []),
    );
    const height = (d: TDailyWorkTimeTarget) => scale(duration(d), longestDay, 0, 100, 0);
    const tooltip = (d: TDailyWorkTimeTarget) =>
        d.start && d.end
            ? `${parseTimeString(d.start).format("HH:mm")} - ${parseTimeString(d.end).format(
                  "HH:mm",
              )}(${parseTimeString(d.duration).format("H:mm[h]")})`
            : parseTimeString(d.duration).format("H:mm[h]");

    return (
        <div class="h-full flex flex-col" classList={{ "opacity-50": !daily.length }}>
            <div class="rounded flex-1 flex flex-col justify-end gap-1">
                <For each={daily}>
                    {(d) =>
                        d && (
                            <div
                                class="tooltip hover:z-50"
                                data-tip={tooltip(d)}
                                style={{
                                    height: `${height(d)}%`,
                                }}
                            >
                                <div class="bg-primary rounded h-full" />
                            </div>
                        )
                    }
                </For>
            </div>
            <span class="text-center">{dayjs().day(day).format("ddd")}</span>
            <span class="text-center">
                {dayjs.duration(duration(daily), "minutes").format("H:mm")}h
            </span>
        </div>
    );
};
