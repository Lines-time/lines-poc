import dayjs from "dayjs";

import type { Duration } from "dayjs/plugin/duration";

export const scale = (
    value: number,
    maxIn: number,
    minIn: number,
    maxOut: number,
    minOut: number
): number => {
    return ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut) + minOut;
};

export const parseTimeString = (time?: string) => dayjs(time, "HH:mm:ss");

export const parseTimeStringDuration = (time?: string) =>
    dayjs.duration({
        hours: parseTimeString(time).hour(),
        minutes: parseTimeString(time).minute(),
        seconds: parseTimeString(time).second(),
    });

export const formatDuration = (duration: Duration) => {
    return `${(duration.asHours() * 60 - duration.minutes()) / 60}:${duration.format("mm")}`;
};

export function groupArray<T, K extends keyof T>(array: Array<T>, key: K) {
    return array.reduce(
        (map, item) => map.set(item[key], [...(map.get(item[key]) || []), item]),
        new Map<T[K], T[]>()
    );
}
