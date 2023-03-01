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
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    const snapPoints = useMemo(() => ['25%'], []);

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

    var positionOfTimeMarker = ((now - start) / (end - start));
    console.log("time marker: " + positionOfTimeMarker)
    if(positionOfTimeMarker < 0 || positionOfTimeMarker > 1) positionOfTimeMarker = -100
    // ^ hehe

    const scheduleItemCallback = (data) => {
        setModalStatus({shown: true, data: data});
        bottomSheetRef.current.snapToIndex(0);
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
                <View pointerEvents='none' style={{
                    position: "absolute",
                    top: Dimensions.get("window").height * positionOfTimeMarker,
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
            {modalStatus.shown ? (isWeb() ?
                <Modal
                    animationType="none"
                    visible={modalStatus.shown}
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
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 32,
                            color: COLORS.GREEN,
                            textAlign: 'center'
                        }}>
                            {modalStatus.data.customName}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: "grey",
                            textAlign: 'center'
                        }}>
                            {modalStatus.data.start} - {modalStatus.data.end}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            marginTop: 8,
                            color: "black",
                            textAlign: 'center'
                        }}>
                            Taught by {modalStatus.data.teacher} in {modalStatus.data.room}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {}}
                            style={{
                                backgroundColor: COLORS.GREEN,
                                marginTop: 24,
                                borderRadius: 2,
                                height: 36,
                                width: 100,
                                marginLeft: (Dimensions.get("window").width - 100) / 2,
                                shadowColor: COLORS.GREEN,
                                shadowOpacity: 1,
                                shadowOffset: 0.5,
                                shadowRadius: 5
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                marginTop: 8,
                                fontWeight: 'bold',
                                color: COLORS.FOREGROUND_COLOR,
                                textAlign: 'center',
                            }}>
                                EDIT
                            </Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheet>
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