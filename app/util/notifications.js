import { CONFIG } from "./config";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import log from "./debug";

async function registerForPushNotificationsAsync() {
    var token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // handle
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      log(token);
    } else {
      alert('Why are you running this on a simulator? Are you high?');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: CONFIG.bg,
      });
    }
  
    return token;
}

const setLocalNotification = async (title, body, seconds, channel) => {
  // check if a notification with this title already exists
  // log("setting notification with title " + title + " and body " + body + " in " + seconds + " seconds");
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  for(var i = 0; i < notifications.length; i++){
    if(notifications[i].content.title == title){
      Notifications.cancelScheduledNotificationAsync(notifications[i].identifier);
      // log("Notification with title " + title + " already exists, removing it.");
      // return;
      break;
    }
  }

  // log("Notification with title " + title + " does not exist, creating it.");
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
      seconds: seconds,
      channelId: channel,
    }
  });
};

export {
  setLocalNotification
}