import { SafeAreaView, StatusBar, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "./util/config";
import { CalendarContext, ScheduleContext, UserDataContext } from "./util/contexts";
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

const Tabs = createBottomTabNavigator();

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
      const data = await response.json();
      setCalendar(data.calendar);

      var today = new Date();
      today = today.getFullYear() + (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1) + (today.getDate() < 9 ? "0" : "") + today.getDate();
      if(schedule == null || schedule.date != today){
        setSchedule(data.schedule);
        await AsyncStorage.setItem("schedule", JSON.stringify(data.schedule));
      }
      
      setNews(data.news);
    }
    const getScheduleFromStorage = async () => {
      const schedule = await AsyncStorage.getItem("schedule");
      if(schedule != null) setSchedule(JSON.parse(schedule));
    }

    getScheduleFromStorage();
    getStartupData();
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <StatusBar barStyle={"dark-content"} />
        <NavigationContainer>
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
        </NavigationContainer>
      </UserDataContext.Provider>
    </ScheduleContext.Provider>
  );
}
