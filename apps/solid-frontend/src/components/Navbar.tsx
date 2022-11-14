import { Menu } from "lucide-solid";

import type { Component } from "solid-js"

type TProps = {
    
};

const Navbar: Component<TProps> = (props) => {
    return (
        <div class="navbar bg-base-200">
            <div class="flex-none">
                <label for="main-drawer" class="drawer-button btn btn-ghost lg:hidden btn-square">
                    <Menu />
                </label>
            </div>
            <div class="flex-1"></div>
            <div class="flex-none"></div>
        </div>
    );
}
export default Navbar;