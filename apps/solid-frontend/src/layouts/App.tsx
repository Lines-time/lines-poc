import { A, Outlet, useLocation, useSearchParams } from "@solidjs/router";
import { Calendar, LayoutDashboard, LogOut, Plus, Settings, Timer } from "lucide-solid";
import { Component, createResource, createSignal, onMount, Show, Suspense } from "solid-js";
import Avatar from "~/Avatar";
import Button from "~/Button";
import Loading from "~/Loading";

import authStore from "../store/authStore";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    onMount(async () => {
        const authed = await authStore.isAuthenticated;
        if (!authed) {
            // navigate("/login"); // somehow doesnt work
            window.location.href = "/login";
        }
    });

    const [currentUser, currentUserResource] = createResource(
        async () => await authStore.currentUser,
    );
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
                        <ul class="menu w-full p-2 rounded-box gap-2">
                            <li>
                                <A
                                    href="/"
                                    end
                                    activeClass="text-primary bg-base-100"
                                >
                                    <LayoutDashboard />
                                    Dashboard
                                </A>
                            </li>
                            <li>
                                <A
                                    href="/track"
                                    activeClass="text-primary bg-base-100"
                                >
                                    <Timer />
                                    Track time
                                </A>
                            </li>
                            <li class="gap-2">
                                <A
                                    href="/calendar"
                                    end
                                    activeClass="text-primary bg-base-100 peer"
                                >
                                    <Calendar />
                                    Calendar
                                </A>
                                <Show when={location.pathname === "/calendar"}>
                                    <button
                                        type="button"
                                        class="ml-4"
                                        onClick={() =>
                                            setSearchParams({
                                                vacation: "new",
                                            })
                                        }
                                    >
                                        <Plus /> Vacation
                                    </button>
                                </Show>
                            </li>
                            {/* <li class="menu-title">
                                <span>Reports</span>
                            </li>
                            <li>
                                <A
                                    href="/reports"
                                    end
                                    activeClass="text-primary bg-base-100"
                                >
                                    <BarChart3 />
                                    Overview
                                </A>
                            </li> */}
                        </ul>
                        <div class="flex-1" />
                        <div class="bg-base-300 border-t-2 border-base-100 p-2 pl-4 gap-2 flex flex-row items-center">
                            <Show when={currentUser()?.avatar}>
                                <Suspense fallback={<Loading size="md" />}>
                                    <Avatar id={currentUser()?.avatar} />
                                </Suspense>
                            </Show>
                            <A
                                class="flex-1 p-2 rounded-lg"
                                href="/personal"
                                activeClass="text-primary bg-base-100"
                            >
                                <Suspense fallback={<Loading size="md" />}>
                                    <Show
                                        when={
                                            currentUser()?.first_name &&
                                            currentUser()?.last_name
                                        }
                                    >
                                        {`${currentUser()!.first_name} ${
                                            currentUser()!.last_name
                                        }`}
                                    </Show>
                                </Suspense>
                            </A>
                            <Button
                                icon={LogOut}
                                class="btn-sm"
                                onClick={() => {
                                    authStore.logout;
                                    window.location.href = "/";
                                }}
                            />
                            <A
                                class="btn btn-sm btn-square btn-ghost"
                                href="/settings"
                                activeClass="text-primary bg-base-100"
                            >
                                <Settings size={20} />
                            </A>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default App;
