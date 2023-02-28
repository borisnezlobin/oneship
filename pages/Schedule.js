import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, View, Text, Dimensions, Modal } from 'react-native'
import ScheduleItem from '../components/ScheduleItem';
import COLORS from '../util/COLORS';
import Loading from '../util/Loading';
import isWeb, { formatDate } from '../util/util';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { UserSettingsContext } from '../util/contexts';
import { Confetti } from 'phosphor-react-native';
import Bar from '../components/Bar';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

var lastUpdate = "";
const Schedule = ({ navigation }) => {
    var storedValue;
    try {
        storedValue = JSON.parse(sessionStorage.getItem("schedule-today"))
    } catch (e) {
        storedValue = null;
    }
    const insets = useSafeAreaInsets()
    const [schedule, setSchedule] = useState(storedValue);
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const [modalStatus, setModalStatus] = useState({shown: false, data: null});
    const { userSettingsContext } = useContext(UserSettingsContext);
    const bottomSheetRef = useRef();
    const snapPoints = useMemo(() => ['25%', '75%'], []);

    var s;
    try{
        s = schedule.data;
        if(!userSettingsContext.show0Period && schedule.data[0].name == "0 Period"){
            s = schedule.data.slice(1)
        }
    }catch(e){} // haha

    useEffect(() => {
        if(schedule == null){
            getData();
        }

        async function getData(){
            lastUpdate = formatDate(Date.now(), true, false);
            fetch("https://paly-vikings.onrender.com/schedule/" + lastUpdate)
            .then(res => res.json())
            .then(json => {
                setSchedule(json);
                sessionStorage.setItem("schedule-today", JSON.stringify(json));
            })
        }

        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000 * 60);

    }, [schedule, currentTime])

    if(schedule == null){
        return (<Loading />);
    }

    if(schedule.data[0].name == "No school"){
        return (
            <>
                <Bar navigation={navigation} routeName="Schedule" />
                <SafeAreaView style={{
                    width: "100%",
                    backgroundColor: COLORS.FOREGROUND_COLOR,
                    height: Dimensions.get("window").height - insets.top - (isWeb() ? 0 : 50),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Confetti size={72} color={COLORS.GREEN} />
                    <Text style={{textAlign: "center", color: COLORS.GREEN, fontWeight: "bold"}}>
                        No school today!
                    </Text>
                </SafeAreaView>
            </>
        )
    }

    if(lastUpdate !== formatDate(Date.now(), true, false)){
        setSchedule(null);
        return <Loading />
    }
    var scheduleLength = userSettingsContext.show0Period ? schedule.data.length : schedule.data.length - 1;
    var screenHeight = (Dimensions.get("screen").height - 24 - insets.bottom - insets.top);

    var nowDate = currentTime;
    var now = nowDate.getHours() * 60 + nowDate.getMinutes();
    // var now = 13 * 60;

    var start = calculateMinutesFromTime(s[0].start);
    var end = calculateMinutesFromTime(s[s.length - 1].end);

    console.log("start: " + start);
    console.log("end: " + end);
    console.log("height: " + screenHeight)

    var positionOfTimeMarker = ((now - start) / (end - start)) * 100;
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 100) positionOfTimeMarker = -100
    // ^ hehe

    const scheduleItemCallback = (data) => {
        setModalStatus({shown: true, data: data});
        bottomSheetRef.current.snapToIndex(1);
    }

    return (
        <>
            <SafeAreaView style={{overflowX: "hidden", height: Dimensions.get("window").height}}>
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
                <View style={{
                    position: "absolute",
                    top: positionOfTimeMarker.toString() + "%",
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
            </SafeAreaView>
            <Bar navigation={navigation} />
            {isWeb() ?
                <Modal
                    animationType="none"
                    visible={modalVisible.shown}
                    transparent={true}
                >
                    <Text>{JSON.stringify(modalStatus)}</Text>
                </Modal>
            :
                <BottomSheet
                    style={{
                        shadowRadius: "2",
                        shadowColor: COLORS.BACKGROUND_COLOR,
                        shadowOpacity: 0.5
                    }}
                    enablePanDownToClose={true}
                    index={-1}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                >
                    <BottomSheetView>
                        <Text>{JSON.stringify(modalStatus)}</Text>
                    </BottomSheetView>
                </BottomSheet>
            }
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