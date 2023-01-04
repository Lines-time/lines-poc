import dayjs from "dayjs";
import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [freeDays] = createStore({
    get getForDateRange() {
        return async (start: Date, end: Date) => {
            const result = await directus.items("FreeDay").readByQuery({
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
        };
    },
});

export default freeDays;
