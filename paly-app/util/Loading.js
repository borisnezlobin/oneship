import React, { useState, useEffect } from 'react'
import { Image, SafeAreaView, View, Text, Dimensions, StatusBar } from 'react-native'
import getColors from './COLORS'

// well at least it looks cool so actually just don't worry about any of this code
const Loading = ({ loading = true, insets = { top: 0 }, text="LOADING", animate = false }) => {
  const [scale, setScale] = useState(1);
  const isLightMode = false;

  useEffect(() => {
    if (scale < 0) return;
    if(loading) return;
    if(!loading && !animate && scale !== 0){
      setScale(0);
    }
    const timer = setTimeout(() => {
      setScale(scale - 1/25);
    }, 0.001);
    return () => clearTimeout(timer);
  }, [scale]);

  if(scale < 0.01) return <></>;

  return (
    <View style={{position: "absolute", top: 0}}>
      <View style={{
        width: 1000 * scale,
        height: 1000 * scale,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (500 * scale),
        top: Dimensions.get("window").height / 2 - (500 * scale),
        backgroundColor: isLightMode ? "#6d9959" : "#27401b",
        borderRadius: 1024,
      }} />
      <View style={{
        width: 850 * (scale - 0.2) * 1.25,
        height: 850 * (scale - 0.2) * 1.25,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (425 * (scale - 0.2) * 1.25),
        top: Dimensions.get("window").height / 2 - (425 * (scale - 0.2) * 1.25),
        backgroundColor: isLightMode ? "#55883f" : "#264818",
        borderRadius: 1024
      }} />
      <View style={{
        width: 600 * (scale - 0.3) * 1.5,
        height: 600 * (scale - 0.3) * 1.5,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (300 * (scale - 0.3) * 1.5),
        top: Dimensions.get("window").height / 2 - (300 * (scale - 0.3) * 1.5),
        backgroundColor: isLightMode ? "#3b7824" : "#255015",
        borderRadius: 1024
      }} />
      <View style={{
        width: 384 * (scale - 0.4) * 1.6,
        height: 384 * (scale - 0.4) * 1.6,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (192 * (scale - 0.4) * 1.6),
        top: Dimensions.get("window").height / 2 - (192 * (scale - 0.4) * 1.6),
        backgroundColor: "#1C6800",
        borderRadius: 1024
      }} />
      <View style={{
        width: 192 * (scale - 0.25) * 1.3,
        height: 192 * (scale - 0.25) * 1.3,
        position: "absolute",
        left: Dimensions.get("window").width / 2 - (96 * (scale - 0.25) * 1.3),
        top: Dimensions.get("window").height / 2 - (96 * (scale - 0.25) * 1.3),
        backgroundColor: getColors().FOREGROUND_COLOR,
        borderRadius: 1024,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Image style={{
          width: 128 * (scale - 0.25) * 1.3,
          height: 128 * (scale - 0.25) * 1.3,
          borderRadius: 1024,
        }} source={require("../assets/logo-transparent.png")} />
        <Text style={{
          fontWeight: "bold",
          fontSize: scale >= 0.25 ? 12 * (scale - 0.25) * 1.3 : 0.001,
          color: getColors().GREEN
        }}>
          {text}
        </Text>
      </View>
    </View>
  )
}

export default Loading