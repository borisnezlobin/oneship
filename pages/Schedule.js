import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import COLORS from '../util/COLORS';
import Loading from '../util/Loading';
import isWeb, { formatDate } from '../util/util';
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Schedule = () => {
    // use localstorage to avoid load times every time user visits page
    var storedValue;
    try {
        storedValue = JSON.parse(localStorage.getItem("schedule-today"))
    } catch (e) {
        storedValue = null;
    }
    const insets = useSafeAreaInsets()
    const [schedule, setSchedule] = useState(storedValue);
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));

    useEffect(() => {
        if(schedule == null){
            getData();
        }

        async function getData(){
            fetch("https://paly-vikings.onrender.com/schedule-today")
            .then(res => res.json())
            .then(json => {
                setSchedule(json);
                localStorage.setItem("schedule-today", JSON.stringify(json));
            })
        }

        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000 * 60);

    }, [schedule, currentTime])

    if(schedule == null){
        return (<Loading />);
    }
    var scheduleLength = isWeb() ? schedule.data.length - 1 : schedule.data.length;
    var heightOfElement = (Dimensions.get("screen").height - 24 - insets.bottom - insets.top) / scheduleLength;
    console.log("height: " + (Dimensions.get("screen").height - 24 - insets.bottom - insets.top))
    console.log(schedule.data.length)
    console.log(insets)
    
    var nowDate = currentTime;
    var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    // var now = 500;

    var start = calculateMinutesFromTime(schedule.data[0].start);
    var end = calculateMinutesFromTime(schedule.data[schedule.data.length - 1]);

    var positionOfTimeMarker = ((now - startTime) / (endTime - startTime)) * 100;
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 100) positionOfTimeMarker = -100
    // ^ hehe

    return (
        <SafeAreaView style={{overflow: "hidden"}}>
            <View>
                {schedule.data.map((e, i) => <ScheduleItem height={heightOfElement} key={i} scheduleItem={e} />)}
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
            </Text>
        </SafeAreaView>
    )
}

const calculateMinutesFromTime = (timeString) => {
    var time = parseInt(timeString.split(":")[0]) * 60;
    time += parseInt(timeString.split(":")[1]);
    return timeString;
}

export default Schedule
export { calculateMinutesFromTime }; // used in schedule items