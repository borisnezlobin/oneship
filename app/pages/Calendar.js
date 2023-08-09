import { SafeAreaView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST } from "../util/config";
import { CalendarList } from 'react-native-calendars';
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import log from "../util/debug";

const CalendarPage = ({ calendar, navigation }) => {
    const insets = useSafeAreaInsets();

    if(calendar == null){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }

    var today = new Date();
    var key = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var markedDates = {};
    console.log(key);
    markedDates[key] = {
        customStyles: {
            container: {
                backgroundColor: CONFIG.green,
            },
            text: {
                color: CONFIG.bg,
                fontWeight: 'bold'
            }
        },
        selected: true
    };

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <CalendarList
                theme={{
                    backgroundColor: CONFIG.bg,
                    calendarBackground: CONFIG.bg,
                    textSectionTitleColor: CONFIG.grey,
                    textSectionTitleDisabledColor: CONFIG.grey,
                    dayTextColor: CONFIG.text,
                    textDisabledColor: CONFIG.grey,
                    arrowColor: CONFIG.green,
                    disabledArrowColor: CONFIG.grey,
                    monthTextColor: CONFIG.green,
                    indicatorColor: CONFIG.green,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 16,
                    textMonthFontSize: 24,
                    textDayHeaderFontSize: 16,
                    todayBackgroundColor: CONFIG.green,
                    todayTextColor: CONFIG.bg,
                }}
                onDayPress={day => {
                    log('selected day ' + JSON.stringify(day));
                    var events = getEventsOnDay(day.timestamp, calendar);
                    if(events.length == 0){
                        Toast.show("No events on " + day.day + "/" + day.month + "/" + day.year, {
                            ...ERROR_TOAST,
                            containerStyle: {
                                top: insets.top
                            }
                        });
                        return;
                    }
                    var body = "";
                    for(var i = 0; i < events.length; i++){
                        var event = events[i];
                        var isAllDay = event.start.getHours() == 0 && event.start.getMinutes() == 0 && event.start.getMilliseconds() == 0;
                        body += "##" + event.event.summary + "\n" +
                            (isAllDay ? "All day" : event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") + event.start.getMinutes() + " - " + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end.getMinutes())
                            + "\n" + event.event.description + "\n|\n";
                    }
                    navigation.navigate(
                        "Modal", {
                            title: "Events on " + day.day + "/" + day.month + "/" + day.year,
                            isMarkdown: true,
                            body: body,
                            image: "event"
                        }
                    );
                }}
                pastScrollRange={4}
                futureScrollRange={4}
                markingType="multi-dot"
                markedDates={markedDates}
                showScrollIndicator={true}
                key={key}
            />
        </SafeAreaView>
    );
}

const getEventsOnDay = (timestamp, calendar) => {
    timestamp = new Date(timestamp);
    timestamp.setDate(timestamp.getDate() + 1);
    var events = [];
    for(var i = 0; i < calendar.length; i++){
        var event = calendar[i];
        if(event.start.getFullYear() <= timestamp.getFullYear() && event.start.getMonth() <= timestamp.getMonth() && event.start.getDate() <= timestamp.getDate() && event.end.getFullYear() >= timestamp.getFullYear() && event.end.getMonth() >= timestamp.getMonth() && event.end.getDate() >= timestamp.getDate()){
            events.push(event);
        }
    }
    return events;
}

export default CalendarPage;