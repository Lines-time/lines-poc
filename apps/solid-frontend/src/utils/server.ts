import { server as offline } from "offline-server";

import { directus } from "./servers/directus";

import type { TApi, TServer } from "lines-types";

const createServer = (server: TServer) => {
    let api: TApi | null = null;
    switch (server.type) {
        case "offline":
            api = offline(server);
            break;
        case "directus":
            api = directus(server);
            break;
    }
    return {
        ...server,
        ...api,
    };
};

export default createServer;
