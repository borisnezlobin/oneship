import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions, Modal } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import getColors from '../util/COLORS';
import Loading from '../util/Loading';
import isWeb, { formatDate } from '../util/util';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { UserSettingsContext } from '../util/contexts';
import { Confetti } from 'phosphor-react-native';
import Bar from '../components/Bar';
import ScheduleBottomSheet from '../components/ScheduleBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

var lastUpdate = "";
const Schedule = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const COLORS = getColors();
    const [schedule, setSchedule] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const [modalStatus, setModalStatus] = useState({shown: false, data: null});
    const { userSettingsContext } = useContext(UserSettingsContext);
    const bottomSheetRef = useRef();
    console.log("rerendered");

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
            lastUpdate = await AsyncStorage.getItem("lastScheduleUpdateTime");
            var rn = formatDate(Date.now(), true, false);
            console.log("last update: " + lastUpdate + ", current: " + rn);
            if(lastUpdate == rn && schedule == null){
                var prevData = await AsyncStorage.getItem("schedule");
                if(prevData != null && prevData){
                    setSchedule(JSON.parse(prevData));
                    return;
                }
            }else if(lastUpdate == rn && schedule !== null) return;
            lastUpdate = rn
            AsyncStorage.setItem("lastScheduleUpdateTime", lastUpdate);
            fetch("https://paly-vikings.onrender.com/schedule/" + lastUpdate)
            .then(res => res.json())
            .then(j => {
                setSchedule(j);
                AsyncStorage.setItem("schedule", JSON.stringify(j));
            }).catch((e) => console.log("error: " + e))
        }

        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000 * 10); // every 10 seconds is good enough imo
    }, [schedule, currentTime, modalStatus])

    if(schedule == null){
        return (<Loading />);
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
                    <Confetti size={72} color={COLORS.GREEN} />
                    <Text style={{textAlign: "center", color: COLORS.GREEN, fontWeight: "bold"}}>
                        No school today!
                    </Text>
                </SafeAreaView>
                <Bar navigation={navigation} routeName="Schedule" />
            </>
        )
    }

    if(lastUpdate !== formatDate(Date.now(), true, false)){
        setSchedule(null);
        return <Loading />
    }

    var screenHeight = (Dimensions.get("window").height - insets.top - insets.bottom);

    var nowDate = currentTime;
    var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    // var now = 14 * 60 + 40;

    var start = calculateMinutesFromTime(s[0].start);
    var end = calculateMinutesFromTime(s[s.length - 1].end);

    var positionOfTimeMarker = ((now - start) / (end - start));
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 1) positionOfTimeMarker = -100
    // ^ hehe

    const scheduleItemCallback = (data) => {
        setModalStatus({shown: true, data: data});
        bottomSheetRef.current?.snapToIndex(0);
    }

    return (
        <>
            <View style={{overflowX: "hidden", paddingTop: insets.top, height: Dimensions.get("window").height, backgroundColor: COLORS.BACKGROUND_COLOR}}>
                <View>
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