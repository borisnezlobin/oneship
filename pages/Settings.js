import * as React from 'react';
import { Button, Text, View, TouchableOpacity } from 'react-native';
import getColors from '../util/COLORS';
import { UserSettingsContext } from '../util/contexts';
import Bar from "../components/Bar"
import { BellAlertIcon, BellSlashIcon, EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";


function Settings({ navigation }) {
  const { userSettingsContext, setUserSettingsContext } = React.useContext(UserSettingsContext);
  const COLORS = getColors()
  const changeBoolValueInSettings = (keyName) => {
    var newObj = {...userSettingsContext}
    newObj[keyName] = !userSettingsContext[keyName];
    setUserSettingsContext(newObj);
  }

  return (
    <SafeAreaView style={{
        height: "100%",
        backgroundColor: COLORS.FOREGROUND_COLOR
    }}>
        <Text style={{
          color: COLORS.GREEN,
          fontSize: 48,
          marginBottom: 16,
          fontWeight: "bold",
          position: "relative",
          top: 0,
          textAlign: "center",
          width: "100%"
        }}>
            Settings
        </Text>
        <Text style={{
            fontWeight: "bold",
            color: COLORS.FOREGROUND_COLOR,
            width: "100%",
            backgroundColor: COLORS.GREEN,
            padding: 16,
            textAlign: "center",
            fontSize: 20
        }}>
          PREFERENCES
        </Text>
        { /* PREFERENCES */ }
        <View style={{padding: 16}}>
          <TouchableOpacity onPress={() => changeBoolValueInSettings("show0Period")}>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'flex-start'
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
            justifyContent: 'flex-start'
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
      </View>
      <Text style={{
            fontWeight: "bold",
            color: COLORS.FOREGROUND_COLOR,
            width: "100%",
            backgroundColor: COLORS.GREEN,
            padding: 16,
            textAlign: "center",
            fontSize: 20
        }}>
          NOTIFICATIONS
        </Text>
        { /* NOTIFICATIONS */ }
        <View style={{padding: 16}}>
        <View style={{
          display: "flex",
          marginTop: 16,
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          {userSettingsContext.isLightMode ? 
            <SunIcon color={COLORS.GREEN} weight="bold" size={32} />
          : <MoonIcon color={COLORS.GREEN} weight="bold" size={32} />
          }
        </View>
        <Picker
          selectedValue={5}
        >
          <Picker.Item value={-1} label="Don't remind me" />
          <Picker.Item value={0.001} label="0 minutes" />
          <Picker.Item value={1} label="1 minutes" />
          <Picker.Item value={2} label="2 minutes" />
          <Picker.Item value={5} label="5 minutes" />
          <Picker.Item value={10} label="10 minutes" />
          <Picker.Item value={15} label="15 minutes" />
        </Picker>
      </View>
      <Bar navigation={navigation} />
    </SafeAreaView>
  );
}

export default Settings;