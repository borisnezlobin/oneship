import { useContext, useEffect, useState } from "react";
import { DataContext, UserDataContext } from "../util/contexts.ts";
import { useNavigate } from "react-router-dom";
import FeedItem from "../components/FeedItem";
import { getCurrentScheduleInfo } from "../util/functions";
import sync from "../illustrations/sync.svg";
import ScheduleList from "../components/schedule/schedule-component.tsx";
import SchedulePage from "./Schedule.tsx";

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

  if (userData == null || userData.data === undefined) {
    return (
      <div className="m-0 flex h-full flex-col items-center justify-center px-4 md:ml-64">
        {/* <img
                    src={login}
                    alt=""
                    className="w-1/2"
                /> */}
        {/* <Fingerprint color="var(--green)" size={128} /> */}
        <h1 className="bigText text-center">You're not logged in!</h1>
        <p className="text-center">
          In order to show your feed, we need to know who you are.
        </p>
        <div className="h-4" />
        <button
          className="btn"
          onClick={() => {
            nav("/login");
          }}
        >
          Log in
        </button>
      </div>
    );
  } else {
    return (
      <div className="m-0 mb-2 px-4 md:ml-64">
        <div className="mt-4 flex w-full flex-col items-center justify-center lg:w-1/2">
          <h1 className="bigText text-center">
            {getTimelyGreeting()}, {userData.data.displayName}
          </h1>
          <p className="text-center text-xl">
            {data === null || data.schedule === undefined
              ? "Loading..."
              : getCurrentScheduleInfo(data.schedule, currentTime)}
          </p>
        </div>
        {userData.messages.length === 0 ? (
          <div className="mt-16 flex h-full w-full flex-col items-center justify-center lg:w-1/2">
            <img src={sync} className="h-36 w-36" alt="logo" />
            <p className="text-theme m-4 ml-2 text-center text-2xl font-bold md:text-3xl">
              No messages for now! Lorem ispuda;sdjf dolor sit amet
            </p>
          </div>
        ) : (
          <>
            <p className="text-theme m-4 ml-2 text-2xl font-bold md:text-3xl lg:w-1/2">
              Here's what's happening:
            </p>
            {userData.messages.map((message, index) => {
              return <FeedItem key={"feed" + index} item={message} />;
            })}
          </>
        )}

        <div className="mt:4 border-gray-10 right-4 top-4 w-full rounded-lg border lg:fixed lg:w-1/3">
          <SchedulePage containerStyles="md:flex-col" pageStyles="md:m-0" />
        </div>
      </div>
    );
  }
};

const getTimelyGreeting = () => {
  const date = new Date();
  const hour = date.getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export default FeedPage;
