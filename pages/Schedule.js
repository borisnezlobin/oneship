import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import COLORS from '../util/COLORS';
import Loading from '../util/Loading';
import isWeb, { formatDate } from '../util/util';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { UserSettingsContext } from '../util/contexts';

const Schedule = () => {
    // use sessionStorage to avoid load times every time user visits page
    var storedValue;
    try {
        storedValue = JSON.parse(sessionStorage.getItem("schedule-today"))
    } catch (e) {
        storedValue = null;
    }
    const insets = useSafeAreaInsets()
    const [schedule, setSchedule] = useState(storedValue);
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const { userSettingsContext } = useContext(UserSettingsContext);
    var s;
    try{
        s = schedule.data;
        if(!userSettingsContext.show0Period && schedule.data[0].name == "0 Period"){
            s = schedule.data.slice(1)
        }
    }catch(e){} // haha

    useEffect(() => {
        if(schedule == null){
            getData();
        }

        async function getData(){
            fetch("https://paly-vikings.onrender.com/schedule-today")
            .then(res => res.json())
            .then(json => {
                setSchedule(json);
                sessionStorage.setItem("schedule-today", JSON.stringify(json));
            })
        }

        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000 * 60);

    }, [schedule, currentTime])

    if(schedule == null){
        return (<Loading />);
    }
    var scheduleLength = userSettingsContext.show0Period ? schedule.data.length : schedule.data.length - 1;
    var screenHeight = (Dimensions.get("screen").height - 24 - insets.bottom - insets.top);

    var nowDate = currentTime;
    var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    // var now = 500;

    var start = calculateMinutesFromTime(s[0].start);
    var end = calculateMinutesFromTime(s[s.length - 1].end);

    console.log("start: " + start);
    console.log("end: " + end);
    console.log("height: " + screenHeight)

    var positionOfTimeMarker = ((now - start) / (end - start)) * 100;
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 100) positionOfTimeMarker = -100
    // ^ hehe

    return (
        <SafeAreaView style={{overflowX: "hidden", height: Dimensions.get("window").height}}>
            <View>
                {s.map((e, i) => <ScheduleItem
                    startTime={start}
                    endTime={end}
                    key={i}
                    scheduleItem={e}
                    screenHeight = {screenHeight}
                />)}
            </View>
            <View style={{
                position: "absolute",
                top: positionOfTimeMarker.toString() + "%",
                width: "100%",
                left: 2,
                height: 32,
            }}>
                <View style={{
                    width: "100%",
                    backgroundColor: "red",
                    height: 1,
                    position: "relative",
                    top: 16
                }} />
                <Text style = {{
                    position: "relative",
                    right: 0,
                    textAlign: 'center',
                    color: COLORS.FOREGROUND_COLOR,
                    fontWeight: "bold",
                    backgroundColor: "#B80f0A",
                    padding: 8,
                    width: 58,
                    height: 32,
                    borderRadius: 8
                }}>
                    {nowDate.getHours() == 12 ? "12" : nowDate.getHours() % 12}:{nowDate.getMinutes() < 10 ? "0" : ""}{nowDate.getMinutes()}
                </Text>
            </View>
            <Text style={{
                textAlign: "center",
                height: 24,
                lineHeight: 24
            }}>
                Server data last updated {formatDate(schedule.metadata.lastDataUpdateTime, false, true)}
                {now}, {end}, {start}
            </Text>
        </SafeAreaView>
    )
}

const calculateMinutesFromTime = (timeString) => {
    var hour = parseInt(timeString.split(":")[0]);
    var time = (hour < 7 ? hour + 12 : hour) * 60
    time += parseInt(timeString.split(":")[1]);
    return time;
}

export default Schedule
export { calculateMinutesFromTime }; // used in schedule items