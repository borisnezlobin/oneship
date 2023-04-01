import React, { useContext, useEffect, useState } from 'react'
import { ScheduleContext } from '../util/contexts'
import ScheduleItem from '../components/ScheduleItem';
import CONFIG, { DEFAULT_PAGE_STYLES } from '../util/config';

const SchedulePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const { schedule } = useContext(ScheduleContext);

    useEffect(() => {
        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000)
    }, [currentTime])

    if(schedule == null) {
        return (
            <div>
                Loading..
            </div>
        )
    }

    if(schedule.data[0].name === "No school"){
        return (
            <div className='flex' style={DEFAULT_PAGE_STYLES}>
                <p className='bigText'>
                    No school today!
                </p>
            </div>
        )
    }

    const startTime = schedule.data[0].start;
    const endTime = schedule.data[schedule.data.length - 1].end;

    const now = 10 * 60;

    return (
        <div style={{
            backgroundColor: "var(--bg)",
            paddingLeft: CONFIG.NAVBAR_WIDTH,
            height: window.innerHeight
        }}>
            
            {schedule == null ? "loading" : schedule.data.map((e, i) => {
                return (
                    <ScheduleItem key={i} scheduleItem={e} endTime={endTime} startTime={startTime} />
                )
            })}
            <div style={{
                position: "absolute",
                left: 8 + CONFIG.NAVBAR_WIDTH,
                top: window.innerHeight * ((now - startTime) / (endTime - startTime)),
                backgroundColor: "var(--red)",
                color: "var(--text)",
                fontWeight: "bold",
                width: 128,
                textAlign: "center",
                borderRadius: 8,
                height: "48px",
                lineHeight: "48px",
                fontFamily: "monospace",
                fontSize: "x-large"
            }}>
                <div style={{
                    width: window.innerWidth - CONFIG.NAVBAR_WIDTH - 8,
                    height: 1,
                    backgroundColor: "var(--red)",
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                    top: 23.5,
                }} />
                <p style={{ zIndex: 4, margin: 0, position: "relative" }}>
                    {currentTime.getHours()}:
                    {currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()}:
                    {currentTime.getSeconds() < 10 ? "0" + currentTime.getSeconds() : currentTime.getSeconds()}
                </p>
            </div>
        </div>
    )
}

export default SchedulePage