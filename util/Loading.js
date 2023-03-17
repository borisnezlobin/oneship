import React from 'react'
import { Image, SafeAreaView, View, Text, Dimensions, StatusBar } from 'react-native'
import Animated, { interpolate, Value } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import getColors from './COLORS'

const Loading = ({ scaleValue }) => {

  const isLightMode = false;
  const insets = {top: 1, bottom: 1};
  if(!scaleValue) scaleValue = new Value(1);

  console.log(scaleValue);
  const scale = scaleValue._value;
  console.log("scale: " + scale)

  if(scale < 2 && insets.top !== 0){
    StatusBar.setBarStyle("light-content", true)
  }else if(insets.top !== 0){
    StatusBar.setBarStyle("dark-content", true)
  }

  if(scale > 15) return <></>;

  return (
    <View pointerEvents='none'>
      <Animated.View style={{
        width: scale * 1000,
        height: 1000 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (500 * scale),
        top: Dimensions.get("window").height / 2 - (500 * scale),
        backgroundColor: isLightMode ? "#6d9959" : "#27401b",
        borderRadius: 1024,
      }} />
      <Animated.View style={{
        width: 850 * scale,
        height: 850 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (425 * scale),
        top: Dimensions.get("window").height / 2 - (425 * scale),
        backgroundColor: isLightMode ? "#55883f" : "#264818",
        borderRadius: 1024
      }} />
      <Animated.View style={{
        width: 600 * scale,
        height: 600 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (300 * scale),
        top: Dimensions.get("window").height / 2 - (300 * scale),
        backgroundColor: isLightMode ? "#3b7824" : "#255015",
        borderRadius: 1024
      }} />
      <Animated.View style={{
        width: 384 * scale,
        height: 384 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (192 * scale),
        top: Dimensions.get("window").height / 2 - (192 * scale),
        backgroundColor: "#1C6800",
        borderRadius: 1024
      }} />
      <Animated.View style={{
        width: 192 * scale,
        height: 192 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (96 * scale),
        top: Dimensions.get("window").height / 2 - (96 * scale),
        backgroundColor: getColors().FOREGROUND_COLOR,
        borderRadius: 1024,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Image style={{
          width: 128 * scale,
          height: 128 * scale,
          borderRadius: 1024,
        }} source={require("../assets/logo-transparent.png")} />
        <Text style={{
          fontWeight: "bold",
          fontSize: 12 * scale,
          color: getColors().GREEN
        }}>
          LOADING
        </Text>
      </Animated.View>
    </View>
  )

  return (
    <SafeAreaView style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getColors().FOREGROUND_COLOR,
        width: "100%",
        height: "100%"
    }}>
        <Image style={{width: 256, height: 256}} source={require("../assets/loading.gif")} />
        <Text style={{
            color: getColors().GREEN,
            fontSize: 24,
            fontWeight: "bold"
        }}>{text}</Text>
    </SafeAreaView>
  )
}

export default Loading