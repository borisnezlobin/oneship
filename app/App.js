import { SafeAreaView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "./util/config";
import { ScheduleContext } from "./util/contexts";
import { useEffect, useState } from "react";

export default function App() {
  const [schedule, setSchedule] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [news, setNews] = useState(null);
  const [sports, setSports] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const getStartupData = async () => {
      try{
        const response = await fetch(CONFIG.serverURL + "/api/startup");
        const data = await response.json();
        setCalendar(data.calendar);
        if(schedule == null || schedule.date != today){
          setSchedule(data.schedule);
          await AsyncStorage.setItem("schedule", JSON.stringify(data.schedule));
        }
        setNews(data.news);
      }catch(e){
        // redirect to error screen
      }
    }
    const getScheduleFromStorage = async () => {
      const schedule = await AsyncStorage.getItem("schedule");
      if(schedule != null) setSchedule(JSON.parse(schedule));
    }

    getScheduleFromStorage();
    getStartupData();
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      <SafeAreaView style={tailwind("flex-1 items-center justify-center")}>
        <View style={[tailwind("px-16 py-3 rounded-full"), {
          backgroundColor: CONFIG.green,
        }]}>
          <Text style={tailwind("text-white font-semibold text-lg")}>
            OneShip
          </Text>
        </View>
        <Text>{JSON.stringify(schedule)}</Text>
      </SafeAreaView>
    </ScheduleContext.Provider>
  );
}
