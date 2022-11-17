import "./index.css";

import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

import Main from "./Main";

render(
    () => (
        <Router>
            <Main />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
