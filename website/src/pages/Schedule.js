import { useContext, useEffect, useState } from "react";
import { DataContext, UserDataContext } from "../util/contexts";
import LoadingSpinner from "../components/LoadingSpinner";
import ScheduleList from "../components/schedule/schedule-component.tsx";
import EventsComponent from "../components/schedule/events-component.tsx";


const SchedulePage = () => {
    const { data } = useContext(DataContext);

    if (data === null || data.schedule === undefined) return (
        <div className="m-0 md:ml-64 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="m-0 bg-white md:ml-64 p-4">
            <div className="flex justify-center items-center w-full flex-col">
                <h1 className="bigText text-center mb-8 slab">
                    {false ? "Good luck on your finals!" : "Today's Schedule"}
                </h1>
            </div>
            <div className="w-full md:flex md:flex-row">
                <ScheduleList schedule={data.schedule.value} />
                <EventsComponent calendar={data.calendar} />
            </div>
            <p className="w-full text-center text-sm mt-4 mb-8">
                All schedule and calendar data is from the{" "}
                <a
                    className="link text-sm"
                    href="https://www.paly.net/calendar"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontSize: "0.8rem"
                    }}
                >
                    Paly Calendar
                </a>
                , with occasional manual overrides. If something doesn't look right, please
                {" "}
                <a
                    href="mailto:bn51245@pausd.us"
                    className="link"
                    style={{
                        fontSize: "0.8rem"
                    }}
                >
                    contact us
                </a>
                .
            </p>
        </div>
    );
};

export default SchedulePage;