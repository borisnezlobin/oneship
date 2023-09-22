import { Text, View } from "react-native";
import { InformationCircleIcon } from "react-native-heroicons/solid";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";

const alertColors = {
    info: CONFIG.blue,
}

const iconTypes = {
    info: <InformationCircleIcon
        color={alertColors.info}
        size={32}
    />,
}

const Alert = ({ message, type }) => {
    return (
        <View style={[
                tailwind("flex m-1 flex-row items-center justify-start bg-white border border-l-8 p-2"),
                {
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    borderColor: alertColors[type],
                }
            ]}>
            {iconTypes[type]}
            <Text style={tailwind("ml-2")}>
                {message}
            </Text>
        </View>
    );
}

export default Alert;