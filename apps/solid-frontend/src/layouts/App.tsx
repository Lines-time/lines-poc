import { A, Outlet } from "@solidjs/router";
import { ChevronDown, Settings } from "lucide-solid";
import { Component, createMemo, createResource, createSignal, For, Show } from "solid-js";
import Avatar from "~/Avatar";
import Button from "~/Button";
import Dropdown from "~/Dropdown";
import LoginModal from "~/modals/LoginModal";

import servers from "../store/servers";
import createServer from "../utils/server";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const activeServer = createMemo(
        () => (servers.state.activeServer ? createServer(servers.state.activeServer) : null),
        null
    );
    const [isAuthenticated, authResource] = createResource(async () => {
        return (await servers.currentServer()?.auth?.isAuthenticated()) ?? false;
    });
    const [currentUser, currentUserResource] = createResource(
        async () => await servers.currentServer()?.auth.getCurrentUser()
    );

    const login = async (email: string, password: string) => {
        await servers.currentServer()?.auth?.login(email, password);
        await authResource.refetch();
    };
    const closeLoginModal = async () => {
        await authResource.refetch();
        if (!isAuthenticated()) {
            servers.setState({
                activeServerId: servers.state.defaultServerId,
            });
        }
    };
    return (
        <>
            <div class="drawer drawer-mobile">
                <input
                    id="main-drawer"
                    type="checkbox"
                    checked={drawerOpen()}
                    onInput={(e) => setDrawerOpen(e.currentTarget.checked)}
                    class="drawer-toggle"
                />
                <div class="drawer-content">
                    <Outlet />
                </div>
                <div class="drawer-side">
                    <label for="main-drawer" class="drawer-overlay"></label>
                    <div class="w-80 bg-base-200 border-r-2 border-base-300 border-solid text-base-content grid grid-rows-[64px_1fr]">
                        <div class="w-full flex flex-row justify-between items-center p-2 pl-5 gap-2 bg-primary text-primary-content">
                            <p>{servers.state.activeServer?.display_name}</p>
                            <Dropdown alignment="end" label={<ChevronDown />} labelClass="btn btn-circle btn-primary">
                                <For each={servers.state.servers}>
                                    {(server) => (
                                        <li
                                            class="text-base-content"
                                            onClick={() => {
                                                servers.setState({ activeServerId: server.id });
                                                authResource.refetch();
                                            }}
                                        >
                                            <a>{server.display_name}</a>
                                        </li>
                                    )}
                                </For>
                            </Dropdown>
                        </div>
                        <ul class="menu w-full p-2 rounded-box">
                            <li>
                                <A href="/" end>
                                    Overview
                                </A>
                            </li>
                            <li>
                                <A href="/track">Track time</A>
                            </li>
                            <li>
                                <A href="/vacation" end>
                                    Vacation
                                </A>
                            </li>
                            <li class="menu-title">
                                <span>Reports</span>
                            </li>
                            <li>
                                <A href="/reports" end>
                                    Overview
                                </A>
                            </li>
                        </ul>
                        <div class="flex-1"></div>
                        <div class="bg-base-300 p-2 pl-4 gap-2 flex flex-row items-center">
                            <Show when={currentUser.latest?.avatar && servers.state.activeServer?.type !== "offline"}>
                                <Avatar id={currentUser.latest?.avatar}  />
                            </Show>
                            <span class="flex-1">
                                <Show when={currentUser.latest?.first_name && currentUser.latest?.last_name}>
                                    {`${currentUser.latest!.first_name} ${currentUser.latest!.last_name}`}
                                </Show>
                            </span>
                            <Button class="btn-circle" icon={Settings}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal
                open={!isAuthenticated.loading && !isAuthenticated.latest}
                onClose={closeLoginModal}
                onSave={login}
            />
        </>
    );
};
export default App;
