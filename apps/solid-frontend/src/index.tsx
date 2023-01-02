import "./index.css";

import { Router } from "@solidjs/router";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import { render } from "solid-js/web";

import Main from "./Main";

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(CustomParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat)

render(
    () => (
        <Router>
            <Main />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
