import { Barcode, Calendar, Clock, DownloadSimple, Info } from 'phosphor-react';
import React, { useState } from 'react'
import classes from "../styles/Navbar.module.css";
import CONFIG from '../util/config';
import logo from "./logo-transparent.png"
import NavBarItem from './NavBarItem';


const NavBar = () => {
    const [currentPage, setCurrentPage] = useState("About")
    return (
        <div className={classes.navbarContainer} style={{
            backgroundColor: "var(--bg)"
        }}>
            <img
                src={logo}
                alt="Paly Logo"
                width={CONFIG.NAVBAR_WIDTH - 100}
                height={CONFIG.NAVBAR_WIDTH - 100}
            />
            <NavBarItem
                to="Schedule"
                image={<Clock color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={setCurrentPage}
            />
            <NavBarItem
                to="Calendar"
                image={<Calendar color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={setCurrentPage}
            />
            <NavBarItem
                to="Barcode"
                image={<Barcode color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={setCurrentPage}
            />
            <NavBarItem
                to="Download"
                image={<DownloadSimple color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={setCurrentPage}
            />
            <NavBarItem
                to="About"
                image={<Info color="var(--green)" size={32} />}
                current={currentPage}
                setCurrent={setCurrentPage}
            />
        </div>
    )
}

export default NavBar