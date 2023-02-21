import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import COLORS from '../util/COLORS';
import Loading from '../util/Loading';
import { formatDate } from '../util/util';

const Schedule = () => {
    // use localstorage to avoid load times every time user visits page
    var storedValue;
    try {
        storedValue = JSON.parse(localStorage.getItem("schedule-today"))
    } catch (e) {
        storedValue = null;
    }

    const [schedule, setSchedule] = useState(storedValue);

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
    }, [schedule])

    if(schedule == null){
        return (<Loading />);
    }

    var heightOfElement = Dimensions.get("screen").height / schedule.data.length;
    console.log(heightOfElement)
    
    var nowDate = new Date(Date.now());
    // var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    var now = 500;

    var positionOfTimeMarker = calculatePosition(now, schedule.data)

    return (
        <SafeAreaView style={{overflow: "hidden"}}>
            <View>
                {schedule.data.map((e, i) => <ScheduleItem height={heightOfElement} key={i} scheduleItem={e} />)}
            </View>
            <View style={{
                position: "absolute",
                top: positionOfTimeMarker.toString() + "%",
                backgroundColor: "red",
                padding: 8,
            }}>
                <Text style = {{
                    textAlign: 'center',
                    color: COLORS.FOREGROUND_COLOR
                }}>
                    {nowDate.getHours() % 12}:{nowDate.getMinutes()}
                </Text>
            </View>
            <Text>
                Server data last updated {formatDate(schedule.metadata.lastDataUpdateTime, false, true)}
            </Text>
        </SafeAreaView>
    )
}

const calculatePosition = (now, s) => {
    var now = 500;
    var startTime = parseInt(s[0].start.split(":")[0]) * 60;
    startTime += parseInt(s[0].start.split(":")[1]);

    var endTime = parseInt(s[s.length - 1].start.split(":")[0]) * 60 + (12 * 60);
    endTime += parseInt(s[s.length - 1].start.split(":")[1]);

    console.log("now: " + now);
    console.log("start: " + startTime);
    console.log("end: " + endTime);

    return ((now - startTime) / (endTime - startTime)) * 100;
}

export default Schedule