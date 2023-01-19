import dayjs from "dayjs";
import { createMemo, createResource } from "solid-js";

import dailyWorkTimeTargetStore from "../store/dailyWorkTimeTargetStore";
import freeDayStore from "../store/freeDayStore";
import sickDayStore from "../store/sickDayStore";
import vacationStore from "../store/vacationStore";
import workUnitStore from "../store/workUnitStore";

import type { Duration } from "dayjs/plugin/duration";
export const scale = (
    value: number,
    maxIn: number,
    minIn: number,
    maxOut: number,
    minOut: number,
): number => {
    return ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut) + minOut;
};

export const parseTimeString = (time?: string) => dayjs(time, "HH:mm:ss");

export const parseTimeStringDuration = (time?: string) => {
    const parsed = parseTimeString(time);
    return dayjs.duration({
        hours: parsed.hour(),
        minutes: parsed.minute(),
        seconds: parsed.second(),
    });
};

export const formatDuration = (duration: Duration) => {
    return `${
        (duration.asHours() * 60 - duration.minutes()) / 60
    }:${duration.format("mm")}`;
};

export function groupArray<T, K extends keyof T>(array: Array<T>, key: K) {
    return array.reduce(
        (map, item) =>
            map.set(item[key], [...(map.get(item[key]) || []), item]),
        new Map<T[K], T[]>(),
    );
}

export function parseTimeFromStep(
    step: number,
    interval: number,
    start: boolean,
) {
    const _step = start ? step - 1 : step;
    const minutes = (_step * interval) % 60;
    const hours = (_step * interval - minutes) / 60;
    return {
        hours,
        minutes,
    };
}

export const createProgressData = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const [data_value, data_resource] = createResource(
        async () =>
            await workUnitStore.getForDateRangeAndUser(
                start.toDate(),
                end.toDate(),
            ),
    );
    const [target_value, target_resource] = createResource(
        async () =>
            await dailyWorkTimeTargetStore.getForDateRange(
                start.toDate(),
                end.toDate(),
            ),
    );
    const [free_value, free_resource] = createResource(
        async () =>
            await freeDayStore.getForDateRange(start.toDate(), end.toDate()),
    );
    const [vacation_value, vacation_resource] = createResource(
        async () =>
            await vacationStore.getForDateRangeAndUser(
                start.toDate(),
                end.toDate(),
            ),
    );
    const [sick_value] = createResource(
        async () =>
            await sickDayStore.getForDateRangeAndUser(
                start.toDate(),
                end.toDate(),
            ),
    );

    const workedTime = createMemo(() =>
        data_value.latest?.reduce(
            (a, b) => a + dayjs(b?.end).diff(b?.start),
            0,
        ),
    );
    const targetTime = createMemo(() =>
        target_value()
            ?.filter((tt) => {
                return !(
                    vacation_value()?.some((v) =>
                        dayjs(tt!.date).isBetween(
                            v!.start,
                            v!.end,
                            "day",
                            "[]",
                        ),
                    ) ||
                    sick_value()?.some((sd) =>
                        dayjs(tt!.date).isBetween(
                            sd!.start_date,
                            sd!.end_date,
                            "day",
                            "[]",
                        ),
                    )
                );
            })
            .reduce(
                (a, b) =>
                    a +
                    parseTimeStringDuration(b?.duration).asMilliseconds() *
                        (1 -
                            (free_value()?.find((fd) =>
                                dayjs(b?.date).isSame(fd?.date, "day"),
                            )?.percentage ?? 0)),
                0,
            ),
    );
    const targetReached = createMemo(
        () => !dayjs(workedTime()).isBefore(targetTime()),
    );
    const diff = createMemo(() =>
        Math.abs(dayjs(workedTime()).diff(targetTime())),
    );
    const _workedPercent = createMemo(() =>
        scale(workedTime() ?? 0, targetTime() ?? 0, 0, 100, 0),
    );
    const workedPercent = createMemo(() =>
        isNaN(_workedPercent()) || !Number.isFinite(_workedPercent())
            ? 100
            : _workedPercent(),
    );
    const missingDuration = createMemo(() => dayjs.duration(diff()));
    const targetDuration = createMemo(() => dayjs.duration(targetTime() ?? 0));
    return {
        workedTime,
        targetTime,
        targetReached,
        diff,
        workedPercent,
        missingDuration,
        targetDuration,
    };
};
