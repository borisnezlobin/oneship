import { SafeAreaView, ScrollView, Text, View, Image } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG, ERROR_TOAST } from "../util/config";
import { SportsContext } from "../util/contexts";
import { useContext } from "react";
import { PressableScale } from "react-native-pressable-scale";
import { createOpenLink } from "react-native-open-maps";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeIcon } from "react-native-heroicons/solid"

const SportsPage = ({ navigation }) => {
    const { sports } = useContext(SportsContext);
    const insets = useSafeAreaInsets();

    if(sports == null){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold text-center"), { color: CONFIG.green }]}>
                    Loading sports...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full")}>
        {sports.length == 0 ? (
                    <View style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                    }}>
                        <Image
                            style={{
                                width: "100%",
                                height: 196,
                            }}
                            source={require("../assets/illustrations/tickets.png")}
                        />
                        <Text
                            style={[
                                tailwind("text-3xl mt-8 font-bold text-center"),
                                {
                                    color: CONFIG.green,
                                }
                            ]}
                        >
                            No upcoming games!
                        </Text>
                    </View>
        ) : (
            <ScrollView style={{
                width: "100%",
            }}>
                <Image
                    style={{
                        width: "100%",
                        height: 196,
                    }}
                    source={require("../assets/illustrations/tickets.png")}
                />
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
                            paddingHorizontal: 12,
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
                                            display: "flex",
                                            flexDirection: "row",
                                            paddingVertical: 12,
                                            gap: 12,
                                            paddingLeft: game.isHomeGame ? 0 : 36,
                                        }}>
                                            {game.isHomeGame ? (
                                                <HomeIcon size={24} color={CONFIG.green} />
                                            ) : <></>}
                                            <View>
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
                                                    {game.team}
                                                </Text>
                                            </View>
                                        </View>
                                    </PressableScale>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
        )}
        </SafeAreaView>
    );
}

const gameToMarkdown = (game) => {
    var str = "#" + game.team + "\n";
    str += "##" + game.time + ", " + game.date + "\n\n";
    var location = game.location.replace("Palo Alto High School", "").trim();
    if(location != ""){
        str += "At " + location + "\n\n";
    }else{
        str += "Home game" + (location.length != 0 ? ": " + location : "") + "\n\n";
    }
    str += "Against " + game.opponent;

    return str;
};

export default SportsPage;