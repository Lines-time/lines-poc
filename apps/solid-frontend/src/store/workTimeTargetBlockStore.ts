import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [workTimeTargetBlocks] = createStore({
    get getById() {
        return async (id: string) => {
            const result = await directus
                .items("WorkTimeTargetBlock")
                .readOne(id);
            return result;
        };
    },
    get getForUser() {
        return async (userId = "$CURRENT_USER") => {
            const result = await directus
                .items("WorkTimeTargetBlock")
                .readByQuery({
                    filter: {
                        workerId: {
                            id: {
                                _eq: userId,
                            },
                        },
                    },
                });
            return result.data;
        };
    },
    get getCurrent() {
        return async () => {
            const result = await directus
                .items("WorkTimeTargetBlock")
                .readByQuery({
                    filter: {
                        workerId: {
                            id: {
                                _eq: "$CURRENT_USER",
                            },
                        },
                        start: {
                            _lte: new Date(),
                        },
                        _or: [
                            {
                                end: {
                                    _gte: new Date(),
                                },
                            },
                            {
                                end: {
                                    _null: true,
                                },
                            },
                        ],
                    },
                });
            return result.data;
        };
    },
});
export default workTimeTargetBlocks;
