import { SafeAreaView, StatusBar, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "./util/config";
import { CalendarContext, NewsContext, ScheduleContext, UserDataContext } from "./util/contexts";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./pages/Home";
import SchedulePage from "./pages/Schedule";
import CalendarPage from "./pages/Calendar";
import NewsPage from "./pages/News";
import SettingsPage from "./pages/Settings";
import TabBar from "./util/TabBar";
import {
  ScaleIcon,
  ClockIcon,
  Cog6ToothIcon,
  HomeIcon,
  NewspaperIcon
} from "react-native-heroicons/solid";
import {
  ScaleIcon as ScaleOutline,
  CalendarDaysIcon as CalendarDaysOutline,
  ClockIcon as ClockOutline,
  Cog6ToothIcon as CogOutline,
  HomeIcon as HomeOutline,
  NewspaperIcon as NewspaperOuline
} from "react-native-heroicons/outline";
import { RootSiblingParent } from 'react-native-root-siblings';
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack";
import CustomModal from "./pages/CustomModal";
import { setNotificationForClasses } from "./util/functions";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [schedule, setSchedule] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [news, setNews] = useState(null);
  const [sports, setSports] = useState(null);
  const [settings, setSettings] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getStartupData = async () => {
      console.log(CONFIG.serverURL + "api/startup");
      const response = await fetch(CONFIG.serverURL + "api/startup");
      var data = await response.text();
      try{
        data = JSON.parse(data);
        if(data == null){
          console.log("error: data is null");
          return;
        }
        if(data.error){
          console.log("error: " + data.error);
          // TODO: redirect to error screen
          return;
        }
        setCalendar(data.calendar);

        var today = new Date();
        today = today.getFullYear() + (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1) + (today.getDate() < 9 ? "0" : "") + today.getDate();
        if(schedule == null || schedule.date != today){
          if(data.schedule != null){
            setSchedule(data.schedule);
            setNotificationForClasses(data.schedule);
            await AsyncStorage.setItem("schedule", JSON.stringify(data.schedule));
          }
        }

        if(data.calendar != null && calendar == null){
          setCalendar(data.calendar);
        }
        
        console.log("setting news: " + data.news);
        setNews(data.news);
      }catch(e){
        console.log("error: " + e);
        console.log("couldn't parse startup data json from " + data);
      }
    }
    const getScheduleFromStorage = async () => {
      const schedule = await AsyncStorage.getItem("schedule");
      if(schedule != null) setSchedule(JSON.parse(schedule));
    }

    const getUserData = async () => {
      // last saved user data
      const user_data = await AsyncStorage.getItem("user_data");
      if(user_data != null && userData == null) try{
        setUserData(JSON.parse(user_data));
      }catch(e){
        console.log("error: " + e);
        console.log("couldn't parse user_data json from " + user_data);
      }

      // get most up-to-date user data
      var not_sketchy = await AsyncStorage.getItem("not_sketchy");
      console.log("not_sketchy: " + not_sketchy);
      if(not_sketchy == null) return;
      try{
        not_sketchy = JSON.parse(not_sketchy);
      }catch(e){
        console.log("error: " + e);
        console.log("couldn't parse not_sketchy json from " + not_sketchy);
        return;
      }
      
      // enencrypted passwords in the url
      // whatever
      const response = await fetch(CONFIG.serverURL + "api/login?email=" + not_sketchy.email + "&password=" + not_sketchy.password, {
        method: "POST",
      });
      const text = await response.text();
      console.log("got newest user data");
      try{
        AsyncStorage.setItem("user_data", text);
        const data = JSON.parse(text);
        setUserData(data);
      }catch(e){
        console.log("error: " + e);
        console.log("couldn't parse server response json from " + text);
      }
    }

    getUserData();
    getScheduleFromStorage();
    getStartupData();
  }, []);

  return (
    <RootSiblingParent>
      <View style={tailwind("w-full h-full bg-white")}>
        <ScheduleContext.Provider value={{ schedule, setSchedule }}>
          <UserDataContext.Provider value={{ userData, setUserData }}>
            <CalendarContext.Provider value={{ calendar, setCalendar }}>
              <NewsContext.Provider value={{ news, setNews }}>
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
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen name="Modal" component={CustomModal} />
                  </Stack.Navigator>
                </NavigationContainer>
              </NewsContext.Provider>
          </CalendarContext.Provider>
          </UserDataContext.Provider>
        </ScheduleContext.Provider>
      </View>
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
        name="ASB"
        component={CalendarPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <ScaleIcon color={CONFIG.bg} /> : <ScaleOutline color={CONFIG.text} />
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
