import { View, Text, ScrollView, Image, Platform, Alert } from "react-native";
import { CONFIG } from "../util/config";
import { PressableScale } from "react-native-pressable-scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import log, { getLogs, logError } from "../util/debug";
import UserAgent from 'react-native-user-agent';
import { useContext, useState } from "react";
import { DebugContext, UserDataContext } from "../util/contexts";

const ErrorModal = ({ error }) => {
    const { userData } = useContext(UserDataContext);
    const { setError, reloadApp } = useContext(DebugContext);
    const [errorReportStatus, setErrorReportStatus] = useState("unreported"); // unreported, loading, reported
    const insets = useSafeAreaInsets();
    const body = "#Oops!\nSomething went wrong. While the app was running, the following error occured:\n"
     + "##Status " + error.status + ": \"" + error.error + "\""
     + "\n\n" + (!error.closeable ?
        "Please try again later. Close the app and reopen it. If you've encountered this error frequently, you can try clearing the cache.\n\n" :
        "You can continue using the app, but it may not function properly. This error likely occured due to poor internet connection.\n\n")
     + "If the error persists, report it to us and we will fix it as soon as possible.\n\n"
     + "Thank you for your patience,\nThe OneShip Team";

    const registerError = async () => {
        setErrorReportStatus("loading");
        // compile error report
        // logs
        var logs = getLogs();
        // user agent
        var ua = "unknown";
        try{
            ua = UserAgent.getUserAgent();
            ua += ", oneship: " + CONFIG.VERSION;
            console.log("User agent: " + ua);
        }catch(e){
            ua = Platform.OS + " " + Platform.Version + ", oneship: " + CONFIG.VERSION;
        }
        var report = {
            logs,
            userAgent: userData ? userData.uid + ", " + ua : ua,
            error: error.error,
            status: error.status,
        };

        log("Sending error report: " + JSON.stringify(report));
        try{
            const response = await fetch(CONFIG.serverURL + "report-error", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(report),
            });
            var resJson = await response.json();
            log("Sent error report, response status: " + response.status + ". Response body: " + JSON.stringify(resJson));
        }catch(e){
            logError("Error sending error report: " + e);
        }

        // yes technically this will happen even if there's an error reporting the error
        // but I am not making an error reporting system for the error reporting system
        setErrorReportStatus("reported");
    }

    const attemptReload = () => {
        Alert.alert(
            "Clear Cache",
            "Are you sure you want to clear the cache? This will clear all data and log you out.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: reloadApp,
                },
            ]
        );
    }

    return (
        <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: CONFIG.bg,
            paddingTop: 16,
        }}>
            <View style={{
                position: "absolute",
                top: insets.top + 8,
                right: 0,
                backgroundColor: CONFIG.bg,
                zIndex: 1,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: CONFIG.grey,
                paddingBottom: 16,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: CONFIG.green,
                }}>
                    An Error Occurred
                </Text>
            </View>
            <ScrollView style={{
                width: "100%",
                paddingHorizontal: 16,
                top: insets.top + 36,
            }}>
                <View style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 196,
                    width: "100%",
                }}>
                    <Image
                        style={{
                            width: "100%",
                            height: 196,
                        }}
                        source={require("../assets/illustrations/server_error.png")}
                    />
                </View>
                <View style={{
                    height: 16,
                }} />
                {parseMarkdown(body)}
                {error.closeable && (
                    <PressableScale
                        style={{
                            width: "100%",
                            height: 50,
                            backgroundColor: CONFIG.green,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 16,
                        }}
                        onPress={() => {
                            setError(null);
                        }}
                    >
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: CONFIG.bg,
                        }}>
                            Close
                        </Text>
                    </PressableScale>
                )}
                <PressableScale
                    style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: errorReportStatus == "reported" ? CONFIG.green : CONFIG.darkGrey,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 36,
                    }}
                    disabled={errorReportStatus != "unreported"}
                    onPress={() => {
                        switch(errorReportStatus){
                            case "unreported":
                                registerError();
                                break;
                            case "reported":
                                // do nothing
                                break;
                            case "loading":
                                // do nothing
                                break;
                        }
                    }}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: CONFIG.bg,
                    }}>
                        {errorReportStatus == "unreported" ? "Report Error" : errorReportStatus == "reported" ? "Reported!" : "Just a sec..."}
                    </Text>
                </PressableScale>

                <PressableScale
                    style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: CONFIG.red,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 8,
                    }}
                    onPress={attemptReload}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: CONFIG.bg,
                    }}>
                        Clear Cache
                    </Text>
                </PressableScale>
                <View style={{
                    // don't ask
                    height: 128,
                    backgroundColor: CONFIG.bg,
                }} />
            </ScrollView>
        </View>
    );
};

const parseMarkdown = (text) => {
    // rules of psuedo markdown:
    // #header
    // ##subheader
    // \n newline

    var lines = [];
    if(typeof text != "string"){
        text = text.toString();
    }
    lines = text.replaceAll("\\n", "\n").replaceAll("\\,", ",").split("\n");
    var parsed = [];
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        if(line == "|"){
            parsed.push({
                type: "newline",
            });
            continue;
        }
        if(line.startsWith("#")){
            var headerLevel = 0;
            while(line.startsWith("#")){
                headerLevel++;
                line = line.substring(1);
            }
            parsed.push({
                type: "header",
                level: headerLevel,
                text: line,
            });
        }else{
            parsed.push({
                type: "text",
                text: line,
            });
        }
    }

    return parsed.map((line, index) => {
        if(line.type == "header"){
            return (
                <View key={index}>
                    <Text style={{
                        fontSize: 24 - ((line.level - 1) * 6),
                        fontWeight: line.level == 1 ? "bold" : "bold",
                        letterSpacing: -0.5,
                        color: line.level == 1 ? CONFIG.green : CONFIG.green,
                        marginTop: 10,
                    }}>
                        {line.text}
                    </Text>
                    {line.level == 1 ? (
                        <View key={"hr" + index} style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: CONFIG.grey,
                            marginBottom: 10,
                            marginTop: 5,
                        }} />
                    ) : null}
                </View>
            );
        }else if(line.type == "text"){
            return (
                <Text key={index} style={{
                    fontSize: 18,
                    color: CONFIG.text,
                }}>
                    {line.text}
                </Text>
            );
        }else if(line.type == "newline"){
            return (
                <View key={index} style={{
                    height: 16,
                }} />
            );
        }
    });
};

export default ErrorModal;