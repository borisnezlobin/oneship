import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import ComingSoonPage from "./pages/ComingSoonPage";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </>
  );
}

export default App;
