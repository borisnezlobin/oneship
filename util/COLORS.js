var isLightMode = true;

const setLightMode = (newVal) => { isLightMode = newVal; }

const COLORS = {
    GREEN: "#1C6800",
    FOREGROUND_COLOR: isLightMode ? "#ffffff" : "#19191b",
    STATUS_BAR: isLightMode ? "dark_content" : "light_content"
}

export { setLightMode };
export default COLORS;