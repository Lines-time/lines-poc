import dayjs from "dayjs";
import { Component, createResource, For } from "solid-js";
import WorkUnit from "~/WorkUnit";

import servers from "../../store/servers";

const Day: Component = () => {
    const [workUnits, workUnitsResource] = createResource(
        () => servers.currentServer(),
        async () => {
            const result = await servers.currentServer()?.workUnit?.getForDayAndUser(dayjs().toDate());
            result?.sort((a, b) => dayjs(a?.start).diff(dayjs(b?.start)));
            return result;
        }
    );
    return (
        <div class="p-2 flex flex-row gap-2">
            <For each={workUnits()}>{(unit) => unit && <WorkUnit unit={unit} />}</For>
        </div>
    );
};
export default Day;
