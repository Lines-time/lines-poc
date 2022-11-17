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
        <ul class="menu menu-horizontal gap-1 p-2 bg-base-300 rounded-xl">
            {props.tabs.map((tab, index) => (
                <li
                    class="px-2 py-1 cursor-pointer rounded-md transition-colors"
                    classList={{
                        "bg-primary": index === activeTab(),
                        "text-primary-content": index === activeTab(),
                        "hover:bg-base-300": index !== activeTab(),
                    }}
                    onClick={() => changeTab(index)}
                >
                    {tab.label}
                </li>
            ))}
        </ul>
    );
};
export default Tabs;
