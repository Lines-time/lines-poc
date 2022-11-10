import { Menu } from "lucide-solid";
import { Component, createSignal } from "solid-js";

const App: Component = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const toggleDrawer = () => {
        setDrawerOpen(() => !drawerOpen());
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
                    <ul class="menu p-4 w-80 bg-base-200 text-base-content">
                        <li>
                            <a>Sidebar Item 1</a>
                        </li>
                        <li>
                            <a>Sidebar Item 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
export default App;
