import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View, TouchableOpacity } from 'react-native'
import { calculateMinutesFromTime } from '../pages/Schedule';
import getColors from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts'
import { Gear } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


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
            // setTimeout(() => { setCurrentTime(new Date(Date.now())) }, 1000); // update every second
        }
    }, [currentTime]);

    var showThis = thisItem.realName != "Lunch" && thisItem.realName != "PRIME"

    // don't even try to worry about this
    const wtf = () => {
        if(!showThis) return;
        openModalCB({
            ...thisItem,
            start: scheduleItem.start,
            end: scheduleItem.end
        });

        setTimeout(() => openModalCB({
            ...thisItem,
            start: scheduleItem.start,
            end: scheduleItem.end
        }), 100);
    }

    var isSchoolInSession = now <= endTime * 60 && now >= startTime * 60;

    return (
        <>
            <View style={{
                height: heightOfElement,
                position: "absolute",
                top: ((thisStart - startTime) / (endTime - startTime)) * screenHeight,
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
                        fontSize: "large",
                        color: COLORS.GREEN,
                    }}>
                        {thisItem.customName}
                    </Text>
                    <Text style={{color: COLORS.TEXT}}>{scheduleItem.start} - {scheduleItem.end}</Text>
                    {classStatus == CLASS_STATUS.CURRENT ?
                    <Text>Ending in {thisEnd * 60 - now} seconds</Text>
                    : <></>
                    }
                </View>
                {showThis ? <TouchableOpacity
                    onPress={wtf}
                >
                    <Gear
                        size={24}
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
            
        </>
    )
}

export default ScheduleItem