import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import CONFIG from "./util/config";
import { formatDate } from "./util/util";
import { ScheduleContext } from "./util/contexts"
import NavBar from "./components/NavBar";
import BarcodePage from "./pages/BarcodePage";
import LightDarkMode from "./components/LightDarkMode";
import CalendarPage from "./pages/CalendarPage";
import DownloadPage from "./pages/DownloadPage";

function App() {
  const [schedule, setSchedule] = useState(null);
  const [isLightMode, setIsLightMode] = useState(
    localStorage.getItem("lightMode") == null ?
    false : JSON.parse(localStorage.getItem("lightMode")));

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
  }, [schedule])
  
  console.log("rerendered and schedule is " + JSON.stringify(schedule));

  return (
    <div id="app-root" style={{
      "--bg": isLightMode ? "white" : "#19191b",
      "--text": isLightMode ? "black" : "white",
      overflow: window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? "hidden" : undefined,
      width: window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? "100vw" : undefined,
      height: window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? "100vh" : undefined
    }}>
      <ScheduleContext.Provider value={{ schedule, setSchedule }}>
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
      </ScheduleContext.Provider>
    </div>
  );
}

export default App;
