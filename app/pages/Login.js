import { Keyboard, Platform, SafeAreaView, Text, TouchableWithoutFeedback, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext, useEffect, useState } from "react";
import { DebugContext, UserDataContext } from "../util/contexts";
import { ArrowRightOnRectangleIcon, UserIcon } from "react-native-heroicons/outline";
import NiceButton from "../components/NiceButton";
import NiceInput from "../components/NiceInput";
import { openBrowserAsync } from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import log, { logError } from "../util/debug";
import Toast from "react-native-root-toast";
import { ERROR_TOAST } from "../util/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LoginPage = () => {
    const { setError } = useContext(DebugContext);
    const { userData, setUserData } = useContext(UserDataContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setEmailError("");
    }, [email]);

    useEffect(() => {
        setPasswordError("");
    }, [password]);

    const signIn = async () => {
        var isFormValid = true;
        if(!email.includes("@") || !email.includes(".")){
            setEmailError("Enter a valid email");
            isFormValid = false;
        }
        if(!email.endsWith("@pausd.us") && !email.endsWith("@pausd.org")){
            setEmailError("Enter a PAUSD email.");
            isFormValid = false;
        }
        if(email.trim().length == 0){
            setEmailError("Fill out this field");
            isFormValid = false;
        }
        if(password.length < 6){
            setPasswordError("Password must be at least 6 characters");
            isFormValid = false;
        }
        if(password.length == 0){
            setPasswordError("Fill out this field");
            isFormValid = false;
        }

        if(!isFormValid) return;

        setLoading(true);
        const response = await fetch(
            CONFIG.serverURL + "api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.trim(),
                password: password,
                ua: Platform.OS + " " + Platform.Version + " app"
            })
        }).catch(err => {
            logError("Error logging in user: " + err);
            setError({
                error: "Error logging in user.",
                status: 500
            })
            setLoading(false);
        });
        const text = await response.text();
        try {
            log("server response: " + text);
            const json = JSON.parse(text);
            setLoading(false);
            if(response.status == 200 && json.error == null){
                setUserData(json);
                log("saving user data + login to async storage");
                AsyncStorage.setItem("not_sketchy", JSON.stringify({
                    email: email.trim(),
                    password: password
                }));
                AsyncStorage.setItem("user_data", JSON.stringify(json));
                return;
            }else{
                // show error toast
                var message = "";
                if(!json || !json.error || !json.error.error || !json.error.error.message){
                    message = "Error logging in.";
                    logError("Error logging in: " + text);
                }else{
                    if(json.error.error.message == "EMAIL_NOT_FOUND"){
                        message = "Email not found.";
                    }else if(json.error.error.message == "INVALID_PASSWORD"){
                        message = "Invalid password.";
                    }else{
                        message = "Error logging in.";
                        logError("Error logging in: " + json.error.error.message);
                    }
                }

                Toast.show(message, {
                    ...ERROR_TOAST,
                    containerStyle: {
                        top: insets.top,
                    }
                });
            }
        } catch (e) {
            logError("Error: " + e);
            setLoading(false);
        }
    }

    const createAccount = () => {
        // it's not easy to make google oauth work with react native
        openBrowserAsync("https://palo-alto-high-school.web.app/create-account");
    }


    if(loading){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold text-2xl p-8"), { color: CONFIG.green}]}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold text-2xl p-8"), { color: CONFIG.green}]}>
                    Sign in
                </Text>
                <NiceInput
                    placeholder="PAUSD email"
                    type="emailAddress"
                    cb={setEmail}
                    error={emailError}
                    keyboardType="email-address"
                />
                <NiceInput
                    placeholder="Password"
                    type="password"
                    cb={setPassword}
                    error={passwordError}
                />
                <NiceButton cb={signIn}>
                    <UserIcon color={CONFIG.bg} />
                    <Text style={tailwind("text-white font-bold text-lg")}>
                        Sign in
                    </Text>
                </NiceButton>
                <View style={{
                    width: "80%",
                    height: 1,
                    backgroundColor: CONFIG.grey,
                    marginVertical: 24,
                }} />
                <Text style={[tailwind("font-bold text-lg"), { color: CONFIG.green}]}>
                    Don't have an account?
                </Text>
                <NiceButton cb={createAccount}>
                    <Text style={tailwind("text-white font-bold text-lg")}>
                        Create one
                    </Text>
                </NiceButton>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default LoginPage;