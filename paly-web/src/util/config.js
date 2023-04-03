var CONFIG = {
    SERVER_URL: "https://paly-vikings.onrender.com",
    NAVBAR_WIDTH: window.innerHeight * 0.25,
}

const DEFAULT_PAGE_STYLES = {
    left: window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? 0 : CONFIG.NAVBAR_WIDTH,
    backgroundColor: "var(--bg)",
    top: 0,
    width: window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? window.innerWidth : window.innerWidth - CONFIG.NAVBAR_WIDTH + 1,
    height: window.innerHeight,
    position: "absolute",
    color: "var(--text)"
};


export default CONFIG;
export {
    DEFAULT_PAGE_STYLES
}