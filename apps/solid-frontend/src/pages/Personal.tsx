import { Component, createResource, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";

import servers from "../store/servers";

const Personal: Component = () => {
    const [currentUser, currentUserResource] = createResource(
        async () => await servers.currentServer()?.auth.getCurrentUser()
    );
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Personal Info" />
            <Suspense fallback={<Loading />}>
                <div>
                    <h1>{`${currentUser.latest?.first_name} ${currentUser.latest?.last_name}`}</h1>
                </div>
            </Suspense>
        </div>
    );
};
export default Personal;
