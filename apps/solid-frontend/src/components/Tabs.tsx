import { A } from "@solidjs/router";

import type { Component } from "solid-js";

export type TTab = {
    label: string;
    href: string;
};

type TProps = {
    tabs: TTab[];
};

const Tabs: Component<TProps> = (props) => {
    return (
        <div class="tabs tabs-boxed bg-base-300 p-2 rounded-lg">
            {props.tabs.map((tab) => (
                <A class="tab transition-colors rounded-md" activeClass="tab-active" href={tab.href}>
                    {tab.label}
                </A>
            ))}
        </div>
    );
};
export default Tabs;
