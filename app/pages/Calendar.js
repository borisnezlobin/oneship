import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";

const CalendarPage = () => {
    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                Calendar Page
            </Text>
        </SafeAreaView>
    );
}

export default CalendarPage;