import { Dimensions, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext, useState } from "react";
import { CalendarContext, ScheduleContext, UserDataContext } from "../util/contexts";
import { AcademicCapIcon, BellSnoozeIcon } from "react-native-heroicons/outline";
import ScheduleItem from "../components/ScheduleItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tabs from "../components/Tabs";
import CalendarPage from "./Calendar";
import log from "../util/debug";

const SchedulePage = ({ navigation }) => {
    const [page, setPage] = useState(0);
    const { userData } = useContext(UserDataContext);
    const { schedule } = useContext(ScheduleContext);
    const { calendar } = useContext(CalendarContext);

    var height = Dimensions.get("window").height - 56 - useSafeAreaInsets().bottom;

    if(schedule == null || calendar == null){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }

    var scheduleComponent = (
        <View style={tailwind("w-full h-full flex flex-col justify-center items-center")}>
            <AcademicCapIcon color={CONFIG.green} size={100} style={tailwind("mb-4")} />
            <Text style={[tailwind("font-bold text-2xl"), { color: CONFIG.green}]}>
                No School Today
            </Text>
            <Text style={[tailwind("text-lg"), { color: CONFIG.text}]}>
                Enjoy your day off!
            </Text>
        </View>
    );

    var eventsToday = [];
    var niceCalendar = [];
    var now = new Date();
    for(var i = 0; i < calendar.length; i++){
        var event = calendar[i];
        var eventStart = dateFromString(event.start);
        var eventEnd = dateFromString(event.end);
        // r/badcode but idgaf
        if(eventEnd.getHours() == 0) eventEnd.setHours(23, 59, 59, 999);
        // some events are recurring, so we need to check if the event is today
        const obj = {
            event: event,
            start: eventStart,
            end: eventEnd
        };
        if(eventStart.getFullYear() <= now.getFullYear() && eventStart.getMonth() <= now.getMonth() && eventStart.getDate() <= now.getDate() && eventEnd.getFullYear() >= now.getFullYear() && eventEnd.getMonth() >= now.getMonth() && eventEnd.getDate() >= now.getDate()){
            eventsToday.push(obj);
        }
        niceCalendar.push(obj);
    }

    // TODO: make this a setting?
    var useFixedHeight = true; // used to be false but idgaf
    if(schedule.value != null){
        // if we can't fit all the periods on the screen, use a fixed height and make it scroll
        if(schedule.value.length >= 8) useFixedHeight = true;
        var show0Period = schedule.value[0].name == "0 Period" && userData && userData.data && userData.data.show0;
        var start = show0Period ? schedule.value[0].start : schedule.value[1].start;
        var prevStart = start;
        var end = schedule.value[schedule.value.length - 1].end;

        scheduleComponent = !useFixedHeight ? (
            <View>
                {schedule.value.map((period, index) => {
                    if(userData && !userData.data.show0 && period.name == "0 Period") return null;
                    var temp = prevStart;
                    prevStart = period.end;
                    return (<ScheduleItem key={index} period={period} prevStart={temp} start={start} end={end} />)
                })}
            </View>
        ) : (
            <ScrollView>
                {schedule.value.map((period, index) => {
                    if(userData && !userData.data.show0 && period.name == "0 Period") return null;
                    var temp = prevStart;
                    prevStart = period.end;
                    var hasPassing = false;
                    var prevPeriod = null;
                    if(index != 0){
                        prevPeriod = schedule.value[index - 1];
                        hasPassing = prevPeriod.end != period.start;
                    }
                    return (
                        <>
                            {hasPassing && (
                                <View style={{
                                    height: CONFIG.DEFAULT_FIXED_HEIGHT / 2,
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}>
                                    <Text style={{
                                        color: CONFIG.grey,
                                        textAlign: "center",
                                        fontStyle: "italic",
                                    }}>
                                        {period.start - prevPeriod.end}m{" "}
                                        Passing
                                    </Text>
                                    <View style={{
                                        height: 1,
                                        borderStyle: "dashed",
                                        borderWidth: 1,
                                        borderColor: CONFIG.grey,
                                        borderRadius: 1,
                                        width: "100%",
                                    }}/>
                                </View>
                            )}
                            <ScheduleItem fixedHeight={true} key={index} period={period} prevStart={temp} start={start} end={end} />
                        </>
                    )
                })}
                <View style={{ height: CONFIG.DEFAULT_FIXED_HEIGHT / 2 }} />
            </ScrollView>
        );
    }

    const tabs = <Tabs
        tabs={["Schedule", "Events", "Calendar"]}
        cb={setPage}
        current={page}
        style={{
            position: "absolute",
            bottom: 0,
            left: 0,
        }}
    />;

    if(page == 0){
        return (
            <SafeAreaView style={[
                tailwind("bg-white w-full"),
                {
                    height: "100%"
                }
            ]}>
                {scheduleComponent}
                {tabs}
            </SafeAreaView>
        );
    }else if(page == 1){
        return (
            <SafeAreaView style={[
                tailwind("bg-white w-full"),
                {
                    height: "100%"
                }
            ]}>
            {eventsToday.length != 0 ? (
                <ScrollView style={tailwind("w-full h-full")}>
                    {eventsToday.map((event, index) => {
                        if(event.event.summary == undefined) return;
                        if(event.event.summary.includes("Schedule")) return null;
                        if(event.event.summary.includes("Schdule")) return null;
                        if(event.event.summary.includes("Minimum Day")) return null;
                        var isAllDay = event.start.getHours() == 0 && event.start.getMinutes() == 0 && event.start.getSeconds() == 0;
                        return (
                            <View key={index} style={tailwind("w-full px-4 py-2")}>
                                <Text style={[tailwind("font-bold text-2xl"), { color: CONFIG.green }]}>
                                    {event.event.summary}
                                </Text>
                                <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                                    {isAllDay ? "All Day" : event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " - " + event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                                <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                                    {event.event.description}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            ) : (
                <View style={tailwind("w-full h-full flex justify-center items-center")}>
                    <BellSnoozeIcon color={CONFIG.green} size={100} style={tailwind("mb-4")} />
                    <Text style={[tailwind("text-2xl font-bold"), { color: CONFIG.green}]}>
                        No Events Today
                    </Text>
                </View>
            )}
                {tabs}
            </SafeAreaView>
        );
    }else if(page == 2){
        return (
            <SafeAreaView style={[
                tailwind("bg-white w-full"),
                {
                    height: height
                }
            ]}>
                <CalendarPage navigation={navigation} calendar={niceCalendar} />
                {tabs}
            </SafeAreaView>
        );
    }
}

const dateFromString = (dateString) => {
    // format: yyyymmddThhmmss

    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    if(dateString.length == 8) return new Date(year, month - 1, day, 0, 0, 0);

    var hour = dateString.substring(9, 11);
    var minute = dateString.substring(11, 13);
    var second = dateString.substring(13, 15);
    return new Date(year, month - 1, day, hour, minute, second);
}

export default SchedulePage;