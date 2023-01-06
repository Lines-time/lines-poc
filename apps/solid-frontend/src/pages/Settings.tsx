import { Component, createResource, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";

import authStore from "../store/authStore";

const Settings: Component = () => {
    const [currentUser] = createResource(async () => await authStore.currentUser);
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="User-settings" />
            <Suspense fallback={<Loading />}>
                <div class="p-6">
                    <h2 class="text-2xl font-bold">
                        {`${currentUser.latest?.first_name} ${currentUser.latest?.last_name}`}
                    </h2>
                </div>
            </Suspense>
        </div>
    );
};
export default Settings;
