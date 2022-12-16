import { A, Outlet } from "@solidjs/router";
import { BarChart3, ChevronDown, LayoutDashboard, Palmtree, Settings, Timer } from "lucide-solid";
import { Component, createMemo, createResource, createSignal, For, Show, Suspense } from "solid-js";
import Avatar from "~/Avatar";
import Button from "~/Button";
import Dropdown from "~/Dropdown";
import Loading from "~/Loading";
import LoginModal from "~/modals/LoginModal";

import servers from "../store/servers";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const [isAuthenticated, authResource] = createResource(async () => {
        const result = await servers.currentServer()?.auth?.isAuthenticated?.();
        return result;
    });
    const [currentUser, currentUserResource] = createResource(
        async () => await servers.currentServer()?.auth.getCurrentUser()
    );

    const loginModalOpen = createMemo(() => !isAuthenticated.loading && !isAuthenticated());

    const login = async (email: string, password: string) => {
        await servers.currentServer()?.auth?.login?.(email, password);
        authResource.refetch();
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
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>
                <div class="drawer-side">
                    <label for="main-drawer" class="drawer-overlay"></label>
                    <div class="w-80 bg-base-300 border-r-2 border-base-100 border-solid text-base-content grid grid-rows-[64px_1fr]">
                        <div class="border-b-2 border-base-100 p-2">
                            <div class="w-full flex flex-row justify-between items-center h-full p-2 pl-4 gap-2 rounded-md bg-primary text-primary-content">
                                <p>{servers.state.activeServer?.display_name}</p>
                                <Dropdown
                                    alignment="end"
                                    label={<ChevronDown />}
                                    labelClass="btn btn-circle btn-sm btn-primary"
                                >
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
                        </div>
                        <ul class="menu menu-compact w-full p-2 rounded-box gap-2">
                            <li>
                                <A href="/" end activeClass="text-primary bg-base-100">
                                    <LayoutDashboard />
                                    Dashboard
                                </A>
                            </li>
                            <li>
                                <A href="/track" activeClass="text-primary bg-base-100">
                                    <Timer />
                                    Track time
                                </A>
                            </li>
                            <li>
                                <A href="/vacation" end activeClass="text-primary bg-base-100">
                                    <Palmtree />
                                    Vacation
                                </A>
                            </li>
                            <li class="menu-title">
                                <span>Reports</span>
                            </li>
                            <li>
                                <A href="/reports" end activeClass="text-primary bg-base-100">
                                    <BarChart3 />
                                    Overview
                                </A>
                            </li>
                        </ul>
                        <div class="flex-1"></div>
                        <div class="bg-base-300 border-t-2 border-base-100 p-2 pl-4 gap-2 flex flex-row items-center">
                            <Show when={currentUser()?.avatar && servers.state.activeServer?.type !== "offline"}>
                                <Suspense fallback={<Loading size="md" />}>
                                    <Avatar id={currentUser()?.avatar} />
                                </Suspense>
                            </Show>
                            <A class="flex-1" href="/personal" activeClass="text-primary">
                                <Suspense fallback={<Loading size="md" />}>
                                    <Show when={currentUser()?.first_name && currentUser()?.last_name}>
                                        {`${currentUser()!.first_name} ${currentUser()!.last_name}`}
                                    </Show>
                                </Suspense>
                            </A>
                            <Button class="btn-circle" icon={Settings}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal
                open={loginModalOpen()}
                onClose={closeLoginModal}
                onSave={login}
                loading={isAuthenticated.loading}
            />
        </>
    );
};
export default App;
