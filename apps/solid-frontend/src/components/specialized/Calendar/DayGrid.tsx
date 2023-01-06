import dayjs, { Dayjs } from "dayjs";
import { Plus } from "lucide-solid";
import {
    Accessor,
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
    now: Accessor<Dayjs>;
    onCreateDuration?: (start: Dayjs, end: Dayjs) => void;
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

    const [selecting, setSelecting] = createSignal(false);
    const [startStep, setStartStep] = createSignal<number>();
    const [endStep, setEndStep] = createSignal<number>();

    const createDurationFromSelection = () => {
        let ss = startStep();
        let es = endStep();
        if (ss && es) {
            let _ss = Math.min(ss, es);
            let _es = Math.max(ss, es);
            _ss -= 1;
            const startMinutes = (_ss * props.interval) % 60;
            const startHour = (_ss * props.interval - startMinutes) / 60;
            const endMinutes = (_es * props.interval) % 60;
            const endHour = (_es * props.interval - endMinutes) / 60;
            const start = props.now().hour(startHour).minute(startMinutes).second(0);
            const end = props.now().hour(endHour).minute(endMinutes).second(0);
            props.onCreateDuration?.(start, end);
            setStartStep();
            setEndStep();
        }
    };

    return (
        <div class="grid h-full w-full border-2 border-base-100 rounded-lg relative">
            <ForNumber each={props.steps}>
                {(step) => (
                    <div
                        class="border-b border-base-100 group relative"
                        classList={{
                            "border-solid": ((step + 1) * props.interval) % 60 === 0,
                            "border-dashed": ((step + 1) * props.interval) % 60 !== 0,
                            "bg-base-100": !!(
                                startStep() &&
                                endStep() &&
                                Math.min(startStep()!, endStep()!) <= step + 1 &&
                                Math.max(startStep()!, endStep()!) >= step + 1
                            ),
                        }}
                        onMouseDown={() => {
                            setSelecting(true);
                            setStartStep(step + 1);
                            setEndStep(step + 1);
                        }}
                        onMouseEnter={(e) => {
                            if (selecting()) setEndStep(step + 1);
                        }}
                        onMouseUp={() => {
                            setSelecting(false);
                            createDurationFromSelection();
                        }}
                    >
                        <span class="flex flex-row items-center justify-center w-full h-full text-xs absolute group-hover:opacity-50 opacity-0 cursor-default select-none">
                            <Plus size={14} />
                            Create
                        </span>
                    </div>
                )}
            </ForNumber>
            <For each={props.events}>
                {(e) => <CalendarEvent event={e} interval={props.interval} />}
            </For>
            <Show when={props.showCurrentTime}>
                <div
                    class="absolute border-t-2 border-secondary w-full flex justify-end pointer-events-none"
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
                <div
                    id="now"
                    class="absolute -mt-16 pointer-events-none"
                    style={{
                        "grid-row-start": currentTimeRow() + 1,
                        "grid-row-end": "span 1",
                    }}
                />
            </Show>
        </div>
    );
};

export default Day;
