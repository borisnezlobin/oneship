import { Dimensions } from "react-native"

const isWeb = () => {
    return Dimensions.get("window").width > 650;
}

export default isWeb;