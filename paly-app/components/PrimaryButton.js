import React from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'
import getColors from '../util/COLORS'

const PrimaryButton = ({ cb, title, style }) => {
    const COLORS = getColors();
    return (
        <TouchableOpacity
            onPress={cb}
            style={{
                backgroundColor: COLORS.GREEN,
                borderRadius: 2,
                height: 36,
                width: 100,
                shadowColor: COLORS.GREEN,
                shadowOpacity: 1,
                shadowOffset: { width: 0, height: 0.5},
                shadowRadius: 5,
                justifyContent: "center",
                ...style
            }}
        >
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.isLightMode ? COLORS.FOREGROUND_COLOR : "#cccccc",
                textAlign: 'center',
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default PrimaryButton