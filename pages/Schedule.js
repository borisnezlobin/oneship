import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions, Modal } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import getColors from '../util/COLORS';
import Loading from '../util/Loading';
import isWeb, { formatDate, sendLocalNotification } from '../util/util';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { UserSettingsContext } from '../util/contexts';
import Bar from '../components/Bar';
import ScheduleBottomSheet from '../components/ScheduleBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RocketLaunchIcon } from 'react-native-heroicons/outline';
import { getAllScheduledNotificationsAsync } from 'expo-notifications';

var lastUpdate = "";
var wasLoadingLastUpdate = true;
const Schedule = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const COLORS = getColors();
    const [schedule, setSchedule] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const [modalStatus, setModalStatus] = useState({shown: false, data: null});
    const { userSettingsContext } = useContext(UserSettingsContext);
    const bottomSheetRef = useRef();

    var s;
    try{
        s = schedule.data;
        if(!userSettingsContext.show0Period && schedule.data[0].name == "0 Period"){
            s = schedule.data.slice(1)
        }
    }catch(e){} // haha

    useEffect(() => {
        getData()
        async function getData(){
            wasLoadingLastUpdate = false; // 1984
            lastUpdate = await AsyncStorage.getItem("lastScheduleUpdateTime");
            var rn = formatDate(Date.now(), true, false);
            console.log("current: " + rn + ", last udpate:" + lastUpdate)
            if(lastUpdate == rn && schedule == null){
                var prevData = await AsyncStorage.getItem("schedule");
                if(prevData != null && prevData){
                    console.log("schedule: rerendered from local storage")
                    setSchedule({
                        data: JSON.parse(prevData).data,
                        hasSetNotifications: true, // because like uh
                        // it really seems about right
                    });
                    return;
                }
            }else if(lastUpdate == rn) return;
            wasLoadingLastUpdate = true;
            lastUpdate = rn
            fetch("https://paly-vikings.onrender.com/schedule/" + lastUpdate)
            .then(res => res.json())
            .then(j => {
                console.log("schedule: rerendered from server")
                setSchedule({
                    data: j.data,
                    hasSetNotifications: false
                });
                AsyncStorage.setItem("schedule", JSON.stringify(j));
                AsyncStorage.setItem("lastScheduleUpdateTime", lastUpdate);
            }).catch((e) => console.log("error: " + e))
        }

        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000 * 10); // every 10 seconds is good enough imo
    }, [schedule, currentTime, modalStatus])

    if(schedule == null){
        console.log("returned loading because schedule is null");
        return (
            <Loading />
        );
    }

    if(schedule.data[0].name == "No school"){
        return (
            <>
                <SafeAreaView style={{
                    width: "100%",
                    backgroundColor: COLORS.FOREGROUND_COLOR,
                    height: Dimensions.get("window").height,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <RocketLaunchIcon size={72} color={COLORS.GREEN} />
                    <Text style={{textAlign: "center", color: COLORS.GREEN, fontWeight: "bold"}}>
                        No school today!
                    </Text>
                </SafeAreaView>
                <Bar navigation={navigation} routeName="Schedule" />
                <Loading animate={wasLoadingLastUpdate} loading={false} />
            </>
        )
    }

    if(lastUpdate !== formatDate(Date.now(), true, false)){
        setSchedule(null);
        wasLoadingLastUpdate = true;
        return <Loading loading={true} />
    }

    var screenHeight = (Dimensions.get("window").height - insets.top - insets.bottom);

    var nowDate = currentTime;
    var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    // var now = 10 * 60;

    var start = s[0].start;
    var end = s[s.length - 1].end;

    var positionOfTimeMarker = ((now - start) / (end - start));
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 1) positionOfTimeMarker = -100
    // ^ hehe
    
    if(userSettingsContext.remind !== -1 && schedule.hasOwnProperty("hasSetNotifications") && !schedule.hasSetNotifications){
        for(var i = schedule.data.length - 1; i >= 0; i--){
            if(schedule.data[i].start - 5 >= now){
                sendLocalNotification(
                    schedule.data[i].name,
                    "Starting in " + userSettingsContext.remind.toString() + " minute" + (userSettingsContext.remind !== 1 ? "s" : ""),
                    {},
                    {
                        seconds: (schedule.data[i].start - 5 - now) * 60
                    }
                )
                console.log("set notification for " + schedule.data[i].name);
                console.log("it will trigger in " + ((schedule.data[i].start - 5 - now) * 60).toString() + " seconds");
            }else{ break; }
        }
        setSchedule({
            data: schedule.data,
            hasSetNotifications: true
        });
    }

    const scheduleItemCallback = (data) => {
        setModalStatus({shown: true, data: data});
        bottomSheetRef.current?.snapToIndex(0);
    }

    return (
        <>
            <View style={{overflowX: "hidden", paddingTop: insets.top, height: Dimensions.get("window").height, backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <View onLayout={() => wasLoadingLastUpdate = false}>
                    {s.map((e, i) => <ScheduleItem
                        startTime={start}
                        endTime={end}
                        key={i}
                        scheduleItem={e}
                        screenHeight = {screenHeight}
                        openModalCB={scheduleItemCallback}
                    />)}
                </View>
            </View>
            <View pointerEvents='none' style={{
                position: "absolute",
                top: (screenHeight * positionOfTimeMarker) + insets.top - 16,
                width: "100%",
                left: 2,
                height: 32,
                borderRadius: 8
            }}>
                <View style={{
                    width: "100%",
                    backgroundColor: "red",
                    height: 1,
                    position: "relative",
                    top: 16,
                }} />
                <Text style = {{
                    position: "relative",
                    right: 0,
                    textAlign: 'center',
                    color: COLORS.FOREGROUND_COLOR,
                    fontWeight: "bold",
                    backgroundColor: "#B80f0A",
                    padding: 8,
                    width: 58,
                    height: 32,
                    borderRadius: 8
                }}>
                    {nowDate.getHours() == 12 ? "12" : nowDate.getHours() % 12}:{nowDate.getMinutes() < 10 ? "0" : ""}{nowDate.getMinutes()}
                </Text>
            </View>
            <Bar navigation={navigation} />
            {modalStatus.shown ? (isWeb() ?
                <Modal
                    animationType="none"
                    visible={modalStatus.shown}
                    transparent={true}
                >
                    <Text>{JSON.stringify(modalStatus)}</Text>
                </Modal>
            : <ScheduleBottomSheet bottomSheetRef={bottomSheetRef} modalStatus={modalStatus} setModal={setModalStatus} />
            ) : <></>}
            <Loading animate={wasLoadingLastUpdate} loading={false} text="SCHEDULE" />
        </>
    )
}

const calculateMinutesFromTime = (timeString) => {
    var hour = parseInt(timeString.split(":")[0]);
    var time = (hour < 7 ? hour + 12 : hour) * 60
    time += parseInt(timeString.split(":")[1]);
    return time;
}

export default Schedule
export { calculateMinutesFromTime }; // used in schedule items