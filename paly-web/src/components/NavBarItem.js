import React from 'react'
import { useNavigate } from 'react-router'
import classes from "../styles/Navbar.module.css"

const NavBarItem = ({ to, image, current, setCurrent, isSidebar }) => {
    const nav = useNavigate();
    return (
        <div
            className={classes.navbarItem}
            onClick={() => {
                setCurrent(to);
                nav("/" + to.toLowerCase())
            }}
            style={{
                backgroundColor: current === to ? "rgba(125, 125, 125, 0.125)" : "",
                justifyContent: isSidebar ? undefined : "center",
                padding: isSidebar ? undefined : "12px 0px",
                width: isSidebar ? undefined : "75vw"
            }}
        >
            {image}
            <p className='mediumText'>
                {to}
            </p>
        </div>
    )
}

export default NavBarItem