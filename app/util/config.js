import Toast from 'react-native-root-toast';

const CONFIG = {
    green: "#1c8000",
    grey: "#c4c4c4",
    bg2: "#f2f2f2",
    red: "#990000",
    text: "#000000",
    bg: "#ffffff",
    // serverURL: "https://oneship.vercel.app/",
    serverURL: "http://10.0.0.169:5000/",
}

const DEFUALT_TOAST = {
    position: Toast.positions.TOP,
    duration: 1000,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: CONFIG.bg,
    textColor: CONFIG.text,
    shadowColor: CONFIG.grey,
    opacity: 1,
    containerStyle: {
        backgroundColor: CONFIG.bg,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderLeftWidth: 4,
    }
}

const ERROR_TOAST = {
    ...DEFUALT_TOAST,
    containerStyle: {
        ...DEFUALT_TOAST.containerStyle,
        borderColor: CONFIG.red,
    }
}

const SUCCESS_TOAST = {
    ...DEFUALT_TOAST,
    containerStyle: {
        ...DEFUALT_TOAST.containerStyle,
        borderColor: CONFIG.green,
    }
}

export { CONFIG, ERROR_TOAST, SUCCESS_TOAST }