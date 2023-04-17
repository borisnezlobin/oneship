import * as React from 'react';
import { Button, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import getColors from '../util/COLORS';
import { UserSettingsContext, VersionContext } from '../util/contexts';
import Bar from "../components/Bar"
import { EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";
import CONFIG from '../util/config';
import Update from './Update';
import PrimaryButton from '../components/PrimaryButton';


function Settings({ navigation }) {
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const { userSettingsContext, setUserSettingsContext } = React.useContext(UserSettingsContext);
  const { remoteVersion } = React.useContext(VersionContext);
  console.log("\'" + remoteVersion + "\' vs \'" + CONFIG.VERSION + "\'");
  const COLORS = getColors();

  const changeBoolValueInSettings = (keyName) => {
    var newObj = {...userSettingsContext}
    newObj[keyName] = !userSettingsContext[keyName];
    setUserSettingsContext(newObj);
  }


  if(updateOpen){
    return <Update closeCB={() => setUpdateOpen(false)} />
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
        {remoteVersion == CONFIG.VERSION ?
        <PrimaryButton title="Download Update" cb={() => setUpdateOpen(true)} style={{
          width: "50%",
          margin: 12,
          marginTop: 0,
          left: (Dimensions.get("window").width / 4) - 12
        }} />
        : <></>}
        <View style={{ width: "100%", height: 1, backgroundColor: COLORS.GREEN }} />
        <Text style={{
            fontWeight: "bold",
            color: COLORS.GREEN,
            width: "100%",
            padding: 16,
            textAlign: "center",
            fontSize: 36
        }}>
          Appearance
        </Text>
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
      <View style={{ width: "100%", height: 1, backgroundColor: COLORS.GREEN }} />
      <Text style={{
            fontWeight: "bold",
            color: COLORS.GREEN,
            width: "100%",
            padding: 16,
            textAlign: "center",
            fontSize: 36
        }}>
          Notifications
      </Text>
      <View style={{padding: 16}}>
      <Picker
        selectedValue={userSettingsContext.remind}
        onValueChange={(newVal) => {
          var newObj = {...userSettingsContext};
          newObj.remind = newVal;
          setUserSettingsContext(newObj);
        }}
        itemStyle={{
          color: COLORS.TEXT
        }}
      >
        <Picker.Item value={-1} label="Don't remind me" />
        <Picker.Item value={0.001} label="0 minutes" />
        <Picker.Item value={1} label="1 minute" />
        <Picker.Item value={2} label="2 minutes" />
        <Picker.Item value={3} label="3 minutes" />
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