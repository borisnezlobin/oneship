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

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle={"dark-content"} />
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <DrawerComponent {...props} />}
        screenOptions={{
          drawerType: isWeb() ? "permanent" : "slide",
          headerShown: false
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Calendar" component={Calendar} />
        <Drawer.Screen name="Surveys" component={Surveys} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Schedule" component={Schedule} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}