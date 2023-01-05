import { Outlet } from "@solidjs/router";
import { Component, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import Tabs, { TTab } from "~/Tabs";

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
    ];
    return (
        <div class="h-screen grid grid-rows-[64px_1fr] overflow-hidden">
            <Navbar title="Track time" center={<Tabs tabs={tabs} />} />
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </div>
    );
};
export default Track;
