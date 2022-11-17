import { Component, createSignal } from "solid-js";

export type TTab = {
    label: string;
};

type TProps = {
    tabs: TTab[];
    onChange?: (index: number) => void;
};

const Tabs: Component<TProps> = (props) => {
    const [activeTab, setActiveTab] = createSignal(0);

    const changeTab = (index: number) => {
        setActiveTab(index);
        props.onChange?.(index);
    };
    return (
        <div class="tabs tabs-boxed bg-base-300 p-2 rounded-lg">
            {props.tabs.map((tab, index) => (
                <a
                    class="tab"
                    classList={{
                        "tab-active": index === activeTab(),
                    }}
                    onClick={() => changeTab(index)}
                >
                    {tab.label}
                </a>
            ))}
        </div>
    );
};
export default Tabs;
