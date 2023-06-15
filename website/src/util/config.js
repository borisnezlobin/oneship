const CONFIG = {
    SERVER_URL: "https://oneship.vercel.app",
}

const ERROR_TOAST_STYLES = {
    style: {
        backgroundColor: "#990000",
        color: "#ffffff",
    },
    iconTheme: {
        primary: "#ffffff",
        secondary: "#990000",
    }
}

const SUCCESS_TOAST_STYLES = {
    style: {
        backgroundColor: "var(--green)",
        color: "#ffffff",
    },
    iconTheme: {
        primary: "#ffffff",
        secondary: "var(--green)",
    }
}

export default CONFIG;
export { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES };