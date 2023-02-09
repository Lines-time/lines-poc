import { createMemo, For } from "solid-js";
import ForNumber from "~/ForNumber";

import type { Component, JSX, ComponentProps } from "solid-js";
import type dayjs from "dayjs";
type TGridProps = Omit<ComponentProps<typeof For<number, JSX.Element>>, "each"> & {
    now: dayjs.Dayjs;
};

const Grid: Component<TGridProps> = (props) => {
    const weekAmount = createMemo(
        () =>
            props.now
                .date(props.now.daysInMonth())
                .isoWeekday(1)
                .diff(props.now.date(1).isoWeekday(1), "week") + 1,
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
            <ForNumber each={props.now.date(1).isoWeekday() - 1}>
                {(day) => (
                    <div class="opacity-50">
                        {props.now.subtract(1, "month").daysInMonth() +
                            (day + 1 - props.now.date(0).isoWeekday())}
                    </div>
                )}
            </ForNumber>
            {/* Days of this month */}
            <ForNumber each={props.now.daysInMonth()}>{props.children}</ForNumber>
            {/* Fill the rest of the days with days from the next month */}
            <ForNumber each={7 - props.now.date(props.now.daysInMonth()).isoWeekday()}>
                {(day) => <div class="opacity-50">{day + 1}</div>}
            </ForNumber>
        </div>
    );
};

export default Grid;
