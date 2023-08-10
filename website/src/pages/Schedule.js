import { useContext } from "react";
import { DataContext, UserDataContext } from "../util/contexts";
import LoadingSpinner from "../components/LoadingSpinner";
import party from "../illustrations/party.svg";

const SchedulePage = () => {
    const { userData } = useContext(UserDataContext);
    const { data } = useContext(DataContext);

    if(data === null || data.schedule === undefined) return (
        <div className="m-0 md:ml-64 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );

    const schedule = data.schedule;

    var scheduleComponent = <></>;
    if(schedule.value == null){
        scheduleComponent = <div className="flex justify-center items-center w-full flex-col">
            <img
                src={party}
                alt=""
                className="w-1/2"
            />
            <h1 className="bigText text-center mb-8">
                No School Today!
            </h1>
        </div>;
    }else{
        var useFixedHeight = false;
        if(schedule.value.length >= 8) useFixedHeight = true;
        var winHeight = window.innerHeight;

        // in minutes
        var dayStart = schedule.value[0].start;
        var dayEnd = schedule.value[schedule.value.length - 1].end;

        scheduleComponent = <div className="w-full h-full">
            {schedule.value.map((e, i) => {
                if(userData != null && !userData.data.show0 && e.name.includes("0 Period")) return <></>;
                var top = i === 0 ? 0 : (
                    (e.start - schedule.value[i - 1].end) / (dayEnd - dayStart) * winHeight
                );
                var topRadius = e.start === (i === 0 ? e.end : schedule.value[i - 1].end) ? 0 : 8;
                var bottomRadius = e.end === (i === schedule.value.length - 1 ? e.start : schedule.value[i + 1].start) ? 0 : 8;
                return <div
                    key={"scheduleItem" + i}
                    className="rounded-lg px-4 py-2 bg-gray-50 w-full border border-grey-300"
                    style={{
                        height: useFixedHeight ? 100 : (e.end - e.start) / (dayEnd - dayStart) * winHeight + "px",
                        marginTop: useFixedHeight ? 10 : top + "px",
                        borderTopLeftRadius: topRadius + "px",
                        borderTopRightRadius: topRadius + "px",
                        borderBottomLeftRadius: bottomRadius + "px",
                        borderBottomRightRadius: bottomRadius + "px",
                    }}
                >
                    <h1 className="mediumText">
                        {e.name}
                        {" "}
                        <span className="text-lg text-gray-500">
                            {e.startString}-{e.endString}
                        </span>
                    </h1>
                </div>;
            })}
        </div>;
    }

    var eventsToday = [];
    var eventComponent = <></>;
    const containerClassName = "rounded-lg p-4 bg-white shadow-xl w-full md:w-64 md:absolute md:top-24 md:right-4 border border-grey-300 flex flex-col justify-center items-center";
    if(data.calendar != null){
        var now = new Date();
        for(var i = 0; i < data.calendar.length; i++){
            var event = data.calendar[i];
            var eventStart = dateFromString(event.start);
            var eventEnd = dateFromString(event.end);
            // r/badcode but idgaf
            if(eventEnd.getHours() === 0) eventEnd.setHours(23, 59, 59, 999);
            // some events are recurring, so we need to check if the event is today
            const obj = {
                event: event,
                start: eventStart,
                end: eventEnd
            };
            if(eventStart.getFullYear() <= now.getFullYear() && eventStart.getMonth() <= now.getMonth() && eventStart.getDate() <= now.getDate() && eventEnd.getFullYear() >= now.getFullYear() && eventEnd.getMonth() >= now.getMonth() && eventEnd.getDate() >= now.getDate()){
                eventsToday.push(obj);
            }
        }
        eventComponent = <div className="w-full mt-4 md:mt-0 md:absolute md:h-full flex flex-col justify-center items-center">
            <div className={containerClassName}>
                <h1 className="mediumText">
                    Today's Events
                </h1>
                <div className="w-full h-px bg-gray-300 my-2" /> {/* idk why I can't just <hr /> */}
                {eventsToday.map((e, i) => {
                    return (
                        <div
                            key={"eventItem" + i}
                            className="rounded-lg p-2 bg-gray-100 w-full border border-grey-300 flex justify-start items-center mt-2"
                        >
                            <h1 className="mediumText">
                                {e.event.summary}
                                {" "}
                                <span className="text-lg text-gray-500">
                                    {e.start.getHours() + ":" + e.start.getMinutes() + "-" + e.end.getHours() + ":" + e.end.getMinutes()}
                                </span>
                            </h1>
                        </div>
                    );
                })}
                {eventsToday.length === 0 ? <h1 className="mediumText text-center mt-2">
                    No events today!
                    </h1> : <></>
                }
            </div>
        </div>;
    }else{
        eventComponent = <div className={containerClassName}>
            <h1 className="mediumText">
                Loading...
            </h1>
        </div>;
    }

    return (
        <div className="m-0 bg-white md:ml-64 p-4">
            <div className="flex justify-center items-center w-full flex-col">
                <h1 className="bigText text-center mb-8">
                    Today's Schedule
                </h1>
            </div>
            <div className="w-full md:w-2/3">
                {scheduleComponent}
            </div>
            <div className="block md:absolute w-full md:w-1/3 md:top-0 right-0 md:right-4">
                {eventComponent}
            </div>
            <p className="w-full text-center text-sm mt-4">
                All schedule and calendar data is from the{" "}
                <a
                    className="link text-sm"
                    href="https://www.paly.net/calendar"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontSize: "0.8rem"
                    }}
                >
                    Paly Calendar
                </a>
                , with occasional manual overrides. If something doesn't look right, please
                {" "}
                <a
                    href="mailto:bn51245@pausd.us"
                    className="link"
                    style={{
                        fontSize: "0.8rem"
                    }}
                >
                    contact us
                </a>
                .
            </p>
        </div>
    );
};

const dateFromString = (dateString) => {
    // format: yyyymmddThhmmss

    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    if(dateString.length === 8) return new Date(year, month - 1, day - 1, 0, 0, 0);

    var hour = dateString.substring(9, 11);
    var minute = dateString.substring(11, 13);
    var second = dateString.substring(13, 15);
    return new Date(year, month - 1, day - 1, hour, minute, second);
};

export default SchedulePage;