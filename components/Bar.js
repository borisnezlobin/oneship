import { Equals, ListDashes } from 'phosphor-react-native'
import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../util/COLORS'
import isWeb from '../util/util'

const Bar = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    if(isWeb()) return <></>;

    return (
        <View style={{
                position: 'absolute',
                height: 48,
                width: 48,
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.GREEN,
                top: 0,
                borderRadius: 1024,
                top: insets.top,
                left: 8
            }}
        >
            <TouchableOpacity onPress={navigation.openDrawer}>
                <ListDashes size={24} color={COLORS.FOREGROUND_COLOR} />
            </TouchableOpacity>
        </View>
    )
}

export default Bar