import { Component, createResource, createSignal, Show, Suspense } from "solid-js";
import Button from "~/Button";
import FormControl from "~/FormControl";
import Loading from "~/Loading";
import Navbar from "~/Navbar";

import authStore from "../store/authStore";

import type { TUser } from "lines-types";

const Settings: Component = () => {
    const [currentUser] = createResource(async () => await authStore.currentUser);
    const [user, userResource] = createResource(async () => await authStore.currentUser);
    const [mutatedUser, setMutatedUser] = createSignal<Partial<TUser>>({});
    const saveSettings = async (e: Event) => {
        e.preventDefault();
        await authStore.update(mutatedUser());
        setMutatedUser({});
    };
    function updateProperty<T extends keyof TUser>(property: T, value: TUser[T]) {
        setMutatedUser((u) => ({
            ...u,
            [property]: value,
        }));
        userResource.mutate((u) => ({
            ...u,
            [property]: value,
        }));
    }

    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="User-settings" />
            <Suspense fallback={<Loading />}>
                <div class="p-6">
                    <form onSubmit={saveSettings}>
                        <div class="flex flex-row items-center gap-2">
                            <h2 class="text-2xl font-bold">
                                {`${currentUser.latest?.first_name} ${currentUser.latest?.last_name}`}
                            </h2>
                            <Show when={Object.keys(mutatedUser()).length !== 0}>
                                <Button submit primary class="btn-sm">
                                    Save
                                </Button>
                            </Show>
                        </div>
                        <FormControl inline label="Use project colors">
                            <input
                                type="checkbox"
                                class="toggle"
                                checked={user()?.use_project_colors ?? false}
                                onInput={(e) =>
                                    updateProperty("use_project_colors", e.currentTarget.checked)
                                }
                            />
                        </FormControl>
                    </form>
                </div>
            </Suspense>
        </div>
    );
};
export default Settings;
