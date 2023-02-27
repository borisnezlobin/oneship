import * as React from 'react';
import { Text, View, SafeAreaView, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import COLORS from '../util/COLORS';
import Loading from '../util/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isWeb, { formatDate, serverDateToCalendarDate } from '../util/util';

function CalendarPage({ navigation }) {
  const [calendar, setCalendar] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState({shown: false, day: null});

  React.useEffect(() => {
    const doShit = async () => {
      const getDataFromStorage = async () => {
        const data = await AsyncStorage.getItem("calendar");
        return JSON.parse(data);
      }
      const getDataFromServer = async () => {
        const res = await fetch("https://paly-vikings.onrender.com/schedule");
        const data = await res.json();
        return data;
      }
      if(calendar == null){
        var maybeData = await getDataFromStorage();
        if(maybeData != null){
          setCalendar(maybeData);
          return;
        }
        const data = await getDataFromServer();
        AsyncStorage.setItem("calendar", JSON.stringify(data));
        setCalendar(data); // surely it won't be null
      }
    }

    doShit(); // swering bad
  }, [calendar]);

  if(calendar == null){
    return <Loading />
  }

  var calObjects = {};
  for(var i = 0; i < calendar.data.length; i++){
    var date = calendar.data[i].hasOwnProperty("date")
      ? serverDateToCalendarDate(calendar.data[i].date)
      : "";
    var hasEvents = calendar.data[i].hasOwnProperty("events") && calendar.data[i].events.length > 0;
    if(hasEvents) console.log(calendar.data[i].events)
    calObjects[date] = {
      disabled: !hasEvents,
    }
  }

  var eventsForDay = [];
  var selectedDay = modalVisible.shown ? formatDate(modalVisible.day.timestamp + 6000 * 60 * 60 * 4, true, false) : "";
  if(modalVisible.shown){
    for(var i = 0; i < calendar.data.length; i++){
      console.log(calendar.data[i]);
      if(calendar.data[i].hasOwnProperty("date") && calendar.data[i].date == selectedDay){
        if(!calendar.data[i].hasOwnProperty("events")) break;
        eventsForDay = calendar.data[i].events;
        break;
      }
    }
  }

  console.log(eventsForDay);

  var calendarElement = <CalendarList
    markingType='custom'
    markedDates={calObjects}
    onDayPress={(day) => {
      console.log("you pressed day " + JSON.stringify(day));
      setModalVisible({shown: true, day: day});
    }}
    disableAllTouchEventsForDisabledDays={true}
    disabledByDefault={true}
    theme={{
      backgroundColor: COLORS.FOREGROUND_COLOR,
      calendarBackground: '#ffffff',
      textSectionTitleColor: '#b6c1cd',
      textSectionTitleDisabledColor: '#d9e1e8',
      selectedDayBackgroundColor: '#00adf5',
      selectedDayTextColor: '#ffffff',
      todayTextColor: COLORS.GREEN,
      dayTextColor: COLORS.GREEN,
      textDisabledColor: '#999999',
      dotColor: COLORS.GREEN,
      selectedDotColor: '#ffffff',
      arrowColor: COLORS.GREEN,
      disabledArrowColor: '#d9e1e8',
      monthTextColor: COLORS.GREEN,
      indicatorColor: COLORS.GREEN,
      textDayFontWeight: 'bold',
      textMonthFontWeight: 'bold',
      textDayHeaderFontWeight: '300',
      textDayFontSize: 16,
      textMonthFontSize: 32,
      textDayHeaderFontSize: 16,
    }}
    calendarWidth={isWeb() ? Dimensions.get("window").width - 320 : Dimensions.get("window").width}
    current={serverDateToCalendarDate(formatDate(Date.now(), true, false))}
    pastScrollRange={0}
    futureScrollRange={4}
    scrollEnabled={true}
    showScrollIndicator={true}
  />;

  const modalContent = !modalVisible.shown ? <></> : (
    <TouchableWithoutFeedback onPress={() => setModalVisible({shown: false, day: null})}>
      <View style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
      }}>
        <View style={{
            width: Dimensions.get("window").width * 2 / 3,
            marginLeft: Dimensions.get("window").width / 6,
            height: Dimensions.get("window").height / 2,
            marginTop: Dimensions.get("window").height / 4,
            backgroundColor: COLORS.FOREGROUND_COLOR,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
          <Text style={{color: COLORS.GREEN, fontSize: 36}}>
            Events for {selectedDay}
          </Text>
          {eventsForDay.map((e, i) => <View key={i}>
              <Text>{e.title}</Text>
              <Text>{e.description}</Text>
          </View>)}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

  if(isWeb()){
    return (
      <>
        {calendarElement}
        <Modal
          animationType="none"
          visible={modalVisible.shown}
          transparent={true}
        >
          {modalContent}
        </Modal>
      </>
    )
  }

  return (
    <>
    {isWeb() ? calendarElement
    : <SafeAreaView style={{backgroundColor: COLORS.FOREGROUND_COLOR}}>
      {calendarElement}
      <Text>{modalVisible}</Text>
    </SafeAreaView>
    }
    </>
  );
}

export default CalendarPage