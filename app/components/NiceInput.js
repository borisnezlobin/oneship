import { TextInput, TouchableOpacity, View, Text } from "react-native"
import tailwind from "tailwind-rn"
import { CONFIG } from "../util/config"

const NiceInput = ({ cb, placeholder, defaultValue = "", type, error = "", props, style }) => {
    return (
        <View style={tailwind("w-full flex flex-col justify-center items-center")}>
            <TextInput
                style={[
                    tailwind("px-4 h-12 py-2 m-1 text-lg flex flex-row justify-center items-center"),
                    {
                        backgroundColor: CONFIG.bg,
                        borderRadius: 8,
                        width: "80%",
                        color: CONFIG.green,
                        borderColor: error.length != 0 ? CONFIG.red : CONFIG.grey,
                        borderWidth: 1,
                        lineHeight: 24, // h-12 = 24px
                        ...style
                    }
                ]}
                defaultValue={defaultValue}
                onChangeText={(e) => cb(e)}
                placeholder={placeholder}
                placeholderTextColor={CONFIG.grey}
                secureTextEntry={type == "password" ? true : false}
                textContentType={type}
                {...props}
            />
            <Text style={{ color: CONFIG.red }}>
                {error}
            </Text>
        </View>
    )
}

export default NiceInput;