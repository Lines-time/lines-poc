import dayjs from "dayjs";
import Stat from "~/Stat";

import { createProgressData, formatDuration } from "../../utils/utils";

import type { Component } from "solid-js";
type TProps = {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    title: string;
};

const DashboardStat: Component<TProps> = (props) => {
    const data = createProgressData(props.start, props.end);

    return (
        <Stat
            title={props.title}
            value={
                <>
                    <span
                        classList={{
                            "text-error": !data.targetReached(),
                            "text-success": data.targetReached(),
                        }}
                    >
                        {formatDuration(dayjs.duration(data.workedTime() ?? 0))}
                    </span>
                    <span class="font-normal opacity-60">
                        /{formatDuration(data.targetDuration())}
                    </span>
                </>
            }
            description={
                <span
                    class="text-lg"
                    classList={{
                        "text-error": !data.targetReached(),
                        "text-success": data.targetReached(),
                    }}
                >
                    {!data.targetReached() ? "-" : "+"}
                    {`${formatDuration(data.missingDuration())}h`}
                </span>
            }
            figure={
                <div
                    class="radial-progress"
                    style={{
                        "--value": data.workedPercent(),
                    }}
                >
                    {data.workedPercent().toFixed(2)}%
                </div>
            }
        />
    );
};
export default DashboardStat;
