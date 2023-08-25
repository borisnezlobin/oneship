import { Dimensions, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

function ScheduleItem({ period, start, end, fixedHeight = false }) {
    const [now, setNow] = useState(new Date());
    var screenHeight = Dimensions.get("window").height - useSafeAreaInsets().bottom -40 - 56 - useSafeAreaInsets().top;
    var height = ((period.end - period.start) / (end - start)) * (screenHeight);

    useEffect(() => {
        var interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    var isCurrent = false;
    var nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    if(nowSeconds >= period.start * 60 && nowSeconds < period.end * 60){
        isCurrent = true;
    }

    return (
        <View style={[
            tailwind("w-full px-4 py-2"), 
            {
                width: Dimensions.get("window").width - 8,
                position: fixedHeight ? "relative" : "absolute",
                backgroundColor: "#F3F4F6",
                top: fixedHeight ? 0 : ((period.start - start) / (end - start)) * (screenHeight),
                height: fixedHeight ? CONFIG.DEFAULT_FIXED_HEIGHT : height,
                marginTop: fixedHeight ? 4 : 0,
                marginHorizontal: 4,
                borderRadius: 8,
                borderColor: isCurrent ? CONFIG.green : CONFIG.bg,
                borderWidth: 2,
            }
        ]}>
            <Text style={[tailwind("font-bold text-lg w-full text-left"), { color: CONFIG.green}]}>
                {period.name}
            </Text>
            <Text>{period.startString}-{period.endString}</Text>
            {isCurrent && fixedHeight && (
                <Text>
                    Ending in {getTime(now, period.end)}
                </Text>
            )}
        </View>
    )
}

const getTime = (now, end) => {
    var nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    var endSeconds = end * 60;
    var diff = endSeconds - nowSeconds;
    var minutes = Math.floor(diff / 60);
    var seconds = diff % 60;
    return (minutes < 0 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export default ScheduleItem;