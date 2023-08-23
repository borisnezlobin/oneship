import { Toaster } from 'react-hot-toast';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import CONFIG from './util/config';
import { DataContext, UserDataContext } from './util/contexts';
import NewsPage from './pages/News';
import FeedPage from './pages/Feed';
import LoginPage from './pages/Login';
import CreateAccountPage from './pages/Register';
import SportsPage from './pages/Sports';
import SchedulePage from './pages/Schedule';
import SettingsPage from './pages/Settings';
import BarcodePage from './pages/Barcode';
import PostDetails from './pages/PostDetails';

function App() {
  const [startupData, setStartupData] = useState(null);
  const [userData, setLocalUserData] = useState(null);

  useEffect(() => {
    const getStartupData = async () => {
      const res = await fetch(CONFIG.SERVER_URL + "/api/startup");
      try{
        const data = await res.json();
        setStartupData(data);
      } catch (e) {
        console.error(e);
        // TODO: redirect to error screen
      }
    };

    const attemptLogin = async () => {
      const creds = JSON.parse(localStorage.getItem("creds"));
      if(creds === null) return;
      const res = await fetch(CONFIG.SERVER_URL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.password,
          ua: navigator.userAgent ? navigator.userAgent : "web"
        })
      });
      try{
        const data = await res.json();
        setLocalUserData(data);
      } catch (e) {
        console.error(e);
      }
    };

    if(startupData == null) getStartupData();
    if(userData == null) attemptLogin();
  }, [startupData]);

  // TODO: get user data from localstorage and update from server
  const setUserData = (data) => {
    setLocalUserData(data);
    // localStorage.setItem("userData", JSON.stringify(data));
  };

  const canDownloadAndroidApp = window.navigator.userAgent.toLowerCase().includes("android");

  return (
    <DataContext.Provider value={{ data: startupData }}>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <Toaster position={window.innerWidth < 768 ? "top-center" : 'bottom-right'} />
        <div className='w-full h-full' style={{
          overflow: "auto",
          overflowX: "hidden",
          height: "100dvh",
          paddingTop: canDownloadAndroidApp ? "calc(2rem + 32px)" : "0",
          marginBottom: window.innerWidth < 768 ? 48 : 0,
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/createaccount" element={<CreateAccountPage />} />
            <Route path="/signup" element={<CreateAccountPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/barcode" element={<BarcodePage />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        {canDownloadAndroidApp &&
          <div
            className="fixed top-0 w-full bg-gray-800 text-white text-center py-2"
            onClick={() => window.open("https://oneship.vercel.app/internal/PalyOneShip.apk")}
          >
            <p>
              Download the OneShip app!
            </p><p>
              The file is not dangerous (trust me).
            </p>
          </div>
        }
        <Navbar />
      </UserDataContext.Provider>
    </DataContext.Provider>
  );
}

export default App;
