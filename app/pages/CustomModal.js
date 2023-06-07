import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { CONFIG } from "../util/config";
import { PressableScale } from "react-native-pressable-scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoSvg from "../util/LogoSvg";

const modalTypes = {
    "announcement": {
        image: <LogoSvg />,
    },
    "event": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            resizeMode="contain"
            source={require("../assets/illustrations/time.png")}
        />,
    },
    "warning": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            source={require("../assets/illustrations/warning.png")}
        />,
    },
    "error": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            source={require("../assets/illustrations/error.png")}
        />,
    },
    "server error": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            source={require("../assets/illustrations/server_error.png")}
        />,
    },
};

const CustomModal = ({ route, navigation }) => {
    var { title, body = "", isMarkdown, image = "announcement" } = route.params;
    const insets = useSafeAreaInsets();

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
                    {title}
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
                    {image ? modalTypes[image].image : (
                        <LogoSvg />
                    )}
                </View>
                <View style={{
                    height: 16,
                }} />
                {isMarkdown ? parseMarkdown(body) : (
                    <Text style={{
                        fontSize: 18,
                        color: CONFIG.text,
                    }}>
                        {body}
                    </Text>
                )}
                <PressableScale style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: CONFIG.green,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 36,
                }}
                onPress={() => {
                    navigation.goBack();
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: CONFIG.bg,
                    }}>
                        Close
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
        text == text.toString();
    }
    console.log(typeof text);
    // console.log("'" + text.replace(/\\n/g, "\n") + "'");
    lines = text.replaceAll("\\n", "\n").replaceAll("\\,", ",").split("\n");
    var parsed = [];
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        console.log(line);
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
                <>
                    <Text key={index} style={{
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
                </>
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

export default CustomModal;