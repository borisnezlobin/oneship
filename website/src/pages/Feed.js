import { useContext } from "react";
import { UserDataContext } from "../util/contexts";
import { useNavigate } from "react-router-dom";
import FeedItem from "../components/FeedItem";

const FeedPage = () => {
    const { userData } = useContext(UserDataContext);
    const nav = useNavigate();

    if(userData == null || userData.data == undefined){
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
            <div className="m-0 md:ml-64 px-4">
                <div className="w-full mt-4 flex flex-col justify-center items-center">
                    <h1 className="bigText text-center">
                        {getTimelyGreeting()}, {userData.data.displayName}
                    </h1>
                    <p className="text-xl text-center">
                        3rd Period is ending in 00:42:38
                    </p>
                </div>
                <p className="font-bold text-theme text-2xl md:text-3xl m-4 ml-2">
                    Here's what's happening:
                </p>
                {userData.messages.map((message, index) => {
                    return (
                        <FeedItem key={"feed" + index} item={message} />
                    )
                })}
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