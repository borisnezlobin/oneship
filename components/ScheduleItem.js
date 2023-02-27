import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { calculateMinutesFromTime } from '../pages/Schedule';
import COLORS from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'

var rerenders = 0;
const ScheduleItem = ({ scheduleItem, startTime, endTime, screenHeight }) => {
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    var now = currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
    var isCurrent = thisStart * 60 <= now && thisEnd * 60 >= now;

    const { userSettingsContext } = useContext(UserSettingsContext);
    if(scheduleItem.name == "0 Period" && !userSettingsContext.show0Period){
        return <></>
    }

    if(scheduleItem.name == "Period") scheduleItem.name = "7th Period"; // WTF

    var thisStart = calculateMinutesFromTime(scheduleItem.start);
    var thisEnd = calculateMinutesFromTime(scheduleItem.end);

    var heightOfElement = ((thisEnd - thisStart) / (endTime - startTime)) * screenHeight;
    console.log(heightOfElement);

    useEffect(() => {
        if(isCurrent){
            setTimeout(() => { setCurrentTime(new Date(Date.now())) }, 1000); // update every second
        }
    }, [currentTime]);

    return (
        <View style={{
            height: heightOfElement,
            position: "absolute",
            top: ((thisStart - startTime) / (endTime - startTime)) * screenHeight,
            backgroundColor: isCurrent ? COLORS.FOREGROUND_COLOR : "rgb(245, 245, 245)",
            borderColor: COLORS.BACKGROUND_COLOR,
            borderWidth: 1,
            borderStyle: "solid",
            width: Dimensions.get("window").width - 64 - 2,
            borderRadius: 8,
            marginLeft: 64,
        }}>
            <Text style={{
                fontWeight: "bold",
                fontSize: "large"
            }}>{scheduleItem.name}</Text>
            <Text>{scheduleItem.start} - {scheduleItem.end}</Text>
            {isCurrent ?
            <Text>Ending in {thisEnd * 60 * 60 - now} seconds</Text>
            : <Text>This class is not currently in session.{"\n" + now}, {thisStart}, {thisEnd}</Text>
            }
        </View>
    )
}

export default ScheduleItem