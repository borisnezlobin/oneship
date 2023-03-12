import React, { useState } from 'react'
import { Bars3Icon } from "react-native-heroicons/outline"
import { Dimensions, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import getColors from '../util/COLORS'
import isWeb from '../util/util'

const Bar = ({ navigation }) => {
    const [opacity, setOpacity] = useState(1);
    const insets = useSafeAreaInsets();
    var COLORS = getColors();
    if(isWeb()) return <></>;

    const startPress = () => {
        setOpacity(0.6)
    }

    const endPress = () => {
        setOpacity(1)
    }

    return (
        <View style={{
                position: "absolute",
                height: 48,
                width: 48,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "visible",
                backgroundColor: COLORS.GREEN,
                bottom: insets.bottom + 2,
                borderRadius: 1024,
                right: 16,
                shadowColor: COLORS.GREEN,
                shadowOpacity: 1,
                shadowOffset: { width: 0, height: 0.5},
                opacity: opacity,
                elevation: 1,
            }}
        >
            <TouchableOpacity onPressIn={startPress} onPressOut={endPress} onPress={navigation.openDrawer}>
                <Bars3Icon size={24} color={COLORS.FOREGROUND_COLOR} />
            </TouchableOpacity>
        </View>
    )
}

export default Bar