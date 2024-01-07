import React, { ComponentProps, useEffect, useState } from "react";
// @ts-ignore
import awesome from "../../illustrations/awesome.svg";
import ScheduleListItem from "./list-item.tsx";
import { ScheduleItem } from "../../types";
// @ts-ignore
import party from "../../illustrations/party.svg";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const calculateMinutes = (date) => {
    return date.getHours() * 60 + date.getMinutes();
};

interface ScheduleListProps {
    schedule: { value: ScheduleItem[], date: string };
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
        return <div className="flex justify-center items-center w-full flex-col">
            <img
                src={party}
                alt=""
                className="w-1/2"
            />
            <h1 className="bigText text-center mb-8">
                No School Today!
            </h1>
        </div>
    }

    return (
        <div className="w-full h-full">
            {schedule.value.map((e, i) => (
                <ScheduleListItem
                    schedule={schedule.value}
                    i={i}
                    e={e}
                    nowMinutes={nowMinutes}
                />
            ))}
            {calculateMinutes(schedule.value[schedule.value.length - 1]) < nowMinutes &&
                <>
                    <img
                        src={awesome}
                        className="w-1/2"
                    />
                    <p className="mediumText">
                        School's over!
                    </p>
                    <p>Enjoy the rest of your {days[new Date().getDay()]}!</p>
                </>
            }
        </div>
    );
}

export default ScheduleList;