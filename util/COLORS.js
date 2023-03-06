var isLightMode = true;

const setLightMode = (newVal) => { isLightMode = newVal; }

const COLORS = {
    GREEN: isLightMode ? "#1C6800" : "#008A00",
    TEXT: isLightMode ? "#000000" : "#ffffff",
    FOREGROUND_COLOR: isLightMode ? "#ffffff" : "#222222", // #19191b
    LIGHT: isLightMode ? "#e9e9e9" : "#222222",
    BACKGROUND_COLOR: isLightMode ? "#cccccc" : "#333333",
    STATUS_BAR: isLightMode ? "dark_content" : "light_content"
}

export { setLightMode };
export default COLORS;