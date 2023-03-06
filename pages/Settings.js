import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserSettingsContext } from '../util/contexts';

function Settings({ navigation }) {
  const { userSettingsContext, setUserSettingsContext } = React.useContext(UserSettingsContext);

  const change0PeriodBehaviour = () => {
    var newObj = {...userSettingsContext}
    newObj.show0Period = !userSettingsContext.show0Period;
    setUserSettingsContext(newObj);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: "#1C6800", fontSize: "larger", marginBottom: 16, fontWeight: "bold" }}>
            Settings
        </Text>
      <Button onPress={change0PeriodBehaviour} title={(userSettingsContext.show0Period ? "Hide" : "Show") + " 0 period on schedule"}>
          {userSettingsContext.show0Period ? "Hide" : "Show"} 0 period on schedule
      </Button>
    </View>
  );
}

export default Settings;