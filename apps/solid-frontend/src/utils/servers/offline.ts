import type { TApi, TServer } from "../types";

// TODO: offline database with PouchDB
export const offline = (server: TServer): TApi => {
    return {
        auth: {
            login: () => {
                return true;
            },
            logout: () => {},
            isAuthenticated: () => true,
        },
        project: {
            getAll: () => {
                return null;
            },
            getById: (id) => {
                return null;
            },
        },
        category: {
            getAll: () => {
                return null;
            },
            getById: (id) => {
                return null;
            },
            getForProject: (id) => {
                return null;
            },
        },
        workUnit: {
            getForDayAndUser: (day, userId) => {
                return null;
            },
        },
    };
};
