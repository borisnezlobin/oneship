import { useContext } from "react"
import { DataContext } from "../util/contexts";
import game from "../illustrations/game.svg";
import { House, MapTrifold, PushPinSimple } from "phosphor-react";
import tickets from "../illustrations/tickets.svg";
import LoadingSpinner from "../components/LoadingSpinner";


const days = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
]

const SportsPage = () => {
    const { data } = useContext(DataContext);

    if(data === null || data.sports === undefined) return (
        <div className="m-0 md:ml-64 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );

    const today = new Date();
    const todayName = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate();

    return (
        <div className="m-0 md:ml-64 min-h-screen pb-8">
            {(!data.sports || data.sports.length === 0) ?
            <div className="flex flex-col justify-center items-center w-full h-screen">
                <img
                    src={tickets}
                    alt="tickets"
                    className="w-48 h-48"
                />
                <h1 className="bigText mb-4">
                    No Upcoming Events
                </h1>
                <hr className="w-4/5" />

            </div>
            :
            <>
            <div className="flex justify-center items-center w-full flex-col">
                <img
                    src={game}
                    alt="game"
                    className="w-48 h-48"
                />
                <h1 className="bigText text-center mb-8">
                    Upcoming Sports Events
                </h1>
            </div>
            {data.sports.map((day, index) => {
                return <div className="border border-grey rounded p-4 mx-2 mb-4" key={"sports" + day.date} ref={(r) => {
                    if(day.date == todayName && r) r.scrollIntoView();
                }}>
                    <h1 className="bigText flex flex-row gap-2 items-center justify-start">
                        {day.date} {day.date == todayName ? <PushPinSimple size={24} color="var(--green)" weight="bold" /> : <></>}
                    </h1>
                    <hr />
                    {day.events.map((event, index) => {
                        return <div key={"sports" + event.date + "" + index} className="mt-8 flex flex-row gap-8">
                            <p className="flex flex-col items-center justify-center w-24">
                                <p className={"font-bold text-2xl " + (event.result.includes("Win") ? "text-theme" : "text-red-800")}>
                                    {event.result.slice(4).trim()}
                                </p>
                                <p>
                                    {event.result.includes("Win") ? "Win" : event.result.includes("Loss") ? "Loss" : "---"}
                                </p>
                            </p>
                            <div>
                                <h1 className="mediumText">
                                    {event.team} {" "}
                                    <span className="font-bold text-black text-lg slab">
                                        {" "} {event.time}
                                    </span>
                                </h1>
                                <p>
                                    {
                                        event.location.toUpperCase().includes("TBA") ?
                                        "Location not announced"
                                        : "against " + event.opponent.trim()
                                    }
                                </p>
                                {!event.location.includes("TBA") && 
                                (
                                    <button onClick={() => {
                                        window.open(
                                            "https://www.google.com/maps/search/?api=1&query="
                                                + event.location.replaceAll(" ", "+"),
                                            "_blank"
                                        );
                                    }} className="absolute right-0 top-0 btn w-16">
                                        <MapTrifold />
                                        <p>Get Directions</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    })}
                </div>
            })}
            </>
            }
        </div>
    );
}

export default SportsPage;