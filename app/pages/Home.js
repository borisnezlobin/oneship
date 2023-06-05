import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST, SUCCESS_TOAST } from "../util/config";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../util/contexts";
import LoginPage from "./Login";
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomePage = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    const insets = useSafeAreaInsets();

    if(userData == null){
        return <LoginPage />
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <Text style={[tailwind("text-xl"), { color: CONFIG.text}]}>
                Welcome back,
            </Text>
            <Text style={[tailwind("font-bold m-4 text-4xl"), { color: CONFIG.green}]}>
                {userData.data.displayName}
            </Text>
        </SafeAreaView>
    );
}

export default HomePage;