import dayjs from "dayjs";
import { ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-solid";
import { createMemo, Show } from "solid-js";

import Button from "./Button";
import ForNumber from "./ForNumber";

import type { Component } from "solid-js";

type TProps = {
    time?: boolean;
    date?: boolean;
    value: Date;
    location?: "bottom" | "top" | "right" | "left";
    align?: "end" | "start";
    onChange: (v: Date) => void;
    minuteInterval?: number;
    ref?: HTMLDivElement;
};

const Datetime: Component<TProps> = (props) => {
    const align = createMemo(() => props.align ?? "start");
    const location = createMemo(() => props.location ?? "bottom");

    const minuteInterval = createMemo(() => props.minuteInterval ?? 30);
    const value = createMemo(() => dayjs(props.value));

    const setValue = (v: dayjs.Dayjs) => {
        props.onChange(
            v
                .second(0)
                .subtract(v.minute() % minuteInterval(), "minute")
                .toDate(),
        );
    };

    const currentLang = () => window.navigator.languages[0];
    const formatTimeNumber = (v: number) =>
        `${v.toLocaleString(currentLang(), { minimumIntegerDigits: 2 })}`;

    return (
        <div
            class="dropdown"
            classList={{
                "dropdown-top": location() === "top",
                "dropdown-right": location() === "right",
                "dropdown-left": location() === "left",
                "dropdown-bottom": location() === "bottom",
                "dropdown-end": align() === "end",
            }}
        >
            <div
                tabindex={0}
                class="input input-bordered bg-transparent flex flex-row items-center justify-between group pr-2"
                ref={props.ref}
            >
                <Show when={props.date}>{value().format("dddd, DD.MM.YYYY")}</Show>
                <Show when={props.date && props.time}>{" - "}</Show>
                <Show when={props.time}>{value().format("HH:mm[h]")}</Show>
                <span class="flex flex-row">
                    <Button
                        class="btn-sm hidden group-hover:flex"
                        onClick={() => setValue(dayjs().second(0))}
                    >
                        {props.time ? "Now" : "Today"}
                    </Button>
                    <Button class="btn-sm" icon={ChevronDown} />
                </span>
            </div>
            <div
                tabindex={0}
                class="dropdown-content card card-bordered bg-base-300 shadow p-2 flex flex-col gap-2"
            >
                <Show when={props.date}>
                    <div class="flex flex-row justify-between items-center gap-2 w-full">
                        <Button
                            class="btn-sm"
                            icon={ChevronLeft}
                            onClick={() => setValue(value().month(value().month() - 1))}
                        />
                        <span>{value().format("MMMM YYYY")}</span>
                        <Button
                            class="btn-sm"
                            icon={ChevronRight}
                            onClick={() => setValue(value().month(value().month() + 1))}
                        />
                    </div>
                    <div class="grid grid-cols-7 gap-1">
                        <ForNumber each={7}>
                            {(day) => <div class="flex flex-row items-center justify-center" />}
                        </ForNumber>
                        <ForNumber each={value().date(0).isoWeekday()}>
                            {(day) => <div />}
                        </ForNumber>
                        <ForNumber each={value().daysInMonth()}>
                            {(day) => (
                                <div
                                    class="btn btn-square btn-sm"
                                    classList={{
                                        "btn-primary": day + 1 === value().date(),
                                        "btn-ghost": day + 1 !== value().date(),
                                        "text-primary":
                                            day + 1 !== value().date() &&
                                            value()
                                                .date(day + 1)
                                                .isToday(),
                                    }}
                                    onClick={() => setValue(value().date(day + 1))}
                                >
                                    {day + 1}
                                </div>
                            )}
                        </ForNumber>
                    </div>
                </Show>
                <Show when={props.time}>
                    <div class="flex flex-row items-center p-2 gap-2">
                        <Clock size="18" />
                        <select
                            class="select select-bordered select-sm"
                            value={value().hour()}
                            onInput={(e) => setValue(value().hour(Number(e.currentTarget.value)))}
                        >
                            <ForNumber each={24}>
                                {(hour) => <option value={hour}>{formatTimeNumber(hour)}</option>}
                            </ForNumber>
                        </select>
                        h
                        <select
                            class="select select-bordered select-sm"
                            value={value().minute()}
                            onInput={(e) => setValue(value().minute(Number(e.currentTarget.value)))}
                        >
                            <ForNumber each={60 / minuteInterval()}>
                                {(minute) => (
                                    <option value={minute * minuteInterval()}>
                                        {formatTimeNumber(minute * minuteInterval())}
                                    </option>
                                )}
                            </ForNumber>
                        </select>
                        min
                    </div>
                </Show>
            </div>
        </div>
    );
};
export default Datetime;
