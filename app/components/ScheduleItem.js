import { Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";

function ScheduleItem({ period }) {
    return (
        <View style={[
            tailwind("w-full flex flex-row justify-center items-center"), 
            { gap: 12 }
        ]}>
            <Text style={[tailwind("font-bold text-lg w-24 text-left"), { color: CONFIG.green}]}>
                {period.name}
            </Text>
            <Text>{period.startString}-{period.endString}</Text>
        </View>
    )
}

export default ScheduleItem;