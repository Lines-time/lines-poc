import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

import type { Accessor, Component } from "solid-js";
type TProps = {
    now: Accessor<dayjs.Dayjs>;
    onUpdateNow?: (value: dayjs.Dayjs) => void;
    controls?: boolean;
};

const CalendarWeek: Component<TProps> = (props) => {
    const { now, onUpdateNow, controls = true } = props;
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
                        {now().isoWeekday(1).format("dddd, LL")} - {now().isoWeekday(7).format("dddd, LL")}
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
                <div>{/* This element is above the time stamps on the left and left of the weekday names */}</div>
                <ForNumber each={7}>
                    {(day) => (
                        <div class="flex flex-row items-center justify-center p-2">
                            {/* Weekday names above the columns */}
                            {now().isoWeekday(day + 1).format("ddd")}
                        </div>
                    )}
                </ForNumber>
                <div class="grid grid-rows-48 border-2 border-transparent">
                    {/* Timestamps on the left */}
                    <ForNumber each={48}>
                        {(halfHour) => (
                            <div class="px-1 text-sm">
                                {now()
                                    .minute((halfHour % 2) * 30)
                                    .hour(halfHour / 2)
                                    .format("HH:mm")}
                            </div>
                        )}
                    </ForNumber>
                </div>
                <ForNumber each={7}>
                    {(day) => (
                        <div class="grid grid-rows-48 border-2 border-base-100 rounded-lg">
                            <ForNumber each={48}>
                                {(day) => <div class="border-b border-dashed border-base-100" />}
                            </ForNumber>
                        </div>
                    )}
                </ForNumber>
            </div>
        </div>
    );
};
export default CalendarWeek;
