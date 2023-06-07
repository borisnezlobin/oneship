import { Alert, TouchableOpacity, View } from "react-native"
import tailwind from "tailwind-rn"
import { CONFIG } from "../util/config"
import { PressableScale } from "react-native-pressable-scale"

const NiceButton = ({ cb, children, style, type }) => {
    if(!type) type = "default";
    return (
        <PressableScale onPress={() => {
            if(type == "danger"){
                Alert.alert('Are you sure?', '', [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                        onPress: cb
                    },
                ]);
            }else{
                cb();
            }
        }}>
            <View style={[
                tailwind("px-8 py-2 m-4 font-bold text-lg text-white flex flex-row justify-center items-center"),
                {
                    backgroundColor: (() => {
                        switch (type){
                            case "default":
                                return CONFIG.green;
                            case "danger":
                                return CONFIG.red;
                            default:
                                return CONFIG.green;
                        }
                    })(),
                    borderRadius: 4,
                    ...style
                }
            ]}>
                {children}
            </View>
        </PressableScale>
    )
}

export default NiceButton;