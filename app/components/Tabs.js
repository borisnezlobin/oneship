import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";

const Tabs = ({
    style,
    cb,
    tabs = [],
    current = -1,
}) => {
    return (
        <View style={[
            tailwind("w-full flex flex-row justify-around items-center h-10"),
            style
        ]}>
            {tabs.map((tab, index) => {
                var isCurrent = current == index;
                return (
                    <TouchableOpacity key={tab} activeOpacity={0.9} onPress={() => cb(index)}>
                        <View style={{
                            backgroundColor: CONFIG.bg,
                            padding: 8,
                            flexGrow: 1,
                            height: 24,
                            width: Dimensions.get("window").width / tabs.length,
                            borderBottomWidth: 2,
                            borderBottomColor: isCurrent ? CONFIG.green : CONFIG.bg2,
                        }}>
                            <Text style={{
                                color: isCurrent ? CONFIG.green : CONFIG.grey,
                                fontWeight: "bold",
                                fontSize: 16,
                                textAlign: "center",
                                lineHeight: 24,
                            }}>
                                {tab}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default Tabs;