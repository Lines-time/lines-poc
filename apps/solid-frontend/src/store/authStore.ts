import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

const [auth] = createStore({
    get login() {
        return async (email: string, password: string) => {
            const result = await directus.auth.login({
                email,
                password,
            });
            if (result.access_token) return true;
            return false;
        };
    },
    get logout() {
        return directus.auth.logout();
    },
    get isAuthenticated() {
        return directus.users.me
            .read()
            .catch(() => false)
            .then((me) => !!me);
    },
    get currentUser() {
        return directus.users.me.read();
    },
    get authToken() {
        return directus.auth.token;
    },
});

export default auth;
