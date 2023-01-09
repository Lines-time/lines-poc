import { Component, JSX, Show } from "solid-js";

type TProps = {
    title: JSX.Element;
    description: JSX.Element;
    value: JSX.Element;
    figure?: JSX.Element;
};

const Stat: Component<TProps> = (props) => {
    return (
        <div class="stat">
            <Show when={props.figure}>
                <div class="stat-figure text-primary">{props.figure}</div>
            </Show>
            <div class="stat-title">{props.title}</div>
            <div class="stat-value">{props.value}</div>
            <div class="stat-desc">{props.description}</div>
        </div>
    );
};
export default Stat;
