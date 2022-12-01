import { Directus } from "@directus/sdk";
import dayjs from "dayjs";

import type {
    TApi,
    TCategory,
    TClient,
    TDailyWorkTimeTarget,
    TPerson,
    TProject,
    TServer,
    TUser,
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
            createOne: async (data) => {
                const me = await _directus.users.me.read();
                const result = await _directus.items("WorkUnit").createOne({
                    worker: me.id,
                    ...data,
                });
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
        },
    };
};
