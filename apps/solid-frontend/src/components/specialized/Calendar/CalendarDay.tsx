import dayjs, { Dayjs } from "dayjs";
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
    onCreateEvent?: (start: Dayjs, end: Dayjs) => void;
    onStepMouseEnter?: (e: Event, interval: number) => boolean;
};

const CalendarDay: Component<TProps> = (props) => {
    const { now, controls = true, interval = () => 30, events = () => [], onUpdateNow } = props;
    const steps = createMemo(() => 24 * (60 / interval()));

    return (
        <div class="grid grid-cols-[max-content_1fr] grid-rows-[min-content_1fr] h-full w-full gap-1">
            <div />
            <div
                class="flex flex-row items-center gap-2 w-full p-2 sticky top-0 z-10 bg-gradient-to-b from-base-300 to-transparent"
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
                    <span>{now().format("dddd, LL")}</span>
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
            <DayGrid
                now={now}
                steps={steps()}
                events={events()}
                interval={interval()}
                onStepMouseEnter={props.onStepMouseEnter}
                onCreateDuration={props.onCreateEvent}
                showCurrentTime
            />
        </div>
    );
};
export default CalendarDay;
