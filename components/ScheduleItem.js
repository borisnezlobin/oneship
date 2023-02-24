import React, { useContext } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { calculateMinutesFromTime } from '../pages/Schedule';
import COLORS from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'

const ScheduleItem = ({ scheduleItem, startTime, endTime, screenHeight }) => {
    const { userSettingsContext } = useContext(UserSettingsContext);
    if(scheduleItem.name == "0 Period" && !userSettingsContext.show0Period){
        return <></>
    }

    var thisStart = calculateMinutesFromTime(scheduleItem.start);
    var thisEnd = calculateMinutesFromTime(scheduleItem.end);

    var heightOfElement = ((thisEnd - thisStart) / (endTime - startTime)) * screenHeight;
    console.log(heightOfElement);

    return (
        <View style={{
            height: heightOfElement,
            backgroundColor: COLORS.FOREGROUND_COLOR,
            borderColor: COLORS.BACKGROUND_COLOR,
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 8,
            marginLeft: 64,
        }}>
            <Text style={{
                fontWeight: "bold",
                fontSize: "large"
            }}>{scheduleItem.name}</Text>
            <Text>{scheduleItem.start} - {scheduleItem.end}</Text>
        </View>
    )
}

export default ScheduleItem