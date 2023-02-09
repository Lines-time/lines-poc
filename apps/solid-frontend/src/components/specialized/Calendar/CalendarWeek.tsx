import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { createMemo, Show } from "solid-js";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

import DayGrid from "./DayGrid";

import type { Component } from "solid-js";
import type { TCalendarEvent } from "../../../types";
type TProps = {
    now: dayjs.Dayjs;
    onUpdateNow?: (value: dayjs.Dayjs) => void;
    controls?: boolean;
    interval?: number;
    events?: TCalendarEvent[];
    onCreateEvent?: (start: Dayjs, end: Dayjs) => void;
    onStepMouseEnter?: (e: Event, interval: number) => boolean;
};

const CalendarWeek: Component<TProps> = (props) => {
    const controls = createMemo(() => props.controls ?? true);
    const interval = createMemo(() => props.interval ?? 30);
    const events = createMemo(() => props.events ?? []);
    const steps = createMemo(() => 24 * (60 / interval()));

    const dayEvents = (day: number) => {
        return events().filter((e) => {
            return props.now.isoWeekday(day).isBetween(e.start, e.end, "day", "[]");
        });
    };

    return (
        <div class="grid grid-rows-[min-content_min-content_1fr] p-1 h-full">
            <div
                class="flex flex-row items-center gap-2 w-full"
                classList={{
                    "justify-between": controls(),
                    "justify-center": !controls(),
                }}
            >
                {/* Controls to change the week */}
                {controls() && (
                    <Button
                        class="btn-sm"
                        icon={ChevronLeft}
                        onClick={() => props.onUpdateNow?.(props.now.subtract(1, "week"))}
                    />
                )}
                <span class="flex items-center gap-2">
                    <span>
                        {props.now.isoWeekday(1).format("dddd, LL")} -{" "}
                        {props.now.isoWeekday(7).format("dddd, LL")}
                    </span>
                    {controls() && props.now.isoWeek() !== dayjs().isoWeek() ? (
                        <Button class="btn-sm" onClick={() => props.onUpdateNow?.(dayjs())}>
                            Today
                        </Button>
                    ) : (
                        ""
                    )}
                </span>
                {controls() && (
                    <Button
                        class="btn-sm"
                        icon={ChevronRight}
                        onClick={() => props.onUpdateNow?.(props.now.add(1, "week"))}
                    />
                )}
            </div>
            <div class="grid grid-cols-[max-content_repeat(7,_1fr)] grid-rows-[min-content_1fr] grid-flow-row gap-1 h-full">
                <div>
                    {/* This element is above the time stamps on the left and left of the weekday names */}
                </div>
                <ForNumber each={7}>
                    {(day) => (
                        <div
                            class="flex flex-row items-center justify-center p-2 sticky top-0 z-10 bg-gradient-to-b from-base-300 to-transparent"
                            classList={{
                                "text-primary": props.now.isoWeekday(day + 1).isToday(),
                            }}
                        >
                            {/* Weekday names above the columns */}
                            {props.now.isoWeekday(day + 1).format("ddd")}
                        </div>
                    )}
                </ForNumber>
                <div class="grid grid-rows-48 border-2 border-transparent">
                    {/* Timestamps on the left */}
                    <ForNumber each={steps()}>
                        {(step) => (
                            <div class="px-1 h-5 text-sm -translate-y-2.5">
                                <Show when={(step * interval()) % 60 === 0}>
                                    {props.now
                                        .hour(0)
                                        .minute(step * interval())
                                        .format("HH:mm")}
                                </Show>
                            </div>
                        )}
                    </ForNumber>
                </div>
                <ForNumber each={7}>
                    {(day) => (
                        <DayGrid
                            now={props.now.isoWeekday(day + 1)}
                            onCreateDuration={props.onCreateEvent}
                            onStepMouseEnter={props.onStepMouseEnter}
                            showCurrentTime={props.now.isoWeekday(day + 1).isToday()}
                            steps={steps()}
                            events={dayEvents(day + 1)}
                            interval={interval()}
                        />
                    )}
                </ForNumber>
            </div>
        </div>
    );
};

export default CalendarWeek;
