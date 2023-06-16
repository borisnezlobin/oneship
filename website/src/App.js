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

    if(startupData == null) getStartupData();
  }, []);

  const setUserData = (data) => {
    setLocalUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
    // fetch(CONFIG.SERVER_URL + "/api/user", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
  };

  return (
    <DataContext.Provider value={{ data: startupData }}>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <Toaster position={window.innerWidth < 768 ? "top-center" : 'bottom-right'} />
        <div className='w-full h-full' style={{
          overflow: "auto",
          overflowX: "hidden",
          height: window.innerWidth < 768 ? window.innerHeight - 16 * 4 : "100%",
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/createaccount" element={<CreateAccountPage />} />
            <Route path="/signup" element={<CreateAccountPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Navbar />
      </UserDataContext.Provider>
    </DataContext.Provider>
  );
}

export default App;
