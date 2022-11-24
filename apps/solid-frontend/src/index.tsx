import "./index.css";

import { Router } from "@solidjs/router";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import isToday from "dayjs/plugin/isToday";
import weekday from "dayjs/plugin/weekday";
import { render } from "solid-js/web";

import Main from "./Main";

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(CustomParseFormat);

render(
    () => (
        <Router>
            <Main />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
