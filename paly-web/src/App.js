import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import CONFIG from "./util/config";
import { formatDate } from "./util/util";
import { CalendarContext, ScheduleContext } from "./util/contexts"
import NavBar from "./components/NavBar";
import BarcodePage from "./pages/BarcodePage";
import LightDarkMode from "./components/LightDarkMode";
import CalendarPage from "./pages/CalendarPage";
import DownloadPage from "./pages/DownloadPage";
import useDimensions from "./util/rerenderOnResize.hook";

function App() {
  const dimensions = useDimensions();
  const [schedule, setSchedule] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [isLightMode, setIsLightMode] = useState(
    localStorage.getItem("lightMode") == null ?
    true : JSON.parse(localStorage.getItem("lightMode")));

  useEffect(() => {
    const getScheduleFromServer = async (now) => {
      const response = await fetch(CONFIG.SERVER_URL + "/schedule/" + now);
      const json = await response.json();
      const newSchedule = {
        data: json.data,
        lastUpdate: now
      }
      localStorage.setItem("schedule", JSON.stringify(newSchedule))
      setSchedule(newSchedule)
    }

    const getScheduleFromStorage = (now) => {
      const localSchedule = localStorage.getItem("schedule");
      if(localSchedule == null || JSON.parse(localSchedule).lastUpdate !== now){
        getScheduleFromServer(now);
      }else{
        var parsedSchedule;
        try{
          parsedSchedule = JSON.parse(localSchedule);
          setSchedule(parsedSchedule);
        }catch(e){
          getScheduleFromServer(now);
          return;
        }
      }
    }
    const now = formatDate(new Date(Date.now()), true, false);
    if(schedule == null || schedule.lastUpdate !== now){
      getScheduleFromStorage(now);
    }



    const getCalendar = async () => {
      const date = new Date(Date.now());
      const today = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
      console.log(today);
      // lol some clown left a google calendar api key unencoded on their website ¯\_(ツ)_/¯
      // (it was paly.win and I want that domain)
      const res = await fetch("https://clients6.google.com/calendar/v3/calendars/palycalendar@gmail.com/events?calendarId=palycalendar@gmail.com&singleEvents=true&maxResults=250&sanitizeHtml=true&timeMin=" + today + "T00:00:00-07:00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs");
      const json = await res.json();
      setCalendar(json.items);
    }
    if(calendar == null) getCalendar();
  }, [schedule, calendar])
  
  console.log("rerendered and schedule is " + JSON.stringify(schedule));
  console.log("calendar:");
  console.log(calendar);

  const isSmallScreen = dimensions.width < 750;

  return (
    <div id="app-root" style={{
      "--bg": isLightMode ? "white" : "#19191b",
      "--text": isLightMode ? "black" : "white",
      "--calendar-width": isSmallScreen ? "100vw" : "75vw",
      "--calendar-left": isSmallScreen ? "0" : "25vw",
      "--today-button-display": isSmallScreen ? "none" : "none",
      overflow: isSmallScreen ? "hidden" : undefined,
      width: isSmallScreen ? "100vw" : undefined,
      height: isSmallScreen ? "100vh" : undefined
    }}>
      <ScheduleContext.Provider value={{ schedule, setSchedule }}>
        <CalendarContext.Provider value={{ calendar }}>
          <Toaster position="bottom-right" />
          <NavBar />
          <LightDarkMode isLightMode={isLightMode} setLightMode={setIsLightMode} />
          <Routes>
            <Route path="/about" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/barcode" element={<BarcodePage />} />
          </Routes>
        </CalendarContext.Provider>
      </ScheduleContext.Provider>
    </div>
  );
}

export default App;
