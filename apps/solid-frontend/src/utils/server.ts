import { directus } from "./servers/directus";
import { offline } from "./servers/offline";

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