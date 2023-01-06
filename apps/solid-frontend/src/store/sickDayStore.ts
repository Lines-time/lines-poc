import dayjs from "dayjs";
import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [sickDays] = createStore({
    get getForDateRangeAndUser() {
        return async (start: Date, end: Date, userId = "$CURRENT_USER") => {
            const result = await directus.items("Sickday").readByQuery({
                filter: {
                    worker: {
                        _eq: userId,
                    },
                    start_date: {
                        _lt: dayjs(end).toDate(),
                    },
                    end_date: {
                        _gt: dayjs(start).toDate(),
                    },
                },
            });
            return result.data;
        };
    },
});

export default sickDays;
