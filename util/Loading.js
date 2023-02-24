import React from 'react'
import { Image, SafeAreaView, Text } from 'react-native'
import COLORS from './COLORS'

const Loading = ({ text }) => {
  return (
    <SafeAreaView style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.FOREGROUND_COLOR,
        width: "100%",
        height: "100%"
    }}>
        <Image style={{width: 256, height: 256}} source={require("../assets/loading.gif")} />
        <Text style={{
            color: COLORS.GREEN,
            fontSize: 24,
            fontWeight: "bold"
        }}>{text}</Text>
    </SafeAreaView>
  )
}

export default Loading