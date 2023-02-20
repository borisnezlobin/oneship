import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Surveys({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: "#1C6800", fontSize: "larger" }}>
                Go to home page
            </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Surveys;