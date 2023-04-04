var CONFIG = {
    SERVER_URL: "https://paly-vikings.onrender.com",
    NAVBAR_WIDTH: window.innerWidth * 0.25,
}

const DEFAULT_PAGE_STYLES = {
    left: window.innerWidth < 750 ? 0 : CONFIG.NAVBAR_WIDTH,
    backgroundColor: "var(--bg)",
    top: 0,
    width: window.innerWidth < 750 ? window.innerWidth : window.innerWidth - CONFIG.NAVBAR_WIDTH + 1,
    height: window.innerHeight,
    position: "absolute",
    color: "var(--text)"
};

const SUCCESS_TOAST_STYLES = {
    style: {
        backgroundColor: "#1c8000",
        fontWeight: "normal",
        color: "white",
        boxShadow: "0px 0px 10px var(--green)",
        padding: "8px 32px"
    }
}

export default CONFIG;
export {
    DEFAULT_PAGE_STYLES,
    SUCCESS_TOAST_STYLES
}