import { useContext, useEffect, useState } from "react";
import { DataContext, UserDataContext } from "../util/contexts.ts";
import LoadingSpinner from "../components/LoadingSpinner";
import ScheduleList from "../components/schedule/schedule-component.tsx";
import EventsComponent from "../components/schedule/events-component.tsx";

const SchedulePage: React.FC = ({
  containerStyles = "",
  pageStyles = "",
}: {
  containerStyles?: string;
  pageStyles?: string;
}) => {
  const { data } = useContext(DataContext);

  if (data === null || data.schedule === undefined)
    return (
      <div className="m-0 flex h-full items-center justify-center md:ml-64">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className={`m-0 bg-white p-4 ${pageStyles ? pageStyles : "md:ml-64"}`}>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="bigText slab mb-8 text-center">
          {false ? "Good luck on your finals!" : "Today's Schedule"}
        </h1>
      </div>
      <div className={`w-full md:flex md:flex-row ${containerStyles}`}>
        <ScheduleList schedule={data.schedule.value} />
        <EventsComponent calendar={data.calendar} />
      </div>
      <p className="mb-8 mt-4 w-full text-center text-sm">
        All schedule and calendar data is from the{" "}
        <a
          className="link text-sm"
          href="https://www.paly.net/calendar"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "0.8rem",
          }}
        >
          Paly Calendar
        </a>
        , with occasional manual overrides. If something doesn't look right,
        please{" "}
        <a
          href="mailto:bn51245@pausd.us"
          className="link"
          style={{
            fontSize: "0.8rem",
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
