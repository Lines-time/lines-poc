import { useSearchParams } from "@solidjs/router";
import dayjs from "dayjs";
import { Plus, X } from "lucide-solid";
import { Component, createMemo, createResource, For, onMount, Show, Suspense } from "solid-js";
import Button from "~/Button";
import Loading from "~/Loading";
import WorkUnitForm from "~/modals/WorkUnitForm";
import CalendarDay from "~/specialized/CalendarDay";
import WorkUnit from "~/specialized/WorkUnit";

import categoryStore from "../../store/categoryStore";
import projectStore from "../../store/projectStore";
import workUnitStore from "../../store/workUnitStore";

import type { TWorkUnit } from "lines-types";
const Day: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    onMount(() => {
        if (searchParams.d === undefined) {
            setSearchParams({
                d: dayjs().format("YYYY-MM-DD"),
            });
        }
    });

    const [workUnits, workUnitsResource] = createResource(async () => {
        const result = await workUnitStore.getForDayAndUser(dayjs(searchParams.d).toDate());
        result?.sort((a, b) => dayjs(a?.start).diff(dayjs(b?.start)));
        return result;
    });

    const workUnitModalPresetData = createMemo(() => {
        if (searchParams.edit === "new") {
            const units = workUnits();
            if (units) {
                const lastUnit = units[units.length - 1];
                if (lastUnit) {
                    return {
                        start: lastUnit.end,
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

    const closeEdit = () => {
        setSearchParams({ edit: undefined });
    };

    const makeCalendarEventTitle = async (wu: TWorkUnit) => {
        const _project = await projectStore.getById(wu.project);
        const _category = await categoryStore.getById(wu.category);
        console.log("Hello");
        return `${_project?.title} - ${_category?.name} - ${wu.description}`;
    };

    const [calendarEvents] = createResource(workUnits, async () => {
        if (workUnits()) {
            return await Promise.all(
                workUnits()!.map(
                    async (wu) =>
                        wu && {
                            id: wu.id,
                            title: await makeCalendarEventTitle(wu),
                            start: wu.start,
                            end: wu.end,
                        }
                )
            );
        }
        return [];
    });

    return (
        <div class="grid grid-cols-3">
            <div class="p-6 grid col-span-2 grid-cols-2 gap-x-2 grid-rows-[min-content_1fr] w-full">
                <h2 class="text-xl font-bold col-span-3">{dayjs().format("dddd, DD.MM.YYYY")}</h2>
                <div class="pt-2">
                    <Suspense>
                        <CalendarDay events={calendarEvents() ?? []} />
                    </Suspense>
                </div>
                <div class="flex flex-col gap-2 pt-2">
                    <Suspense fallback={<Loading />}>
                        <For each={workUnits()}>
                            {(unit) =>
                                unit && (
                                    <WorkUnit
                                        unit={unit}
                                        active={searchParams.edit === unit.id}
                                        onClick={() => setSearchParams({ edit: unit.id })}
                                    />
                                )
                            }
                        </For>
                        <Button
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
                <div class="bg-base-300 border-l-2 border-base-100 border-solid w-full">
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
            </Show>
        </div>
    );
};
export default Day;
