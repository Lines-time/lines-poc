import { A, Outlet } from "@solidjs/router";
import { ChevronDown } from "lucide-solid";
import { Component, createMemo, createResource, createSignal, For } from "solid-js";
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
        return (await activeServer()?.auth.isAuthenticated()) ?? false;
    });

    const login = async (email: string, password: string) => {
        await activeServer()?.auth.login(email, password);
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
                    <div class="w-80 bg-base-200 text-base-content">
                        <div class="w-full flex flex-row justify-between items-center p-2 pl-5 gap-2 bg-primary text-primary-content">
                            <p>{servers.state.activeServer?.display_name}</p>
                            <Dropdown alignment="end" label={<ChevronDown />} labelClass="btn btn-circle btn-primary">
                                <For each={servers.state.servers}>
                                    {(server) => (
                                        <li
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
                                <A href="/track" end>
                                    Track time
                                </A>
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
