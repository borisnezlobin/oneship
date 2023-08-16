import { View, Text, ScrollView, Image, Dimensions, Linking, Share } from "react-native";
import { CONFIG } from "../util/config";
import { PressableScale } from "react-native-pressable-scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoSvg from "../util/LogoSvg";
import { LinkIcon, ShareIcon } from "react-native-heroicons/outline";
import tailwind from "tailwind-rn";
import { openBrowserAsync } from "expo-web-browser";

var modalTypes = {
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
    "game": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            resizeMode="contain"
            source={require("../assets/illustrations/game.png")}
        />,
    },
    "ad": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            resizeMode="contain"
            source={require("../assets/illustrations/speaker.png")}
        />,
    },
    "asb": {
        image: <Image
            style={{
                width: "100%",
                height: 196,
            }}
            resizeMode="contain"
            source={require("../assets/illustrations/voting.png")}
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

modalTypes.oneship = modalTypes.announcement;

const CustomModal = ({ route, navigation }) => {
    var { title, body = "", isMarkdown, image = "announcement", id, shareable = true, closeable = true } = route.params;
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
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: CONFIG.grey,
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
                {(image != "game" && image != "event" && shareable) &&
                    <PressableScale
                        style={{
                            padding: 8,
                            backgroundColor: CONFIG.bg,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        activeScale={0.7}
                        onPress={() => {
                            Share.share({
                                message: "Check out " + title + " on OneShip!",
                                url: id ? "https://palyoneship.web.app/post/" + id : undefined,
                            }, {
                                dialogTitle: "Share \"" + title + "\"",
                            });
                        }}
                    >
                        <ShareIcon color={CONFIG.green} size={24} />
                    </PressableScale>
                }
            </View>
            <ScrollView style={{
                width: "100%",
                paddingHorizontal: 16,
                top: insets.top + 36 + 16 + 2,
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
                {closeable ? (
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
                ): <></>}
                <View style={{
                    height: 16,
                    backgroundColor: CONFIG.bg,
                }} />

                {image != "game" && shareable && image != "event" ? (
                    <View style={{
                        backgroundColor: CONFIG.bg,
                    }}>
                        <Text>
                            Want to post your own message?{" "}
                            <Text onPress={() => {
                                Linking.openURL("mailto:boris.nezlobin@gmail.com?subject=OneShip%20Message&body=Title:%20%0ABody:%20%0A");
                            }} style={{
                                marginLeft: 4,
                                color: CONFIG.green,
                            }}>
                                Email us
                            </Text>
                            .
                        </Text>
                    </View>
                ) : null}
                <View style={{
                    height: 64 + 2 * useSafeAreaInsets().bottom,
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
    // [link](url)

    var lines = [];
    if(typeof text != "string"){
        text == text.toString();
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
            var j = 0;
            var lastLink = 0;
            for(; j < line.length; j++){
                if(line[j] == "["){
                    var link = "";
                    var text = "";
                    var k = j + 1;
                    while(line[k] != "]"){
                        text += line[k];
                        k++;
                    }
                    k += 2;
                    while(line[k] != ")"){
                        link += line[k];
                        k++;
                    }
                    parsed.push({
                        type: "text",
                        text: line.substring(lastLink, j),
                    });
                    parsed.push({
                        type: "link",
                        text: text,
                        link: link,
                    });
                    j = k;
                    lastLink = k + 1;
                    continue;
                }
            }
            parsed.push({
                type: "text",
                text: line.substring(lastLink)
            });
        }
    }

    return parsed.map((line, index) => {
        if(line.type == "header"){
            return (
                <>
                    <Text key={"modalheader" + index} style={{
                        fontSize: 24 - ((line.level - 1) * 6),
                        fontWeight: line.level == 1 ? "bold" : "bold",
                        letterSpacing: -0.5,
                        color: line.level == 1 ? CONFIG.green : CONFIG.green,
                        marginTop: 10,
                    }}>
                        {line.text}
                    </Text>
                    {line.level == 1 ? (
                        <View key={"modalhr" + index} style={{
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
                <Text key={"modaltext" + index} style={{
                    fontSize: 18,
                    color: CONFIG.text,
                }}>
                    {line.text}
                </Text>
            );
        }else if(line.type == "newline"){
            return (
                <View key={"modalnewline" + index} style={{
                    height: 16,
                }} />
            );
        }else if(line.type == "link"){
            return (
                <PressableScale
                    style={[
                        tailwind("w-full flex flex-row justify-between items-center p-3 rounded-xl m-1"),
                        {
                            gap: 8,
                            backgroundColor: CONFIG.bg2,
                        }
                    ]}
                    onPress={() => {
                        if(line.link.startsWith("http")){
                            openBrowserAsync(line.link);
                        }else{
                            Linking.openURL(line.link);
                        }
                    }}
                    onLongPress={() => {
                        Share.share({
                            title: line.text,
                            message: line.link,
                        });
                    }}
                >
                    <LinkIcon color={CONFIG.green} size={24} />
                    <View style={tailwind("w-11/12")}>
                        <Text key={"modallink" + index} style={{
                            fontSize: 18,
                            color: CONFIG.green,
                        }}>
                            {line.text}
                        </Text>
                        <Text style={tailwind("text-xs")}>
                            {line.link}
                        </Text>
                    </View>
                </PressableScale>
            );
        }
    });
};

export default CustomModal;