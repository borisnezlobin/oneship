import { SafeAreaView, Text, View, Switch, TouchableWithoutFeedback, Keyboard } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext, useState } from "react";
import { UserDataContext } from "../util/contexts";
import LoginPage from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NiceInput from "../components/NiceInput";
import NiceButton from "../components/NiceButton";

const SettingsPage = () => {
    const { userData, setUserData } = useContext(UserDataContext);

    const [gradeError, setGradeError] = useState("");
    console.log(gradeError);

    const updateUserData = (newUserData) => {
        setUserData(newUserData);
        // update async storage
        AsyncStorage.setItem("user_data", JSON.stringify(newUserData));
        // TODO: update server
    }

    if(userData == null){
        return <LoginPage />
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={tailwind("bg-white w-full h-full")} key={userData}>
                <View style={tailwind("bg-white w-full p-4 h-full flex justify-start items-start")}>
                    <Text style={[tailwind("text-4xl w-full font-bold text-center"), { color: CONFIG.green }]}>
                        {userData.data.displayName}
                    </Text>
                    <Text style={[tailwind("text-lg w-full text-center"), { color: CONFIG.text }]}>
                        {userData.data.email}
                    </Text>
                    <View style={{
                        height: 1,
                        marginLeft: "10%",
                        width: "80%",
                        backgroundColor: CONFIG.grey,
                        marginVertical: 32,
                    }} />
                    <View style={tailwind("flex px-3 flex-row justify-between items-center w-full")}>
                        <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                            Show 0 Period
                        </Text>
                        <Switch
                            trackColor={{ false: CONFIG.bg2, true: CONFIG.green }}
                            thumbColor={ userData.data.show0 ? CONFIG.bg : CONFIG.bg }
                            onValueChange={() => {
                                var newUserData = {...userData};
                                newUserData.data.show0 = !userData.data.show0;
                                updateUserData(newUserData);
                            }}
                            value={userData.data.show0}
                        />
                    </View>
                    <View style={tailwind("flex w-full px-3 flex-row justify-center items-center w-full")}>
                        <NiceButton
                            type="danger"
                            cb={() => {
                                console.log("signing out")
                                AsyncStorage.removeItem("user_data");
                                AsyncStorage.removeItem("not_sketchy");
                                setUserData(null);
                            }}
                        >
                            <Text style={[tailwind("text-lg font-bold"), { color: CONFIG.bg }]}>
                                Sign out
                            </Text>
                        </NiceButton>
                    </View>
                    {/*}
                    <View style={tailwind("flex px-3 flex-col justify-center items-center w-full")}>
                        <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                            Grade
                        </Text>
                        <NiceInput
                            cb={(e) => {
                                var newGrade = e;
                                setGradeError("");
                                newGrade = parseInt(newGrade);
                                if(isNaN(newGrade) || newGrade < 9 || newGrade > 12){
                                    setGradeError("Please enter a valid grade.");
                                    return;
                                }
                                var newUserData = {...userData};
                                newUserData.data.grade = newGrade;
                                updateUserData(newUserData);
                            }}
                            placeholder={"0"}
                            keyboardType="numeric"
                            style={{
                                width: "20%",
                                textAlign: "center",
                            }}
                            error={gradeError}
                        />
                    </View>
                    */}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default SettingsPage;