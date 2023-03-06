import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserSettingsContext } from '../util/contexts';

function Settings({ navigation }) {
  const { userSettingsContext, setUserSettingsContext } = React.useContext(UserSettingsContext);

  const changeBoolValueInSettings = (keyName) => {
    var newObj = {...userSettingsContext}
    newObj[keyName] = !userSettingsContext[keyName];
    setUserSettingsContext(newObj);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: "#1C6800", fontSize: "larger", marginBottom: 16, fontWeight: "bold" }}>
            Settings
        </Text>
      <Button onPress={() => changeBoolValueInSettings("show0Period")} title={(userSettingsContext.show0Period ? "Hide" : "Show") + " 0 period on schedule"}>
          {userSettingsContext.show0Period ? "Hide" : "Show"} 0 period on schedule
      </Button>
      <Button onPress={() => changeBoolValueInSettings("isLightMode")} title={(userSettingsContext.isLightMode ? "Light" : "Dark") + " mode"} />
      <Text>
        {JSON.stringify(userSettingsContext)}
      </Text>
    </View>
  );
}

export default Settings;