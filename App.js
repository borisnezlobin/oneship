import * as React from 'react';
import { Button, Dimensions, StatusBar, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import DrawerComponent from './util/DrawerComponent';
import Surveys from './pages/Surveys';
import isWeb from './util/util';
import Settings from './pages/Settings';
import COLORS from './util/COLORS';
import Schedule from './pages/Schedule';
import { defaultSettings, UserSettingsContext } from './util/contexts';
import CalendarPage from './pages/Calendar';
import Bar from './components/Bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './util/Loading';

const Drawer = createDrawerNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);

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
          <StatusBar barStyle={"dark-content"} />
          <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <DrawerComponent navigation={props.navigation} />}
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