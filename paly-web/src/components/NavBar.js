import { Barcode, Calendar, Clock, DownloadSimple, Info, List } from 'phosphor-react';
import React, { useState } from 'react'
import { useLocation } from 'react-router';
import classes from "../styles/Navbar.module.css";
import CONFIG from '../util/config';
import logo from "./logo-transparent.png"
import NavBarItem from './NavBarItem';


const NavBar = () => {
    const location = useLocation().pathname.replace("/", "");
    const path = location.charAt(0).toUpperCase() + location.slice(1);
    const [currentPage, setCurrentPage] = useState(path.length === 0 ? "About" : path);
    const [shown, setShown] = useState(false);
    const isSidebar = window.innerWidth > 750;
    if(!isSidebar) CONFIG.NAVBAR_WIDTH = 0;

    const itemCallback = (newPage) => {
        setCurrentPage(newPage);
        if(!isSidebar) setShown(false);
    }

    const contents = (
        <>
            {isSidebar ?
                <img
                    src={logo}
                    alt="Paly Logo"
                    width={CONFIG.NAVBAR_WIDTH - 100}
                    height={CONFIG.NAVBAR_WIDTH - 100}
                />
            :
                <></>
            }
            <NavBarItem
                to="Schedule"
                image={<Clock color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={itemCallback}
                isSidebar={isSidebar}
            />
            <NavBarItem
                to="Calendar"
                image={<Calendar color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={itemCallback}
                isSidebar={isSidebar}
            />
            <NavBarItem
                to="Barcode"
                image={<Barcode color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={itemCallback}
                isSidebar={isSidebar}
            />
            <NavBarItem
                to="Download"
                image={<DownloadSimple color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={itemCallback}
                isSidebar={isSidebar}
            />
            <NavBarItem
                to="About"
                image={<Info color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={itemCallback}
                isSidebar={isSidebar}
            />
            {!isSidebar ?
                <div className='btn' style={{margin: 32}} onClick={() => setShown(false)}>
                    CLOSE
                </div>
            : <></>}
        </>
    );

    return (
        <>
            {isSidebar || shown ?
                <div className={"flex " + classes.navbarContainer + " " + classes.open} style={{
                    width: !isSidebar ? "100vw" : undefined,
                    position: isSidebar ? undefined : "absolute",
                    zIndex: 3,
                    overflow: isSidebar ? undefined : "hidden"
                }}>
                    {contents}
                </div>
            : !isSidebar ? <div className={classes.navbarContainer + " flex " + classes.closed} style={{
                    width: !isSidebar ? "100vw" : undefined,
                    position: isSidebar ? "relative" : "absolute",
                    zIndex: 3,
                    overflow: isSidebar ? undefined : "hidden"
                }}>
                    {contents}
                </div> : <></>
            }
            {!isSidebar && !shown ?
                <div className={classes.openMenuButton + " flex"} onClick={() => setShown(true)}>
                    <List color="var(--bg)" size={24} />
                </div>
            : <></> }
        </>
    )
}

export default NavBar