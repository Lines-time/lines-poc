import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Dynamic } from "solid-js/web";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

import MonthGrid from "./MonthGrid";

import type { Accessor, Component } from "solid-js";
type TProps = {
    now: Accessor<dayjs.Dayjs>;
    onUpdateNow?: (value: dayjs.Dayjs) => void;
    controls?: boolean;
    events?: Accessor<
        Array<{
            start: Date;
            end: Date;
            render: Component;
        }>
    >;
};

const CalendarMonth: Component<TProps> = (props) => {
    const { now, onUpdateNow, controls = true } = props;
    return (
        <div class="h-full grid grid-rows-[min-content_1fr] p-1">
            <div
                class="flex flex-row items-center gap-2 w-full"
                classList={{
                    "justify-between": controls,
                    "justify-center": !controls,
                }}
            >
                {/* Controls to change the month */}
                {controls && (
                    <Button
                        class="btn-sm"
                        icon={ChevronLeft}
                        onClick={() => onUpdateNow?.(now().month(now().month() - 1))}
                    />
                )}
                <span class="flex flex-row gap-2 items-center">
                    <span>{now().format("MMMM YYYY")}</span>
                    {controls && !now().isToday() && (
                        <Button onClick={() => onUpdateNow?.(dayjs())} class="btn-sm">
                            Today
                        </Button>
                    )}
                </span>
                {controls && (
                    <Button
                        class="btn-sm"
                        icon={ChevronRight}
                        onClick={() => onUpdateNow?.(now().month(now().month() + 1))}
                    />
                )}
            </div>
            <div class="relative h-full grid grid-rows-[min-content_1fr]">
                <div class="grid grid-cols-7">
                    {/* Weekday names above the columns */}
                    <ForNumber each={7}>
                        {(day) => (
                            <div
                                class="flex flex-row items-center justify-center p-2"
                                classList={{
                                    "text-primary": dayjs().isSame(
                                        now().isoWeekday(day + 1),
                                        "day"
                                    ),
                                }}
                            >
                                {now()
                                    .isoWeekday(day + 1)
                                    .format("ddd")}
                            </div>
                        )}
                    </ForNumber>
                </div>
                <MonthGrid now={now}>
                    {(day) => (
                        <div class="border-base-100 border-2 rounded-lg px-1 py-1">
                            <span
                                class="px-1"
                                classList={{
                                    "text-primary": dayjs().isSame(now().date(day + 1), "day"),
                                }}
                            >
                                {day + 1}
                            </span>
                            {props
                                .events?.()
                                .filter((e) =>
                                    now()
                                        .date(day + 1)
                                        .isBetween(e.start, e.end, "day", "[]")
                                )
                                .map((event) => (
                                    <Dynamic component={event?.render} />
                                ))}
                        </div>
                    )}
                </MonthGrid>
            </div>
        </div>
    );
};

export default CalendarMonth;
