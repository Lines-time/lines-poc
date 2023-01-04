import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [settings] = createStore({
    get get() {
        return async () => {
            const result = await directus.singleton("Settings").read();
            return result;
        };
    },
});
export default settings;
