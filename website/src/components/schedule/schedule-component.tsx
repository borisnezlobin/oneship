import React, { ComponentProps, useEffect, useState } from "react";
// @ts-ignore
import awesome from "../../illustrations/awesome.svg";
import ScheduleListItem from "./list-item.tsx";
import { ScheduleItem } from "../../types";
// @ts-ignore
import party from "../../illustrations/party.svg";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const calculateMinutes = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes();
};

interface ScheduleListProps {
  schedule: ScheduleItem[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedule }) => {
  const [nowMinutes, setNow] = useState(calculateMinutes(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(calculateMinutes(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (schedule == null) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <img src={party} alt="" className="w-1/2" />
        <h1 className="bigText mb-8 text-center">No School Today!</h1>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {schedule.map((e, i) => (
        <ScheduleListItem
          schedule={schedule}
          i={i}
          e={e}
          nowMinutes={nowMinutes}
        />
      ))}
      {schedule[schedule.length - 1].end < nowMinutes && (
        <>
          <img src={awesome} className="w-1/2" />
          <p className="mediumText">School's over!</p>
          <p>Enjoy the rest of your {days[new Date().getDay()]}!</p>
        </>
      )}
    </div>
  );
};

export default ScheduleList;
