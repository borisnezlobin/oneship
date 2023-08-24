import { SafeAreaView, Text, View, Switch, Dimensions, ScrollView } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST, SUCCESS_TOAST } from "../util/config";
import { useContext, useEffect, useState } from "react";
import { DebugContext, UserDataContext } from "../util/contexts";
import LoginPage from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Barcode from '@kichiyaki/react-native-barcode-generator';
import NiceButton from "../components/NiceButton";
import log, { logError } from "../util/debug";
import SettingsGradePicker from "../components/SettingsGradePicker";
import SettingsClassReminder from "../components/SettingsClassReminder";
import Tabs from "../components/Tabs";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsPage = () => {
    const insets = useSafeAreaInsets();
    const [page, setPage] = useState(0);
    const [edited, setEdited] = useState(false);
    const { userData, setUserData, setUserDataAndNotify } = useContext(UserDataContext);

    const logout = () => {
        log("signing out")
        AsyncStorage.removeItem("user_data");
        AsyncStorage.removeItem("not_sketchy");
        setUserData(null);
    }

    var perchance = null;
    try{
        perchance = JSON.parse(JSON.stringify(userData.data));
    }catch(e){ logout(); }

    const [editedSettings, setEditedSettings] = useState(perchance);
    const { setError } = useContext(DebugContext);

    useEffect(() => {
        if(userData == null) return;
        if(editedSettings == null){
            try{
                setEditedSettings(JSON.parse(JSON.stringify(userData.data)));
            }catch(e){ logout(); }
            return;
        }
        
        if(userData && editedSettings){
            var skippable = ["userAgents"];
            var change = false;
            for(var key in editedSettings){
                if(!skippable.includes(key) && editedSettings[key] != userData.data[key]){
                    change = true;
                    break;
                }
            }
            if(edited !== change) setEdited(change);
        }
    }, [userData, editedSettings]);

    const saveUserData = () => {
        var newUserData = JSON.parse(JSON.stringify(userData));
        newUserData.data = editedSettings;

        // idfk
        newUserData.data.userAgents = userData.data.userAgents;

        setUserDataAndNotify(newUserData);
        AsyncStorage.setItem("user_data", JSON.stringify(newUserData));

        fetch(CONFIG.serverURL + "/api/user/settings", {
            method: "POST",
            body: JSON.stringify({
                settings: newUserData.data,
                token: userData.token,
                uid: userData.data.uid
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async res => {
            var text = await res.text();
            if(res.status != 200){
                logError("Error updating user data: server responded with " + res.status + ", " + text);
                Toast.show("Failed to save settings", {...ERROR_TOAST, containerStyle: {
                    top: insets.top,
                }});
                setError({
                    error: "Failed to save settings",
                    status: res.status
                });
            }else{
                Toast.show("Saved settings!", {...SUCCESS_TOAST, containerStyle: {
                    top: insets.top,
                }});
                log("apparent success saving user settings: " + text);
            }
        }).catch(err => {
            Toast.show("Error communicating with the server.", {...ERROR_TOAST, containerStyle: {
                top: insets.top,
            }});
            logError("Error updating user data: " + err);
        });
    }

    const updateUserData = (key, newVal) => {
        var obj = JSON.parse(JSON.stringify(editedSettings));
        obj[key] = newVal;
        setEditedSettings(obj);
    }


    if(userData == null || !userData.data || editedSettings == null){
        return <LoginPage />
    }

    const tabs = <Tabs
        tabs={["Settings", "Barcode"]}
        cb={setPage}
        current={page}
        style={{
            position: "absolute",
            bottom: 0,
            left: 0,
        }}
    />;

    const settingsComponent = (
        // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={tailwind("bg-white w-full h-full")} key={userData}>
                <ScrollView style={[
                    tailwind("bg-white w-full p-4")
                ]}>
                    <Text style={[tailwind("text-4xl w-full font-bold text-center"), { color: CONFIG.green }]}>
                        {userData.data.displayName}
                    </Text>
                    <Text style={[tailwind("text-lg w-full text-center"), { color: CONFIG.text }]}>
                        {userData.data.email}
                    </Text>
                    <View style={{
                        height: 1,
                        marginLeft: "2.5%",
                        width: "95%",
                        backgroundColor: CONFIG.grey,
                        marginTop: 16,
                    }} />
                    <View style={tailwind("flex px-3 flex-row justify-between my-4 items-center w-full")}>
                        <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                            Show 0 Period
                        </Text>
                        <Switch
                            trackColor={{ false: CONFIG.bg2, true: CONFIG.green }}
                            thumbColor={ CONFIG.bg }
                            onValueChange={() => {
                                updateUserData("show0", !editedSettings.show0);
                            }}
                            value={editedSettings.show0}
                        />
                    </View>
                    <SettingsGradePicker
                        grade={parseInt(editedSettings.grade)}
                        setGrade={(newGrade) => {
                            updateUserData("grade", newGrade);
                        }}
                    />
                    <SettingsClassReminder
                        reminder={editedSettings.classNotification}
                        setClassReminder={(newReminder) => {
                            updateUserData("classNotification", newReminder);
                        }}
                    />
                    <View style={{
                        height: 56 + 40 + 16,
                    }} />
                </ScrollView>
                <View style={tailwind("flex px-3 h-20 flex-row justify-around items-center w-full absolute bottom-7 bg-white")}>
                    <NiceButton
                        type="danger"
                        cb={logout}
                    >
                        <Text style={[tailwind("text-lg font-bold"), { color: CONFIG.bg }]}>
                            Sign out
                        </Text>
                    </NiceButton>
                    <NiceButton
                        disabled={!edited}
                        cb={() => {
                            log("saving settings");
                            saveUserData();
                        }}
                        
                    >
                        <Text style={[tailwind("text-lg font-bold"), { color: CONFIG.bg }]}>
                            Save
                        </Text>
                    </NiceButton>
                </View>
                {tabs}
            </SafeAreaView>
        // </TouchableWithoutFeedback>
    );

    var useFake = userData.data.email == "mc34608@pausd.us";

    const barcodeComponent = (
        <SafeAreaView style={tailwind("bg-white w-full h-full")} key={userData}>
            <View style={tailwind("w-full h-full flex justify-center items-center")}>
                {userData.data.email.split("@")[1] == "pausd.us" ? (
                <Barcode
                    format="CODE39"
                    value={useFake ? "95051245" : "950" + userData.data.email.split("@")[0].substring(2)}
                    text={userData.data.displayName + " - OneShip"}
                    textStyle={{
                        fontSize: 20,
                    }}
                    height={80}
                    style={{
                        height: 200,
                        width: 200,
                        alignSelf: "center",
                        transform: [
                            { rotate: '90deg' },
                            { translateY: 40 },
                        ],
                    }}
                    maxWidth={Dimensions.get('window').height / 2}
                />
                ) : (
                    <Text style={[tailwind("text-2xl text-center"), { color: CONFIG.text }]}>
                        You must have a{" "}
                        <Text style={{ color: CONFIG.green }}>
                            PAUSD student email{" "}
                        </Text>
                        to use this feature.
                    </Text>
                )}
            </View>
            {tabs}
        </SafeAreaView>
    );

    return (page == 0 ? settingsComponent : barcodeComponent);
}

export default SettingsPage;