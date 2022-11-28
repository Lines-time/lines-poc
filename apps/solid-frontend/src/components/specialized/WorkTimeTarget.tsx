import dayjs from "dayjs";
import { Component, createResource, For, Show, Suspense } from "solid-js";
import ForNumber from "~/ForNumber";
import Loading from "~/Loading";

import servers from "../../store/servers";
import { scale } from "../../utils/utils";

import type { TDailyWorkTimeTarget } from "lines-types";
type TProps = {
    id: string;
};

const WorkTimeTarget: Component<TProps> = (props) => {
    const [workTimeTarget, workTimeTargetResource] = createResource(
        async () => await servers.currentServer()?.workTimeTargetBlock.getById(props.id)
    );
    const [dailyWorkTimeTargets, dailyWorkTimeTargetsResource] = createResource(
        () => workTimeTarget.latest,
        async () => {
            const result = workTimeTarget.latest?.DailyWorkTimeTargets.map(
                async (id) => await servers.currentServer()?.dailyWorkTimeTarget.getById(id)
            );
            const awaited = result ? await Promise.all(result) : [];
            awaited.sort((a, b) => a!.dayOfWeek - b!.dayOfWeek);
            return awaited;
        }
    );

    return (
        <div class="flex flex-col gap-1">
            <Suspense fallback={<Loading />}>
                <span>
                    {dayjs(workTimeTarget.latest?.start).format("dddd, DD.MM.YYYY")}
                    {" - "}
                    {workTimeTarget.latest?.end
                        ? `${dayjs(workTimeTarget.latest?.end).format("dddd, DD.MM.YYYY")}`
                        : "today"}
                </span>
                <div class="bg-base-200 rounded-lg p-2 grid grid-cols-7 gap-1 h-64">
                    <Show when={dailyWorkTimeTargets.latest}>
                        <ForNumber each={7}>
                            {(day) =>
                                dailyWorkTimeTargets.latest && <Daily day={day} dailies={dailyWorkTimeTargets.latest} />
                            }
                        </ForNumber>
                    </Show>
                </div>
            </Suspense>
        </div>
    );
};
export default WorkTimeTarget;

const Daily: Component<{ day: number; dailies: (TDailyWorkTimeTarget | undefined | null)[] }> = (props) => {
    const { dailies } = props;

    const day = props.day + 1;
    const daily = dailies.filter((d) => d?.dayOfWeek === day);
    const parseTimeString = (time?: string) => dayjs(time, "HH:mm:ss");

    const duration = (d: (TDailyWorkTimeTarget | undefined | null)[] | TDailyWorkTimeTarget | undefined | null) => {
        if (Array.isArray(d))
            return d.reduce(
                (a, b) =>
                    a +
                    dayjs
                        .duration({
                            hours: parseTimeString(b?.duration).hour(),
                            minutes: parseTimeString(b?.duration).minute(),
                        })
                        .asMinutes(),
                0
            );
        return dayjs
            .duration({
                hours: parseTimeString(d?.duration).hour(),
                minutes: parseTimeString(d?.duration).minute(),
            })
            .asMinutes();
    };

    const longestDay = Math.max(
        ...([0, 1, 2, 3, 4, 5, 6, 7].map((day) => duration(dailies.filter((d) => d?.dayOfWeek === day))) ?? [])
    );
    const height = (d: TDailyWorkTimeTarget) => scale(duration(d), longestDay, 0, 100, 0);
    const tooltip = (d: TDailyWorkTimeTarget) =>
        d.start && d.end
            ? parseTimeString(d.start).format("HH:mm") +
              ` - ${parseTimeString(d.end).format("HH:mm")}` +
              `(${parseTimeString(d.duration).format("H:mm[h]")})`
            : parseTimeString(d.duration).format("H:mm[h]");

    return (
        <div class="h-full flex flex-col" classList={{ "opacity-50": !daily }}>
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
                                <div class="bg-primary rounded h-full"></div>
                            </div>
                        )
                    }
                </For>
            </div>
            <span class="text-center">{dayjs().day(day).format("ddd")}</span>
            <span class="text-center">{dayjs.duration(duration(daily), "minutes").format("H:mm")}h</span>
        </div>
    );
};
