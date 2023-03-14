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

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userSettingsContext, setUserSettingsContext] = React.useState(null);
  const navRef = React.useRef();
  
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
      <Stack.Screen name="Sports" component={Sports} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  )
}

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});