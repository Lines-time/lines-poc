import dayjs from "dayjs";
import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

import type { TWorkUnit } from "lines-types";

const [workUnits] = createStore({
    get getForDayAndUser() {
        return async (day: Date | string, userId = "$CURRENT_USER") => {
            const result = await directus.items("WorkUnit").readByQuery({
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
        };
    },
    get getForDateRangeAndUser() {
        return async (start: Date, end: Date, userId = "$CURRENT_USER") => {
            const result = await directus.items("WorkUnit").readByQuery({
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
        };
    },
    get createOne() {
        return async (data: Partial<TWorkUnit>) => {
            const me = await directus.users.me.read();
            const result = await directus.items("WorkUnit").createOne({
                worker: me.id,
                ...data,
            });
            return result;
        };
    },
    get updateOne() {
        return async (id: string, data: Partial<TWorkUnit>) => {
            const result = await directus.items("WorkUnit").updateOne(id, data);
            return result;
        };
    },
    get deleteOne() {
        return async (id: string) => {
            await directus.items("WorkUnit").deleteOne(id);
        };
    },
});
export default workUnits;
