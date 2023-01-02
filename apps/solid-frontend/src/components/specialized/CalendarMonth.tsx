import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Accessor, Component, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

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
    const weekAmount = createMemo(() => now().date(now().daysInMonth()).day(0).diff(now().date(1).day(0), "week") + 1);

    return (
        <div class="h-full grid grid-rows-[min-content_min-content_1fr] p-1">
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
                    ></Button>
                )}
                <span>{now().format("MMMM YYYY")}</span>
                {controls && (
                    <Button
                        class="btn-sm"
                        icon={ChevronRight}
                        onClick={() => onUpdateNow?.(now().month(now().month() + 1))}
                    ></Button>
                )}
            </div>
            <div class="grid grid-cols-7">
                {/* Weekday names above the columns */}
                <ForNumber each={7}>
                    {(day) => (
                        <div class="flex flex-row items-center justify-center p-2">
                            {dayjs().weekday(day).format("ddd")}
                        </div>
                    )}
                </ForNumber>
            </div>
            <div
                class="grid grid-cols-7 gap-1 h-full"
                classList={{
                    "grid-rows-5": weekAmount() === 5,
                    "grid-rows-6": weekAmount() === 6,
                }}
            >
                {/* Fill the days before the first of this month with the days from the previous month */}
                <ForNumber each={now().date(1).weekday()}>
                    {(day) => (
                        <div class="opacity-50">
                            {now().subtract(1, "month").daysInMonth() + (day - now().date(0).weekday())}
                        </div>
                    )}
                </ForNumber>
                {/* Days of this month */}
                <ForNumber each={now().daysInMonth()}>
                    {(day) => (
                        <div class="border-base-100 border-2 rounded-lg px-2 py-1">
                            {day + 1}
                            {props
                                .events?.()
                                .filter(
                                    (e) =>
                                        dayjs(e.start).date() === day + 1 ||
                                        dayjs(e.end).date() === day + 1 ||
                                        now()
                                            .date(day + 1)
                                            .isBetween(e.start, e.end, "day", "[]")
                                )
                                .map((event) => (
                                    <Dynamic component={event?.render}></Dynamic>
                                ))}
                        </div>
                    )}
                </ForNumber>
                {/* Fill the rest of the days with days from the next month */}
                <ForNumber each={6 - now().date(now().daysInMonth()).weekday()}>
                    {(day) => <div class="opacity-50">{day + 1}</div>}
                </ForNumber>
            </div>
        </div>
    );
};
export default CalendarMonth;
