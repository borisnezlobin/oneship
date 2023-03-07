import { View, Image, SafeAreaView } from "react-native";
import DrawerListItem from "../components/DrawerListItem";
import getColors from "./COLORS";
import { HouseLine, Calendar, ChartBar, Clock, GearSix } from "phosphor-react-native"
import IMAGES from "./ASSETS";
import isWeb from "./util";

function DrawerComponent({ navigation, currentRoute, setRoute }) {
    const iconSize = 36;
    const COLORS = getColors();
    
    return (
        <SafeAreaView style={{
            flex: 1,
            display: "flex",
            alignItems: 'left',
            justifyContent: 'center',
            flexDirection: "column",
            backgroundColor: COLORS.FOREGROUND_COLOR,
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
                setCurrentRoute={setRoute}
                currentRoute={currentRoute}
                to="Home"
                icon={<HouseLine size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                setCurrentRoute={setRoute}
                currentRoute={currentRoute}
                to="Schedule"
                icon={<Clock size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                setCurrentRoute={setRoute}
                currentRoute={currentRoute}
                to="Calendar"
                icon={<Calendar size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                setCurrentRoute={setRoute}
                currentRoute={currentRoute}
                to="Surveys"
                icon={<ChartBar size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                setCurrentRoute={setRoute}
                currentRoute={currentRoute}
                to="Settings"
                icon={<GearSix size={iconSize} color={COLORS.GREEN} />}
            />
        </SafeAreaView>
    );
}

export default DrawerComponent;