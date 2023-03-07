/*
var COLORS = {
    isLightMode: true,
    GREEN: this.isLightMode ? "#1C6800" : "#008A00",
    GREY: "#bbbbbb",
    TEXT: this.isLightMode ? "#000000" : "#dddddd",
    FOREGROUND_COLOR: this.isLightMode ? "#ffffff" : "#222222", // #19191b
    LIGHT: this.isLightMode ? "#e9e9e9" : "#333333",
    BACKGROUND_COLOR: this.isLightMode ? "#cccccc" : "#333333",
    STATUS_BAR: this.isLightMode ? "dark_content" : "light_content",
}*/

var COLORS = {
    isLightMode: true,
    GREEN: "#000000",
    GREY: "#000000",
    TEXT: "#000000",
    FOREGROUND_COLOR: "#000000", // #19191b
    LIGHT: "#000000",
    BACKGROUND_COLOR: "#000000",
    STATUS_BAR: "#000000",
};

const setTheme = (isLightMode) => {
    var newColors = {
        isLightMode: isLightMode,
        GREEN: isLightMode ? "#1C6800" : "#0F7D00",
        GREY: "#bbbbbb",
        TEXT: isLightMode ? "#000000" : "#dddddd",
        FOREGROUND_COLOR: isLightMode ? "#ffffff" : "#222222", // #19191b
        LIGHT: isLightMode ? "#e9e9e9" : "#333333",
        BACKGROUND_COLOR: isLightMode ? "#cccccc" : "#333333",
        STATUS_BAR: isLightMode ? "dark_content" : "light_content",
    };
    COLORS = newColors;
    return newColors;
}

setTheme(true);

const getColors = () => COLORS;

export default getColors;
export { setTheme }