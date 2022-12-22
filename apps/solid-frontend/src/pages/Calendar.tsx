import Navbar from "~/Navbar";
import CalendarMonth from "~/specialized/CalendarMonth";

import type { Component } from "solid-js";
const Calendar: Component = () => {
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Navbar title="Calendar" />
            <div>
                <CalendarMonth events={[]} />
            </div>
        </div>
    );
};
export default Calendar;
