import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native'
import Bar from '../components/Bar'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../util/Loading'
import CONFIG from '../util/config'
import { dateToSportsEventDay } from '../util/util'
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { openBrowserAsync } from "expo-web-browser"
import { Transition, Transitioning } from 'react-native-reanimated'
import SportsDay from '../components/SportsDay'
import { createMapLink, createOpenLink } from "react-native-open-maps"

const Sports = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // cope moar
    const transitionRef = useRef();
    const transition = <Transition.Change interpolation='easeInOut' />
    const [events, setEvents] = useState(null);
    const [bottomSheetOpen, setBottomSheetOpen] = useState({shown: false, data: null});
    const bottomSheetRef = useRef();
    const snapPoints = useMemo(() => ["35%"], []);


    useEffect(() => {
        if(events !== null) return;

        const getSportsFromStorage = async () => {
            const data = JSON.parse(await AsyncStorage.getItem("sports"));
            if(data !== null){
                setEvents(data);
                return;
            }else{
                getSportsFromServer();
            }
        }

        const getSportsFromServer = async () => {
            const response = await fetch(CONFIG.SERVER_URL + "/sports/all");
            const data = await response.json();
            AsyncStorage.setItem("sports", JSON.stringify(data));
            setEvents(data);
        }

        getSportsFromStorage();
    }, [events])

    if(events == null){
        return (
        <>
            <Loading />
            <Bar navigation={navigation} />
        </>
        )
    }
    
    const COLORS = getColors();
    const today = dateToSportsEventDay(new Date());
    var hasGottenToToday = false;

    const openModal = (sportEvent) => {
        setBottomSheetOpen({shown: true, data: sportEvent});
        bottomSheetRef.current?.snapToIndex(0)
        setTimeout(() => bottomSheetRef.current?.snapToIndex(0), 100);
    }

    const onDayPress = () => {
        transitionRef.current?.animateNextTransition();
    }

    const canOpenMaps = (
        bottomSheetOpen.data !== null &&
        !bottomSheetOpen.data.location.includes("Palo Alto High School") &&
        !bottomSheetOpen.data.location.includes("TBA")
    );
    
    
    const link = canOpenMaps ? createOpenLink({
        query: bottomSheetOpen.data.location,
        travelType: "drive",
        end: bottomSheetOpen.data.location
    }) : null;

    return (
        <Transitioning.View ref={transitionRef} transition={transition}>
            <SafeAreaView style={{height: "100%", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <ScrollView bounces={false} style={{ backgroundColor: COLORS.FOREGROUND_COLOR}}>
                    {events.map((e, i) => {
                        if(!hasGottenToToday && e.date !== today) return;
                        hasGottenToToday = true;
                        return <SportsDay e={e} key={i} dayCb={onDayPress} eventCb={openModal} today={today} />
                    })}
                </ScrollView>
            </SafeAreaView>
            <Bar navigation={navigation} />
            {bottomSheetOpen.shown && bottomSheetOpen.data !== null ?
            <BottomSheet
                snapPoints={snapPoints}
                ref={bottomSheetRef}
                index={-1}
                enablePanDownToClose={true}
                style={{
                    shadowColor: COLORS.BACKGROUND_COLOR,
                    shadowRadius: 8,
                    shadowOpacity: 1,
                    elevation: 5000,
                    backgroundColor: COLORS.FOREGROUND_COLOR,
                    borderWidth: Platform.OS == "android" ? 1 : 0,
                    borderRadius: 8,
                    borderColor: COLORS.BACKGROUND_COLOR
                }}
                backgroundStyle={{backgroundColor: COLORS.FOREGROUND_COLOR}}
                handleIndicatorStyle={{backgroundColor: COLORS.GREY}}
            >
                <BottomSheetView style={{width: "100%"}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{
                        width: "100%",
                        fontWeight: "bold",
                        color: COLORS.GREEN,
                        fontSize: 36,
                        padding: 8,
                        textAlign: "center"
                    }}>
                        {bottomSheetOpen.data.eventName}
                    </Text>
                    <Text style={{
                        color: COLORS.TEXT,
                        textAlign: "center",
                        fontSize: 20,
                    }}>
                        <Text style={{color: COLORS.GREEN, fontWeight: "bold"}}>
                            {bottomSheetOpen.data.date + " "}
                        </Text>
                        at
                        <Text style={{color: COLORS.GREEN, fontWeight: "bold"}}>
                            {" " + bottomSheetOpen.data.time}
                        </Text>
                    </Text>
                    <Text style={{
                        textAlign: "center",
                        color: COLORS.TEXT,
                        marginTop: 12,
                        fontSize: 20,
                    }}>
                        <Text style={{color: COLORS.GREEN, fontWeight: "bold"}}>
                            {bottomSheetOpen.data.isHomeGame ? "HOME " : "AWAY "}
                        </Text>
                        game at{" "}
                        <Text onPress={() => {
                            if(!canOpenMaps) return;
                            link()
                        }} style={{
                            color: COLORS.GREEN,
                            fontWeight: "bold",
                            textDecorationStyle: "solid",
                            textDecorationColor: COLORS.GREEN,
                            textDecorationLine: canOpenMaps ? "underline" : "none",
                        }}>
                            {bottomSheetOpen.data.location.replace("Palo Alto High School  ", "")}
                        </Text>
                    </Text>
                </BottomSheetView>
            </BottomSheet>
            : <></> }
            <Loading loading={false} />
        </Transitioning.View>
    )
}

export default Sports