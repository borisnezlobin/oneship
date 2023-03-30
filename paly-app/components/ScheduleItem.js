import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View, TouchableOpacity } from 'react-native'
import { calculateMinutesFromTime } from '../pages/Schedule';
import getColors from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'
import { CogIcon } from "react-native-heroicons/outline";

const CLASS_STATUS = {
    PASSED: "passed",
    CURRENT: "current",
    FUTURE: "future",
}

const ScheduleItem = ({ scheduleItem, startTime, endTime, screenHeight, openModalCB }) => {
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    var now = currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
    // const now = 14 * 60 * 60 + 40 * 60 + 3;
    const COLORS = getColors();
    var classStatus;
    if(scheduleItem.start * 60 > now){
        classStatus = CLASS_STATUS.FUTURE;
    }else if(scheduleItem.end * 60 < now){
        classStatus = CLASS_STATUS.PASSED
    }else{
        classStatus = CLASS_STATUS.CURRENT;
    }

    // var isCurrent = thisStart * 60 <= now && thisEnd * 60 >= now;

    const { userSettingsContext } = useContext(UserSettingsContext);
    if(scheduleItem.name == "0 Period" && !userSettingsContext.show0Period){
        return <></>
    }

    var thisItem = userSettingsContext.schedule[scheduleItem.name.split("/")[0]]; // because cope (CAASP testing lol)

    var heightOfElement = ((scheduleItem.end - scheduleItem.start) / (endTime - startTime)) * screenHeight;

    useEffect(() => {
        if(classStatus == CLASS_STATUS.CURRENT){
            setTimeout(() => { setCurrentTime(new Date(Date.now())) }, 1000); // update every second
        }else{
            setTimeout(() => setCurrentTime(new Date(Date.now())), 20000); // cope moar
        }
    }, [currentTime]);

    var showThis = thisItem && (!thisItem.realName.includes("Lunch") && !thisItem.realName.includes("PRIME"))

    // don't even try to worry about this
    const wtf = () => {
        if(!showThis) return;
        openModalCB({
            ...thisItem,
            start: scheduleItem.startString,
            end: scheduleItem.endString
        });

        setTimeout(() => openModalCB({
            ...thisItem,
            start: scheduleItem.startString,
            end: scheduleItem.endString
        }), 100);
    }

    var isSchoolInSession = now <= endTime * 60 && now >= startTime * 60;

    return (
        <View style={{
            height: heightOfElement,
            position: "absolute",
            top: ((scheduleItem.start - startTime) / (endTime - startTime)) * screenHeight,
            backgroundColor: classStatus == CLASS_STATUS.PASSED ? COLORS.LIGHT : COLORS.LIGHT,
            borderRadius: 8,
            width: Dimensions.get("window").width - (isSchoolInSession ? 66 : 0),
            marginLeft: isSchoolInSession ? 64 : 0,
            padding: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "flex-start",
        }}>
            <View>
                <Text style={{
                    fontWeight: "bold",
                    color: COLORS.GREEN,
                }}>
                    {thisItem ? thisItem.customName : scheduleItem.name}
                </Text>
                <Text style={{color: COLORS.TEXT}}>{scheduleItem.startString} - {scheduleItem.endString}</Text>
                {classStatus == CLASS_STATUS.CURRENT ?
                <Text style={{color: COLORS.TEXT}}>Ending in {scheduleItem.end * 60 - now} seconds</Text>
                : <></>
                }
            </View>
            {showThis ? <TouchableOpacity
                onPress={wtf}
            >
                <CogIcon
                    size={36}
                    color={COLORS.GREEN}
                    style={{
                        bottom: 0,
                        right: 0,
                        height: 32,
                        width: 32,
                    }}
                />
            </TouchableOpacity>
            : <></>}
        </View>
    )
}

export default ScheduleItem