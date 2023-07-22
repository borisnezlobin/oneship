// message is in the format {
//     sender: "name",
//     targets: {
//         students: Boolean,
//         teachers: Boolean,
//         grades: [grade1, grade2, grade3],
//         individuals: [uid1, uid2, uid3],
//     }
//     content: "message",
//     title: "title",
//     attachments: [url1, url2, url3],
//     postType: "announcement"  | "event" | "ad" | "asb",
//     expires: Date,
// }

import { View, Text, Image } from 'react-native';
import tailwind from 'tailwind-rn';
import { CONFIG } from '../util/config';
import { CalendarDaysIcon, ScaleIcon, ChatBubbleLeftIcon, StarIcon } from 'react-native-heroicons/outline';
import { PressableScale } from 'react-native-pressable-scale';

const MESSAGE_TYPES = {
    "announcement": <StarIcon color={CONFIG.grey} />,
    "oneship": <Image
        style={{
            width: 24,
            height: 24,
        }}
        source={require("../assets/logo_icon.png")}
        resizeMode="contain"
    />,
    "event": <CalendarDaysIcon color={CONFIG.grey} />,
    "ad": <ChatBubbleLeftIcon color={CONFIG.grey} />,
    "asb": <ScaleIcon color={CONFIG.grey} />,
};

const MessageItem = ({ message, navigation }) => {
    // react native
    return (
        <PressableScale
            onPress={() => {
                navigation.navigate("Modal", {
                    title: message.title,
                    body: getInfoText(message) + message.content,
                    isMarkdown: true,
                    image: message.postType,
                    id: message.id,
                });
            }}
        >
            <View style={{
                padding: 16,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: message.featured ? CONFIG.green : CONFIG.bg,
                margin: 8,
                borderRadius: 8,
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: CONFIG.green,
                }}>
                    {message.title}
                </Text>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginVertical: 10,
                    gap: 2,
                }}>
                    {MESSAGE_TYPES[message.postType]}
                    <Text style={{
                        fontSize: 18,
                        color: CONFIG.grey,
                    }}>
                        {message.sender}
                    </Text>
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: CONFIG.grey,
                    marginVertical: 10
                }} />
                <Text style={{
                    fontSize: 18,
                    width: "100%",
                    color: CONFIG.text,
                }}>
                    {message.description}
                </Text>
            </View>
        </PressableScale>
    );
};

const getInfoText = (message) => {
    var infoText = "";
    if (message.postType === "announcement") {
        infoText += "An official OneShip announcement.";
    } else if (message.postType === "oneship") {
        infoText += "An official OneShip message.";
    }else if(message.postType === "asb"){
        infoText += "An official ASB message.";
    }else if(message.postType === "ad"){
        infoText += "A OneShip-approved message from " + message.sender + ".";
    }

    return infoText + "\n\n";
};

export default MessageItem;