import { useContext, useEffect, useState } from "react";
import { DataContext, UserDataContext } from "../util/contexts";
import { useNavigate } from "react-router-dom";
import FeedItem from "../components/FeedItem";
import { getCurrentScheduleInfo } from "../util/functions";
import sync from "../illustrations/sync.svg";

const FeedPage = () => {
    const { userData } = useContext(UserDataContext);
    const { data } = useContext(DataContext);
    const nav = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if(userData == null || userData.data === undefined){
        return (
            <div className="m-0 md:ml-64 flex flex-col px-4 justify-center items-center h-full">
                {/* <img
                    src={login}
                    alt=""
                    className="w-1/2"
                /> */}
                {/* <Fingerprint color="var(--green)" size={128} /> */}
                <h1 className="bigText text-center">
                    You're not logged in!
                </h1>
                <p className="text-center">
                    In order to show your feed, we need to know who you are.
                </p>
                <div className="h-4" />
                <button className="btn" onClick={() => {
                    nav("/login");
                }}>
                    Log in
                </button>
            </div>
        );
    }else{
        return (
            <div className="m-0 mb-2 md:ml-64 px-4">
                <div className="w-full mt-4 flex flex-col justify-center items-center">
                    <h1 className="bigText text-center">
                        {getTimelyGreeting()}, {userData.data.displayName}
                    </h1>
                    <p className="text-xl text-center">
                        {data === null || data.schedule === undefined ?
                            "Loading..." :
                            getCurrentScheduleInfo(data.schedule, currentTime)
                        }
                    </p>
                </div>
                {userData.messages.length === 0 ? (
                    <div className="w-full mt-16 h-full flex flex-col justify-center items-center">
                        <img src={sync} className="h-36 w-36" alt="logo" />
                        <p className="font-bold text-theme text-2xl md:text-3xl m-4 ml-2">
                            No messages for now!
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="font-bold text-theme text-2xl md:text-3xl m-4 ml-2">
                            Here's what's happening:
                        </p>
                        {userData.messages.map((message, index) => {
                            return (
                                <FeedItem key={"feed" + index} item={message} />
                            )
                        })}
                    </>
                )}
            </div>
        );
    }
};

const getTimelyGreeting = () => {
    const date = new Date();
    const hour = date.getHours();
    if(hour < 12){
        return "Good morning";
    }else if(hour < 18){
        return "Good afternoon";
    }else{
        return "Good evening";
    }
}

export default FeedPage;