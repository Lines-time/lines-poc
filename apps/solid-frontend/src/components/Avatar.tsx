import { Component, createResource } from "solid-js";

import { BACKEND_URL } from "../config";
import authStore from "../store/authStore";

type TProps = {
    id?: string;
};

const Avatar: Component<TProps> = (props) => {
    const [image, imageResource] = createResource(async () => {
        if (props.id) {
            const url = `${BACKEND_URL}/assets/${props.id}`;
            const res = await fetch(url, {
                headers: {
                    authorization: `Bearer ${await authStore.authToken}`,
                },
            });
            return window.URL.createObjectURL(await res.blob());
        }
        return "";
    });
    return (
        <div class="avatar">
            <div class="rounded-full w-8">
                <img src={image.latest} alt="" />
            </div>
        </div>
    );
};
export default Avatar;
