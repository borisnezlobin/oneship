import React, { ComponentProps, useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../util/contexts.ts";
import { ScheduleItem } from "../../types";

interface ScheduleListItemProps {
  e: ScheduleItem;
  schedule: ScheduleItem[];
  i: number;
  nowMinutes: number;
}

const useFixedHeight = true; // maybe re-enabled in the future? we will see

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({
  e,
  schedule,
  i,
  nowMinutes,
}) => {
  var winHeight = window.innerHeight;

  // in minutes
  const dayStart = schedule[0].start;
  const dayEnd = schedule[schedule.length - 1].end;
  const { userData } = useContext(UserDataContext);

  if (userData != null && !userData.data.show0 && e.name.includes("0 Period"))
    return <></>;
  if (e.end < nowMinutes) return <></>;

  var top =
    i === 0
      ? 0
      : ((e.start - schedule[i - 1].end) / (dayEnd - dayStart)) * winHeight;
  var topRadius = e.start === (i === 0 ? e.end : schedule[i - 1].end) ? 0 : 8;
  var bottomRadius =
    e.end === (i === schedule.length - 1 ? e.start : schedule[i + 1].start)
      ? 0
      : 8;

  return (
    <>
      {i !== 0 && e.start !== schedule[i - 1].end ? (
        <div
          key={"scheduleGap" + i}
          style={{
            marginTop: 8,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#ccc",
            }}
          >
            {e.start - schedule[i - 1].end}m passing period
          </p>
        </div>
      ) : (
        <></>
      )}
      <div
        key={"scheduleItem" + i}
        className="border-grey-300 w-full rounded-lg border bg-gray-50 px-4 py-2"
        style={{
          // whatev-ah... cope harder (I have no clue what this code does anymore)
          height: useFixedHeight
            ? 100
            : ((e.end - e.start) / (dayEnd - dayStart)) * winHeight + "px",
          marginTop: useFixedHeight ? (topRadius == 8 ? 10 : 4) : top + "px",
          borderTopLeftRadius: topRadius + "px",
          borderTopRightRadius: topRadius + "px",
          borderBottomLeftRadius: bottomRadius + "px",
          borderBottomRightRadius: bottomRadius + "px",
          minHeight: 50,
        }}
      >
        <h1 className="mediumText slab">
          {userData != null &&
          Object.keys(userData.data).includes(e.name.trim())
            ? userData.data[e.name.trim()].customName
            : e.name}{" "}
          <span className="text-lg text-gray-500">
            {e.startString}-{e.endString}
          </span>
        </h1>
      </div>
    </>
  );
};

export default ScheduleListItem;
