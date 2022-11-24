import { Component, createResource } from "solid-js";

import servers from "../store/servers";

type TProps = {
    id?: string;
};

const Avatar: Component<TProps> = (props) => {
    const [image, imageResource] = createResource(async () => {
        if (servers.state.activeServer && servers.state.activeServer?.type !== "offline" && props.id) {
            const serverUrl = servers.state.activeServer.url;
            const url = `${serverUrl}/assets/${props.id}`;
            const res = await fetch(url, {
                headers: {
                    authorization: `Bearer ${await servers.currentServer()?.auth.getAuthToken()}`,
                },
            });
            return window.URL.createObjectURL(await res.blob());
        }
        return "";
    });
    return (
        <div class="avatar">
            <div class="rounded-full w-8">
                <img src={image.latest} />
            </div>
        </div>
    );
};
export default Avatar;
