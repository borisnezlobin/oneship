import { MoonStars, Sun } from 'phosphor-react'
import React from 'react'
import classes from "../styles/Settings.module.css"

const LightDarkMode = ({ isLightMode, setLightMode }) => {

    const setMode = (light) => {
        localStorage.setItem("lightMode", JSON.stringify(light));
    }

    setMode(isLightMode);

    return (
        <div className={classes.container} onClick={() => {
            setLightMode(!isLightMode);
        }}>
            {isLightMode ? 
                <MoonStars color={"var(--text)"} weight='light' size={32} />
            :
                <Sun color={"var(--text)"} weight='light' size={32} />
            }
        </div>
    )
}

export default LightDarkMode