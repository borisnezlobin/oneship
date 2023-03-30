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
import { TouchableOpacity } from 'react-native-gesture-handler'

const SportsDay = ({ e, today, eventCb, dayCb }) => {
    const COLORS = getColors();
    const [expanded, setExpanded] = useState(today == e.date);

    return (
        <View style={{}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                dayCb();
                setExpanded(!expanded);
            }} style={{
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
            </TouchableOpacity>
            <View>
                {expanded ? 
                e.events.map((event, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => eventCb(event)}
                            style={{
                                backgroundColor: COLORS.FOREGROUND_COLOR,
                            }}
                        >
                            <View style={{
                                left: 56,
                                paddingVertical: 16,
                            }}>
                                <Text key={i} style={{
                                    color: COLORS.GREEN,
                                    fontWeight: "bold",
                                }}>
                                    {event.eventName}
                                </Text>
                                <Text style={{color: COLORS.TEXT}}>
                                    against {event.against}
                                </Text>
                            </View>
                            <View style={{
                                position: "absolute",
                                top: 16,
                            }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: COLORS.GREEN,
                                    fontSize: 12,
                                    width: 56,
                                    textAlign: "center"
                                }}>
                                    {event.time}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
                : <></> }
                {expanded ? <View style={{height: 8}} /> : <></> }
            </View>
        </View>
    )
}

export default SportsDay