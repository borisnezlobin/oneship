import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext, useState } from "react";
import { UserDataContext } from "../util/contexts";
import { ArrowRightOnRectangleIcon, UserIcon } from "react-native-heroicons/outline";
import NiceButton from "../components/NiceButton";
import { HashtagIcon } from "react-native-heroicons/solid";
import LoginPage from "./Login";

const SettingsPage = () => {
    const { userData, setUserData } = useContext(UserDataContext);

    if(userData == null){
        return <LoginPage />
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <Text style={[tailwind("font-bold text-lg"), { color: CONFIG.green}]}>
                Settings Page
            </Text>
            <Text>
                {JSON.stringify(userData)}
            </Text>
        </SafeAreaView>
    );
}

export default SettingsPage;