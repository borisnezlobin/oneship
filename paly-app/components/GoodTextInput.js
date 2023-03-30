import React from 'react'
import { Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import getColors from '../util/COLORS'

const GoodTextInput = ({ value, placeholder, setValue, lines }) => {
    const COLORS = getColors()
    return (
        <View style={{width: "100%", paddingHorizontal: 8}}>
            <Text style={{
                color: COLORS.GREEN,
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: 8,
                paddingLeft: 4,
                width: "100%",
            }}>
                {placeholder}
            </Text>
            <TextInput
                placeholderTextColor={COLORS.ALPHA_GREEN}
                value={value}
                onChangeText={setValue}
                onBegan={e => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                autoCapitalize="words"
                multiline={lines == null ? false : true}
                numberOfLines={lines}
                style={{
                    backgroundColor: COLORS.LIGHT,
                    color: COLORS.GREEN,
                    borderRadius: 8,
                    width: "100%",
                    padding: 8,
                    fontSize: 16,
                    minHeight: 16 + 19,
                    maxHeight: 16 + (lines == null ? 1 : lines) * 19 // idk man
                }}
            />
        </View>
    )
}

export default GoodTextInput