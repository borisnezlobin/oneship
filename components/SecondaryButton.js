import React from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'
import getColors from '../util/COLORS'

const SecondaryButton = ({ cb, title, style }) => {
    const COLORS = getColors();
    return (
        <TouchableOpacity
            onPress={cb}
            style={{
                backgroundColor: COLORS.BACKGROUND_COLOR,
                borderRadius: 2,
                height: 36,
                width: 100,
                shadowColor: COLORS.BACKGROUND_COLOR,
                shadowOpacity: 1,
                shadowOffset: { width: 0, height: 0.5},
                shadowRadius: 5,
                ...style
            }}
        >
            <Text style={{
                fontSize: 16,
                marginTop: 8,
                fontWeight: 'bold',
                color: COLORS.isLightMode ? COLORS.FOREGROUND_COLOR : "#cccccc",
                textAlign: 'center',
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default SecondaryButton