import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { calculateMinutesFromTime } from '../pages/Schedule';
import COLORS from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'
import BottomSheet, { BottomSheetScrollView, BottomSheetView, useBottomSheet, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import isWeb from '../util/util';


const CLASS_STATUS = {
    PASSED: "passed",
    CURRENT: "current",
    FUTURE: "future",
}

const ScheduleItem = ({ scheduleItem, startTime, endTime, screenHeight, openModalCB }) => {
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    var now = currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

    var thisStart = calculateMinutesFromTime(scheduleItem.start);
    var thisEnd = calculateMinutesFromTime(scheduleItem.end);
    var classStatus;
    if(thisStart * 60 > now){
        classStatus = CLASS_STATUS.FUTURE;
    }else if(thisEnd * 60 < now){
        classStatus = CLASS_STATUS.PASSED
    }else{
        classStatus = CLASS_STATUS.CURRENT;
    }

    // var isCurrent = thisStart * 60 <= now && thisEnd * 60 >= now;

    const { userSettingsContext } = useContext(UserSettingsContext);
    if(scheduleItem.name == "0 Period" && !userSettingsContext.show0Period){
        return <></>
    }

    var thisItem = userSettingsContext.schedule[scheduleItem.name];

    var heightOfElement = ((thisEnd - thisStart) / (endTime - startTime)) * screenHeight;

    useEffect(() => {
        if(classStatus == CLASS_STATUS.CURRENT){
            setTimeout(() => { setCurrentTime(new Date(Date.now())) }, 1000); // update every second
        }
    }, [currentTime]);

    return (
        <>
            <View style={{
                height: heightOfElement,
                position: "absolute",
                top: ((thisStart - startTime) / (endTime - startTime)) * screenHeight,
                backgroundColor: classStatus == CLASS_STATUS.PASSED ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR,
                width: Dimensions.get("window").width - 64 - 2,
                marginLeft: 64,
                padding: 8
            }}>
                <TouchableOpacity onPress={() => {
                    if(thisItem.realName == "Lunch" || thisItem.realName == "PRIME") return;
                    openModalCB({
                        ...thisItem,
                        start: scheduleItem.start,
                        end: scheduleItem.end
                    })
                }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: "large",
                        color: COLORS.GREEN,
                    }}>{thisItem.customName}</Text>
                    <Text>{scheduleItem.start} - {scheduleItem.end}</Text>
                    {classStatus == CLASS_STATUS.CURRENT ?
                    <Text>Ending in {thisEnd * 60 - now} seconds</Text>
                    : <></>
                    }
                </TouchableOpacity>
            </View>
            
        </>
    )
}

export default ScheduleItem