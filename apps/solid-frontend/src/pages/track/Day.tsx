import { useSearchParams } from "@solidjs/router";
import dayjs from "dayjs";
import { Plus } from "lucide-solid";
import { Component, createResource, createSignal, For, onMount } from "solid-js";
import Button from "~/Button";
import WorkUnitModal from "~/modals/WorkUnitModal";
import WorkUnit from "~/WorkUnit";

import servers from "../../store/servers";

const Day: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showWorkUnitModal, setShowWorkUnitModal] = createSignal(false);

    onMount(() => {
        if (searchParams.d === undefined) {
            setSearchParams({
                d: dayjs().format("YYYY-MM-DD"),
            });
        }
    });

    const [workUnits, workUnitsResource] = createResource(
        () => servers.currentServer(),
        async () => {
            const result = await servers.currentServer()?.workUnit?.getForDayAndUser(dayjs(searchParams.d).toDate());
            result?.sort((a, b) => dayjs(a?.start).diff(dayjs(b?.start)));
            return result;
        }
    );

    return (
        <div class="grid grid-cols-3">
            <div class="p-6 grid col-span-2 grid-cols-2 grid-rows-[min-content_1fr] w-full">
                <h2 class="text-xl font-bold col-span-3">{dayjs().format("dddd, DD.MM.YYYY")}</h2>
                <div class="calendarday">{/* TODO: calendar day here */}</div>
                <div class="flex flex-col gap-2">
                    <For each={workUnits()}>{(unit) => unit && <WorkUnit unit={unit} />}</For>
                    <Button onClick={() => setShowWorkUnitModal(true)}>
                        <Plus />
                    </Button>
                </div>
            </div>
            <div class="bg-base-200 border-l-2 border-base-300 border-solid w-full"></div>
            <WorkUnitModal
                open={showWorkUnitModal()}
                onClose={() => setShowWorkUnitModal(false)}
                onSave={() => workUnitsResource.refetch()}
            ></WorkUnitModal>
        </div>
    );
};
export default Day;
