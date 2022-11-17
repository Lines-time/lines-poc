import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";

import servers from "./store/servers";

const App = lazy(() => import("./layouts/App"));
const Track = lazy(() => import("@/Track"));
const Overview = lazy(() => import("@/Overview"));
const Vacation = lazy(() => import("@/Vacation"));
const ReportsOverview = lazy(() => import("@/reports/Overview"));

const Main: Component = () => {
    servers.init();
    return (
        <>
            <Routes>
                <Route path="/" component={App}>
                    <Route path="/" component={Overview}></Route>
                    <Route path="/track" component={Track}></Route>
                    <Route path="/vacation" component={Vacation}></Route>
                    <Route path="/reports">
                        <Route path="/" component={ReportsOverview}></Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default Main;
