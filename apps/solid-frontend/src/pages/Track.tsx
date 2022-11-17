import Navbar from "~/Navbar";
import Tabs, { TTab } from "~/Tabs";

import type { Component } from "solid-js";
const Track: Component = () => {
    const tabs: TTab[] = [
        {
            label: "Day",
        },
        {
            label: "Week",
        },
        {
            label: "Month",
        },
    ];
    const onChangeTab = (index: number) => {
        
    };
    return (
        <div>
            <Navbar center={<Tabs tabs={tabs} onChange={onChangeTab} />} />
            <h1>Track time</h1>
        </div>
    );
};
export default Track;
