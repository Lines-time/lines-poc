import Navbar from "~/Navbar";

import type { Component } from "solid-js";
const Overview: Component = () => {
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Overview" />
        </div>
    );
};
export default Overview;
