import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { CalendarDaysIcon, ClockIcon } from 'react-native-heroicons/outline'
import getColors from '../util/COLORS'

const CalendarScheduleDisplay = ({ cb, showingSchedule }) => {
    return (
        <View style={{
            position: "absolute",
            top: 0,
            right: 4
        }}>
            <TouchableOpacity onPress={() => {
                cb(!showingSchedule);
            }}>
                {showingSchedule ?
                    <CalendarDaysIcon size={32} color={getColors().GREEN} />
                    : <ClockIcon size={32} color={getColors().GREEN} />
                }
            </TouchableOpacity>
        </View>
    )
}

export default CalendarScheduleDisplay