import { StatusBar } from "react-native";

var COLORS = {
    isLightMode: true,
    GREEN: "#000000",
    RED: "#000000",
    ALPHA_GREEN: "#00000000",
    GREY: "#000000",
    TEXT: "#000000",
    FOREGROUND_COLOR: "#000000", // #19191b
    LIGHT: "#000000",
    BACKGROUND_COLOR: "#000000",
    STATUS_BAR: "#000000",
};

const setTheme = (isLightMode) => {
    StatusBar.setBarStyle(isLightMode ? "dark-content" : "light-content", true);
    var newColors = {
        isLightMode: isLightMode,
        GREEN: isLightMode ? "#1C6800" : "#1C6800",
        RED: "#c40000",
        ALPHA_GREEN: isLightMode ? "#1C680099" : "#1C680099",
        GREY: "#bbbbbb",
        TEXT: isLightMode ? "#000000" : "#dddddd",
        FOREGROUND_COLOR: isLightMode ? "#ffffff" : "#222222", // #19191b
        LIGHT: isLightMode ? "#e9e9e9" : "#333333",
        BACKGROUND_COLOR: isLightMode ? "#cccccc" : "#2b2b2b",
        STATUS_BAR: isLightMode ? "dark_content" : "light_content",
    };
    COLORS = newColors;
    return newColors;
}

setTheme(true);

const getColors = () => COLORS;

export default getColors;
export { setTheme }