import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import COLORS from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'

const ScheduleItem = ({ scheduleItem, height }) => {
    const { userSettingsContext } = useContext(UserSettingsContext);
    if(scheduleItem.name == "0 Period" && !userSettingsContext.show0Period){
        return <></>
    }

    return (
        <View style={{
            height: height,
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