import { Menu } from "lucide-solid";

import type { Component, JSX } from "solid-js";

type TProps = {
    center?: JSX.Element;
    right?: JSX.Element;
};

const Navbar: Component<TProps> = (props) => {
    return (
        <div class="navbar bg-base-200">
            <div class="flex-none">
                <label for="main-drawer" class="drawer-button btn btn-ghost lg:hidden btn-square">
                    <Menu />
                </label>
            </div>
            <div class="flex-1 flex flex-row justify-center w-full">{props.center}</div>
            <div class="flex-none flex flex-row justify-end">{props.right}</div>
        </div>
    );
};
export default Navbar;
