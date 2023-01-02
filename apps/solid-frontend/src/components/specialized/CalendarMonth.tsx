import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Accessor, Component, ComponentProps, createMemo, For, JSX } from "solid-js";
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
                <Grid now={now}>
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
                </Grid>
            </div>
        </div>
    );
};

type TGridProps = Omit<ComponentProps<typeof For<number, JSX.Element>>, "each"> & {
    now: Accessor<dayjs.Dayjs>;
};

const Grid: Component<TGridProps> = (props) => {
    const { now } = props;

    const weekAmount = createMemo(
        () =>
            now()
                .date(now().daysInMonth())
                .isoWeekday(1)
                .diff(now().date(1).isoWeekday(1), "week") + 1
    );

    return (
        <div
            class="grid grid-cols-7 gap-1 h-full w-full"
            classList={{
                "grid-rows-5": weekAmount() === 5,
                "grid-rows-6": weekAmount() === 6,
            }}
        >
            {/* Fill the days before the first of this month with the days from the previous month */}
            <ForNumber each={now().date(1).isoWeekday() - 1}>
                {(day) => (
                    <div class="opacity-50">
                        {now().subtract(1, "month").daysInMonth() +
                            (day + 1 - now().date(0).isoWeekday())}
                    </div>
                )}
            </ForNumber>
            {/* Days of this month */}
            <ForNumber each={now().daysInMonth()}>{props.children}</ForNumber>
            {/* Fill the rest of the days with days from the next month */}
            <ForNumber each={7 - now().date(now().daysInMonth()).isoWeekday()}>
                {(day) => <div class="opacity-50">{day + 1}</div>}
            </ForNumber>
        </div>
    );
};

export default CalendarMonth;
