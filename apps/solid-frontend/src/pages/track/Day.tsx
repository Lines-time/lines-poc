import { useNavigate, useSearchParams } from "@solidjs/router";
import dayjs, { Dayjs } from "dayjs";
import { Plus, X } from "lucide-solid";
import {
    Component,
    createEffect,
    createMemo,
    createResource,
    createSignal,
    For,
    onMount,
    Show,
    Suspense,
} from "solid-js";
import Button from "~/Button";
import Loading from "~/Loading";
import WorkUnitForm from "~/modals/WorkUnitForm";
import CalendarDay from "~/specialized/Calendar/CalendarDay";
import WorkUnit from "~/specialized/WorkUnit";
import WorkUnitCalendarEvent from "~/specialized/WorkUnitCalendarEvent";

import settingsStore from "../../store/settingsStore";
import workUnitStore from "../../store/workUnitStore";

import type { TWorkUnit } from "lines-types";
const Day: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [now, setNow] = createSignal(dayjs());

    const [presetStart, setPresetStart] = createSignal<Dayjs | undefined>();
    const [presetEnd, setPresetEnd] = createSignal<Dayjs | undefined>();
    const [settings] = createResource(async () => await settingsStore.get());
    const trackingInterval = createMemo(() => settings()?.tracking_increment ?? 30);

    const updateSearchParamsDay = () => {
        if (searchParams.d === undefined) {
            setSearchParams({
                d: dayjs().format("YYYY-MM-DD"),
            });
        }
    };

    onMount(() => {
        updateSearchParamsDay();
    });

    createEffect(() => {
        updateSearchParamsDay();
    });

    const [workUnits, workUnitsResource] = createResource(async () => {
        const result = await workUnitStore.getForDayAndUser(dayjs(searchParams.d).toDate());
        result?.sort((a, b) => dayjs(a?.start).diff(dayjs(b?.start)));
        return result;
    });

    const workUnitModalPresetData = createMemo(() => {
        if (searchParams.edit === "new") {
            const units = workUnits.latest;
            if (units) {
                const lastUnit = units[units.length - 1];
                if (lastUnit || (presetStart() && presetEnd())) {
                    return {
                        start: presetStart()?.toString() ?? lastUnit.end,
                        end: presetEnd()?.toString(),
                    };
                }
            }
        } else if (searchParams.edit) {
            const _wu = workUnits.latest?.find((wu) => wu && wu.id === searchParams.edit);
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

    const closeEdit = () => {
        setSearchParams({ edit: undefined });
        setPresetEnd(undefined);
        setPresetStart(undefined);
    };

    const clickWorkUnit = (workUnit: TWorkUnit) => {
        setSearchParams({ edit: workUnit.id });
    };

    const events = createMemo(
        () =>
            workUnits.latest?.map((wu) => ({
                start: dayjs(wu.start).toDate(),
                end: dayjs(wu.end).toDate(),
                display: () => (
                    <WorkUnitCalendarEvent workUnit={wu} onClick={() => clickWorkUnit(wu)} />
                ),
            })) ?? []
    );

    return (
        <div class="grid grid-cols-3 overflow-auto">
            <div class="p-6 grid col-span-2 grid-cols-2 gap-x-2 grid-rows-[min-content_1fr] w-full">
                <h2 class="text-xl font-bold col-span-3">{dayjs().format("dddd, DD.MM.YYYY")}</h2>
                <div class="pt-2">
                    <CalendarDay
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
                </div>
                <div class="flex flex-col gap-2 pt-2">
                    <Suspense fallback={<Loading />}>
                        <For each={workUnits.latest}>
                            {(unit) =>
                                unit && (
                                    <WorkUnit
                                        unit={unit}
                                        active={searchParams.edit === unit.id}
                                        onClick={() => clickWorkUnit(unit)}
                                    />
                                )
                            }
                        </For>
                        <Button
                            class="sticky top-2"
                            onClick={() =>
                                setSearchParams({
                                    edit: "new",
                                })
                            }
                        >
                            <Plus />
                        </Button>
                    </Suspense>
                </div>
            </div>
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
export default Day;
