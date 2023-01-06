import { A, Outlet } from "@solidjs/router";
import { BarChart3, Calendar, LayoutDashboard, Settings, Timer } from "lucide-solid";
import { Component, createMemo, createResource, createSignal, Show, Suspense } from "solid-js";
import Avatar from "~/Avatar";
import Button from "~/Button";
import Loading from "~/Loading";
import LoginModal from "~/modals/LoginModal";

import authStore from "../store/authStore";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const [isAuthenticated, authResource] = createResource(
        async () => await authStore.isAuthenticated
    );
    const [currentUser, currentUserResource] = createResource(
        async () => await authStore.currentUser
    );

    const loginModalOpen = createMemo(() => !(isAuthenticated.loading || isAuthenticated()));

    const login = async (email: string, password: string) => {
        await authStore.login?.(email, password);
        authResource.refetch();
    };
    const closeLoginModal = async () => {
        await authResource.refetch();
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
                <div class="drawer-content overflow-hidden">
                    <Outlet />
                </div>
                <div class="drawer-side">
                    <label for="main-drawer" class="drawer-overlay" />
                    <div class="w-80 bg-base-300 border-r-2 border-base-100 border-solid text-base-content grid grid-rows-[64px_1fr]">
                        <div class="border-b-2 border-base-100 p-2">
                            <div class="w-full flex flex-row justify-between items-center h-full p-2 pl-4 gap-2 rounded-md bg-primary text-primary-content">
                                <p>Lines-time</p>
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
                                <A href="/calendar" end activeClass="text-primary bg-base-100">
                                    <Calendar />
                                    Calendar
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
                        <div class="flex-1" />
                        <div class="bg-base-300 border-t-2 border-base-100 p-2 pl-4 gap-2 flex flex-row items-center">
                            <Show when={currentUser()?.avatar}>
                                <Suspense fallback={<Loading size="md" />}>
                                    <Avatar id={currentUser()?.avatar} />
                                </Suspense>
                            </Show>
                            <A class="flex-1" href="/personal" activeClass="text-primary">
                                <Suspense fallback={<Loading size="md" />}>
                                    <Show
                                        when={currentUser()?.first_name && currentUser()?.last_name}
                                    >
                                        {`${currentUser()!.first_name} ${currentUser()!.last_name}`}
                                    </Show>
                                </Suspense>
                            </A>
                            <Button class="btn-circle" icon={Settings} />
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
