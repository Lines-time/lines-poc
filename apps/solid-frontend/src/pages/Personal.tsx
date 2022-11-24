import Navbar from "~/Navbar";

import type { Component } from "solid-js"
const Personal: Component = () => {
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Personal Info" />
            Personal
        </div>
    );
}
export default Personal;