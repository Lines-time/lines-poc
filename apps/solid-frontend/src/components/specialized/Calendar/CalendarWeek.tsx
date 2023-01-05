import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Accessor, Component, createMemo, Show } from "solid-js";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

import DayGrid from "./DayGrid";

import type { TCalendarEvent } from "../../../types";
type TProps = {
    now: Accessor<dayjs.Dayjs>;
    onUpdateNow?: (value: dayjs.Dayjs) => void;
    controls?: boolean;
    interval?: Accessor<number>;
    events?: Accessor<TCalendarEvent[]>;
};

const CalendarWeek: Component<TProps> = (props) => {
    const { now, onUpdateNow, controls = true, interval = () => 30, events = () => [] } = props;
    const steps = createMemo(() => 24 * (60 / interval()));

    const dayEvents = (day: number) => {
        return events().filter((e) => {
            return now().isoWeekday(day).isBetween(e.start, e.end, "day", "[]");
        });
    };

    return (
        <div class="grid grid-rows-[min-content_min-content_1fr] p-1 h-full">
            <div
                class="flex flex-row items-center gap-2 w-full"
                classList={{
                    "justify-between": controls,
                    "justify-center": !controls,
                }}
            >
                {/* Controls to change the week */}
                {controls && (
                    <Button
                        class="btn-sm"
                        icon={ChevronLeft}
                        onClick={() => onUpdateNow?.(now().subtract(1, "week"))}
                    />
                )}
                <span class="flex items-center gap-2">
                    <span>
                        {now().isoWeekday(1).format("dddd, LL")} -{" "}
                        {now().isoWeekday(7).format("dddd, LL")}
                    </span>
                    {controls && now().isoWeek() !== dayjs().isoWeek() ? (
                        <Button class="btn-sm" onClick={() => onUpdateNow?.(dayjs())}>
                            Today
                        </Button>
                    ) : (
                        ""
                    )}
                </span>
                {controls && (
                    <Button
                        class="btn-sm"
                        icon={ChevronRight}
                        onClick={() => onUpdateNow?.(now().add(1, "week"))}
                    />
                )}
            </div>
            <div class="grid grid-cols-[max-content_repeat(7,_1fr)] grid-rows-[min-content_1fr] grid-flow-row gap-1 h-full overflow-y-auto">
                <div>
                    {/* This element is above the time stamps on the left and left of the weekday names */}
                </div>
                <ForNumber each={7}>
                    {(day) => (
                        <div
                            class="flex flex-row items-center justify-center p-2"
                            classList={{
                                "text-primary": now()
                                    .isoWeekday(day + 1)
                                    .isToday(),
                            }}
                        >
                            {/* Weekday names above the columns */}
                            {now()
                                .isoWeekday(day + 1)
                                .format("ddd")}
                        </div>
                    )}
                </ForNumber>
                <div class="grid grid-rows-48 border-2 border-transparent">
                    {/* Timestamps on the left */}
                    <ForNumber each={steps()}>
                        {(step) => (
                            <div class="px-1 h-5 text-sm">
                                <Show when={(step * interval()) % 60 === 0}>
                                    {now()
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
                            showCurrentTime={now()
                                .isoWeekday(day + 1)
                                .isToday()}
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
