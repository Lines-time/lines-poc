import type { Component, JSX } from "solid-js";

type TProps = {
    title: JSX.Element;
    description: JSX.Element;
    value: JSX.Element;
    figure: JSX.Element;
};

const Stat: Component<TProps> = (props) => {
    return (
        <div class="stat">
            <div class="stat-figure text-primary">{props.figure}</div>
            <div class="stat-title">{props.title}</div>
            <div class="stat-value">{props.value}</div>
            <div class="stat-desc">{props.description}</div>
        </div>
    );
};
export default Stat;
