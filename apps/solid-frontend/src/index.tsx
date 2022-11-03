/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./Main";
import { Router } from "@solidjs/router";

render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
