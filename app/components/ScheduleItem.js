import { Dimensions, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ScheduleItem({ period, start, prevStart, end }) {
    var screenHeight = Dimensions.get("window").height - useSafeAreaInsets().top - useSafeAreaInsets().bottom - 64;
    var height = ((period.end - period.start) / (end - start)) * (screenHeight);
    return (
        <View style={[
            tailwind("w-full px-4 py-2"), 
            {
                position: "absolute",
                backgroundColor: "#F3F4F6",
                top: ((period.start - start) / (end - start)) * (screenHeight) + useSafeAreaInsets().top,
                height: height
            }
        ]}>
            <Text style={[tailwind("font-bold text-lg w-24 text-left"), { color: CONFIG.green}]}>
                {period.name}
            </Text>
            <Text>{period.startString}-{period.endString}</Text>
        </View>
    )
}

export default ScheduleItem;