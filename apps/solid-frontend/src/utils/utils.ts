import dayjs from "dayjs";

export const scale = (value: number, maxIn: number, minIn: number, maxOut: number, minOut: number): number => {
    return ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut) + minOut;
};

export const parseTimeString = (time?: string) => dayjs(time, "HH:mm:ss");

export const parseTimeStringDuration = (time?: string) =>
    dayjs.duration({
        hours: parseTimeString(time).hour(),
        minutes: parseTimeString(time).minute(),
        seconds: parseTimeString(time).second(),
    });
