import "./index.css";

import { Router } from "@solidjs/router";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import weekday from "dayjs/plugin/weekday";
import { render } from "solid-js/web";

import Main from "./Main";

dayjs.extend(weekday);
dayjs.extend(isToday);

render(
    () => (
        <Router>
            <Main />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
