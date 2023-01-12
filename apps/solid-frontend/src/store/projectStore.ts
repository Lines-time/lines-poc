import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [projects] = createStore({
    get getAll() {
        return async () => {
            const result = await directus.items("Project").readByQuery({});
            return result.data;
        };
    },
    get getForUser() {
        return async (userId = "$CURRENT_USER") => {
            const result = await directus.items("Project").readByQuery({
                filter: {
                    workers: {
                        directus_users_id: {
                            _eq: userId,
                        },
                    },
                },
            });
            return result.data;
        };
    },
    get getById() {
        return async (id: string) => {
            const result = await directus.items("Project").readOne(id);
            return result;
        };
    },
});

export default projects;
