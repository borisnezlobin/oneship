import { TouchableOpacity, View } from "react-native"
import tailwind from "tailwind-rn"
import { CONFIG } from "../util/config"

const NiceButton = ({ cb, children, style }) => {
    return (
        <TouchableOpacity onPress={cb}>
            <View style={[
                tailwind("px-4 py-2 m-4 font-bold text-lg text-white flex flex-row justify-center items-center"),
                {
                    backgroundColor: CONFIG.green,
                    borderRadius: 4,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    gap: 12,
                    ...style
                }
            ]}>
                {children}
            </View>
        </TouchableOpacity>
    )
}

export default NiceButton;