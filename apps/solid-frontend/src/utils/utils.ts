import dayjs from "dayjs";

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
