import { Dimensions } from "react-native"
import * as Notifications from "expo-notifications"

// uh
const isWeb = () => {
    return Dimensions.get("window").width > 650;
}

var expoPushToken = null;

const setExpoPushToken = (s) => {
    expoPushToken = s;
    console.log(expoPushToken);
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

async function allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}

const sendLocalNotification = async (title, body, data, scheduling, category) => {
    const itIsPermissibleToSendNotifications = await allowsNotificationsAsync();

    if(itIsPermissibleToSendNotifications){
        Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: data,
                sound: "default",
                vibrate: [250, 250, 250, 250],
                categoryIdentifier: category
            },
            trigger: scheduling !== null ? scheduling : {
                seconds: 1, // lol it can't be 0 oh well
            },
        })
    }else{
        await Notifications.requestPermissionsAsync({ ios: { allowAlert: true }});
        sendLocalNotification(title, body, data, scheduling);
    }
}

const sendNotificationsForSchedule = async (schedule, time, now) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if(time !== -1){
        for(var i = schedule.length - 1; i >= 0; i--){
            if(schedule[i].start - 5 >= now){
                sendLocalNotification(
                    schedule[i].name,
                    "Starting in " + time.toString() + " minute" + (time !== 1 ? "s" : ""),
                    {},
                    {
                        seconds: (schedule[i].start - time - now) * 60
                    },
                    "schedule"
                )
            }else{ break; }
        }
    }
}

// use later maybe
async function sendPushNotification(title, body, data) {
    if(expoPushToken == null){
        console.log("failed to send notification");
        return;
    }
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    console.log("sent notification")
}

export default isWeb;
export {
    formatDate,
    serverDateToCalendarDate,
    dateToSportsEventDay,
    setExpoPushToken,
    sendLocalNotification,
    sendNotificationsForSchedule
};