import "./index.css";

import { Directus } from "@directus/sdk";
import { Router } from "@solidjs/router";
import { createContext } from "solid-js";
import { render } from "solid-js/web";

import App from "./Main";

const directus = new Directus("http://localhost:8055");
export const DirectusContext = createContext(directus);

render(
    () => (
        <DirectusContext.Provider value={directus}>
            <Router>
                <App />
            </Router>
        </DirectusContext.Provider>
    ),
    document.getElementById("root") as HTMLElement
);
