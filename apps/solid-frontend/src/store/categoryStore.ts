import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [categories] = createStore({
    get getAll() {
        return async () => {
            const result = await directus.items("WorkCategory").readByQuery({});
            return result.data;
        };
    },
    get getById() {
        return async (id: string) => {
            const result = await directus.items("WorkCategory").readOne(id);
            return result;
        };
    },
    get getForProject() {
        return async (projectId: string) => {
            const result = await directus.items("WorkCategory").readByQuery({
                filter: {
                    projects: {
                        _some: {
                            Project_id: {
                                _eq: projectId,
                            },
                        },
                    },
                },
            });
            return result.data;
        };
    },
});
export default categories;
