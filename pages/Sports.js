import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import Bar from '../components/Bar'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../util/Loading'
import CONFIG from '../util/config'
import { dateToSportsEventDay } from '../util/util'
import { HomeIcon } from 'react-native-heroicons/solid'

const Sports = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // cope moar
    const [events, setEvents] = useState(null);

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

    console.log(events);

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
    return (
        <>
            <SafeAreaView style={{height: "100%", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <ScrollView bounces={false} style={{ backgroundColor: COLORS.FOREGROUND_COLOR}}>
                    {events.map((e, i) => {
                        if(!hasGottenToToday && e.date !== today) return;
                        hasGottenToToday = true;
                        return (
                            <View key={i} style={{marginVertical: 8,}}>
                                <View style={{
                                    backgroundColor: COLORS.GREEN,
                                    paddingVertical: 16,
                                    paddingHorizontal: 8
                                }}>
                                    <Text style={{
                                        fontWeight: "bold",
                                        color: COLORS.FOREGROUND_COLOR,
                                        fontSize: 20,
                                    }}>
                                        {e.date == today ? "TODAY" : e.date}
                                    </Text>
                                </View>
                                <View style={{padding: 8}}>
                                    {e.events.map((event, i) => {
                                        return (
                                            <View key={i}>
                                                <View style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                    margin: 4,
                                                }}>
                                                    <Text key={i} style={{
                                                        color: COLORS.TEXT,
                                                        left: 32
                                                    }}>
                                                        {event.eventName}
                                                    </Text>
                                                </View>
                                                {event.isHomeGame ? 
                                                <HomeIcon
                                                    style={{position: "absolute"}}
                                                    color={COLORS.GREEN}
                                                    size={24}
                                                /> : <></>}
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )
}

export default Sports