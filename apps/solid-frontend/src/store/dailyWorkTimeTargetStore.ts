import dayjs from "dayjs";
import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

import type { TDailyWorkTimeTarget } from "lines-types";

const [dailyWorkTimeTargets] = createStore({
    get getById() {
        return async (id: string) => {
            const result = await directus
                .items("DailyWorkTimeTarget")
                .readOne(id);
            return result;
        };
    },
    get getForDate() {
        return async (date: Date, userId = "$CURRENT_USER") => {
            const currentBlock = await directus
                .items("WorkTimeTargetBlock")
                .readByQuery({
                    filter: {
                        workerId: {
                            _eq: userId,
                        },
                        _or: [
                            {
                                end: {
                                    _null: true,
                                },
                            },
                            {
                                end: {
                                    _gte: date,
                                },
                            },
                        ],
                        start: {
                            _lt: dayjs(date).toString(),
                        },
                    },
                });
            const result = await directus
                .items("DailyWorkTimeTarget")
                .readByQuery({
                    filter: {
                        id: {
                            _in:
                                currentBlock.data?.flatMap(
                                    (block) => block?.DailyWorkTimeTargets,
                                ) ?? [],
                        },
                        dayOfWeek: {
                            _eq: dayjs(date).isoWeekday(),
                        },
                    },
                });
            return result.data;
        };
    },
    get getForDateRange() {
        return async (start: Date, end: Date, userId = "$CURRENT_USER") => {
            const blocks = await directus
                .items("WorkTimeTargetBlock")
                .readByQuery({
                    filter: {
                        workerId: {
                            _eq: userId,
                        },
                        _or: [
                            {
                                start: {
                                    _lte: dayjs(end).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gte: dayjs(end).toString(),
                                        },
                                    },
                                    {
                                        end: {
                                            _null: true,
                                        },
                                    },
                                ],
                            },
                            {
                                start: {
                                    _lte: dayjs(start).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gte: dayjs(start).toString(),
                                        },
                                    },
                                    {
                                        end: {
                                            _null: true,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
            const dailiesIds = blocks.data?.flatMap(
                (block) => block.DailyWorkTimeTargets,
            );
            if (dailiesIds?.length === 0) return [];
            const dailies = await directus
                .items("DailyWorkTimeTarget")
                .readByQuery({
                    filter: {
                        id: {
                            _in: dailiesIds,
                        },
                    },
                });
            const dayRange = dayjs(end).diff(start, "day");
            console.log(dayRange, start, end);
            let result: (TDailyWorkTimeTarget & { date: Date })[] = [];
            for (let day = 0; day <= dayRange; day++) {
                const block = blocks.data?.find((b) =>
                    dayjs(start)
                        .add(day, "day")
                        .isBetween(
                            b.start,
                            b.end ?? dayjs(start).date(dayjs().daysInMonth()),
                            "day",
                            "[]",
                        ),
                );
                console.log(block, start, end)
                if (block) {
                    const daily = dailies.data
                        ?.filter((d) =>
                            block?.DailyWorkTimeTargets.includes(d.id),
                        )
                        .filter(
                            (d) =>
                                d.dayOfWeek ===
                                dayjs(start).add(day, "day").isoWeekday(),
                        );
                    if (daily)
                        result = result.concat(
                            daily.map((d) => ({
                                ...d,
                                date: dayjs(start).add(day, "day").toDate(),
                            })),
                        );
                }
            }
            return result;
        };
    },
});

export default dailyWorkTimeTargets;
