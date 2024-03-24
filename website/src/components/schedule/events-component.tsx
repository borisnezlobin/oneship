import { ComponentProps } from "react";
import { CalendarEvent } from "../../types";
import { Exclude } from "@phosphor-icons/react";
import { Placeholder } from "@phosphor-icons/react/dist/ssr";

interface EventsProps {
  calendar: CalendarEvent[];
}

const EventsComponent: React.FC<EventsProps> = ({ calendar }) => {
  // one line :star-struck:
  var eventsToday: { event: CalendarEvent; start: Date; end: Date }[] = [];

  const containerClassName =
    "rounded-lg p-4 bg-white shadow-xl w-full md:w-128 border border-grey-300 flex flex-col justify-center items-center";
  if (calendar === null) {
    <div className={containerClassName}>
      <h1 className="mediumText">Loading...</h1>
    </div>;
  }

  var now = new Date();
  for (var i = 0; i < calendar.length; i++) {
    var event = calendar[i];
    var eventStart = dateFromString(event.start);
    var eventEnd = dateFromString(event.end);
    // r/badcode but idgaf
    if (eventEnd.getHours() === 0) eventEnd.setHours(23, 59, 59, 999);
    // some events are recurring, so we need to check if the event is today
    const obj = {
      event: event,
      start: eventStart,
      end: eventEnd,
    };
    if (
      eventStart.getFullYear() <= now.getFullYear() &&
      eventStart.getMonth() <= now.getMonth() &&
      eventStart.getDate() <= now.getDate() - 1 &&
      eventEnd.getFullYear() >= now.getFullYear() &&
      eventEnd.getMonth() >= now.getMonth() &&
      eventEnd.getDate() >= now.getDate() - 1
    ) {
      eventsToday.push(obj);
    }
  }

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-center md:ml-4 md:mt-0 md:h-full">
      <div className={containerClassName}>
        {eventsToday.length === 0 ||
        (eventsToday.length === 1 &&
          eventsToday[0].event.summary.includes("Schedule")) ? (
          <>
            <Placeholder className="text-theme mb-4 h-8 w-8" />
            <h1 className="text-theme text-center text-2xl">
              No events today!
            </h1>
          </>
        ) : (
          <>
            <h1 className="mediumText slab">Today's Events</h1>
            <div
              style={{ height: 1, width: "100%" }}
              className="my-2 bg-gray-300"
            />
            <div className="h-px w-full" />
            {eventsToday.map((e, i) => {
              if (e.event.summary.includes("Schedule")) return <></>;
              return (
                <div
                  key={"eventItem" + i}
                  className="border-grey-300 mt-2 flex w-full flex-col items-start justify-start rounded-lg border p-2"
                >
                  <h1 className="text-theme text-lg">{e.event.summary}</h1>
                  <p className="text-sm text-gray-500">
                    {timeStringFromStartAndEnd(e.start, e.end)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {/* @ts-ignore */}
                    {e.event.description.replaceAll("\\", "")}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const timeStringFromStartAndEnd = (start, end) => {
  // e.start.getHours() == 0 ? "All Day" : e.start.getHours() + ":" + e.start.getMinutes() + "-" + e.end.getHours() + ":" + e.end.getMinutes()
  var startString = "";

  if (start.getHours() === 0) return "All Day";

  if (start.getHours() < 10) startString += "0";
  startString += start.getHours() + ":";
  if (start.getMinutes() < 10) startString += "0";
  startString += start.getMinutes();

  startString += " - ";

  if (end.getHours() < 10) startString += "0";
  startString += end.getHours() + ":";
  if (end.getMinutes() < 10) startString += "0";
  startString += end.getMinutes();

  return startString;
};

const dateFromString = (dateString) => {
  // format: yyyymmddThhmmss

  var year = dateString.substring(0, 4);
  var month = dateString.substring(4, 6);
  var day = dateString.substring(6, 8);
  if (dateString.length === 8)
    return new Date(year, month - 1, day - 1, 0, 0, 0);

  var hour = dateString.substring(9, 11);
  var minute = dateString.substring(11, 13);
  var second = dateString.substring(13, 15);
  return new Date(year, month - 1, day - 1, hour, minute, second);
};

export default EventsComponent;
