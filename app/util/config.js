import Toast from 'react-native-root-toast';

const CONFIG = {
    green: "#1c8000",
    grey: "#c4c4c4",
    darkGrey: "#808080",
    blue: "#086099",
    bg2: "#f2f2f2",
    red: "#990000",
    text: "#000000",
    blue: "#1076ab",
    bg: "#ffffff",
    serverURL: "https://oneship.vercel.app/",
    // serverURL: "http://10.0.0.66:5000/",
    DEFAULT_FIXED_HEIGHT: 100,
    VERSION: "0.0.3"
}

const DEFUALT_TOAST = {
    position: Toast.positions.TOP,
    duration: Toast.durations.LONG,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: CONFIG.bg,
    textColor: CONFIG.bg,
    textWeight: "bold",
    shadowColor: CONFIG.grey,
    opacity: 1,
    textStyle: {
        fontSize: 18,
        fontWeight: "normal",
    },
    containerStyle: {
        borderRadius: 8,
    }
}

const ERROR_TOAST = {
    ...DEFUALT_TOAST,
    backgroundColor: CONFIG.red,
    textStyle: {
        fontSize: 18,
        fontWeight: "bold",
    },
}

const SUCCESS_TOAST = {
    ...DEFUALT_TOAST,
    backgroundColor: CONFIG.green,
    textStyle: {
        fontSize: 18,
        fontWeight: "bold",
    },
}

const INFO_TOAST = {
    ...DEFUALT_TOAST,
    backgroundColor: CONFIG.blue,
}

export { CONFIG, ERROR_TOAST, SUCCESS_TOAST, INFO_TOAST }