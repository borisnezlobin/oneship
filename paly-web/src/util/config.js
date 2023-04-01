const CONFIG = {
    SERVER_URL: "https://paly-vikings.onrender.com",
    NAVBAR_WIDTH: 300,
}

const DEFAULT_PAGE_STYLES = {
    left: CONFIG.NAVBAR_WIDTH,
    backgroundColor: "var(--dark-blue)",
    top: 0,
    width: window.innerWidth - CONFIG.NAVBAR_WIDTH + 1,
    height: window.innerHeight,
    position: "absolute",
    color: "var(--text)"
};


export default CONFIG;
export {
    DEFAULT_PAGE_STYLES
}