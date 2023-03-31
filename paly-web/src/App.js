import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import CONFIG from "./util/config";
import { formatDate } from "./util/util";
import { ScheduleContext } from "./util/contexts"
import ComingSoonPage from "./pages/ComingSoonPage";
import NavBar from "./components/NavBar";

function App() {
  const [schedule, setSchedule] = useState(null)

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
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      <Toaster position="bottom-right" />
      <NavBar />
      <Routes>
        <Route path="/about" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </ScheduleContext.Provider>
  );
}

export default App;
