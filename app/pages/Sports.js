import { SafeAreaView, ScrollView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST, INFO_TOAST, SUCCESS_TOAST } from "../util/config";
import { SportsContext } from "../util/contexts";
import { useContext } from "react";
import { PressableScale } from "react-native-pressable-scale";
import { createOpenLink } from "react-native-open-maps";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SportsPage = ({ navigation }) => {
    const { sports } = useContext(SportsContext);
    const insets = useSafeAreaInsets();

    if(sports == null){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("text-2xl font-bold text-center"), { color: CONFIG.green }]}>
                    Loading sports...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full")}>
            <ScrollView style={{
                width: "100%",
            }}>
                <Text style={[
                    tailwind("text-2xl font-bold text-center"),
                    {
                        color: CONFIG.green,
                    }
                ]}>
                    Upcoming games
                </Text>
                <Text style={[
                    tailwind("text-lg text-center mb-8"),
                    {
                        color: "#777777",
                    }
                ]}>
                    Long press on a game to open it in Maps
                </Text>
                {sports.map((day, index) => {
                    return (
                        <View key={index} style={{
                            width: "100%",
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                        }}>
                            <Text style={[
                                tailwind("text-2xl font-bold text-left"),
                                {
                                    color: CONFIG.green,
                                }
                            ]}>
                                {day.date}
                            </Text>
                            {day.events.map((game, index) => {
                                return (
                                    <PressableScale
                                        key={index}
                                        onPress={() => {
                                            navigation.navigate("Modal", {
                                                title: game.eventName,
                                                body: gameToMarkdown(game),
                                                isMarkdown: true,
                                                image: "game",
                                            });
                                        }}
                                        onLongPress={() => {
                                            const canOpenMaps = (
                                                game.location != null &&
                                                game.location != "" &&
                                                !game.location.trim().includes("TBA")
                                            )
                                            if(!canOpenMaps){
                                                Toast.show("Can't open location '" + game.location + "' in Maps", {
                                                    ...ERROR_TOAST,
                                                    containerStyle: {
                                                        top: insets.top,
                                                    }
                                                });
                                                return;
                                            }
                                            const link = createOpenLink({
                                                query: game.location,
                                                travelType: "drive",
                                                end: game.location
                                            });
                                            link();
                                        }}
                                    >
                                        <View key={index} style={{
                                            width: "100%",
                                            paddingLeft: 24,
                                            paddingVertical: 12,
                                        }}>
                                            <Text style={[
                                                tailwind("text-xl font-bold text-left"),
                                                {
                                                    color: CONFIG.green,
                                                }
                                            ]}>
                                                {game.time}
                                            </Text>
                                            <Text style={[
                                                tailwind("text-xl text-left"),
                                                {
                                                    color: CONFIG.text,
                                                }
                                            ]}>
                                                {game.eventName}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const gameToMarkdown = (game) => {
    var str = "#" + game.eventName + "\n";
    str += "##" + game.time + ", " + game.date + "\n\n";
    var location = game.location.replace("Palo Alto High School", "").trim();
    if(location != ""){
        str += "At " + location + "\n\n";
    }else{
        str += "Home game\n\n";
    }
    str += "Against " + game.against;

    return str;
};

export default SportsPage;