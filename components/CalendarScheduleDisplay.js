import BottomSheet, { BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet'
import { Clock } from 'phosphor-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import COLORS from '../util/COLORS'

const CalendarScheduleDisplay = ({ schedule, day }) => {
    const [showSchedule, setShowSchedule] = useState(false)
    const bottomSheetRef = useRef()
    const snapPoints = useMemo(() => ['25%', 'CONTENT_HEIGHT'], []);
    const {
        animatedHandleHeight,
        animatedSnapPoints,
        animatedContentHeight,
        handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(snapPoints);

    useEffect(() => {
        if(showSchedule){
            bottomSheetRef.current?.snapToIndex(1)
        }
    }, [showSchedule])

    if(!showSchedule){
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                right: 4
            }}>
                <TouchableOpacity onPress={() => {
                    setShowSchedule(true);
                }}>
                    <Clock size={32} color={COLORS.GREEN} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <BottomSheet
            onClose={() => setShowSchedule(true)}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            ref={bottomSheetRef}
            enablePanDownToClose={true}
            index={-1}
        >
            <BottomSheetView
                style={{backgroundColor: COLORS.FOREGROUND_COLOR}}
                onLayout={handleContentLayout}
            >
                <Text style={{
                    color: COLORS.GREEN,
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 8,
                    textAlign: 'center'
                }}>
                    {day}
                </Text>
            </BottomSheetView>
        </BottomSheet>
    )
}

export default CalendarScheduleDisplay