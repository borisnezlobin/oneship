import { useContext } from "react";
import { DataContext } from "../util/contexts.ts";
import game from "../illustrations/game.svg";
import { House, MapTrifold, PushPinSimple } from "@phosphor-icons/react";
import tickets from "../illustrations/tickets.svg";
import LoadingSpinner from "../components/LoadingSpinner";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SportsPage = () => {
  const { data } = useContext(DataContext);

  if (data === null || data.sports === undefined)
    return (
      <div className="m-0 flex h-full items-center justify-center md:ml-64">
        <LoadingSpinner />
      </div>
    );

  const today = new Date();
  const todayName =
    days[today.getDay()] +
    ", " +
    months[today.getMonth()] +
    " " +
    today.getDate();

  return (
    <div className="m-0 min-h-screen pb-8 md:ml-64">
      {!data.sports || data.sports.length === 0 ? (
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <img src={tickets} alt="tickets" className="h-48 w-48" />
          <h1 className="bigText mb-4">No Upcoming Events</h1>
          <hr className="w-4/5" />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col items-center justify-center">
            <img src={game} alt="game" className="h-48 w-48" />
            <h1 className="bigText mb-8 text-center">Upcoming Sports Events</h1>
          </div>
          {data.sports.map((day, index) => {
            return (
              <div
                className="border-grey mx-2 mb-4 rounded border p-4"
                key={"sports" + day.date}
                ref={(r) => {
                  if (day.date == todayName && r) r.scrollIntoView();
                }}
              >
                <h1 className="bigText flex flex-row items-center justify-start gap-2">
                  {day.date}{" "}
                  {day.date == todayName ? (
                    <PushPinSimple
                      size={24}
                      color="var(--green)"
                      weight="bold"
                    />
                  ) : (
                    <></>
                  )}
                </h1>
                <hr />
                {day.events.map((event, index) => {
                  return (
                    <div
                      key={"sports" + event.date + "" + index}
                      className="mt-8 flex flex-row gap-8"
                    >
                      <p className="flex w-24 flex-col items-center justify-center">
                        <p
                          className={
                            "text-2xl font-bold " +
                            (event.result.includes("Win")
                              ? "text-theme"
                              : "text-red-800")
                          }
                        >
                          {event.result.slice(4).trim()}
                        </p>
                        <p>
                          {event.result.includes("Win")
                            ? "Win"
                            : event.result.includes("Loss")
                              ? "Loss"
                              : "---"}
                        </p>
                      </p>
                      <div>
                        <h1 className="mediumText">
                          {event.team}{" "}
                          <span className="slab text-lg font-bold text-black">
                            {" "}
                            {event.time}
                          </span>
                        </h1>
                        <p>
                          {event.location.toUpperCase().includes("TBA")
                            ? "Location not announced"
                            : "against " + event.opponent.trim()}
                        </p>
                        {!event.location.includes("TBA") && (
                          <button
                            onClick={() => {
                              window.open(
                                "https://www.google.com/maps/search/?api=1&query=" +
                                  event.location.replaceAll(" ", "+"),
                                "_blank",
                              );
                            }}
                            className="btn absolute right-0 top-0 w-16"
                          >
                            <MapTrifold />
                            <p>Get Directions</p>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SportsPage;
