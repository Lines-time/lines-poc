import dayjs from "dayjs";
import {
    Component,
    createEffect,
    createMemo,
    createSignal,
    For,
    onCleanup,
    onMount,
    Show,
} from "solid-js";
import ForNumber from "~/ForNumber";

import { scale } from "../../../utils/utils";
import CalendarEvent from "./CalendarEvent";

import type { TCalendarEvent } from "../../../types";
type DayProps = {
    steps: number;
    interval: number;
    events: TCalendarEvent[];
    showCurrentTime?: boolean;
};

const Day: Component<DayProps> = (props) => {
    const [currentTime, setCurrentTime] = createSignal(dayjs());
    const intervalsInHour = createMemo(() => 60 / props.interval);
    const updateCurrentTime = () => {
        clearInterval(currentTimeInterval);
        if (props.showCurrentTime) {
            currentTimeInterval = setInterval(() => {
                setCurrentTime(dayjs());
            }, 1000 * 10);
        }
    };
    let currentTimeInterval: NodeJS.Timer;
    onMount(() => {
        updateCurrentTime();
    });
    createEffect(() => {
        updateCurrentTime();
    });
    onCleanup(() => {
        clearInterval(currentTimeInterval);
    });
    const currentTimeRow = createMemo(
        () =>
            currentTime().hour() * intervalsInHour() +
            Math.floor(currentTime().minute() / props.interval)
    );
    return (
        <div class="grid h-full w-full border-2 border-base-100 rounded-lg relative">
            <ForNumber each={props.steps}>
                {(step) => (
                    <div
                        class="border-b border-base-100"
                        classList={{
                            "border-solid": ((step + 1) * props.interval) % 60 === 0,
                            "border-dashed": ((step + 1) * props.interval) % 60 !== 0,
                        }}
                    />
                )}
            </ForNumber>
            <For each={props.events}>
                {(e) => <CalendarEvent event={e} interval={props.interval} />}
            </For>
            <Show when={props.showCurrentTime}>
                <div
                    class="absolute border-t-2 border-secondary w-full flex justify-end"
                    style={{
                        "grid-row-start": currentTimeRow() + 1,
                        "grid-row-end": "span 1",
                        translate: `0px ${scale(
                            currentTime().minute() % props.interval,
                            props.interval,
                            0,
                            100,
                            0
                        )}%`,
                    }}
                >
                    <span class="text-xs h-min bg-secondary text-secondary-content rounded-b px-1">
                        {currentTime().format("H:mm")}
                    </span>
                </div>
            </Show>
        </div>
    );
};

export default Day;
