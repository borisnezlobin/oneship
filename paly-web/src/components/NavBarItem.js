import React from 'react'
import { useNavigate } from 'react-router'
import classes from "../styles/Navbar.module.css"

const NavBarItem = ({ to, image, current, setCurrent}) => {
    const nav = useNavigate();
    return (
        <div
            className={classes.navbarItem}
            onClick={() => {
                setCurrent(to);
                nav("/" + to)
            }}
            style={{
                backgroundColor: current == to ? "rgba(125, 125, 125, 0.125)" : ""
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