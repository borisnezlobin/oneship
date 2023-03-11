import * as React from 'react';
import { Button, Text, View, TouchableOpacity } from 'react-native';
import getColors from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts';
import Bar from "../components/Bar"
import { EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';

function Settings({ navigation }) {
  const { userSettingsContext, setUserSettingsContext } = React.useContext(UserSettingsContext);
  const COLORS = getColors()
  const changeBoolValueInSettings = (keyName) => {
    var newObj = {...userSettingsContext}
    newObj[keyName] = !userSettingsContext[keyName];
    setUserSettingsContext(newObj);
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.FOREGROUND_COLOR}}>
        <Text style={{ color: COLORS.GREEN, fontSize: 48, marginBottom: 16, fontWeight: "bold", position: "relative", top: 0 }}>
            Settings
        </Text>
        <TouchableOpacity onPress={() => changeBoolValueInSettings("show0Period")}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {userSettingsContext.show0Period ? 
            <EyeIcon color={COLORS.GREEN} weight="bold" size={32} />
          : <EyeSlashIcon color={COLORS.GREEN} weight="bold" size={32} />
          }
          <Text style={{
            color: COLORS.GREEN,
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            {userSettingsContext.show0Period ? "Show" : "Hide"} 0 period
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeBoolValueInSettings("isLightMode")}>
        <View style={{
          display: "flex",
          marginTop: 16,
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {userSettingsContext.isLightMode ? 
            <SunIcon color={COLORS.GREEN} weight="bold" size={32} />
          : <MoonIcon color={COLORS.GREEN} weight="bold" size={32} />
          }
          <Text style={{
            color: COLORS.GREEN,
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            {userSettingsContext.isLightMode ? "Light" : "Dark"} mode
          </Text>
        </View>
      </TouchableOpacity>
      <Bar navigation={navigation} />
    </View>
  );
}

export default Settings;