import dayjs from "dayjs";
import { Component, createMemo, createResource } from "solid-js";
import Stat from "~/Stat";

import dailyWorkTimeTargetStore from "../../store/dailyWorkTimeTargetStore";
import freeDayStore from "../../store/freeDayStore";
import vacationStore from "../../store/vacationStore";
import workUnitStore from "../../store/workUnitStore";
import { parseTimeStringDuration, scale } from "../../utils/utils";

type TProps = {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    title: string;
};

const createData = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const [data_value, data_resource] = createResource(
        async () => await workUnitStore.getForDateRangeAndUser(start.toDate(), end.toDate())
    );
    const [target_value, target_resource] = createResource(
        async () => await dailyWorkTimeTargetStore.getForDateRange(start.toDate(), end.toDate())
    );
    const [free_value, free_resource] = createResource(
        async () => await freeDayStore.getForDateRange(start.toDate(), end.toDate())
    );
    const [vacation_value, vacation_resource] = createResource(
        async () => await vacationStore.getForDateRangeAndUser(start.toDate(), end.toDate())
    );

    const workedTime = createMemo(() =>
        data_value.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0)
    );
    const targetTime = createMemo(() =>
        target_value.latest
            ?.filter((tt) => {
                return !vacation_value()?.some((v) =>
                    dayjs(tt!.date).isBetween(v!.start, v!.end, "day", "[]")
                );
            })
            .reduce(
                (a, b) =>
                    a +
                    parseTimeStringDuration(b?.duration).asMilliseconds() *
                        (1 -
                            (free_value()?.find((fd) => dayjs(b?.date).isSame(fd?.date, "day"))
                                ?.percentage ?? 0)),
                0
            )
    );
    const targetReached = createMemo(() => !dayjs(workedTime()).isBefore(targetTime()));
    const diff = createMemo(() => Math.abs(dayjs(workedTime()).diff(targetTime())));
    return {
        workedTime,
        targetTime,
        targetReached,
        diff,
    };
};

const DashboardStat: Component<TProps> = (props) => {
    const data = createData(props.start, props.end);

    const missingDuration = createMemo(() => dayjs.duration(data.diff()));
    const workedPercent = createMemo(() =>
        scale(data.workedTime() ?? 0, data.targetTime() ?? 0, 0, 100, 0)
    );

    return (
        <Stat
            title={props.title}
            value={dayjs.duration(data.workedTime() ?? 0).format("H:mm[h]")}
            description={
                <span
                    classList={{
                        "text-error": !data.targetReached(),
                        "text-success": data.targetReached(),
                    }}
                >
                    {!data.targetReached() ? "-" : "+"}
                    {`${missingDuration().asHours()}h`}
                </span>
            }
            figure={
                <div
                    class="radial-progress"
                    style={{
                        "--value":
                            isNaN(workedPercent()) || !Number.isFinite(workedPercent())
                                ? 100
                                : workedPercent(),
                    }}
                >
                    {isNaN(workedPercent()) || !Number.isFinite(workedPercent())
                        ? 100
                        : workedPercent().toFixed(2)}
                    %
                </div>
            }
        />
    );
};
export default DashboardStat;
