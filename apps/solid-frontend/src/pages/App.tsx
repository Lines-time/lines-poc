import { ChevronDown, Menu } from "lucide-solid";
import { Component, createSignal, For } from "solid-js";
import Dropdown from "~/Dropdown";

import { activeServer, servers, setActiveServerId } from "../store/servers";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
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
                    <div class="navbar bg-base-200">
                        <div class="flex-none">
                            <label for="main-drawer" class="drawer-button btn btn-ghost lg:hidden btn-square">
                                <Menu />
                            </label>
                        </div>
                        <div class="flex-1"></div>
                        <div class="flex-none"></div>
                    </div>
                    {/* CONTENT */}
                </div>
                <div class="drawer-side">
                    <label for="main-drawer" class="drawer-overlay"></label>
                    <div class="w-80 bg-base-200 text-base-content">
                        <div class="w-full flex flex-row justify-between items-center p-2 pl-5 gap-2 bg-primary text-primary-content">
                            <p>{activeServer()?.display_name}</p>
                            <Dropdown alignment="end" label={<ChevronDown />} labelClass="btn btn-circle btn-primary">
                                <For each={servers()}>
                                    {(server) => (
                                        <li onClick={() => setActiveServerId(server.id)}>
                                            <a>{server.display_name}</a>
                                        </li>
                                    )}
                                </For>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default App;
