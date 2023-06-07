import { SafeAreaView, ScrollView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { useContext, useEffect, useState } from "react";
import { ScheduleContext, UserDataContext } from "../util/contexts";
import LoginPage from "./Login";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageItem from "../components/MessageItem";
import { getCurrentScheduleInfo } from "../util/functions";
import { CONFIG } from "../util/config";

const HomePage = ({ navigation }) => {
    const { userData, setUserData } = useContext(UserDataContext);
    const { schedule } = useContext(ScheduleContext);
    const [currentTime, setCurrentTime] = useState(new Date());
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if(userData == null || userData.data == null || userData.messages == null){
        return <LoginPage />
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <ScrollView style={{
                width: "100%",
            }}>
                <Text style={[
                    tailwind("text-2xl font-bold text-center"),
                    {
                        color: CONFIG.green,
                    }
                ]}>
                    Welcome, {userData.data.displayName}
                </Text>
                <Text style={tailwind("text-xl text-center")}>
                    {getCurrentScheduleInfo(schedule, currentTime)}
                </Text>
                {userData.messages.map((message, index) => {
                    return <MessageItem key={index} message={message} navigation={navigation} />
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomePage;