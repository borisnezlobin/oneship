import { SafeAreaView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST } from "../util/config";
import { CalendarList } from 'react-native-calendars';
import { useState } from "react";
import Modal from "./Modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";


// just...
// don't worry about this
// you can't fight it
const one = {key: 'one', color: "#949394"};
const two = {key: 'two', color: '#464646'};
const three = {key: 'three', color: '#343334'};

const CalendarPage = ({ calendar }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);

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

    var markedDates = {};
    for(var i = 0; i < calendar.length; i++){
        var date = calendar[i].start;
        date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        if(markedDates[date] == null) markedDates[date] = { dots: [one], marked: true };
        else{
            if(markedDates[date].dots.length == 1){
                markedDates[date].dots.push(two);
            }else if(markedDates[date].dots.length == 2){
                markedDates[date].dots.push(three);
            }
        }
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <CalendarList
                theme={{
                    backgroundColor: CONFIG.bg,
                    calendarBackground: CONFIG.bg,
                    textSectionTitleColor: CONFIG.grey,
                    textSectionTitleDisabledColor: CONFIG.grey,
                    selectedDayBackgroundColor: CONFIG.green,
                    selectedDayTextColor: CONFIG.bg,
                    todayTextColor: CONFIG.green,
                    dayTextColor: CONFIG.text,
                    textDisabledColor: CONFIG.grey,
                    dotColor: CONFIG.green,
                    selectedDotColor: CONFIG.bg,
                    arrowColor: CONFIG.green,
                    disabledArrowColor: CONFIG.grey,
                    monthTextColor: CONFIG.green,
                    indicatorColor: CONFIG.green,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 16,
                    textMonthFontSize: 24,
                    textDayHeaderFontSize: 16
                }}
                onDayPress={day => {
                    console.log('selected day', day);
                    var events = getEventsOnDay(day.timestamp, calendar);
                    if(events.length == 0){
                        Toast.show("No events on " + day.day + "/" + day.month + "/" + day.year, {
                            ...ERROR_TOAST,
                            containerStyle: {
                                ...ERROR_TOAST.containerStyle,
                                top: insets.top
                            }
                        });
                        return;
                    }
                    setModalTitle("Events on " + day.day + "/" + day.month + "/" + day.year)
                    setModalContent(
                        <View style={[
                            tailwind("bg-white flex flex-col justify-start items-start h-full w-full rounded-lg p-4"),
                            { top: 36 + insets.top}
                        ]}>
                            {events.map(event => {
                                var isAllDay = event.start.getHours() == 0 && event.start.getMinutes() == 0 && event.start.getMilliseconds() == 0;
                                return (
                                    <View style={tailwind("w-full mt-2")} key={event.event.uid}>
                                        <Text style={tailwind("text-lg font-semibold")}>
                                            {event.event.summary}
                                        </Text>
                                        <Text style={tailwind("text-lg")}>
                                            {isAllDay ? "All day" : event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") + event.start.getMinutes() + " - " + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end.getMinutes()}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    );
                    setModalVisible(true);
                }}
                pastScrollRange={4}
                futureScrollRange={4}
                markingType="multi-dot"
                markedDates={markedDates}
                showScrollIndicator={true}
            />
            <Modal
                visible={modalVisible}
                setVisible={setModalVisible}
                title={modalTitle}
            >
                {modalContent}
            </Modal>
        </SafeAreaView>
    );
}

const getEventsOnDay = (timestamp, calendar) => {
    timestamp = timestamp + 1;
    console.log(new Date(timestamp));
    var events = [];
    for(var i = 0; i < calendar.length; i++){
        var event = calendar[i];
        if(event.start <= timestamp && event.end >= timestamp){
            events.push(event);
        }
    }
    return events;
}

export default CalendarPage;