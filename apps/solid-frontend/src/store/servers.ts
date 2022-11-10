import { createEffect, createMemo, createSignal } from "solid-js";

import createServer from "../utils/server";

const [servers, setServers] = createSignal<TServer[]>([]);
const [activeServerId, setActiveServerId] = createSignal<string | null>(null);
const [showLoginModal, setShowLoginModal] = createSignal(false);
const activeServer = createMemo(() => {
    return servers().length ? createServer(servers().find((s) => s.id === activeServerId()) ?? servers()[0]) : null;
});
const defaultServerId = createMemo(() => servers().find((s) => s.default)?.id ?? null);
createEffect(() => {
    const id = activeServerId();
    if (id) localStorage.setItem("activeServerId", id);
});

createEffect(async () => {
    if ((await activeServer()?.auth.isAuthenticated()) === false) setShowLoginModal(true);
});

const init = async () => {
    const result = await fetch("/servers.json");
    const text = (await result.json()) as { servers: TServer[] };
    setServers(text.servers);
    setActiveServerId(localStorage.getItem("activeServerId") ?? text.servers.find((s) => s.default)?.id ?? null);
};

export {
    servers,
    activeServerId,
    setActiveServerId,
    activeServer,
    init,
    showLoginModal,
    setShowLoginModal,
    defaultServerId,
};
