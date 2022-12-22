import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { Component, createMemo, createSignal } from "solid-js";
import Button from "~/Button";
import ForNumber from "~/ForNumber";

type TProps = {};

const CalendarMonth: Component<TProps> = (props) => {
    const [month, setMonth] = createSignal(dayjs());
    const weekAmount = createMemo(
        () => month().date(month().daysInMonth()).day(0).diff(month().date(1).day(0), "week") + 1
    );

    return (
        <div class="h-full grid grid-rows-[min-content_min-content_1fr] p-1">
            <div class="flex flex-row justify-between items-center gap-2 w-full">
                <Button
                    class="btn-sm"
                    icon={ChevronLeft}
                    onClick={() => setMonth(month().month(month().month() - 1))}
                ></Button>
                <span>{month().format("MMMM YYYY")}</span>
                <Button
                    class="btn-sm"
                    icon={ChevronRight}
                    onClick={() => setMonth(month().month(month().month() + 1))}
                ></Button>
            </div>
            <div class="grid grid-cols-7">
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
                <ForNumber each={month().date(1).weekday()}>{(day) => <div></div>}</ForNumber>
                <ForNumber each={month().daysInMonth()}>
                    {(day) => <div class="border-base-100 border-2 rounded-lg px-2 py-1">{day + 1}</div>}
                </ForNumber>
            </div>
        </div>
    );
};
export default CalendarMonth;
