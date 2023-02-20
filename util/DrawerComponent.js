import { View, Image, SafeAreaView } from "react-native";
import DrawerListItem from "../components/DrawerListItem";
import COLORS from "./COLORS";
import { HouseLine, Calendar, ChartBar, Clock, GearSix } from "phosphor-react-native"
import IMAGES from "./ASSETS";
import isWeb from "./util";

function DrawerComponent({ navigation }) {
    const iconSize = 36;
    return (
        <SafeAreaView style={{
            flex: 1,
            display: "flex",
            marginLeft: 16,
            alignItems: 'left',
            justifyContent: 'center',
            flexDirection: "column",
        }}>
            <View style={{
                paddingRight: 16,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Image source={require("../assets/logo-transparent.png")} style={{width: 128, height: 128}} />
            </View>
            <View style={{height: 24}} />
            <DrawerListItem
                navigation={navigation}
                to="Home"
                icon={<HouseLine size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                to="Schedule"
                icon={<Clock size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                to="Calendar"
                icon={<Calendar size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                to="Surveys"
                icon={<ChartBar size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                to="Settings"
                icon={<GearSix size={iconSize} color={COLORS.GREEN} />}
            />
        </SafeAreaView>
    );
}

export default DrawerComponent;