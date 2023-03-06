var COLORS = {
    isLightMode: true,
    GREEN: this.isLightMode ? "#1C6800" : "#008A00",
    TEXT: this.isLightMode ? "#000000" : "#ffffff",
    FOREGROUND_COLOR: this.isLightMode ? "#ffffff" : "#222222", // #19191b
    LIGHT: this.isLightMode ? "#e9e9e9" : "#222222",
    BACKGROUND_COLOR: this.isLightMode ? "#cccccc" : "#333333",
    STATUS_BAR: this.isLightMode ? "dark_content" : "light_content",
    setLightMode(newVal){
        this.isLightMode = newVal;
    }
}

export default COLORS;