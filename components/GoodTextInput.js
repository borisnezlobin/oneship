import React from 'react'
import { Text } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import getColors from '../util/COLORS'

const GoodTextInput = ({ value, placeholder, setValue, lines }) => {
    const COLORS = getColors()
    return (
        <>
            <Text style={{
                color: COLORS.GREEN,
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: 8,
                paddingLeft: 4,
            }}>
                {placeholder}
            </Text>
            <TextInput
                placeholderTextColor={COLORS.ALPHA_GREEN}
                value={value}
                onChangeText={setValue}
                autoCapitalize="words"
                multiline={lines == null ? false : true}
                numberOfLines={lines}
                style={{
                    backgroundColor: COLORS.LIGHT,
                    color: COLORS.GREEN,
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 16,
                    maxHeight: 16 + (lines == null ? 1 : lines) * 19 // idk man
                }}
            />
        </>
    )
}

export default GoodTextInput