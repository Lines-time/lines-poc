import dayjs from "dayjs";
import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [vacations] = createStore({
    get getForDateRangeAndUser() {
        return async (start: Date, end: Date, userId = "$CURRENT_USER") => {
            const result = await directus.items("Vacation").readByQuery({
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
        };
    },
    get submitVacationRequest() {
        return async (start: Date, end: Date, description: string) => {
            const me = await directus.users.me.read();
            const response = await directus.items("Vacation").createOne({
                start,
                end,
                description,
                worker: me.id,
            });
            return response;
        };
    },
});
export default vacations;