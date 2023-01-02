import { Directus } from "@directus/sdk";
import dayjs from "dayjs";

import type {
    TApi,
    TCategory,
    TClient,
    TDailyWorkTimeTarget,
    TFreeDay,
    TPerson,
    TProject,
    TServer,
    TSettings,
    TUser,
    TVacation,
    TWorkTimeTargetBlock,
    TWorkUnit,
} from "lines-types";

type TDirectusServer = TServer & {
    url: string;
};

type TDirectus = {
    Project: TProject;
    Client: TClient;
    Person: TPerson;
    WorkCategory: TCategory;
    WorkUnit: TWorkUnit;
    WorkTimeTargetBlock: TWorkTimeTargetBlock;
    DailyWorkTimeTarget: TDailyWorkTimeTarget;
    FreeDay: TFreeDay;
    Vacation: TVacation;
    Settings: TSettings;
    directus_users: TUser;
};

export const directus = (server: TDirectusServer): TApi => {
    const _directus = new Directus<TDirectus>(server.url, {
        // TODO: enable this again, when the directus/sdk has a fix for it, this is the terrible temporary fix for "too much recursion" error in firefox
        // storage: {
        //     prefix: server.id + "-",
        // },
    });
    return {
        project: {
            getAll: async () => {
                const result = await _directus.items("Project").readByQuery({});
                return result.data;
            },
            getById: async (id) => {
                const result = await _directus.items("Project").readOne(id);
                return result;
            },
        },
        category: {
            getAll: async () => {
                const result = await _directus.items("WorkCategory").readByQuery({});
                return result.data;
            },
            getById: async (id) => {
                const result = await _directus.items("WorkCategory").readOne(id);
                return result;
            },
            getForProject: async (id) => {
                const result = await _directus.items("WorkCategory").readByQuery({
                    filter: {
                        projects: {
                            _some: {
                                Project_id: {
                                    _eq: id,
                                },
                            },
                        },
                    },
                });
                return result.data;
            },
        },
        workUnit: {
            getForDayAndUser: async (day, userId = "$CURRENT_USER") => {
                const result = await _directus.items("WorkUnit").readByQuery({
                    filter: {
                        worker: {
                            id: {
                                _eq: userId,
                            },
                        },
                        start: {
                            _between: [
                                dayjs(day).hour(0).second(0).minute(0).toString(),
                                dayjs(day).hour(23).second(59).minute(59).toString(),
                            ],
                        },
                    },
                });
                return result.data;
            },
            getForDateRangeAndUser: async (start, end, userId = "$CURRENT_USER") => {
                const result = await _directus.items("WorkUnit").readByQuery({
                    filter: {
                        worker: {
                            id: {
                                _eq: userId,
                            },
                        },
                        start: {
                            _between: [
                                dayjs(start).hour(0).second(0).minute(0).toString(),
                                dayjs(end).hour(23).second(59).minute(59).toString(),
                            ],
                        },
                    },
                });
                return result.data;
            },
            createOne: async (data) => {
                const me = await _directus.users.me.read();
                const result = await _directus.items("WorkUnit").createOne({
                    worker: me.id,
                    ...data,
                });
                return result;
            },
            updateOne: async (id, data) => {
                const result = await _directus.items("WorkUnit").updateOne(id, data);
                return result;
            },
        },
        auth: {
            login: async (email, password) => {
                const result = await _directus.auth.login({
                    email,
                    password,
                });
                if (result.access_token) return true;
                return false;
            },
            logout: async () => {
                await _directus.auth.logout();
            },
            isAuthenticated: async () => {
                const me = await _directus.users.me.read().catch(() => false);
                return !!me;
            },
            getCurrentUser: async () => {
                const me = await _directus.users.me.read();
                return me;
            },
            getAuthToken: async () => {
                return await _directus.auth.token;
            },
        },
        workTimeTargetBlock: {
            getById: async (id) => {
                const result = await _directus.items("WorkTimeTargetBlock").readOne(id);
                return result;
            },
            getForUser: async (id) => {
                const result = await _directus.items("WorkTimeTargetBlock").readByQuery({
                    filter: {
                        workerId: {
                            id: {
                                _eq: id,
                            },
                        },
                    },
                });
                return result.data;
            },
        },
        dailyWorkTimeTarget: {
            getById: async (id) => {
                const result = await _directus.items("DailyWorkTimeTarget").readOne(id);
                return result;
            },
            getForDate: async (date) => {
                const currentBlock = await _directus.items("WorkTimeTargetBlock").readByQuery({
                    filter: {
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
                const result = await _directus.items("DailyWorkTimeTarget").readByQuery({
                    filter: {
                        id: {
                            _in: currentBlock.data?.map((block) => block?.DailyWorkTimeTargets).flat() ?? [],
                        },
                        dayOfWeek: {
                            _eq: dayjs(date).weekday(),
                        },
                    },
                });
                return result.data;
            },
            getForDateRange: async (start, end) => {
                const blocks = await _directus.items("WorkTimeTargetBlock").readByQuery({
                    filter: {
                        _or: [
                            {
                                start: {
                                    _lt: dayjs(end).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gt: dayjs(end).toString(),
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
                                    _lt: dayjs(start).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gt: dayjs(start).toString(),
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
                const dailiesIds = blocks.data?.map((block) => block.DailyWorkTimeTargets).flat();
                const dailies = await _directus.items("DailyWorkTimeTarget").readByQuery({
                    filter: {
                        id: {
                            _in: dailiesIds,
                        },
                    },
                });
                const dayRange = dayjs(end).diff(start, "day");
                const result: (TDailyWorkTimeTarget & { date: Date })[] = [];
                for (let day = 0; day <= dayRange; day++) {
                    const block = blocks.data?.find((b) =>
                        dayjs()
                            .date(day)
                            .isBetween(b.start, b.end ?? dayjs().date(dayjs().daysInMonth()), "day", "[]")
                    );
                    if (block) {
                        const daily = dailies.data
                            ?.filter((d) => block?.DailyWorkTimeTargets.includes(d.id))
                            .find((d) => d.dayOfWeek === dayjs(start).add(day, "day").weekday());
                        if (daily)
                            result.push({
                                ...daily,
                                date: dayjs(start).add(day, "day").toDate(),
                            });
                    }
                }
                return result;
            },
        },
        freeDay: {
            getForDateRange: async (start, end) => {
                const result = await _directus.items("FreeDay").readByQuery({
                    filter: {
                        date: {
                            _between: [
                                dayjs(start).hour(0).minute(0).second(0).toDate(),
                                dayjs(end).hour(59).minute(59).second(59).toDate(),
                            ],
                        },
                    },
                });
                return result.data;
            },
        },
        vacation: {
            getForDateRangeAndUser: async (start, end, userId = "$CURRENT_USER") => {
                const result = await _directus.items("Vacation").readByQuery({
                    filter: {
                        worker: {
                            _eq: userId,
                        },
                        _or: [
                            {
                                start: {
                                    _lt: dayjs(end).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gt: dayjs(end).toString(),
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
                                    _lt: dayjs(start).toString(),
                                },
                                _or: [
                                    {
                                        end: {
                                            _gt: dayjs(start).toString(),
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
                return result.data;
            },
        },
    };
};
