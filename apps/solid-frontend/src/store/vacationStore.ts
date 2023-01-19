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
                    start: {
                        _lt: dayjs(end).toDate(),
                    },
                    end: {
                        _gt: dayjs(start).toDate(),
                    },
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
                approved: false,
            });
            return response;
        };
    },
    get cancelVacationRequest() {
        return async (id: string) => {
            await directus.items("Vacation").deleteOne(id);
        };
    },
    get getCurrentBudgetForUser() {
        return async (userId = "$CURRENT_USER") => {
            const result = await directus.items("VacationBudget").readByQuery({
                filter: {
                    worker: {
                        _eq: userId,
                    },
                    start_date: {
                        _lt: dayjs().startOf("day").toDate(),
                    },
                    end_date: {
                        _gt: dayjs().endOf("day").toDate(),
                    },
                },
            });
            return result.data;
        };
    },
});
export default vacations;
