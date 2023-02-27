import { Equals } from 'phosphor-react-native'
import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../util/COLORS'
import isWeb from '../util/util'

const Bar = ({ navigation, routeName }) => {
    const insets = useSafeAreaInsets();
    if(isWeb()) return <></>;

    return (
        <View style={{
            width: "100%",
            height: 50 + insets.top,
            backgroundColor: COLORS.FOREGROUND_COLOR,
            top: 0,
            paddingLeft: 8,
            paddingTop: insets.top,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: 'center',
            borderBottomColor: "grey",
            borderBottomWidth: 1,
        }}>
            <TouchableOpacity onPress={navigation.openDrawer}>
                <Equals size={36} color={COLORS.GREEN} />
            </TouchableOpacity>
            <Text style={{
                position: 'relative',
                width: Dimensions.get("window").width - 64,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 24,
                color: COLORS.GREEN
            }}>
                {routeName}
            </Text>
        </View>
    )
}

export default Bar