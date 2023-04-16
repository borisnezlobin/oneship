import * as React from 'react';
import { AppState, StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './pages/Home';
import DrawerComponent from './util/DrawerComponent';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import { defaultSettings, PublicationsContext, ScheduleContext, UserSettingsContext } from './util/contexts';
import CalendarPage from './pages/Calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './util/Loading';
import { setTheme } from './util/COLORS';
import Sports from './pages/Sports';
import Assignments from './pages/assignments/Assignments';
import CreateAssignment from './pages/assignments/CreateAssignment';
import Publications from './pages/Publications';
import Publication from './pages/Publication';
import ArticleDetails from './pages/ArticleDetails';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { formatDate, setExpoPushToken } from './util/util';
import CONFIG from './util/config';
import Update from './pages/Update';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const [schedule, setSchedule] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [isNewVersionAvailable, setIsNewVersionAvailable] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  setExpoPushToken(token);
  const navRef = React.useRef();
  const [publications, setPublications] = React.useState(null);
  setTheme(userSettingsContext == null ? false : userSettingsContext.isLightMode);

  React.useEffect(() => {
    // NOTIFICATIONS
    if(token == null) registerForPushNotificationsAsync().then(t => {
      setToken(t);
      // register token on backend
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("received notification: " + JSON.stringify(notification))
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // SETTINGS
    const getData = async () => {
      try{
        var gottenSettings = JSON.parse(await AsyncStorage.getItem("settings"));
      }catch(e){
        console.log("FAILED TO GET USER SETTINGS: " + e);
        return;
      }
      if(gottenSettings == null){
        setUserSettingsContext(defaultSettings);
        return;
      }
      for(var key in Object.keys(defaultSettings)){
        if(!gottenSettings.hasOwnProperty(key)){
          gottenSettings[key] = defaultSettings[key];
        }
      }
      setUserSettingsContext(gottenSettings);
    }

    const setData = () => {
      AsyncStorage.setItem("settings", JSON.stringify(userSettingsContext))
    }

    if(userSettingsContext == null){
      getData()
    }else{
      setData();
    }

    // SCHEDULE
    const getScheduleFromServer = async (d) => {
      var gottenSchedule = await fetch(CONFIG.SERVER_URL + "/schedule/" + d);
      if(gottenSchedule.status !== 200){
        alert("A server error occured: " + gottenSchedule.statusText);
        return;
      }else{
        const resData = (await gottenSchedule.json());
        const s = {
          lastUpdate: d,
          schedule: resData.data,
        };
        AsyncStorage.setItem("schedule", JSON.stringify(s));
        setSchedule(s);
      }
    }

    var getScheduleFromStorage = async () => {
      const gottenSchedule = JSON.parse(await AsyncStorage.getItem("schedule"));
      var todayDate = formatDate(Date.now(), true, false);
      if(gottenSchedule == null || gottenSchedule.lastUpdate !== todayDate){
        getScheduleFromServer(todayDate);
        return;
      }else{
        setSchedule(gottenSchedule);
      }
    }

    const checkForUpdates = async () => {
      const localVersion = CONFIG.VERSION;
      const remoteVersion = await fetch(CONFIG.SERVER_URL + "/app-version");
      if(localVersion !== remoteVersion){
        if(!isNewVersionAvailable) setIsNewVersionAvailable(true);
      }
    }

    var appStateSubscription = AppState.addEventListener("change", async (newVal) => {
      if(newVal == "active"){
        checkForUpdates();
      }
      if(schedule !== null) getScheduleFromStorage();
    });

    if(schedule == null) getScheduleFromStorage();
    checkForUpdates();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      appStateSubscription.remove();
    };
  }, [userSettingsContext, schedule])

  if(userSettingsContext == null){
    return <>
      <Loading />
    </>
  }

  const CopeScreen = () => {
    return StackContainer(isNewVersionAvailable);
}
  return (
    <SafeAreaProvider>
      <UserSettingsContext.Provider value={{ userSettingsContext, setUserSettingsContext }}>
        <PublicationsContext.Provider value={{ publications, setPublications }}>
          <ScheduleContext.Provider value={{ schedule, setSchedule }}>
            <NavigationContainer ref={navRef}>
              <Drawer.Navigator
                drawerContent={(props) => <DrawerComponent navRef={navRef} {...props} />}
                screenOptions={{
                  drawerType: "slide",
                  headerShown: false,
                  swipeEdgeWidth: 200,
                }}
              >
                <Drawer.Screen component={CopeScreen} name="Stack" />
              </Drawer.Navigator>
            </NavigationContainer>
          </ScheduleContext.Provider>
        </PublicationsContext.Provider>
      </UserSettingsContext.Provider>
    </SafeAreaProvider>
  );
}


const StackContainer = (isNewVersionAvailable) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forFade,
        gestureEnabled: false
      }}
      initialRouteName={"Update"}
    >
      <Stack.Screen name="Update" component={Update} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Schedule"
        component={Schedule}
      />
      <Stack.Screen name="Publications" component={Publications} />
      <Stack.Screen name="Publications_Publication" component={Publication} />
      <Stack.Screen name="Publications_Publication_Article" component={ArticleDetails} />
      <Stack.Screen name="Assignments" component={Assignments} />
      <Stack.Screen
        name="CreateAssignment"
        component={CreateAssignment}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarPage}
      />
      <Stack.Screen
        name="Sports"
        component={Sports}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  )
}

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ffffff',
    });
  }

  return token;
}