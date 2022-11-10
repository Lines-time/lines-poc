import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";

import { init } from "./store/servers";

const App = lazy(() => import("@/App"));

const Main: Component = () => {
    init();
    return (
        <>
            <Routes>
                <Route path="/" component={App}></Route>
            </Routes>
        </>
    );
};

export default Main;
