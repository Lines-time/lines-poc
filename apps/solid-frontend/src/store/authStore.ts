import { createStore } from "solid-js/store";

import { directus } from "../utils/directus";

import type { TUser } from "lines-types";

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
    get update() {
        return async (user: Partial<TUser>) => {
            const result = await directus.users.me.update(user);
            return result;
        };
    },
});

export default auth;
