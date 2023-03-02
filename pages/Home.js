import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Bar from '../components/Bar';

function Home({ navigation }) {
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
              <Text style={{ color: "#1C6800", fontSize: "larger" }}>
                  Go to calendar
              </Text>
        </TouchableOpacity>
      </View>
      <Bar navigation={navigation} />
    </>
  );
}

export default Home;