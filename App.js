import * as React from 'react';
import { StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './pages/Home';
import DrawerComponent from './util/DrawerComponent';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import { defaultSettings, PublicationsContext, UserSettingsContext } from './util/contexts';
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
import { sendLocalNotification, sendPushNotification, setExpoPushToken } from './util/util';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  setExpoPushToken(token);
  sendLocalNotification("4th Period starting in 5 minutes", "Head to room 410!", null, null)
  const navRef = React.useRef();
  
  // it'd be really funny if I just made this async and update on app load
  // bc then there would be no visible loading time on the publications page I think
  const [publications, setPublications] = React.useState(null);
  setTheme(userSettingsContext == null ? false : userSettingsContext.isLightMode);

  React.useEffect(() => {
    // NOTIFICATIONS
    if(token == null) registerForPushNotificationsAsync().then(t => setToken(t));
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
      const gottenSettings = await AsyncStorage.getItem("settings");
      if(gottenSettings == null){
        setUserSettingsContext(defaultSettings);
        return;
      }
      setUserSettingsContext(JSON.parse(gottenSettings));
    }

    const setData = () => {
      AsyncStorage.setItem("settings", JSON.stringify(userSettingsContext))
    }

    if(userSettingsContext == null){
      getData()
    }else{
      setData();
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userSettingsContext])

  if(userSettingsContext == null){
    return <>
      <StatusBar barStyle="dark-content" />
      <Loading />
    </>
  }

  return (
    <SafeAreaProvider>
      <UserSettingsContext.Provider value={{ userSettingsContext, setUserSettingsContext }}>
        <PublicationsContext.Provider value={{ publications, setPublications }}>
          <NavigationContainer ref={navRef}>
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={(props) => <DrawerComponent navRef={navRef} {...props} />}
              screenOptions={{
                drawerType: "slide",
                headerShown: false,
                swipeEdgeWidth: 200,
              }}
            >
              <Drawer.Screen component={StackContainer} name="Stack" />
            </Drawer.Navigator>
          </NavigationContainer>
        </PublicationsContext.Provider>
      </UserSettingsContext.Provider>
    </SafeAreaProvider>
  );
}


const StackContainer = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forFade,
        gestureEnabled: false
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        options={{ unmountOnBlur: true }}
        name="Schedule"
        component={Schedule}
      />
      <Stack.Screen name="Publications" component={Publications} />
      <Stack.Screen name="Publications_Publication" component={Publication} />
      <Stack.Screen name="Publications_Publication_Article" component={ArticleDetails} />
      <Stack.Screen name="Assignments" component={Assignments} />
      <Stack.Screen
        options={{ unmountOnBlur: true }}
        name="CreateAssignment"
        component={CreateAssignment}
      />
      <Stack.Screen
        options={{ unmountOnBlur: true }}
        name="Calendar"
        component={CalendarPage}
      />
      <Stack.Screen
        name="Sports"
        component={Sports}
        options={{ unmountOnBlur: true }}
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

/*
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
*/
