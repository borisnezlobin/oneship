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

const Drawer = createDrawerNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const [routeContext, setRouteContext] = React.useState("");
  
  // it'd be really funny if I just made this async and update on app load
  // bc then there would be no visible loading time on the publications page I think
  const [publications, setPublications] = React.useState(null);
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
        <PublicationsContext.Provider value={{ publications, setPublications }}>
          <NavigationContainer>
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={(props) => <DrawerComponent currentRoute={routeContext} setRoute={setRouteContext} navigation={props.navigation} />}
              screenOptions={{
                drawerType: "slide",
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
              <Drawer.Screen name="Publications" component={Publications} />
              <Drawer.Screen name="Publication" component={Publication} />
              <Drawer.Screen name="Article" component={ArticleDetails} />
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
        </PublicationsContext.Provider>
      </UserSettingsContext.Provider>
    </SafeAreaProvider>
  );
}