import { View, Text, Image } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { PressableScale } from "react-native-pressable-scale";
import { openBrowserAsync } from "expo-web-browser";
import { VideoCameraIcon } from "react-native-heroicons/outline";
import { useState } from "react";

const image404 = "https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg"

const NewsFeedItem = ({ item }) => {
    const [imageLoaded, setImageLoaded] = useState(item.isVideo);

    return (
        <PressableScale onPress={() => openBrowserAsync(item.link)}>
            <View style={{
                width: "95%",
                left: "2.5%",
                padding: 10,
                borderRadius: 10,
                marginBottom: 32
            }}>
                <Text style={[tailwind("font-bold text-xl"), { color: CONFIG.green }]}>
                    {item.title}
                </Text>
                <Text style={[tailwind("text-base"), { color: CONFIG.text }]}>
                    {item.authors.map((author, index) => {
                        return (index == 0 ? "" : ", ") + author.authorName;
                    })}
                    {item.authors.length > 0 ? " with " : ""}
                    {item.source}
                </Text>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: CONFIG.grey,
                    marginVertical: 10
                }} />
                <View style={tailwind("w-full")}>
                    <Text style={[tailwind("text-base"), { color: CONFIG.text }]}>
                        {item.description.replaceAll("\n", "").replaceAll("\r", "").trim().slice(0, 200) + (item.description.length > 200 ? "..." : "")}
                    </Text>
                    {item.image == null || item.image == image404 || item.isVideo ? <></> :
                        <View style={{}}>
                            <Image
                                style={{
                                    width: "100%",
                                    height: 200,
                                    resizeMode: "cover",
                                    borderRadius: 10,
                                }}
                                onLoad={() => setImageLoaded(true)}
                                source={{ uri: item.image }}
                            />
                            {!imageLoaded ?
                                <View style={[tailwind("flex flex-col justify-center items-center"), {
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 10,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    backgroundColor: CONFIG.bg,
                                }
                                ]}>
                                    <Text style={[tailwind("text-base"), { color: CONFIG.text }]}>
                                        Loading image...
                                    </Text>
                                </View>
                            : <></>}
                        </View>
                    }
                    {item.isVideo ?
                        <PressableScale onPress={() => openBrowserAsync(item.embedURL)} style={[
                            tailwind("flex flex-col justify-center items-center"),
                            {
                                width: "100%",
                                height: 200,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: CONFIG.grey,
                            }
                        ]}>
                            <VideoCameraIcon style={{ color: CONFIG.green }} />
                            <Text
                                style={{
                                    color: CONFIG.green,
                                }}
                            >
                                Watch the video on YouTube
                            </Text>
                        </PressableScale>
                    : <></>}
                </View>
            </View>
        </PressableScale>
    );
};

export default NewsFeedItem;