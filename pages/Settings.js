import * as React from 'react';
import { Text, View } from 'react-native';
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
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: "#1C6800", fontSize: "larger" }}>
                Go to home page
            </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={change0PeriodBehaviour}>
        <Text>
          {userSettingsContext.show0Period ? "Hide" : "Show"} 0 period on schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Settings;