import { useContext } from "react"
import { DataContext } from "../util/contexts";
import game from "../illustrations/game.svg";
import { House, MapTrifold } from "phosphor-react";
import tickets from "../illustrations/tickets.svg";
import LoadingSpinner from "../components/LoadingSpinner";


// tfw when the formatting
const SportsPage = () => {
    const { data } = useContext(DataContext);

    if(data === null || data.sports === undefined) return (
        <div className="m-0 md:ml-64 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );

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
                return <div className="border border-grey rounded p-4 mx-2 mb-4" key={"sports" + day.date}>
                    <h1 className="bigText">
                        {day.date}
                    </h1>
                    <hr />
                    {day.events.map((event, index) => {
                        return <div key={"sports" + event.date + "" + index} className="mt-8 flex flex-row">
                            {event.isHomeGame ? <House size={32} className="mr-4" color="var(--green)" /> : <></>}
                            <div>
                                <h1 className="mediumText">
                                    {event.team} {" "}
                                    <span className="font-bold text-black text-lg slab">
                                        {" "} {event.time}
                                    </span>
                                </h1>
                                <p>
                                    {
                                        event.location.includes("TBA") ?
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