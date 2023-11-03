import { AppState, StatusBar, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "./util/config";
import { CalendarContext, DebugContext, NewsContext, ScheduleContext, SportsContext, UserDataContext } from "./util/contexts";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./pages/Home";
import SchedulePage from "./pages/Schedule";
import NewsPage from "./pages/News";
import SettingsPage from "./pages/Settings";
import TabBar from "./util/TabBar";
import {
  ClockIcon,
  Cog6ToothIcon,
  HomeIcon,
  NewspaperIcon,
  TrophyIcon
} from "react-native-heroicons/solid";
import {
  TrophyIcon as TrophyOutline,
  ClockIcon as ClockOutline,
  Cog6ToothIcon as CogOutline,
  HomeIcon as HomeOutline,
  NewspaperIcon as NewspaperOuline
} from "react-native-heroicons/outline";
import { RootSiblingParent } from 'react-native-root-siblings';
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack";
import CustomModal from "./pages/CustomModal";
import { setNotificationForClasses } from "./util/functions";
import SportsPage from "./pages/Sports";
import ErrorModal from "./pages/ErrorModal";
import log, { logError } from "./util/debug";


const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

function App() {
  const [schedule, setSchedule] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [news, setNews] = useState(null);
  const [sports, setSports] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStartupData = async () => {
      log(CONFIG.serverURL + "api/startup");
      var response;
      try{
        response = await fetch(CONFIG.serverURL + "api/startup")
        .catch(e => {
          logError("Error fetching startup data: " + e);
          if(!error) setError({
            error: "Startup data fetch failed.",
            status: 500,
            closeable: true
          });
        });
        if(error) return;
        var data = await response.text();
        try{
          data = JSON.parse(data);
          if(data.error){
            logError("data.error: " + JSON.stringify(data.error));
            if(!error) setError({
              error: "Startup data dump failed.",
              status: response.status,
            });
            return;
          }

          setCalendar(data.calendar);

          var today = new Date();
          today = today.getFullYear() + (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1) + (today.getDate() < 9 ? "0" : "") + today.getDate();
          if(schedule == null || schedule.date != today){
            if(data.schedule != null){
              setSchedule(data.schedule);
              console.log(userData);
              setNotificationForClasses(data.schedule, (userData && userData.data) ? userData.data.classNotification : 5);
              await AsyncStorage.setItem("schedule", JSON.stringify(data.schedule));
            }
          }

          if(data.calendar != null && calendar == null){
            setCalendar(data.calendar);
          }
          
          setSports(data.sports);
          setNews(data.news);
        }catch(e){
          logError("error: " + e);
          logError("couldn't parse startup data json from ");
          log(data);
          if(!error) setError({
            error: "JSON parsing of startup data dump failed.",
            status: 500
          });
        }
      }catch(e){
        logError("error sending startup request to server: " + e);
        logError("couldn't fetch startup data from " + CONFIG.serverURL + "api/startup");
      }
    }
    const getScheduleFromStorage = async () => {
      const storage = await AsyncStorage.getItem("schedule");
      if(storage != null && !schedule) setSchedule(JSON.parse(storage));
    }

    const getUserData = async () => {
      // last saved user data
      const user_data = await AsyncStorage.getItem("user_data");
      if(user_data != null && userData == null) try{
        setUserData(JSON.parse(user_data));
      }catch(e){
        logError("error: " + e);
        logError("couldn't parse user_data json from " + user_data);
        if(!error) setError({
          error: "JSON parsing of user data failed.",
          status: 500
        });
      }

      // get most up-to-date user data
      var not_sketchy = await AsyncStorage.getItem("not_sketchy");
      log("not_sketchy: " + not_sketchy);
      if(not_sketchy == null) return;
      try{
        not_sketchy = JSON.parse(not_sketchy);
      }catch(e){
        logError("error: " + e);
        logError("couldn't parse not_sketchy json from " + not_sketchy);
        if(!error) setError({
          error: "JSON parsing of user credentials failed.",
          status: 500
        });
        return;
      }
      
      var text;
      try{
        const response = await fetch(CONFIG.serverURL + "api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: not_sketchy.email,
            password: not_sketchy.password
          })
        });
        text = await response.text();
        log("got newest user data");
        AsyncStorage.setItem("user_data", text);
        const data = JSON.parse(text);
        if(JSON.stringify(data) != JSON.stringify(userData)) setUserData(data);
      }catch(e){
        logError("error logging in: " + e);
        logError("couldn't parse server response json from " + text);
        if(!error) setError({
          error: "Error logging in user.",
          status: 500
        });
      }
    }

    if(error) return;

    const start = async () => {
      await getUserData();
      getScheduleFromStorage();
      getStartupData();
    }

    const sub = AppState.addEventListener("change", (state) => {
      if(state == "active"){
        start();
      }
    });

    start();

    if(userData && userData.data && schedule && schedule.value != null){
      setNotificationForClasses(schedule, userData.data.classNotification);
    }

    return () => {
      sub.remove()
    }
  }, [userData, error]);

  const setUserDataAndNotify = async (data) => {
    setUserData(data);
    setNotificationForClasses(schedule, data.data.classNotification);
  }

  const reloadApp = () => {
    log("RELOADING APP");
    setSchedule(null);
    setCalendar(null);
    setNews(null);
    setSports(null);
    setUserData(null);
    setError(null);

    AsyncStorage.clear();
  }

  return (
    <RootSiblingParent>
      <DebugContext.Provider value={{ setError, reloadApp }}>
        <View style={tailwind("w-full h-full bg-white")}>
          <ScheduleContext.Provider value={{ schedule, setSchedule }}>
            <UserDataContext.Provider value={{ userData, setUserData, setUserDataAndNotify }}>
              <CalendarContext.Provider value={{ calendar, setCalendar }}>
                <NewsContext.Provider value={{ news, setNews }}>
                  <SportsContext.Provider value={{ sports, setSports }}>
                    <StatusBar barStyle={"dark-content"} />
                    <NavigationContainer>
                      <Stack.Navigator
                        screenOptions={{
                          cardStyle: { backgroundColor: "transparent" },
                          headerShown: false,
                          // make screens slide in from the bottom
                          gestureEnabled: false,
                          gestureDirection: "vertical",
                          ...TransitionPresets.ModalSlideFromBottomIOS,
                        }}
                      >
                        <Stack.Screen name="Main" component={error == null ?
                          TabNavigator : () => <ErrorModal error={error} />
                        } />
                        <Stack.Screen name="Modal" component={CustomModal} />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </SportsContext.Provider>
                </NewsContext.Provider>
            </CalendarContext.Provider>
            </UserDataContext.Provider>
          </ScheduleContext.Provider>
        </View>
      </DebugContext.Provider>
    </RootSiblingParent>
  );
}

const TabNavigator = ({ navigation }) => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Home"
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="Schedule"
        component={SchedulePage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <ClockIcon color={CONFIG.bg} /> : <ClockOutline color={CONFIG.text} />
          ),
        }}
      />
      <Tabs.Screen
        name="Sports"
        component={SportsPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <TrophyIcon color={CONFIG.bg} /> : <TrophyOutline color={CONFIG.text} />
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <HomeIcon color={CONFIG.bg} /> : <HomeOutline color={CONFIG.text} />
          ),
        }}
      />
      <Tabs.Screen
        name="News"
        component={NewsPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <NewspaperIcon color={CONFIG.bg} /> : <NewspaperOuline color={CONFIG.text} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Cog6ToothIcon color={CONFIG.bg} /> : <CogOutline color={CONFIG.text} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default App;