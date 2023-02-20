import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, View } from "react-native"
import COLORS from '../util/COLORS'
import { Link } from '@react-navigation/native';
import isWeb from '../util/util';

const DrawerListItem = ({ navigation, icon, to}) => {
    const component = (
        <>
            <View>
                {icon}
            </View>
            <View style={{width: 12}} />
            <Text style={{
                color: COLORS.GREEN,
                fontSize: 18,
                fontWeight: "bold",
            }}>
                {to}
            </Text>
        </>
    )

    if(isWeb()){
        return (
            <Link
                to={"/" + to}
                style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'left',
                    flexDirection: "row",
                    height: 48,
                    pointer: "cursor"
                }}
            >
                {component}
            </Link>
          )
    }

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(to)}
            style={{
                display: "flex",
                alignItems: 'center',
                justifyContent: 'left',
                flexDirection: "row",
                height: 64,
                pointer: "cursor"
            }}
        >
            {component}
        </TouchableOpacity>
    )
  
}

export default DrawerListItem