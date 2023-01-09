import { Navigate, Route, Routes } from "@solidjs/router";
import { Component, createEffect, createResource, lazy } from "solid-js";

import authStore from "./store/authStore";

const App = lazy(() => import("./layouts/App"));
const Track = lazy(() => import("@/Track"));
const Day = lazy(() => import("@/track/Day"));
const Week = lazy(() => import("@/track/Week"));
const Dashboard = lazy(() => import("@/Dashboard"));
const Calendar = lazy(() => import("@/Calendar"));
const ReportsOverview = lazy(() => import("@/reports/Overview"));
const Personal = lazy(() => import("@/Personal"));
const Settings = lazy(() => import("@/Settings"));
const Login = lazy(() => import("@/Login"));

const Main: Component = () => {
    const [user] = createResource(async () => await authStore.currentUser);
    createEffect(() => {
        switch (user()?.theme ?? "auto") {
            case "dark":
                document.documentElement.dataset.theme = "lines-dark";
                break;
            case "light":
                document.documentElement.dataset.theme = "lines-light";
                break;
            default:
                const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
                if (darkThemeQuery.matches) {
                    document.documentElement.dataset.theme = "lines-dark";
                } else {
                    document.documentElement.dataset.theme = "lines-light";
                }
        }
    });
    return (
        <>
            <Routes>
                <Route path="/" component={App}>
                    <Route path="/" component={Dashboard} />
                    <Route path="/track" component={Track}>
                        <Route path="/" element={<Navigate href="day" />} />
                        <Route path="/day" component={Day} />
                        <Route path="/week" component={Week} />
                    </Route>
                    <Route path="/calendar" component={Calendar} />
                    <Route path="/reports">
                        <Route path="/" component={ReportsOverview} />
                    </Route>
                    <Route path="/personal" component={Personal} />
                    <Route path="/settings" component={Settings} />
                </Route>
                <Route path="/login" component={Login} />
            </Routes>
        </>
    );
};

export default Main;
