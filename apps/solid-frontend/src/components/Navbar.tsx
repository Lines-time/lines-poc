import { Menu } from "lucide-solid";

import type { Component, JSX } from "solid-js";

type TProps = {
    left?: JSX.Element;
    center?: JSX.Element;
    right?: JSX.Element;
    title?: string;
};

const Navbar: Component<TProps> = (props) => {
    return (
        <div class="navbar bg-base-200 border-b-2 border-base-300 border-solid">
            <div class="flex-none">
                <label for="main-drawer" class="drawer-button btn btn-ghost lg:hidden btn-square">
                    <Menu />
                </label>
                <h3 class="pl-4 font-bold text-xl">{props.title}</h3>
                {props.left}
            </div>
            <div class="flex-1 flex flex-row justify-center w-full">{props.center}</div>
            <div class="flex-none flex flex-row justify-end">{props.right}</div>
        </div>
    );
};
export default Navbar;
