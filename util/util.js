import { Dimensions } from "react-native"

// uh
const isWeb = () => {
    return Dimensions.get("window").width > 650;
}

// scary dyi weee
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const formatDate = (date, includeYear, includeTime) => {
    var date1 = new Date(date);
    var s = months[date1.getMonth()] + " " + date1.getDay();
    if(includeYear){
        s += " " + date1.getFullYear();
    }
    if(includeTime){
        s += " at " + date1.getHours() + ":";
        if(date1.getMinutes() < 10) s += "0";
        s += date1.getMinutes();
    }
    return s;
}

export default isWeb;
export { formatDate };