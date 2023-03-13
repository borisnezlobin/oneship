import React from 'react'
import { Dimensions, View, TouchableWithoutFeedback, Keyboard } from 'react-native'

const DismissKeyboard = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
            position: "absolute",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
        }}/>
    </TouchableWithoutFeedback>
  )
}

export default DismissKeyboard