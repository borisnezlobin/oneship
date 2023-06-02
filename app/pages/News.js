import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";

const NewsPage = () => {
    return (
        <SafeAreaView style={tailwind("w-full h-full flex justify-center items-center")}>
            <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                News Page
            </Text>
        </SafeAreaView>
    );
}

export default NewsPage;