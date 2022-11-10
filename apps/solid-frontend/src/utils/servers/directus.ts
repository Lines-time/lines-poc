import { Directus } from "@directus/sdk";

type TDirectusServer = TServer & {
    url: string;
};

export const directus = (server: TDirectusServer): TApi => {
    const _directus = new Directus(server.url, {
        storage: {
            prefix: server.id + "-",
        },
    });
    return {
        auth: {
            login: async (email, password) => {
                const result = await _directus.auth.login({
                    email,
                    password,
                });
                if (result.access_token) return true;
                return false;
            },
            logout: async () => {
                await _directus.auth.logout();
            },
        },
    };
};
