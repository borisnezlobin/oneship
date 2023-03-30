import * as React from 'react';
import { Text, View, SafeAreaView, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import getColors from '../util/COLORS';
import Loading from '../util/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isWeb, { formatDate, serverDateToCalendarDate } from '../util/util';
import BottomSheet, { BottomSheetScrollView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Bar from '../components/Bar';
import { UserSettingsContext } from '../util/contexts';
import CalendarScheduleDisplay from '../components/CalendarScheduleDisplay';
import { getCalendarDateString } from 'react-native-calendars/src/services';

var r = 0; // r for "real good naming"
var wasLoadingLastUpdate = true;
function CalendarPage({ navigation }) {
  const [calendar, setCalendar] = React.useState(null);
  const [showingSchedule, setShowingSchedule] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState({shown: false, day: null});
  const { userSettingsContext } = React.useContext(UserSettingsContext);
  const COLORS = getColors();
  const bottomSheetRef = React.useRef();
  const snapPoints = React.useMemo(() => ["25%", "CONTENT_HEIGHT"], []);
  r++;
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);
  const insets = useSafeAreaInsets();

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
        wasLoadingLastUpdate = true;
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
  }, [calendar, modalVisible, userSettingsContext]);

  if(calendar == null){
    wasLoadingLastUpdate = true;
    return <Loading />
  }

  var calObjects = {};
  var selected = modalVisible.shown ?
    getCalendarDateString(formatDate(modalVisible.day.timestamp + 6000 * 60 * 60 * 4, true, false))
  :
    getCalendarDateString(formatDate(Date.now(), true, false))
  for(var i = 0; i < calendar.data.length; i++){
    var date = calendar.data[i].hasOwnProperty("date")
      ? serverDateToCalendarDate(calendar.data[i].date)
      : "";
    var hasEvents = calendar.data[i].hasOwnProperty("events") && calendar.data[i].events.length > 0;
    calObjects[date] = {
      marked: hasEvents,
      selected: date == selected,
      disabled: !hasEvents,
    }
  }

  var eventsForDay = [];
  var selectedDay = modalVisible.shown ? formatDate(modalVisible.day.timestamp + 6000 * 60 * 60 * 4, true, false) : "";
  if(modalVisible.shown){
    for(var i = 0; i < calendar.data.length; i++){
      if(calendar.data[i].hasOwnProperty("date") && calendar.data[i].date == selectedDay){
        if(!calendar.data[i].hasOwnProperty("events")) break;
        eventsForDay = calendar.data[i].events;
        break;
      }
    }
  }

  var calendarElement = <CalendarList
    key={userSettingsContext.isLightMode}
    markingType='custom'
    markedDates={calObjects}
    onDayPress={(day) => {
      setModalVisible({shown: true, day: day});
      setShowingSchedule(false);
      setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 100);
    }}
    disableAllTouchEventsForDisabledDays={true}
    disabledByDefault={true}
    theme={{
      backgroundColor: COLORS.FOREGROUND_COLOR,
      calendarBackground: COLORS.FOREGROUND_COLOR,
      textSectionTitleColor: '#b6c1cd',
      textSectionTitleDisabledColor: '#d9e1e8',
      selectedDayBackgroundColor: COLORS.GREEN,
      selectedDayTextColor: COLORS.FOREGROUND_COLOR,
      todayTextColor: COLORS.TEXT,
      todayDotColor: COLORS.TEXT,
      dayTextColor: COLORS.GREEN,
      textDisabledColor: COLORS.GREY,
      dotColor: COLORS.GREEN,
      selectedDotColor: COLORS.FOREGROUND_COLOR,
      arrowColor: COLORS.GREEN,
      disabledArrowColor: '#d9e1e8',
      monthTextColor: COLORS.GREEN,
      indicatorColor: COLORS.GREEN,
      textDayFontWeight: 'bold',
      textMonthFontWeight: 'bold',
      textDayHeaderFontWeight: '300',
      textDayFontSize: 16,
      textMonthFontSize: 24,
      textDayHeaderFontSize: 16,
    }}
    calendarWidth={isWeb() ? Dimensions.get("window").width - 320 : Dimensions.get("window").width}
    current={serverDateToCalendarDate(formatDate(Date.now(), true, false))}
    pastScrollRange={0}
    futureScrollRange={4}
    scrollEnabled={true}
    showScrollIndicator={true}
  />;

  return (
    <>
      <SafeAreaView onLayout={() => wasLoadingLastUpdate = false} style={{backgroundColor: COLORS.FOREGROUND_COLOR}}>
        {calendarElement}
        <Bar navigation={navigation} />
        <BottomSheet
          handleIndicatorStyle={{
            backgroundColor: COLORS.GREY
          }}
          backgroundStyle={{
            backgroundColor: COLORS.FOREGROUND_COLOR
          }}
          style={{
            shadowRadius: "2",
            shadowColor: COLORS.BACKGROUND_COLOR,
            shadowOpacity: 0.5,
          }}
          handleStyle={{
            backgroundColor: COLORS.FOREGROUND_COLOR,
          }}
          ref={bottomSheetRef}
          snapPoints={animatedSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          enablePanDownToClose={true}
          index={-1}
          onClose={() => {
            setShowingSchedule(false);
          }}
        >
          <BottomSheetScrollView onLayout={handleContentLayout} style={{
              backgroundColor: COLORS.FOREGROUND_COLOR,
              padding: 4,
              paddingBottom: insets.bottom
          }}>
            <Text style={{
              color: COLORS.GREEN,
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
              textAlign: 'center'
            }}>
              {selectedDay}
            </Text>
            {eventsForDay.map((e, i) => {
              if(e.title.includes("Schedule") || e.title.includes("Minimum Day")){
                return (
                  <CalendarScheduleDisplay key={i} showingSchedule={showingSchedule} cb={(bool) => {
                    bottomSheetRef.current?.snapToIndex(0); // running out of bandaids I is
                    setShowingSchedule(bool);
                    setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 300);
                  }} />
                )
              }
              return;
            })}
            {eventsForDay.map((e, i) => {
              var description = (e.description == "No description") ? "" : e.description;
              if((e.title.includes("Schedule") || e.title.includes("Minimum Day")) && showingSchedule){
                return (
                  <View key={i}>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: COLORS.GREEN,
                      textAlign: 'center'
                    }}>
                      {e.title + " "}
                    </Text>
                    <Text style={{
                        fontWeight: "normal",
                        color: COLORS.TEXT,
                        textAlign: 'center'
                      }}>
                        {formatSchedule(e.description, userSettingsContext.schedule)}
                      </Text>
                  </View>
                );
              }
              if((!e.title.includes("Schedule") || !e.title.includes("Minimum Day")) && showingSchedule) return;
              if((e.title.includes("Schedule") || e.title.includes("Minimum Day")) && !showingSchedule) return;
              return (
                <View key={i} style={{margin: 2}}>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: COLORS.GREEN,
                      textAlign: 'center'
                    }}>
                      {e.title + " "}
                    </Text>
                    <Text style={{
                        fontWeight: "normal",
                        color: COLORS.TEXT,
                      }}>
                        {description}
                      </Text>
                </View>
              )
            })}
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
      <Loading loading={false} animate={wasLoadingLastUpdate} insets={insets} />
    </>
  );
}

const formatSchedule = (s, settings) => {
  var copeSchedule = s;
  const keys = Object.keys(settings);
  for(var i = 0; i < keys.length; i++){
    copeSchedule = copeSchedule.split(settings[keys[i]].realName).join(settings[keys[i]].customName);
  }
  return copeSchedule;
}

export default CalendarPage