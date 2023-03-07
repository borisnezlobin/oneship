import * as React from 'react';
import { StatusBar, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import Home from './pages/Home';
import DrawerComponent from './util/DrawerComponent';
import Surveys from './pages/Surveys';
import isWeb from './util/util';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import { defaultSettings, RouteContext, UserSettingsContext } from './util/contexts';
import CalendarPage from './pages/Calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './util/Loading';
import getColors, { setTheme } from './util/COLORS';

const Drawer = createDrawerNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const [routeContext, setRouteContext] = React.useState("");
  var COLORS = getColors();
  // COLORS.setLightMode(userSettingsContext == null ? false : userSettingsContext.isLightMode);
  setTheme(userSettingsContext == null ? false : userSettingsContext.isLightMode);
  console.log("theme: " + (userSettingsContext == null ? "null" : userSettingsContext.isLightMode));
  console.log(COLORS.isLightMode)

  React.useEffect(() => {
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
          <NavigationContainer>
            <StatusBar barStyle={COLORS.STATUS_BAR} />
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={(props) => <DrawerComponent currentRoute={routeContext} setRoute={setRouteContext} navigation={props.navigation} />}
              screenOptions={{
                drawerType: isWeb() ? "permanent" : "slide",
                headerShown: false
              }}
            >
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Calendar" component={CalendarPage} />
              <Drawer.Screen name="Surveys" component={Surveys} />
              <Drawer.Screen name="Settings" component={Settings} />
              <Drawer.Screen name="Schedule" component={Schedule} />
            </Drawer.Navigator>
          </NavigationContainer>
      </UserSettingsContext.Provider>
    </SafeAreaProvider>
  );
}