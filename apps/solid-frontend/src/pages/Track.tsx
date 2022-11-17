import { Outlet } from "@solidjs/router";
import Navbar from "~/Navbar";
import Tabs, { TTab } from "~/Tabs";

import type { Component } from "solid-js";
const Track: Component = () => {
    const tabs: TTab[] = [
        {
            label: "Day",
            href: "/track/day",
        },
        {
            label: "Week",
            href: "/track/week",
        },
        {
            label: "Month",
            href: "/track/month",
        },
    ];
    return (
        <div class="h-full grid grid-rows-[min-content_1fr]">
            <Navbar title="Track time" center={<Tabs tabs={tabs} />} />
            <Outlet />
        </div>
    );
};
export default Track;
