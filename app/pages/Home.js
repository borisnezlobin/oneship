import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext } from "react";
import { UserDataContext } from "../util/contexts";
import LoginPage from "./Login";

const HomePage = () => {
    const { userData, setUserData } = useContext(UserDataContext);

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