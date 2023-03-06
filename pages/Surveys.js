import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Bar from '../components/Bar';

function Surveys({ navigation }) {
  return (
    <Bar navigation={navigation} />
  );
}

export default Surveys;