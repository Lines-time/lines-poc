import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [timeBudgets] = createStore({
    get getForProject() {
        return async (projectId: string) => {
            const result = await directus.items("TimeBudget").readByQuery({
                filter: {
                    project: projectId,
                },
            });
            return result.data;
        };
    },
});

export default timeBudgets;
