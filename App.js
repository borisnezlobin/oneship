import * as React from 'react';
import { StatusBar, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './pages/Home';
import DrawerComponent from './util/DrawerComponent';
import isWeb from './util/util';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import { defaultSettings, UserSettingsContext } from './util/contexts';
import CalendarPage from './pages/Calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './util/Loading';
import getColors, { setTheme } from './util/COLORS';
import Sports from './pages/Sports';
import Assignments from './pages/assignments/Assignments';
import CreateAssignment from './pages/assignments/CreateAssignment';

const Drawer = createDrawerNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const [routeContext, setRouteContext] = React.useState("");
  var COLORS = getColors();
  setTheme(userSettingsContext == null ? false : userSettingsContext.isLightMode);

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
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={(props) => <DrawerComponent currentRoute={routeContext} setRoute={setRouteContext} navigation={props.navigation} />}
              screenOptions={{
                drawerType: isWeb() ? "permanent" : "slide",
                headerShown: false,
                swipeEdgeWidth: 200,
              }}
            >
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen
                options={{ unmountOnBlur: true }}
                name="Schedule"
                component={Schedule}
              />
              <Drawer.Screen name="Assignments" component={Assignments} />
              <Drawer.Screen
                options={{ unmountOnBlur: true }}
                name="CreateAssignment"
                component={CreateAssignment}
              />
              <Drawer.Screen
                options={{ unmountOnBlur: true }}
                name="Calendar"
                component={CalendarPage}
              />
              <Drawer.Screen name="Sports" component={Sports} />
              <Drawer.Screen name="Settings" component={Settings} />
            </Drawer.Navigator>
          </NavigationContainer>
      </UserSettingsContext.Provider>
    </SafeAreaProvider>
  );
}

// DrawerComponent
// Calendar?
/*
import React from 'react'
import Home from './pages/Home';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import CalendarPage from './pages/Calendar';
import Sports from './pages/Sports';
import Assignments from './pages/assignments/Assignments';
import CreateAssignment from './pages/assignments/CreateAssignment';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import isWeb from './util/util';

const Drawer = createDrawerNavigator();

const App = () => {
  return <Home navigation={{
    openDrawer: () => {}
  }} />
  return (
    <NavigationContainer>
      <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={{
            drawerType: isWeb() ? "permanent" : "slide",
            headerShown: false,
            swipeEdgeWidth: 200,
          }}
        >
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default App*/