import BottomSheet, { BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet'
import { Calendar, Clock } from 'phosphor-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import COLORS from '../util/COLORS'

const CalendarScheduleDisplay = ({ cb, showingSchedule }) => {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            right: 4
        }}>
            <TouchableOpacity onPress={() => {
                cb(!showingSchedule);
            }}>
                {showingSchedule ?
                    <Calendar size={32} color={COLORS.GREEN} />
                    : <Clock size={32} color={COLORS.GREEN} />
                }
            </TouchableOpacity>
        </View>
    )
}

export default CalendarScheduleDisplay