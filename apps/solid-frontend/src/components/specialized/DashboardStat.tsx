import dayjs from "dayjs";
import { Component, createMemo, createResource } from "solid-js";
import Stat from "~/Stat";

import servers from "../../store/servers";
import { parseTimeString, scale } from "../../utils/utils";

type TProps = {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    title: string;
};

const createData = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const [data_value, data_resource] = createResource(
        async () => await servers.currentServer()?.workUnit.getForDateRangeAndUser(start.toDate(), end.toDate())
    );
    const [target_value, target_resource] = createResource(
        async () => await servers.currentServer()?.dailyWorkTimeTarget.getForDateRange(start.toDate(), end.toDate())
    );
    const workedTime = createMemo(() => data_value.latest?.reduce((a, b) => a + dayjs(b?.end).diff(b?.start), 0));
    const targetTime = createMemo(() =>
        target_value.latest?.reduce(
            (a, b) =>
                a +
                dayjs
                    .duration({
                        hours: parseTimeString(b?.duration).hour(),
                        minutes: parseTimeString(b?.duration).minute(),
                    })
                    .asMilliseconds(),
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
                    {dayjs.duration(data.diff()).format("H:mm[h]")}
                </span>
            }
            figure={
                <div
                    class="radial-progress"
                    style={{
                        "--value": scale(data.workedTime() ?? 0, data.targetTime() ?? 0, 0, 100, 0),
                    }}
                >
                    {dayjs.duration(data.workedTime() ?? 0).format("H:mm[h]")}
                </div>
            }
        ></Stat>
    );
};
export default DashboardStat;
