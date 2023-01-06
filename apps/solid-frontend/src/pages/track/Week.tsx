import { useNavigate, useSearchParams } from "@solidjs/router";
import dayjs, { Dayjs } from "dayjs";
import { X } from "lucide-solid";
import { Component, createMemo, createResource, createSignal, Show } from "solid-js";
import Button from "~/Button";
import WorkUnitForm from "~/modals/WorkUnitForm";
import CalendarWeek from "~/specialized/Calendar/CalendarWeek";
import WorkUnitCalendarEvent from "~/specialized/WorkUnitCalendarEvent";

import settingsStore from "../../store/settingsStore";
import workUnitStore from "../../store/workUnitStore";

import type { TWorkUnit } from "lines-types";

const Week: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [now, setNow] = createSignal(dayjs());

    const [presetStart, setPresetStart] = createSignal<Dayjs | undefined>();
    const [presetEnd, setPresetEnd] = createSignal<Dayjs | undefined>();
    const [settings] = createResource(async () => await settingsStore.get());
    const trackingInterval = createMemo(() => settings()?.tracking_increment ?? 30);

    const [workUnits, workUnitsResource] = createResource(
        async () =>
            await workUnitStore.getForDateRangeAndUser(
                now().isoWeekday(1).toDate(),
                now().isoWeekday(7).toDate()
            )
    );

    const closeEdit = () => {
        setSearchParams({ edit: undefined });
        setPresetEnd(undefined);
        setPresetStart(undefined);
    };

    const clickWorkUnit = (workUnit: TWorkUnit) => {
        setSearchParams({ edit: workUnit.id });
    };

    const workUnitModalPresetData = createMemo(() => {
        if (searchParams.edit === "new") {
            const units = workUnits();
            if (units) {
                const lastUnit = units[units.length - 1];
                if (lastUnit) {
                    return {
                        start: presetStart()?.toString() ?? lastUnit.end,
                        end: presetEnd()?.toString(),
                    };
                }
            }
        } else if (searchParams.edit) {
            const _wu = workUnits()?.find((wu) => wu && wu.id === searchParams.edit);
            if (_wu)
                return {
                    id: _wu.id,
                    start: _wu.start,
                    end: _wu.end,
                    project: _wu.project,
                    category: _wu.category,
                    description: _wu.description,
                };
        }
        return {};
    });

    const events = createMemo(
        () =>
            workUnits()?.map((wu) => ({
                start: dayjs(wu.start).toDate(),
                end: dayjs(wu.end).toDate(),
                display: () => (
                    <WorkUnitCalendarEvent workUnit={wu} onClick={() => clickWorkUnit(wu)} />
                ),
            })) ?? []
    );

    return (
        <div class="overflow-auto relative">
            <CalendarWeek
                now={now}
                controls={false}
                interval={trackingInterval}
                events={events}
                onCreateEvent={(start, end) => {
                    setPresetStart(start);
                    setPresetEnd(end);
                    setSearchParams({ edit: "new" });
                }}
            />
            <Show when={searchParams.edit}>
                <div class="fixed top-20 right-8 bg-base-300 rounded-lg border-solid border-base-100 border-2 z-10 w-1/4">
                    <div class="">
                        <div class="flex flex-row p-2 pl-3 justify-between">
                            <h2 class="font-bold text-xl">
                                {searchParams.edit === "new" ? "Create new" : "Edit"}
                            </h2>
                            <Button class="btn-sm" icon={X} onClick={() => closeEdit()} />
                        </div>
                        <div class="p-2">
                            <WorkUnitForm
                                presetData={workUnitModalPresetData()}
                                onClose={() => closeEdit()}
                                onSave={() => workUnitsResource.refetch()}
                            />
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};
export default Week;
