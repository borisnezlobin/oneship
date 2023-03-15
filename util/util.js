import { Dimensions } from "react-native"

// uh
const isWeb = () => {
    return Dimensions.get("window").width > 650;
}

// scary diy weee
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const formatDate = (date, includeYear, includeTime) => {
    var date1 = new Date(date);
    var s = months[date1.getMonth()] + " " + date1.getDate();
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

const dateToSportsEventDay = (date) => {
    return days[date.getDay() - 1] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

const serverDateToCalendarDate = (date) => {
    var month = date.split(" ")[0];
    var day = parseInt(date.split(" ")[1]);
    var year = date.split(" ")[2];
    var caldate = year + "-";
    var indexOfMonth = months.indexOf(month) + 1;
    if(indexOfMonth < 10) caldate += "0";
    caldate += indexOfMonth + "-";
    if(day < 10) caldate += "0";
    caldate += day;
    return caldate;
}

export default isWeb;
export { formatDate, serverDateToCalendarDate, dateToSportsEventDay };