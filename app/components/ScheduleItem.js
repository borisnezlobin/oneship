import { Dimensions, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ScheduleItem({ period, start, end, fixedHeight = false }) {
    var screenHeight = Dimensions.get("window").height - useSafeAreaInsets().bottom -40 - 56 - useSafeAreaInsets().top;
    var height = ((period.end - period.start) / (end - start)) * (screenHeight);

    return (
        <View style={[
            tailwind("w-full px-4 py-2"), 
            {
                position: fixedHeight ? "relative" : "absolute",
                backgroundColor: "#F3F4F6",
                top: fixedHeight ? 0 : ((period.start - start) / (end - start)) * (screenHeight),
                height: fixedHeight ? CONFIG.DEFAULT_FIXED_HEIGHT : height
            }
        ]}>
            <Text style={[tailwind("font-bold text-lg w-full text-left"), { color: CONFIG.green}]}>
                {period.name}
            </Text>
            <Text>{period.startString}-{period.endString}</Text>
        </View>
    )
}

export default ScheduleItem;