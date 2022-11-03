import { Route, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";
const App = lazy(() => import("@/App"));
const Login = lazy(() => import("@/Login"));

const Main: Component = () => {
    return (
        <>
            <Routes>
                <Route path="/" component={App} />
                <Route path="/login" component={Login} />
            </Routes>
        </>
    );
};

export default Main;
