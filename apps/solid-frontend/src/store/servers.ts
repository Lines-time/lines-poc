import { createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";

import createServer from "../utils/server";

import type { TServer } from "../utils/types";

const [state, setState] = createStore<{
    servers: TServer[];
    activeServerId: string | null;
    readonly isAuthenticated: () => Promise<boolean>;
    readonly activeServer: TServer | null;
    readonly defaultServerId: string | null;
}>({
    servers: [],
    activeServerId: null,
    get isAuthenticated() {
        return async () =>
            this.activeServer ? (await createServer(this.activeServer).auth?.isAuthenticated()) ?? false : false;
    },
    get activeServer() {
        return this.servers.length
            ? this.servers.find((s: TServer) => s.id === this.activeServerId) ?? this.servers[0]
            : null;
    },
    get defaultServerId() {
        return this.servers.find((s: TServer) => s.default)?.id ?? null;
    },
});

const currentServer = createMemo(() => (state.activeServer ? createServer(state.activeServer) : null), null);

createEffect(() => {
    const id = state.activeServerId;
    if (id) localStorage.setItem("activeServerId", id);
    return id;
});

const init = async () => {
    const result = await fetch("/servers.json");
    const text = (await result.json()) as { servers: TServer[] };
    setState({
        servers: text.servers,
        activeServerId: localStorage.getItem("activeServerId") ?? text.servers.find((s) => s.default)?.id ?? null,
    });
};

export default {
    state,
    currentServer,
    setState,
    init,
};
