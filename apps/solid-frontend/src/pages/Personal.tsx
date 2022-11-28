import { Component, createResource, For, Suspense } from "solid-js";
import Loading from "~/Loading";
import Navbar from "~/Navbar";
import WorkTimeTarget from "~/specialized/WorkTimeTarget";

import servers from "../store/servers";

const Personal: Component = () => {
    const [currentUser, currentUserResource] = createResource(
        async () => await servers.currentServer()?.auth.getCurrentUser()
    );

    const [workTimeTargets, workTimeTargetsResource] = createResource(async () => {
        return [{ id: "asd" }];
    });

    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Personal Info" />
            <Suspense fallback={<Loading />}>
                <div class="p-6">
                    <h2 class="text-2xl font-bold">{`${currentUser.latest?.first_name} ${currentUser.latest?.last_name}`}</h2>
                    <h3 class="text-lg">Work time targets</h3>
                    <div class="flex flex-row flex-wrap gap-2">
                        <For each={currentUser()?.workTimeTargetBlocks}>{(id) => id && <WorkTimeTarget id={id} />}</For>
                    </div>
                </div>
            </Suspense>
        </div>
    );
};
export default Personal;
