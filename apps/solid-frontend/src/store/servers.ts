import { createEffect, createMemo, createSignal } from "solid-js";

import createServer from "../utils/server";

const [servers, setServers] = createSignal<TServer[]>([]);
const [activeServerId, setActiveServerId] = createSignal<string | null>(null);
const activeServer = createMemo(() => {
    return servers().length ? createServer(servers().find((s) => s.id === activeServerId()) ?? servers()[0]) : null;
});

createEffect(() => {
    const id = activeServerId();
    if (id) localStorage.setItem("activeServerId", id);
    else localStorage.removeItem("activeServerId");
});

const init = async () => {
    const result = await fetch("/servers.json");
    const text = (await result.json()) as { servers: TServer[] };
    setServers(text.servers);
    setActiveServerId(localStorage.getItem("activeServerId") ?? text.servers.find((s) => s.default)?.id ?? null);
};

export { servers, activeServerId, init };
