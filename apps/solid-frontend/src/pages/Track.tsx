import { Outlet, useLocation } from "@solidjs/router";
import dayjs from "dayjs";
import { Component, createMemo } from "solid-js";
import Navbar from "~/Navbar";
import Tabs, { TTab } from "~/Tabs";

import { createProgressData, formatDuration } from "../utils/utils";

const Track: Component = () => {
    const tabs: TTab[] = [
        {
            label: "Day",
            href: "/track/day",
        },
        {
            label: "Week",
            href: "/track/week",
        },
    ];
    const location = useLocation();
    const dayProgress = createProgressData(
        dayjs().startOf("day"),
        dayjs().endOf("day"),
    );
    const weekProgress = createProgressData(
        dayjs().startOf("week"),
        dayjs().endOf("week"),
    );
    const progress = createMemo(() =>
        location.pathname === "/track/day" ? dayProgress : weekProgress,
    );
    return (
        <div class="h-screen grid grid-rows-[64px_1fr] overflow-hidden">
            <Navbar
                title="Track time"
                center={<Tabs tabs={tabs} />}
                right={
                    <div class="pr-4 flex flex-row items-center gap-3">
                        <span>
                            <span
                                classList={{
                                    "text-success": progress().targetReached(),
                                    "text-error": !progress().targetReached(),
                                }}
                            >
                                {formatDuration(
                                    dayjs.duration(
                                        progress().workedTime() ?? 0,
                                    ),
                                )}
                                h
                            </span>
                            <span class="font-normal opacity-60">
                                /{formatDuration(progress().targetDuration())}h
                            </span>
                        </span>
                        <progress
                            class="progress progress-primary bg-base-100"
                            max={100}
                            value={progress().workedPercent()}
                        />
                    </div>
                }
            />
            <Outlet />
        </div>
    );
};
export default Track;
