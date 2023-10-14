import { Link, useLocation, useNavigate } from "react-router-dom";
import { Barcode, BellSimple, Football, GearSix, HouseSimple, List, Newspaper, SignIn, UserPlus } from "phosphor-react";
import logo from "../logo.svg";
import { useContext, useState } from "react";
import { UserDataContext } from "../util/contexts";

const linkStyle = "text-0 rounded-full h-12 w-12 flex flex-row justify-center border border-transparent"
    + " items-center md:bg-white md:justify-start md:h-6 md:px-4 md:text-xl md:justify-start"
    + "md:text-black md:gap-8 md:ml-0 md:rounded-lg md:py-6 md:w-60 hover:border-gray-400";
const containerStyle = "h-12 fixed bottom-0 md:top-0 left-0 w-full bg-white flex"
+ " flex-row justify-around items-center md:justify-start "
+ "md:h-full md:w-64 md:top-0 md:left-0 md:bottom-auto md:shadow-xl "
+ "md:px-4 md:py-8 md:flex-col md:justify-center md:align-start md:gap-2";

const Navbar = () => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const { userData } = useContext(UserDataContext);
    const nav = useNavigate();
    const path = useLocation().pathname;
    const isSmallScreen = window.innerWidth < 768;

    return (
        <nav className={containerStyle}>
            {window.innerWidth >= 768 ?
                <img src={logo} onClick={() => nav("/")} className="h-0 w-0 md:h-36 md:w-36 cursor-pointer" alt="logo" />
                :<></>
            }
            <Link to="/schedule" className={calculateStyles("/schedule", path)}>
                <BellSimple color="black" size={24} />
                <p>
                    Schedule
                </p>
            </Link>
            <Link to="/sports" className={calculateStyles("/sports", path)}>
                <Football color="black" size={24} />
                <p>
                    Sports
                </p>
            </Link>
            <Link to="/feed" className={calculateStyles("/feed", path)}>
                <HouseSimple color="black" size={24} />
                <p>
                    Home
                </p>
            </Link>
            <Link to="/news" className={calculateStyles("/news", path)}>
                <Newspaper color="black" size={24} />
                <p>
                    News
                </p>
            </Link>
            <button className={linkStyle} style={{
                position: "relative",
            }} onClick={(e) => {
                e.preventDefault();
                setIsMoreMenuOpen(!isMoreMenuOpen);
            }}>
                <List color="black" size={24} />
                <p>
                    More
                </p>
                {isMoreMenuOpen ?
                    <div style={{
                        position: "absolute",
                        top: isSmallScreen ? -48 - 4 - 16*3 : -48 - 4,
                        right: isSmallScreen ? 0 : -256,
                        width: isSmallScreen ? 16 * 3 : "240px",
                        flex: 0,
                        borderRadius: 8,
                        backgroundColor: "white",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}>
                        {userData ? (
                        <>
                            <Link to="/barcode" className={calculateStyles("/barcode", path)}>
                                <Barcode color="black" size={24} />
                                <p>
                                    Barcode
                                </p>
                            </Link>
                            <Link to="/settings" className={calculateStyles("/settings", path)}>
                                <GearSix color="black" size={24} />
                                <p>
                                    Settings
                                </p>
                            </Link>
                        </>
                        ) : (
                        <>
                            <Link to="/register" className={calculateStyles("/register", path)}>
                                <UserPlus color="black" size={24} />
                                <p>
                                    Register
                                </p>
                            </Link>
                            <Link to="/login" className={calculateStyles("/login", path)}>
                                <SignIn color="black" size={24} />
                                <p>
                                    Login
                                </p>
                            </Link>
                        </>
                            
                        )}
                    </div>
                :<></>}
            </button>
        </nav>
    );
};

const calculateStyles = (path, currentPath) => {
    if (path === currentPath) {
        return linkStyle + "border-theme md:border-black";
    }
    return linkStyle;
};

export default Navbar;